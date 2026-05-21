import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Clock, Loader2, XCircle } from 'lucide-react';

interface TimelineProps {
  status: 'IDLE' | 'SUBMITTED' | 'ADJUDICATING' | 'SETTLED' | 'FAILED';
}

const steps = [
  { id: 'SUBMITTED', label: 'Claim Submitted', desc: 'Relayed to GenLayer nodes' },
  { id: 'ADJUDICATING_FETCH', label: 'Fetching Evidence', desc: 'Executing gl.nondet.web.render' },
  { id: 'ADJUDICATING_AI', label: 'AI Adjudication', desc: 'Executing gl.nondet.exec_prompt' },
  { id: 'CONSENSUS', label: 'Consensus Execution', desc: 'Resolving gl.eq_principle.strict_eq' },
  { id: 'SETTLED', label: 'Final Verdict', desc: 'Result permanently stored on-chain' }
];

export default function EvidenceTimeline({ status }: TimelineProps) {
  
  const getSimulatedStep = () => {
    if (status === 'IDLE') return -1;
    if (status === 'SUBMITTED') return 0;
    if (status === 'ADJUDICATING') return 2; // For visual flair, we'll hover around AI & Consensus during this state
    if (status === 'SETTLED') return 4;
    if (status === 'FAILED') return 4;
    return -1;
  };

  const currentStepIndex = getSimulatedStep();

  return (
    <div className="bg-white/80 dark:bg-[#111318]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-xl dark:shadow-2xl">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-8">
        Execution Pipeline
      </h3>
      
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-white/10 z-0"></div>
        
        <div className="space-y-8 relative z-10">
          {steps.map((step, idx) => {
            const isCompleted = currentStepIndex > idx || (status === 'SETTLED' && idx === 4);
            const isActive = currentStepIndex === idx || (status === 'ADJUDICATING' && (idx === 1 || idx === 2 || idx === 3));
            const isFailed = status === 'FAILED' && idx === 4;

            return (
              <motion.div 
                key={step.id}
                initial={{ opacity: 0.5, x: -10 }}
                animate={{ 
                  opacity: isActive || isCompleted || isFailed ? 1 : 0.4, 
                  x: 0 
                }}
                className="flex items-start"
              >
                <div className="relative mr-4 mt-0.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-500 ${
                    isFailed 
                      ? 'bg-red-50 dark:bg-red-900/30 border-red-500 text-red-500'
                    : isCompleted 
                      ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 text-emerald-500' 
                    : isActive 
                      ? 'bg-indigo-50 dark:bg-blue-900/30 border-indigo-500 dark:border-blue-500 text-indigo-600 dark:text-blue-400'
                    : 'bg-white dark:bg-[#0A0A0B] border-gray-300 dark:border-gray-700 text-gray-400'
                  }`}>
                    {isFailed ? <XCircle className="w-4 h-4" /> : 
                     isCompleted ? <CheckCircle2 className="w-4 h-4" /> : 
                     isActive ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                     <Clock className="w-4 h-4" />}
                  </div>
                  {isActive && (
                    <motion.div 
                      className="absolute inset-0 rounded-full border-2 border-indigo-400 dark:border-blue-400"
                      animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>
                
                <div>
                  <h4 className={`text-sm font-semibold transition-colors duration-500 ${
                    isFailed ? 'text-red-600 dark:text-red-400' :
                    isActive || isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-500'
                  }`}>
                    {step.label}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
