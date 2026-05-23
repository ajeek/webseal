import { motion } from "motion/react";

export default function ConsensusVisualizer({ status }: any) {
  const isFinalStates =
    status === "FINALIZED" ||
    status === "EXECUTION_SUCCESS" ||
    status === "EXECUTION_FAILED" ||
    status === "STATE_SYNCED";
  const isExecuting = status === "EXECUTING" || status === "INCLUDED";
  const isPending = status === "PENDING" || status === "TX_SUBMITTED";

  return (
    <div className="h-64 flex items-center justify-center relative bg-white/50 dark:bg-black/20 rounded-2xl border dark:border-white/10 mt-6 overflow-hidden shadow-inner">
      <motion.div
        className={`w-10 h-10 bg-cyan-400 rounded-full z-10 ${status === "EXECUTION_SUCCESS" || status === "STATE_SYNCED" ? "bg-green-400" : status === "EXECUTION_FAILED" ? "bg-red-400" : "bg-cyan-400"}`}
        style={{
          boxShadow:
            status === "EXECUTION_SUCCESS" || status === "STATE_SYNCED"
              ? "0 0 30px 10px rgba(74,222,128,0.5)"
              : status === "EXECUTION_FAILED"
                ? "0 0 30px 10px rgba(248,113,113,0.5)"
                : "0 0 30px 10px rgba(34,211,238,0.5)",
        }}
        animate={{
          scale:
            isExecuting || isPending
              ? [1, 1.5, 1]
              : isFinalStates // collapse + burst
                ? 2
                : 1,
          opacity: isFinalStates ? 0 : 1,
        }}
        transition={{
          repeat: isExecuting || isPending ? Infinity : 0,
          duration: 2,
        }}
      />

      {[1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 bg-white rounded-full shadow-[0_0_10px_2px_rgba(255,255,255,0.8)]"
          animate={{
            x: isFinalStates ? 0 : Math.cos(i) * 80,
            y: isFinalStates ? 0 : Math.sin(i) * 80,
            opacity: isFinalStates ? 0 : 1,
          }}
          transition={{
            repeat: isPending || isExecuting ? Infinity : 0,
            duration: 3,
            ease: "linear",
          }}
        />
      ))}

      {isFinalStates && (
        <motion.div
          className={`absolute inset-0 ${status === "EXECUTION_SUCCESS" || status === "STATE_SYNCED" ? "bg-green-400" : status === "EXECUTION_FAILED" ? "bg-red-400" : "bg-cyan-400"}`}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1 }}
        />
      )}
    </div>
  );
}
