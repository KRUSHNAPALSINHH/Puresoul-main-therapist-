import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Star, Zap, Crown, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCredits } from '../context/CreditContext';

const CreditPackage = ({ credits, price, popular, features, onSelect, icon: Icon }) => (
    <motion.div
        whileHover={{ y: -10, scale: 1.02 }}
        className={`relative p-8 rounded-[2.5rem] border transition-all duration-500 ${popular
                ? 'bg-gradient-to-br from-blue-600/20 to-teal-500/20 border-blue-500/50 shadow-[0_20px_50px_rgba(59,130,246,0.15)] shadow-blue-500/10'
                : 'bg-white/[0.03] border-white/10 hover:border-white/20'
            }`}
    >
        {popular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-teal-400 text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-full shadow-lg">
                Most Popular
            </div>
        )}

        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${popular ? 'bg-blue-500 text-white shadow-xl shadow-blue-500/20' : 'bg-white/5 text-blue-400'
            }`}>
            <Icon className="w-8 h-8" />
        </div>

        <h3 className="text-2xl font-black text-white mb-2">{credits} Credits</h3>
        <div className="flex items-baseline gap-1 mb-6">
            <span className="text-4xl font-black text-white">₹{price}</span>
            <span className="text-blue-200/40 text-sm font-medium">one-time</span>
        </div>

        <div className="space-y-4 mb-8">
            {features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-blue-100/60 text-sm">
                    <CheckCircle2 className={`w-4 h-4 ${popular ? 'text-teal-400' : 'text-blue-400/60'}`} />
                    {feature}
                </div>
            ))}
        </div>

        <button
            onClick={() => onSelect(credits, price)}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 ${popular
                    ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40'
                    : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                }`}
        >
            Select Plan
        </button>
    </motion.div>
);

const BuyCreditsPage = () => {
    const navigate = useNavigate();
    const { credits, addCredits } = useCredits();
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [success, setSuccess] = useState(false);

    const packages = [
        {
            credits: 25,
            price: 199,
            icon: Zap,
            features: ['25 Therapy Messages', 'Emotion Detection', 'Standard AI Support', 'Session Summary'],
            popular: false
        },
        {
            credits: 100,
            price: 699,
            icon: Star,
            features: ['100 Therapy Messages', 'Priority Processing', 'Deep Context Awareness', 'Extended Sessions'],
            popular: true
        },
        {
            credits: 300,
            price: 1499,
            icon: Crown,
            features: ['Unlimited History', '300 Therapy Messages', 'Voice Support Enabled', 'Premium Wellness Tools'],
            popular: false
        }
    ];

    const handlePurchase = async (amount, price) => {
        setIsPurchasing(true);
        // Simulate payment wait
        await new Promise(r => setTimeout(r, 1500));

        await addCredits(amount);
        setIsPurchasing(false);
        setSuccess(true);

        setTimeout(() => {
            navigate('/therapy-session');
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-[#0a0f1a] p-6 lg:p-12 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-600/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

            {/* Navigation */}
            <nav className="relative z-10 flex items-center justify-between mb-16 max-w-7xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-blue-200/40 hover:text-white transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold uppercase tracking-widest text-[10px]">Back to session</span>
                </button>

                <div className="flex items-center gap-3 px-6 py-2 bg-white/5 rounded-full border border-white/10">
                    <Ticket className="w-4 h-4 text-amber-400" />
                    <span className="text-white font-black">{credits}</span>
                    <span className="text-blue-200/40 text-xs font-bold uppercase">Current Credits</span>
                </div>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16"
                >
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
                        Recharge Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">Wellness</span>
                    </h1>
                    <p className="text-blue-100/60 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                        Choose a credit package that suits your journey. Every credit represents a step towards a calmer, more mindful you.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {packages.map((pkg, i) => (
                        <CreditPackage
                            key={i}
                            {...pkg}
                            onSelect={handlePurchase}
                        />
                    ))}
                </div>

                <p className="text-blue-200/30 text-xs font-bold uppercase tracking-[0.3em]">
                    Secure Payment processing • Cancel anytime
                </p>
            </main>

            {/* Success Overlay */}
            <AnimatePresence>
                {(isPurchasing || success) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white/[0.03] border border-white/10 p-12 rounded-[3rem] max-w-md w-full text-center"
                        >
                            {isPurchasing ? (
                                <>
                                    <div className="w-24 h-24 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-8" />
                                    <h2 className="text-2xl font-black text-white mb-2">Processing Payment</h2>
                                    <p className="text-blue-100/60">Securing your wellness credits...</p>
                                </>
                            ) : (
                                <>
                                    <div className="w-24 h-24 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-teal-500/20">
                                        <CheckCircle2 className="w-12 h-12 text-white" />
                                    </div>
                                    <h2 className="text-3xl font-black text-white mb-2">Success!</h2>
                                    <p className="text-blue-100/60 mb-8">Your credits have been added to your account.</p>
                                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '100%' }}
                                            transition={{ duration: 2 }}
                                            className="h-full bg-teal-500"
                                        />
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BuyCreditsPage;
