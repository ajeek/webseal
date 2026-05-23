import ClaimInputPanel from "../components/claim/ClaimInputPanel";
import ConsensusVisualizer from "../components/visualization/ConsensusVisualizer";
import PipelineTimeline from "../components/visualization/PipelineTimeline";
import VerdictCard from "../components/visualization/VerdictCard";
import { useClaimFlow } from "../components/state/useClaimFlow";

export default function Dashboard() {
  const { status, data, error, txHash, submitClaim } = useClaimFlow();

  const isIdle =
    status === "IDLE" ||
    status === "WALLET_CONNECTED" ||
    status === "EXECUTION_SUCCESS" ||
    status === "EXECUTION_FAILED" ||
    status === "STATE_SYNCED";

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="mb-8">
        <ClaimInputPanel onSubmit={submitClaim} disabled={!isIdle} />
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {txHash && (
        <div className="mb-6 text-center">
          <a
            href={`https://explorer.testnet-chain.genlayer.com/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-600 dark:text-cyan-400 hover:underline text-sm font-medium"
          >
            View on Explorer
          </a>
        </div>
      )}

      <PipelineTimeline status={status} />

      {status !== "IDLE" && status !== "WALLET_CONNECTED" && (
        <ConsensusVisualizer status={status} />
      )}

      {data && status === "STATE_SYNCED" && <VerdictCard data={data} />}
    </div>
  );
}
