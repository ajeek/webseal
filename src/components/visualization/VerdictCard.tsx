export default function VerdictCard({ data }: any) {
  if (!data || !data.verdict) return null;

  const color =
    data.verdict === "TRUE"
      ? "text-emerald-500 border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.2)] bg-emerald-500/10"
      : data.verdict === "FALSE"
        ? "text-rose-500 border-rose-500/50 shadow-[0_0_25px_rgba(244,63,94,0.2)] bg-rose-500/10"
        : "text-amber-500 border-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.2)] bg-amber-500/10";

  return (
    <div className={`mt-6 p-6 rounded-2xl border backdrop-blur-xl ${color}`}>
      <h2 className="text-3xl font-bold tracking-tight mb-2">
        Verdict: {data.verdict}
      </h2>
      <p className="font-mono text-sm opacity-80 mb-4">
        Confidence: {data.confidence}%
      </p>
      <div className="pt-4 border-t border-current/20">
        <p className="text-sm leading-relaxed">{data.reason}</p>
      </div>
    </div>
  );
}
