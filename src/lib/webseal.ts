import { genlayerClient } from "./genlayerClient";

/**
 * WebSeal Contract Address
 */
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

// -----------------------------
// SAFETY GUARD (BUILD SAFE)
// -----------------------------
if (!CONTRACT_ADDRESS) {
  throw new Error("[WebSeal] Missing VITE_CONTRACT_ADDRESS");
}

// -----------------------------
// TYPES
// -----------------------------
export interface VerdictResult {
  verdict: "TRUE" | "FALSE" | "UNVERIFIABLE";
  confidence: number;
  reason: string;
}

export interface ClaimStatusResponse {
  intent_id: number;
  status: "SUBMITTED" | "ADJUDICATING" | "SETTLED" | "FAILED";
  claim: string;
  evidence_urls: string[];
  result: VerdictResult | null;
  submitted_at: number;
  settled_at: number;
  error?: string;
}

// -----------------------------
// WRITE: SUBMIT CLAIM
// -----------------------------
export async function submitClaim(claim: string, urls: string[]) {
  try {
    const txHash = await genlayerClient.writeContract({
      address: CONTRACT_ADDRESS,
      functionName: "submit_claim",
      args: [claim, urls],
      value: BigInt(0),
    });

    return { txHash };
  } catch (err: any) {
    console.error("[submitClaim failed]", err);
    throw new Error("Transaction rejected or failed");
  }
}

// -----------------------------
// WRITE: ADJUDICATE CLAIM
// -----------------------------
export async function adjudicateClaim(intentId: number) {
  try {
    const txHash = await genlayerClient.writeContract({
      address: CONTRACT_ADDRESS,
      functionName: "adjudicate_claim",
      args: [intentId],
      value: BigInt(0),
    });

    return { txHash };
  } catch (err: any) {
    console.error("[adjudicateClaim failed]", err);
    throw new Error("Adjudication transaction failed");
  }
}

// -----------------------------
// READ: GET CLAIM
// -----------------------------
export async function getClaim(
  intentId: number
): Promise<ClaimStatusResponse> {
  try {
    const result: any = await genlayerClient.readContract({
      address: CONTRACT_ADDRESS,
      functionName: "get_claim",
      args: [intentId],
      stateStatus: "accepted",
    });

    if (!result) {
      throw new Error("Empty contract response");
    }

    return {
      intent_id: Number(result.intent_id),
      status: result.status ?? "FAILED",
      claim: result.claim ?? "",
      evidence_urls: Array.isArray(result.evidence_urls)
        ? result.evidence_urls
        : JSON.parse(result.evidence_urls ?? "[]"),
      result: result.result ?? null,
      submitted_at: Number(result.submitted_at ?? 0),
      settled_at: Number(result.settled_at ?? 0),
      error: result.error,
    };
  } catch (err: any) {
    console.error("[getClaim failed]", err);

    return {
      intent_id: intentId,
      status: "FAILED",
      claim: "",
      evidence_urls: [],
      result: null,
      submitted_at: 0,
      settled_at: 0,
      error: err.message ?? "Read failed",
    };
  }
}