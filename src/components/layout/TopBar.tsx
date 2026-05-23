import WalletButton from "./WalletButton";
import FaucetButton from "./FaucetButton";
import ThemeToggle from "../ThemeToggle";

export default function TopBar() {
  return (
    <div className="flex justify-between p-4 border-b">
      <div>
        <h1>WebSeal</h1>
        <p>GenLayer Claim Verification</p>
      </div>

      <div className="flex gap-3">
        <FaucetButton />
        <ThemeToggle />
        <WalletButton />
      </div>
    </div>
  );
}
