import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Heart, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import CreditBadge from './CreditSystem/CreditBadge.jsx';

const WelcomePage = () => {
  const navigate = useNavigate();
  const { user } = useApp();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  const handleContinue = () => {
    navigate('/emotion-detection');
  };

  if (!user) return null;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0a0f1a 0%, #0f172a 50%, #0a0f1a 100%)'
      }}
    >
      {/* Top Bar with Credits */}
      <div className="absolute top-10 right-10 z-50">
        <CreditBadge />
      </div>
      {/* Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `rgba(59, 130, 246, ${Math.random() * 0.4 + 0.2})`,
              boxShadow: '0 0 8px rgba(59, 130, 246, 0.5)'
            }}
            animate={{
              y: [0, -80, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3
            }}
          >
            <Sparkles className="w-3 h-3 text-blue-300" />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-2xl mx-auto"
      >
        {/* Main Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="group bg-white/5 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/10 hover:border-blue-500/30 transition-all duration-500"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
          }}
        >
          {/* Card Glow Effect */}
          <motion.div
            className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            animate={{
              boxShadow: [
                '0 0 40px rgba(59, 130, 246, 0.2)',
                '0 0 60px rgba(59, 130, 246, 0.4)',
                '0 0 40px rgba(59, 130, 246, 0.2)'
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(6, 182, 212, 0.1))',
              filter: 'blur(30px)',
            }}
          />

          {/* Animated Heart Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.5,
              type: 'spring',
              stiffness: 200,
              damping: 10
            }}
            className="relative inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 via-teal-500 to-green-500 mb-8 shadow-2xl"
            style={{
              boxShadow: '0 0 40px rgba(59, 130, 246, 0.5)',
            }}
          >
            {/* Heart Glow */}
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="absolute inset-0 w-24 h-24 rounded-2xl bg-gradient-to-r from-blue-500 to-teal-500 blur-xl opacity-60"
            />

            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              <Heart className="w-12 h-12 text-white fill-current relative z-10" />
            </motion.div>
          </motion.div>

          {/* Welcome Message */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 bg-clip-text text-transparent mb-6"
          >
            Welcome, {user.name}!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-xl text-gray-300 mb-8 leading-relaxed"
          >
            I'm here to support you on your emotional wellness journey.
            Let's begin by understanding how you're feeling today.
          </motion.p>

          {/* Personalized Message */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1 }}
            className="bg-gradient-to-r from-blue-500/10 to-teal-500/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/10"
          >
            <h3 className="text-lg font-semibold text-white mb-2">
              Your Safe Space Awaits
            </h3>
            <p className="text-gray-300">
              This is a judgment-free zone where your emotions are valid and understood.
              Take your time, breathe deeply, and know that you're taking a brave step
              towards better mental health.
            </p>
          </motion.div>

          {/* Continue Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            onClick={handleContinue}
            whileHover={{
              scale: 1.05,
              boxShadow: '0 0 50px rgba(59, 130, 246, 0.5)'
            }}
            whileTap={{ scale: 0.98 }}
            className="relative inline-flex items-center bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 text-white px-12 py-5 rounded-full text-xl font-bold shadow-2xl transition-all duration-500 group overflow-hidden"
          >
            {/* Shimmer Effect */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100"
              animate={{ x: [-200, 400] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                width: '200px'
              }}
            />

            <span className="relative z-10 flex items-center">
              Start Emotion Detection
              <motion.div
                className="ml-3"
                animate={{ x: [0, 5, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </span>
          </motion.button>
        </motion.div>

        {/* Bottom Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-gray-400 mt-8 text-lg"
        >
          Remember: Healing is not linear, and every step forward matters 💫
        </motion.p>
      </motion.div>
    </div>
  );
};

export default WelcomePage;