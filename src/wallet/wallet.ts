const CHAIN_ID = "0x107d";
const CHAIN_ID_DECIMAL = 4221;

const BRADBURY_CONFIG = {
  chainId: CHAIN_ID,
  chainName: "GenLayer Bradbury Testnet",
  rpcUrls: ["https://rpc-bradbury.genlayer.com"],
  nativeCurrency: {
    name: "GEN",
    symbol: "GEN",
    decimals: 18,
  },
  blockExplorerUrls: [
    "https://explorer.testnet-chain.genlayer.com",
  ],
};

export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error("No Ethereum wallet detected");
  }

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  const currentChainId = await window.ethereum.request({
    method: "eth_chainId",
  });
  if (
    parseInt(currentChainId, 16) !== CHAIN_ID_DECIMAL &&
    currentChainId !== CHAIN_ID
  ) {
    await switchToBradbury();
  }

  const finalChainId = await window.ethereum.request({ method: "eth_chainId" });
  if (
    parseInt(finalChainId, 16) !== CHAIN_ID_DECIMAL &&
    finalChainId !== CHAIN_ID
  ) {
    throw new Error("Wrong network: must be Bradbury");
  }

  return accounts[0];
}

export async function switchToBradbury() {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: CHAIN_ID }],
    });
  } catch (err: any) {
    if (err.code === 4902 || err?.data?.originalError?.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [BRADBURY_CONFIG],
        });
        
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: CHAIN_ID }],
        });
      } catch (addErr) {
        throw new Error("Failed to add or switch to Bradbury testnet");
      }
    } else {
      throw new Error("Failed to switch to Bradbury testnet");
    }
  }
}
