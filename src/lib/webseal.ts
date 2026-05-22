import { genlayerClient } from "./genlayerClient";

/**
 * GenLayer WebSeal Contract Address
 * Must be defined in .env:
 * VITE_CONTRACT_ADDRESS=0x...
 */
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS as string;

// -----------------------------
// SAFETY GUARD
// -----------------------------
if (!CONTRACT_ADDRESS) {
  throw new Error(
    "[WebSeal] Missing VITE_CONTRACT_ADDRESS in environment variables"
  );
}

// -----------------------------
// TYPES (FRONTEND SAFE FORMAT)
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
  return await genlayerClient.writeContract({
    address: CONTRACT_ADDRESS,
    functionName: "submit_claim",
    args: [claim, urls],
    value: BigInt(0),
  });
}

// -----------------------------
// WRITE: ADJUDICATE CLAIM
// -----------------------------
export async function adjudicateClaim(intentId: number) {
  return await genlayerClient.writeContract({
    address: CONTRACT_ADDRESS,
    functionName: "adjudicate_claim",
    args: [intentId],
    value: BigInt(0),
  });
}

// -----------------------------
// READ: GET CLAIM (SAFE NORMALIZED OUTPUT)
// -----------------------------
export async function getClaim(
  intentId: number
): Promise<ClaimStatusResponse> {
  const result: any = await genlayerClient.readContract({
    address: CONTRACT_ADDRESS,
    functionName: "get_claim",
    args: [intentId],
    stateStatus: "accepted",
  });

  // -----------------------------
  // NORMALIZATION (CRITICAL FOR UI SAFETY)
  // -----------------------------
  return {
    intent_id: Number(result.intent_id),
    status: result.status,
    claim: result.claim,
    evidence_urls: Array.isArray(result.evidence_urls)
      ? result.evidence_urls
      : JSON.parse(result.evidence_urls ?? "[]"),
    result: result.result ?? null,
    submitted_at: Number(result.submitted_at ?? 0),
    settled_at: Number(result.settled_at ?? 0),
    error: result.error,
  };
}