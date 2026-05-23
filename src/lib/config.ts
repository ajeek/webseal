export const CONTRACT_ADDRESS = (import.meta as any).env
  .VITE_CONTRACT_ADDRESS as string;

if (!CONTRACT_ADDRESS) {
  throw new Error("Missing VITE_CONTRACT_ADDRESS");
}
