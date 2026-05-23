import { useState } from "react";
import { submitClaim } from "../../lib/webseal";

export default function ClaimInputPanel({ onSubmit, disabled }: any) {
  const [claim, setClaim] = useState("");
  const [url, setUrl] = useState("");

  function submit() {
    if (!disabled && onSubmit) onSubmit(claim, [url]);
  }

  return (
    <div className="bg-white/80 dark:bg-[#111318]/80 border shadow-xl rounded-2xl p-6 dark:border-white/10">
      <h2 className="text-xl font-bold mb-4">Submit Claim for Verification</h2>

      <textarea
        className="w-full p-4 mb-4 rounded-xl border dark:bg-black/50 dark:border-white/10 outline-none focus:ring-2 focus:ring-cyan-500 min-h-[100px]"
        placeholder="Enter your claim..."
        onChange={(e) => setClaim(e.target.value)}
      />

      <input
        className="w-full p-4 mb-6 rounded-xl border dark:bg-black/50 dark:border-white/10 outline-none focus:ring-2 focus:ring-cyan-500"
        placeholder="Evidence URL"
        onChange={(e) => setUrl(e.target.value)}
      />

      <button
        className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all"
        onClick={submit}
      >
        Submit Claim
      </button>
    </div>
  );
}
