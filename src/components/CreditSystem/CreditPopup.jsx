import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, History, LogOut, Sparkles } from 'lucide-react';

const CreditPopup = ({ isOpen, onBuy, onSummary, onEnd }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl overflow-hidden text-center group"
                    >
                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/20 blur-[80px] rounded-full" />
                        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/20 blur-[80px] rounded-full" />

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl mb-8 group-hover:scale-110 transition-transform duration-500">
                                <Ticket className="w-12 h-12 text-white fill-current animate-pulse" />
                            </div>

                            <h2 className="text-3xl font-black text-white mb-4 leading-tight">
                                Your free credits are used up 💛
                            </h2>

                            <p className="text-blue-100/70 text-lg font-medium mb-10 leading-relaxed px-4">
                                I’m here to support you. You can continue by purchasing more credits.
                            </p>

                            <div className="grid grid-cols-1 gap-4 w-full">
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={onSummary}
                                        className="flex items-center justify-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all active:scale-95"
                                    >
                                        <History className="w-5 h-5" />
                                        Summary
                                    </button>
                                    <button
                                        onClick={onEnd}
                                        className="flex items-center justify-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all active:scale-95"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        End Session
                                    </button>
                                </div>

                                <button
                                    onClick={onBuy}
                                    className="group relative flex items-center justify-center gap-3 w-full bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 p-5 rounded-2xl text-white font-bold text-xl shadow-xl hover:shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <Sparkles className="w-6 h-6" />
                                    Buy More Credits
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CreditPopup;
