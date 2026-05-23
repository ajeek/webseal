import { createClient } from "genlayer-js";
import { testnetBradbury } from "genlayer-js/chains";

/**
 * READ CLIENT (NO WALLET REQUIRED)
 */
export const genlayerReadClient = createClient({
  chain: testnetBradbury,
});

/**
 * WRITE CLIENT (MUST BE CREATED PER WALLET SESSION)
 */
export function createGenlayerWriteClient(account: string) {
  if (!account) {
    throw new Error("Wallet account missing for write operation");
  }

  return createClient({
    chain: testnetBradbury,
    account: account as any,
    provider: window.ethereum,
  });
}