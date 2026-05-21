import React, { useState, useEffect } from 'react';
import ClaimInputPanel from '../components/ClaimInputPanel';
import EvidenceTimeline from '../components/EvidenceTimeline';
import ConsensusVisualizer from '../components/ConsensusVisualizer';
import VerdictCard from '../components/VerdictCard';
import TransactionStatusTracker from '../components/TransactionStatusTracker';
import { websealClient, ClaimStatusResponse } from '../api/websealClient';
import { Shield } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import { motion, AnimatePresence } from 'motion/react';

export default function Dashboard() {
  const [status, setStatus] = useState<'IDLE' | 'SUBMITTED' | 'ADJUDICATING' | 'SETTLED' | 'FAILED'>('IDLE');
  const [intentId, setIntentId] = useState<number | null>(null);
  const [verdict, setVerdict] = useState<ClaimStatusResponse['result']>(null);

  useEffect(() => {
    let pollInterval: NodeJS.Timeout;

    if ((status === 'SUBMITTED' || status === 'ADJUDICATING') && intentId !== null) {
      pollInterval = setInterval(async () => {
        try {
          // Normally we'd poll the real API
          const response = await websealClient.pollStatus(intentId);
          setStatus(response.status);
          if (response.result) {
            setVerdict(response.result);
          }
        } catch (error) {
          console.error("Polling error:", error);
          // In a real app we might not want to fail immediately on network flake,
          // but for now let's just log it.
        }
      }, 5000);
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [status, intentId]);

  const submitClaim = async (claim: string, urls: string[]) => {
    try {
      const res = await websealClient.submitClaim(claim, urls);
      setIntentId(res.intent_id);
      setStatus('SUBMITTED');
      await websealClient.adjudicateClaim(res.intent_id);
    } catch (error) {
      console.error(error);
      setStatus('FAILED');
    }
  };

  const resetFlow = () => {
    setStatus('IDLE');
    setIntentId(null);
    setVerdict(null);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] transition-colors duration-500 font-sans text-gray-900 dark:text-gray-100">
      
      {/* Navigation Layer */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-black/60 backdrop-blur-xl border-b border-gray-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 dark:bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">WebSeal</h1>
            </div>
          </div>
          <div className="flex items-center space-x-6">
             <div className="hidden md:flex items-center space-x-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                 <span className="text-xs font-mono font-medium text-gray-500 dark:text-gray-400">GenLayer Network Connected</span>
             </div>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        
        {/* Header Text */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400 dark:from-white dark:to-white/60">
            Decentralized Verification.
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Submit real-world claims. Watch GenLayer Intelligent Contracts retrieve evidence, adjudicate truth, and reach consensus entirely on-chain.
          </p>
        </div>

        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
             <ClaimInputPanel onSubmit={submitClaim} disabled={status !== 'IDLE' && status !== 'FAILED'} />
             {status === 'SETTLED' && (
                 <div className="mt-4 text-center">
                    <button onClick={resetFlow} className="text-sm text-indigo-600 dark:text-blue-400 hover:underline font-medium">Verify another claim</button>
                 </div>
             )}
          </div>
          
          <div className="lg:col-span-5 space-y-6">
             {status !== 'IDLE' && (
               <TransactionStatusTracker intentId={intentId} status={status} />
             )}
             <EvidenceTimeline status={status} />
          </div>
        </div>

        {/* Theater Section */}
        <AnimatePresence>
          {status !== 'IDLE' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="py-12 border-t border-gray-200 dark:border-white/10"
            >
               <h3 className="text-center text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-8">
                 Smart Contract Execution Layer
               </h3>

               <div className="max-w-4xl mx-auto flex flex-col items-center gap-12">
                  <div className="w-full">
                    <ConsensusVisualizer status={status} />
                  </div>

                  {status === 'SETTLED' && verdict && (
                    <div className="w-full">
                       <VerdictCard verdictData={verdict} intentId={intentId!} />
                    </div>
                  )}
               </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

    </div>
  );
}
