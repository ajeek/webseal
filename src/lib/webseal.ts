import {
  genlayerReadClient,
  createGenlayerWriteClient,
} from "./genlayerClient";

const CONTRACT_ADDRESS = (import.meta as any).env.VITE_CONTRACT_ADDRESS as `0x${string}`;

// -------------------------
// WRITE: SUBMIT CLAIM
// -------------------------
export async function submitClaim(
  account: string,
  claim: string,
  urls: string[]
) {
  const client = createGenlayerWriteClient(account);

  return client.writeContract({
    address: CONTRACT_ADDRESS,
    functionName: "submit_claim",
    args: [claim, urls],
    value: BigInt(0),
  });
}

// -------------------------
// WRITE: ADJUDICATE CLAIM
// -------------------------
export async function adjudicateClaim(
  account: string,
  intentId: number
) {
  const client = createGenlayerWriteClient(account);

  return client.writeContract({
    address: CONTRACT_ADDRESS,
    functionName: "adjudicate_claim",
    args: [intentId],
    value: BigInt(0),
  });
}

// -------------------------
// READ: GET CLAIM
// -------------------------
export async function getClaim(intentId: number) {
  return genlayerReadClient.readContract({
    address: CONTRACT_ADDRESS,
    functionName: "get_claim",
    args: [intentId],
    stateStatus: "accepted",
  } as any);
}