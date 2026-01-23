import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket } from 'lucide-react';
import { useCredits } from '../../context/CreditContext';

const CreditBadge = () => {
    const { credits } = useCredits();
    const [prevCredits, setPrevCredits] = useState(credits);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (credits !== prevCredits) {
            setIsAnimating(true);
            const timer = setTimeout(() => setIsAnimating(false), 1000);
            setPrevCredits(credits);
            return () => clearTimeout(timer);
        }
    }, [credits, prevCredits]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-lg group hover:bg-white/20 transition-all cursor-default"
        >
            <motion.div
                animate={isAnimating ? { rotate: [0, -15, 15, -15, 0], scale: [1, 1.2, 1] } : {}}
                className="text-amber-400"
            >
                <Ticket className="w-5 h-5 fill-current" />
            </motion.div>

            <div className="flex flex-col">
                <span className="text-[10px] text-blue-200/60 uppercase tracking-widest font-bold leading-none mb-0.5">Credits</span>
                <div className="flex items-baseline gap-1">
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={credits}
                            initial={{ y: 5, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -5, opacity: 0 }}
                            className={`text-lg font-black leading-none ${credits <= 3 ? 'text-rose-400' : 'text-white'}`}
                        >
                            {credits}
                        </motion.span>
                    </AnimatePresence>
                    <span className="text-xs text-white/40 font-medium">/ 12</span>
                </div>
            </div>

            {/* Pulsing indicator for low credits */}
            {credits <= 3 && (
                <span className="relative flex h-2 w-2 ml-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
            )}
        </motion.div>
    );
};

export default CreditBadge;
