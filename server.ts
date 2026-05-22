import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import crypto from "crypto";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Backend Relayer Endpoints
  // In a real GenLayer node, these would sign transactions to target `CONTRACT_ADDRESS` using `SPONSOR_PRIVATE_KEY` 
  
  // Temporary locally-stored state for the stateless relayer simulation
  const mockState = new Map();

  app.post("/api/submit_claim", (req, res) => {
    const { claim, urls } = req.body;
    const intent_id = Math.floor(Math.random() * 1000000);
    mockState.set(intent_id, {
      intent_id,
      status: 'SUBMITTED',
      claim,
      evidence_urls: urls,
      result: null,
      submitted_at: Date.now(),
      settled_at: 0
    });
    
    // Simulating relayer safely returning an intent ID to the user to poll
    res.json({ intent_id });
  });

  app.post("/api/adjudicate_claim", (req, res) => {
    const { intent_id } = req.body;
    const claim = mockState.get(intent_id);
    if (!claim) return res.status(404).json({ error: "Intent not found" });
    
    claim.status = 'ADJUDICATING';
    
    // Simulate real GenLayer execution delay
    setTimeout(() => {
      claim.status = 'SETTLED';
      claim.settled_at = Date.now();
      claim.result = {
          verdict: 'TRUE',
          confidence: 96,
          reason: 'Evidence from multiple provided urls indicates the claim is true, processed via gl.nondet.exec_prompt and reached consensus strictly via WebSeal GenLayer contract.'
      };
    }, 5000);

    res.json({ success: true, status: claim.status });
  });

  app.get("/api/get_claim/:id", (req, res) => {
    const intent_id = parseInt(req.params.id);
    const claim = mockState.get(intent_id);
    if (!claim) return res.status(404).json({ error: "Intent not found" });
    res.json(claim);
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", genlayer_rpc_status: "simulated" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Stateless Transation Relay running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
