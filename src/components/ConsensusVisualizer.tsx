import React from 'react';
import { motion } from 'motion/react';
import { Network } from 'lucide-react';

interface ConsensusProps {
  status: 'IDLE' | 'SUBMITTED' | 'ADJUDICATING' | 'SETTLED' | 'FAILED';
}

export default function ConsensusVisualizer({ status }: ConsensusProps) {
  
  const isActive = status === 'ADJUDICATING';
  const isSettled = status === 'SETTLED';
  const isFailed = status === 'FAILED';

  // Abstract nodes for visualization
  const nodes = [
    { id: 1, angle: 0 },
    { id: 2, angle: 72 },
    { id: 3, angle: 144 },
    { id: 4, angle: 216 },
    { id: 5, angle: 288 },
  ];

  return (
    <div className="bg-white/50 dark:bg-[#0A0A0B]/50 backdrop-blur-xl border border-gray-200 dark:border-white/5 rounded-3xl p-8 shadow-inner overflow-hidden relative min-h-[300px] flex items-center justify-center">
      
      {/* Background radial glow */}
      <div className={`absolute inset-0 opacity-20 blur-[100px] transition-colors duration-1000 ${
        isSettled ? 'bg-emerald-500' : 
        isFailed ? 'bg-red-500' : 
        isActive ? 'bg-indigo-500 dark:bg-blue-500' : 'bg-transparent'
      }`} />

      <div className="relative w-64 h-64 flex items-center justify-center">
        
        {/* Central Truth Lock */}
        <motion.div 
          initial={false}
          animate={{
            scale: isSettled || isFailed ? 1 : 0.8,
            boxShadow: isSettled ? "0 0 40px 10px rgba(16, 185, 129, 0.4)" : isFailed ? "0 0 40px 10px rgba(239, 68, 68, 0.4)" : "0 0 0px 0px rgba(0,0,0,0)",
            borderColor: isSettled ? "#10B981" : isFailed ? "#EF4444" : isActive ? "rgba(99, 102, 241, 0.5)" : "rgba(156, 163, 175, 0.3)"
          }}
          transition={{ duration: 1 }}
          className={`absolute w-20 h-20 rounded-full border-2 flex items-center justify-center z-20 ${
            isSettled ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' : 
            isFailed ? 'bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400' : 
            'bg-gray-50 dark:bg-[#111318] text-gray-400'
          }`}
        >
          <Network className="w-8 h-8" />
        </motion.div>

        {/* Orbiting Validator Nodes */}
        {nodes.map((node) => {
          const radius = isSettled || isFailed ? 0 : 100; // Snap to center
          const radian = (node.angle * Math.PI) / 180;
          const x = Math.cos(radian) * radius;
          const y = Math.sin(radian) * radius;

          return (
            <React.Fragment key={node.id}>
              {/* Connecting Line */}
              <motion.line 
                initial={false}
                animate={{
                  x2: isSettled || isFailed ? 0 : x,
                  y2: isSettled || isFailed ? 0 : y,
                  opacity: isActive || isSettled ? 0.3 : 0.1
                }}
                transition={{ duration: 1, type: "spring" }}
                stroke={isSettled ? "#10B981" : isFailed ? "#EF4444" : "#6366F1"}
                strokeWidth="2"
                strokeDasharray="4 4"
                className="absolute inset-0"
                style={{ originX: 0, originY: 0, transform: `translate(128px, 128px)` }}
                x1={0} y1={0}
              />

              {/* Node Point */}
              <motion.div
                initial={false}
                animate={{
                  x: x,
                  y: y,
                  scale: isSettled || isFailed ? 0 : isActive ? [1, 1.2, 1] : 1,
                  opacity: isSettled || isFailed ? 0 : 1
                }}
                transition={{ 
                  scale: { duration: 2, repeat: Infinity, delay: node.id * 0.2 },
                  x: { duration: 1, type: "spring" },
                  y: { duration: 1, type: "spring" }
                }}
                className={`absolute w-6 h-6 rounded-full border-2 border-[#111318] z-10 ${
                  isActive ? 'bg-indigo-500 dark:bg-blue-500 shadow-lg shadow-indigo-500/50' : 'bg-gray-300 dark:bg-gray-700'
                }`}
                style={{ marginLeft: '-12px', marginTop: '-12px' }}
              />
            </React.Fragment>
          );
        })}
        
        {/* SVG overlay for lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
          {nodes.map(node => {
            const radius = isActive ? 100 : 0;
            const radian = (node.angle * Math.PI) / 180;
            const x = Math.cos(radian) * radius;
            const y = Math.sin(radian) * radius;
            return (
               <motion.line
                 key={`line-${node.id}`}
                 initial={false}
                 animate={{
                    x2: isSettled || isFailed ? 128 : 128 + x,
                    y2: isSettled || isFailed ? 128 : 128 + y,
                    opacity: isActive ? 0.4 : isSettled ? 0.8 : 0
                 }}
                 transition={{ duration: 0.8 }}
                 x1="128" y1="128"
                 stroke={isSettled ? "currentColor" : isFailed ? "#EF4444" : "#6366F1"}
                 className={isSettled ? 'text-emerald-500' : ''}
                 strokeWidth="2"
                 strokeDasharray="4 4"
               />
            )
          })}
        </svg>

      </div>

      <div className="absolute bottom-6 left-0 right-0 text-center">
         <p className="text-xs font-mono tracking-widest text-gray-500 uppercase">
           {isSettled ? 'Consensus Reached' : isActive ? 'Equivalence Principle Resolution...' : isFailed ? 'Consensus Failed' : 'GenLayer Network Idle'}
         </p>
      </div>

    </div>
  );
}
