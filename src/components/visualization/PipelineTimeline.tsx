const steps = [
  "TX_SUBMITTED",
  "PENDING",
  "INCLUDED",
  "EXECUTING",
  "FINALIZED",
  "EXECUTION_SUCCESS",
];

export default function PipelineTimeline({ status }: any) {
  const stepStatus = (s: string) => {
    if (s === "EXECUTION_FAILED" && status === "EXECUTION_FAILED")
      return "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] scale-110 z-10";
    if (
      s === status ||
      (s === "EXECUTION_SUCCESS" && status === "STATE_SYNCED")
    ) {
      if (s === "EXECUTION_SUCCESS")
        return "bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)] scale-110 z-10";
      return "bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)] scale-110 z-10";
    }
    return "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400";
  };

  return (
    <div className="flex gap-2 flex-wrap items-center mt-6 p-4 rounded-xl border bg-white/50 dark:bg-black/20 dark:border-white/10">
      {steps.map((s) => (
        <div
          key={s}
          className={`flex-1 text-center py-2 px-3 rounded-lg text-xs font-bold transition-all ${stepStatus(s)}`}
        >
          {s === "EXECUTION_SUCCESS" && status === "EXECUTION_FAILED"
            ? "EXECUTION_FAILED"
            : s}
        </div>
      ))}
    </div>
  );
}
