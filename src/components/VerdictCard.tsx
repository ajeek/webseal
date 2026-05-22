import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ShieldAlert, ShieldQuestion } from 'lucide-react';
import { VerdictResult } from '../lib/webseal';

interface VerdictCardProps {
  verdictData: VerdictResult;
  intentId: number;
}

export default function VerdictCard({ verdictData, intentId }: VerdictCardProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    // Number ticker animation
    if (!verdictData) return;
    const duration = 1500;
    const target = verdictData.confidence || 0;
    const stepTime = Math.abs(Math.floor(duration / Math.max(target, 1)));
    
    let current = 0;
    const timer = setInterval(() => {
      current += 1;
      setDisplayScore(current);
      if (current >= target) {
        clearInterval(timer);
        setDisplayScore(target);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [verdictData]);

  const isTrue = verdictData.verdict === 'TRUE';
  const isFalse = verdictData.verdict === 'FALSE';
  const isUnverifiable = verdictData.verdict === 'UNVERIFIABLE';

  const themeConfig = {
    bg: isTrue ? 'bg-emerald-50 dark:bg-[#0A1A14]' : isFalse ? 'bg-rose-50 dark:bg-[#1A0A0F]' : 'bg-amber-50 dark:bg-[#1A150A]',
    border: isTrue ? 'border-emerald-200 dark:border-emerald-900/50' : isFalse ? 'border-rose-200 dark:border-rose-900/50' : 'border-amber-200 dark:border-amber-900/50',
    shadow: isTrue ? 'shadow-emerald-500/20' : isFalse ? 'shadow-rose-500/20' : 'shadow-amber-500/20',
    text: isTrue ? 'text-emerald-700 dark:text-emerald-400' : isFalse ? 'text-rose-700 dark:text-rose-400' : 'text-amber-700 dark:text-amber-400',
    Icon: isTrue ? ShieldCheck : isFalse ? ShieldAlert : ShieldQuestion,
  };

  const { Icon } = themeConfig;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      className={`rounded-3xl border p-8 shadow-2xl backdrop-blur-xl ${themeConfig.bg} ${themeConfig.border} ${themeConfig.shadow}`}
    >
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        
        {/* Left: Verdict Banner */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center p-6 bg-white/50 dark:bg-black/20 rounded-2xl border border-white/20">
          <Icon className={`w-16 h-16 ${themeConfig.text} mb-4`} />
          <h2 className={`text-3xl font-bold tracking-tight ${themeConfig.text}`}>
            {verdictData.verdict}
          </h2>
          <div className="mt-4 text-center">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest">Confidence</span>
            <div className={`text-4xl font-mono font-bold mt-1 ${themeConfig.text}`}>
              {displayScore}%
            </div>
          </div>
        </div>

        {/* Right: Reasoning & Meta */}
        <div className="flex-1 space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Consensus Rationale</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
              {verdictData.reason}
            </p>
          </div>
          
          <div className="pt-6 border-t border-gray-200 dark:border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-xs font-mono text-gray-500 uppercase tracking-wider">Transaction Intent ID</p>
              <p className="text-sm font-mono text-gray-900 dark:text-white mt-1">#{intentId.toString().padStart(6, '0')}</p>
            </div>
            <div className="px-3 py-1.5 rounded-md bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-mono text-gray-600 dark:text-gray-400">
              Verified by GenLayer protocol
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
