import express from "express";
import path from "path";
import dotenv from "dotenv";

import { createClient } from "genlayer-js";
import { TransactionStatus } from "genlayer-js/types";

// ----------------------------------------------------------------------------
// ENV
// ----------------------------------------------------------------------------

dotenv.config();

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS!;
const GENLAYER_RPC_URL = process.env.GENLAYER_RPC_URL!;
const SPONSOR_PRIVATE_KEY = process.env.SPONSOR_PRIVATE_KEY!;

// ----------------------------------------------------------------------------
// GENLAYER CLIENT (REAL SDK)
// ----------------------------------------------------------------------------

// READ client (no wallet needed)
const readClient = createClient({
  chain: process.env.GENLAYER_NETWORK as any,
});

// WRITE client (wallet required for txs)
const writeClient = createClient({
  chain: process.env.GENLAYER_NETWORK as any,
  account: SPONSOR_PRIVATE_KEY as any,
  provider: undefined as any, // server-side relayer (no browser wallet)
});

// ----------------------------------------------------------------------------
// EXPRESS
// ----------------------------------------------------------------------------

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --------------------------------------------------------------------------
  // SUBMIT CLAIM (REAL CONTRACT CALL)
  // --------------------------------------------------------------------------

  app.post("/api/submit_claim", async (req, res) => {
    try {
      const { claim_text, urls } = req.body;

      if (!claim_text || !Array.isArray(urls)) {
        return res.status(400).json({ error: "INVALID_INPUT" });
      }

      if (urls.length > 3) {
        return res.status(400).json({ error: "MAX_URLS_EXCEEDED" });
      }

      const txHash = await writeClient.writeContract({
        address: CONTRACT_ADDRESS,
        functionName: "submit_claim",
        args: [claim_text, urls],
        value: BigInt(0),
      });

      return res.json({
        success: true,
        tx_hash: txHash,
      });
    } catch (err: any) {
      return res.status(500).json({
        error: "SUBMIT_FAILED",
        message: err.message,
      });
    }
  });

  // --------------------------------------------------------------------------
  // ADJUDICATE CLAIM (REAL CONTRACT EXECUTION)
  // --------------------------------------------------------------------------

  app.post("/api/adjudicate_claim", async (req, res) => {
    try {
      const { intent_id } = req.body;

      if (intent_id === undefined) {
        return res.status(400).json({ error: "INVALID_INTENT_ID" });
      }

      const txHash = await writeClient.writeContract({
        address: CONTRACT_ADDRESS,
        functionName: "adjudicate_claim",
        args: [intent_id],
        value: BigInt(0),
      });

      return res.json({
        success: true,
        tx_hash: txHash,
      });
    } catch (err: any) {
      return res.status(500).json({
        error: "ADJUDICATION_FAILED",
        message: err.message,
      });
    }
  });

  // --------------------------------------------------------------------------
  // GET CLAIM (REAL ON-CHAIN READ ONLY)
  // --------------------------------------------------------------------------

  app.get("/api/get_claim/:id", async (req, res) => {
    try {
      const intent_id = Number(req.params.id);

      const result = await readClient.readContract({
        address: CONTRACT_ADDRESS,
        functionName: "get_claim",
        args: [intent_id],
        stateStatus: "accepted",
      });

      return res.json(result);
    } catch (err: any) {
      return res.status(500).json({
        error: "READ_FAILED",
        message: err.message,
      });
    }
  });

  // --------------------------------------------------------------------------
  // HEALTH
  // --------------------------------------------------------------------------

  app.get("/api/health", (_, res) => {
    res.json({
      status: "ok",
      contract: CONTRACT_ADDRESS,
      rpc: GENLAYER_RPC_URL,
    });
  });

  // --------------------------------------------------------------------------
  // FRONTEND
  // --------------------------------------------------------------------------

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");

    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });

    app.use(vite.middlewares);
  } else {
    const dist = path.join(process.cwd(), "dist");
    app.use(express.static(dist));

    app.get("*", (_, res) => {
      res.sendFile(path.join(dist, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log("WebSeal GenLayer Relayer running on:", PORT);
    console.log("Contract:", CONTRACT_ADDRESS);
  });
}

startServer();