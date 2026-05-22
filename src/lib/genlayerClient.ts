import { createClient } from "genlayer-js";
import { testnetBradbury } from "genlayer-js/chains";

// GenLayer blockchain client (READ + WRITE bridge)
export const genlayerClient = createClient({
  chain: testnetBradbury,
});