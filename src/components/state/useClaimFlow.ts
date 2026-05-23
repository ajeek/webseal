import { useState, useEffect } from "react";
import {
  getClaim,
  submitClaim as apiSubmitClaim,
} from "../../lib/webseal";
import { connectWallet } from "../../wallet/wallet";
import { ExecutionResult, TransactionStatus } from "genlayer-js/types";
import { genlayerReadClient } from "../../lib/genlayerClient";

const TIMEOUT_MS = 120000; // 2 mins

export async function withTimeout<T>(
  promise: Promise<T>,
  timeout = TIMEOUT_MS
): Promise<T> {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Transaction timeout")), timeout)
    ),
  ]) as Promise<T>;
}

export type ClaimState =
  | "IDLE"
  | "WALLET_CONNECTED"
  | "TX_SUBMITTED"
  | "PENDING"
  | "INCLUDED"
  | "EXECUTING"
  | "FINALIZED"
  | "EXECUTION_SUCCESS"
  | "EXECUTION_FAILED"
  | "STATE_SYNCED";

function validateClaimState(result: any) {
  if (!result) throw new Error("Empty state");

  // Our prompt specified these constraints
  if (typeof result.intent_id !== "number" && typeof result.intent_id !== "bigint") {
    throw new Error("Invalid intent_id");
  }

  if (
    !["SUBMITTED", "ADJUDICATING", "SETTLED", "FAILED"].includes(result.status)
  ) {
    throw new Error("Invalid status enum");
  }

  return true;
}

export function useClaimFlow() {
  const [status, setStatus] = useState<ClaimState>("IDLE");
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  useEffect(() => {
    // If the wallet is already connected
    window.ethereum
      ?.request({ method: "eth_accounts" })
      .then((accs: string[]) => {
        if (accs.length > 0) setStatus("WALLET_CONNECTED");
      });
  }, []);

  async function connect() {
    try {
      setError(null);
      await connectWallet();
      setStatus("WALLET_CONNECTED");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to connect wallet");
    }
  }

  async function submitClaim(claim: string, urls: string[]) {
    try {
      setError(null);
      setTxHash(null);
      setStatus("TX_SUBMITTED");
      const account = await connectWallet();
      const hash: string = await apiSubmitClaim(account, claim, urls);
      setTxHash(hash);
      console.log("SUBMIT TX", hash);

      setStatus("PENDING");

      setTimeout(() => setStatus("INCLUDED"), 1500);
      setTimeout(() => setStatus("EXECUTING"), 3500);

      const receipt: any = await withTimeout(
        genlayerReadClient.waitForTransactionReceipt({
          hash: hash as any,
          status: TransactionStatus.FINALIZED,
        })
      );
      console.log("RECEIPT", receipt);

      setStatus("FINALIZED");

      // Wait to ensure we process GenLayer execution properly
      if (
        receipt.txExecutionResultName === ExecutionResult.FINISHED_WITH_RETURN
      ) {
        setStatus("EXECUTION_SUCCESS");

        // In a real app we'd get intentId from receipt events.
        let intentId = 1;
        if (receipt.data) intentId = parseInt(receipt.data, 16);

        const result: any = await getClaim(intentId);

        validateClaimState(result);

        let contractData = result;
        if (typeof result.result === "string") {
          try {
            const parsedResult = JSON.parse(result.result);
            contractData = { ...result, ...parsedResult };
          } catch (e) {
            console.error("Failed to parse result JSON", e);
          }
        } else if (result.result && typeof result.result === "object") {
          contractData = { ...result, ...result.result };
        }

        setData({
          ...contractData,
          ui_synced: true,
        });
        setStatus("STATE_SYNCED");
      } else if (
        receipt.txExecutionResultName === ExecutionResult.FINISHED_WITH_ERROR
      ) {
        throw new Error("Execution failed with contract error");
      } else if (
        receipt.txExecutionResultName === ExecutionResult.NOT_VOTED
      ) {
        throw new Error("Execution was not voted on by validators");
      } else {
        throw new Error("Execution failed or rejected by consensus");
      }
    } catch (err: any) {
      if (err.code === 4001) {
        setError("User rejected transaction");
        setStatus("IDLE");
        return;
      }
      console.error(err);
      setError(err.message || "Transaction failed");
      setStatus("EXECUTION_FAILED");
    }
  }

  return { status, data, error, txHash, submitClaim, connect, setStatus };
}
