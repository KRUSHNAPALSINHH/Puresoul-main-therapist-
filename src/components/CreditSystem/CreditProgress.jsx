import React from 'react';
import { motion } from 'framer-motion';
import { useCredits } from '../../context/CreditContext';

const CreditProgress = () => {
    const { credits } = useCredits();
    const maxCredits = 12;
    const progress = (credits / maxCredits) * 100;

    // Determine color based on remaining credits
    const getProgressColor = () => {
        if (credits <= 2) return 'bg-rose-500';
        if (credits <= 5) return 'bg-amber-500';
        return 'bg-blue-500';
    };

    const getGlowColor = () => {
        if (credits <= 2) return 'shadow-[0_0_10px_#f43f5e]';
        if (credits <= 5) return 'shadow-[0_0_10px_#f59e0b]';
        return 'shadow-[0_0_10px_#3b82f6]';
    };

    return (
        <div className="flex flex-col gap-2 w-full max-w-[200px]">
            <div className="flex justify-between items-end px-1">
                <span className="text-[10px] uppercase tracking-widest font-black text-white/40">
                    Energy Balance
                </span>
                <span className={`text-xs font-bold ${progress <= 20 ? 'text-rose-400' : 'text-blue-300'}`}>
                    {credits} / {maxCredits}
                </span>
            </div>

            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 relative">
                <motion.div
                    initial={{ width: '100%' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: 'spring', stiffness: 50, damping: 20 }}
                    className={`h-full rounded-full ${getProgressColor()} ${getGlowColor()} transition-colors duration-500`}
                />
            </div>

            {credits <= 3 && credits > 0 && (
                <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[9px] text-amber-400/80 font-medium italic animate-pulse px-1"
                >
                    Low credits! Conserving energy 😊
                </motion.p>
            )}

            {credits === 0 && (
                <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[9px] text-rose-400 font-bold uppercase tracking-tighter px-1"
                >
                    Out of energy. Please recharge 💛
                </motion.p>
            )}
        </div>
    );
};

export default CreditProgress;
