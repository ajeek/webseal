import React from 'react';
import { Activity } from 'lucide-react';
import { motion } from 'motion/react';

interface TrackerProps {
  intentId: number | null;
  status: 'IDLE' | 'SUBMITTED' | 'ADJUDICATING' | 'SETTLED' | 'FAILED';
}

export default function TransactionStatusTracker({ intentId, status }: TrackerProps) {
  if (status === 'IDLE' || intentId === null) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 dark:bg-[#111318]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-xl p-4 shadow-md flex items-center justify-between"
    >
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-blue-900/30 border border-indigo-200 dark:border-blue-500/30 flex items-center justify-center text-indigo-600 dark:text-blue-400">
          <Activity className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest shrink-0">
            Relayer Status
          </p>
          <p className="text-sm font-mono text-gray-900 dark:text-white font-medium mt-0.5">
            Intent #{intentId.toString().padStart(6, '0')}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <span className="relative flex h-3 w-3">
          {(status === 'SUBMITTED' || status === 'ADJUDICATING') && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          )}
          <span className={`relative inline-flex rounded-full h-3 w-3 ${
            status === 'SETTLED' ? 'bg-emerald-500' :
            status === 'FAILED' ? 'bg-red-500' :
            'bg-indigo-500'
          }`}></span>
        </span>
        <span className="text-sm font-mono font-bold tracking-wider uppercase text-gray-700 dark:text-gray-300">
          {status}
        </span>
      </div>
    </motion.div>
  );
}
