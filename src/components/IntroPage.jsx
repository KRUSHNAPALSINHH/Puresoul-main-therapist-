import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Brain, Shield, Users, Sparkles, Zap, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import gsap from 'gsap';

// Import all girl images for video-like sequence
const girlImages = [];
for (let i = 0; i <= 79; i++) {
  girlImages.push(new URL(`./girlimage/frame_${i.toString().padStart(3, '0')}.jpg`, import.meta.url).href);
}

const IntroPage = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const videoSectionRef = useRef(null);
  const contentRef = useRef(null);

  // Image sequence state for video effect
  const [currentFrame, setCurrentFrame] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Preload images
  useEffect(() => {
    const preloadImages = async () => {
      const promises = girlImages.map((src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve;
          img.src = src;
        });
      });
      await Promise.all(promises);
      setImagesLoaded(true);
    };
    preloadImages();
  }, []);

  // Fast video-like image sequence animation with GSAP
  useEffect(() => {
    if (!imagesLoaded) return;

    const frameAnimation = gsap.to({}, {
      duration: 3, // Video loop duration
      repeat: -1,
      ease: "none",
      onUpdate: function () {
        const progress = this.progress();
        const frameIndex = Math.floor(progress * (girlImages.length - 1));
        setCurrentFrame(frameIndex);
      }
    });

    return () => {
      frameAnimation.kill();
    };
  }, [imagesLoaded]);

  // GSAP entrance animations
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power4.out" }
      });

      // Video section animation
      tl.fromTo(videoSectionRef.current,
        { opacity: 0, x: -100 },
        { opacity: 1, x: 0, duration: 1.2 }
      );

      // Content section animation
      tl.fromTo(contentRef.current,
        { opacity: 0, x: 100 },
        { opacity: 1, x: 0, duration: 1.2 },
        "-=1"
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: Heart,
      title: 'Emotional Understanding',
      description: 'AI-powered emotion recognition',
      color: 'from-blue-500 to-teal-500',
    },
    {
      icon: Brain,
      title: 'Intelligent Therapy',
      description: 'Personalized therapeutic guidance',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Shield,
      title: 'Safe Space',
      description: 'Secure, judgment-free environment',
      color: 'from-teal-500 to-green-500',
    },
    {
      icon: Users,
      title: '24/7 Support',
      description: 'Always-available AI companion',
      color: 'from-cyan-500 to-blue-500',
    },
  ];

  return (
    <div
      ref={containerRef}
      className="min-h-screen overflow-hidden relative"
      style={{
        background: 'linear-gradient(135deg, #0a0f1a 0%, #0f172a 50%, #0a0f1a 100%)'
      }}
    >
      {/* Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
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
          />
        ))}
      </div>

      {/* Main Layout - Split Screen */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">

        {/* Left Side - Video Section */}
        <motion.div
          ref={videoSectionRef}
          className="lg:w-1/2 relative flex items-center justify-center p-8 lg:p-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Video Container with Glow Effect */}
          <div className="relative w-full max-w-lg aspect-[3/4] rounded-3xl overflow-hidden">
            {/* Outer Glow */}
            <motion.div
              className="absolute -inset-4 rounded-3xl opacity-60"
              animate={{
                boxShadow: [
                  '0 0 40px rgba(59, 130, 246, 0.4), 0 0 80px rgba(6, 182, 212, 0.2)',
                  '0 0 60px rgba(59, 130, 246, 0.6), 0 0 100px rgba(6, 182, 212, 0.3)',
                  '0 0 40px rgba(59, 130, 246, 0.4), 0 0 80px rgba(6, 182, 212, 0.2)'
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Video Frame Border */}
            <div
              className="absolute inset-0 rounded-3xl border-2 border-white/20 z-20 pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)'
              }}
            />

            {/* Image Sequence (Video Effect) */}
            <AnimatePresence mode="sync">
              {imagesLoaded && girlImages.map((src, index) => (
                <motion.img
                  key={index}
                  src={src}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover rounded-3xl"
                  initial={false}
                  animate={{
                    opacity: currentFrame === index ? 1 : 0,
                  }}
                  transition={{
                    opacity: { duration: 0.04, ease: "linear" }
                  }}
                  style={{
                    filter: 'brightness(0.9) contrast(1.05) saturate(1.1)',
                  }}
                />
              ))}
            </AnimatePresence>

            {/* Video Overlay Gradient */}
            <div
              className="absolute inset-0 rounded-3xl z-10 pointer-events-none"
              style={{
                background: `
                  linear-gradient(0deg, rgba(10, 15, 26, 0.6) 0%, transparent 30%),
                  linear-gradient(180deg, rgba(10, 15, 26, 0.3) 0%, transparent 20%)
                `
              }}
            />

            {/* Animated Corner Accents */}
            <motion.div
              className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-blue-400 z-20"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-teal-400 z-20"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
            <motion.div
              className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-teal-400 z-20"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
            <motion.div
              className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-blue-400 z-20"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
            />
          </div>

          {/* Floating Elements around Video */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [0.8, 1.1, 0.8],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: Math.random() * 2,
              }}
            >
              <Sparkles className="w-4 h-4 text-blue-300" />
            </motion.div>
          ))}
        </motion.div>

        {/* Right Side - Content Section */}
        <motion.div
          ref={contentRef}
          className="lg:w-1/2 flex flex-col justify-center p-8 lg:p-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              delay: 0.5,
              type: 'spring',
              stiffness: 200,
              damping: 15
            }}
            className="relative inline-flex items-center mb-8"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-teal-500 to-green-500 flex items-center justify-center shadow-2xl"
              style={{
                boxShadow: '0 0 40px rgba(59, 130, 246, 0.5)',
              }}
            >
              <Heart className="w-8 h-8 text-white fill-current" />
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Zap className="w-5 h-5 text-yellow-300" />
              </motion.div>
            </motion.div>
            <span className="ml-4 text-2xl font-bold text-white">Puresoul AI</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Your Personal
            <span className="block bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 bg-clip-text text-transparent">
              AI Therapist
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="text-lg text-gray-300 mb-10 max-w-md leading-relaxed"
          >
            Experience the future of emotional wellness through advanced AI therapy,
            real-time emotion recognition, and personalized healing journeys.
          </motion.p>

          {/* Features Grid - Compact */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="grid grid-cols-2 gap-4 mb-10"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all duration-300"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center flex-shrink-0`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{feature.title}</h3>
                  <p className="text-xs text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
          >
            <motion.button
              onClick={() => navigate('/login')}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 0 50px rgba(59, 130, 246, 0.5)'
              }}
              whileTap={{ scale: 0.98 }}
              className="group relative flex items-center gap-3 bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 text-white px-8 py-4 rounded-full text-lg font-bold shadow-2xl overflow-hidden"
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

              <span className="relative z-10">Begin Your Healing Journey</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="relative z-10"
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </motion.button>

            <p className="text-gray-500 mt-4 text-sm">
              Free to start • No credit card required
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(0deg, #0a0f1a 0%, transparent 100%)'
        }}
      />
    </div>
  );
};

export default IntroPage;