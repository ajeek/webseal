import { useState } from "react";
import { connectWallet } from "../../wallet/wallet";

export default function WalletButton() {
  const [addr, setAddr] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  async function handleConnect() {
    if (addr) return;
    try {
      const a = await connectWallet();
      setAddr(a);
    } catch (err) {
      console.error(err);
    }
  }

  function handleDisconnect(e: React.MouseEvent) {
    e.stopPropagation();
    setAddr(null);
    setIsHovered(false);
  }

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={handleConnect}
        className="px-3 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
      >
        {addr ? addr.slice(0, 6) + "..." + addr.slice(-4) : "Connect Wallet"}
      </button>

      {addr && isHovered && (
        <div className="absolute right-0 top-full mt-2 w-48 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 z-50 transition-all origin-top-right">
          <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700 truncate">
            {addr}
          </div>
          <button
            onClick={handleDisconnect}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            Disconnect Wallet
          </button>
        </div>
      )}
    </div>
  );
}
