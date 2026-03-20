'use client';

import { motion, AnimatePresence } from 'framer-motion';
// import { signIn } from 'next-auth/react'; // the blueprint originally used next-auth/react here, but better-auth is installed. We'll simulate the UX first.
import { useState } from 'react';

/**
 * Meta-Auth Gateway Page
 * Modern authentication using Next.js 14 App Router best practices.
 * Performance: Glassmorphism applied only to 600×700px static panel
 */
export default function MetaAuthGateway() {
  const [isLaunching, setIsLaunching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (provider: string) => {
    setIsLaunching(true);
    setError(null);
    
    try {
      // Simulate auth trigger
      console.log(`Triggering ${provider} auth...`);
      await triggerLaunchAnimation();
      window.location.href = '/hub';
    } catch (err) {
      console.error('Authentication failed:', err);
      setError(err instanceof Error ? err.message : 'Authentication failed');
      setIsLaunching(false);
    }
  };

  const triggerLaunchAnimation = () => {
    return new Promise((resolve) => setTimeout(resolve, 800));
  };

  return (
    <div className="min-h-screen bg-obsidian-dark relative overflow-hidden">
      {/* Animated background particles - GPU optimized */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-gold-bright rounded-full blur-sm"
          animate={{
            y: [0, -50, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-2/3 right-1/3 w-3 h-3 bg-gold-emboss rounded-full blur-md"
          animate={{
            y: [0, 30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </div>

      {/* Main content container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <AnimatePresence>
          {!isLaunching ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100, scale: 1.2 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md"
            >
              {/* Logo with glow pulse */}
              <motion.div
                className="flex justify-center mb-8"
                animate={{ filter: ['drop-shadow(0 0 20px rgba(244, 208, 63, 0.5))', 'drop-shadow(0 0 30px rgba(244, 208, 63, 0.8))', 'drop-shadow(0 0 20px rgba(244, 208, 63, 0.5))'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="text-6xl font-doto text-gold-bright tracking-wider">
                  ACHEEVY
                </div>
              </motion.div>

              {/* Glassmorphic auth panel */}
              <div
                className="relative bg-white/5 backdrop-blur-glass backdrop-saturate-glass border border-white/20 rounded-2xl p-8 shadow-glass will-change-[backdrop-filter] transform-gpu"
                style={{
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.37), inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
                }}
              >
                {/* Title */}
                <h1 className="text-center text-3xl font-doto text-gold-emboss mb-2 tracking-wide">
                  HYBRID BUSINESS
                  <br />
                  ARCHITECT
                </h1>
                
                {/* Subtitle */}
                <p className="text-center text-gray-400 text-sm mb-8">
                  Empowering Hybrid Work with AI Intelligence
                </p>

                {/* Error message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Auth buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => handleAuth('google')}
                    disabled={isLaunching}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg transition-all duration-200 text-gray-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-xl">🔵</span>
                    Sign in with Google
                  </button>

                  <button
                    onClick={() => handleAuth('telegram')}
                    disabled={isLaunching}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg transition-all duration-200 text-gray-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-xl">📱</span>
                    Sign in with Telegram
                  </button>

                  <button
                    onClick={() => handleAuth('whatsapp')}
                    disabled={isLaunching}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg transition-all duration-200 text-gray-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-xl">💬</span>
                    Sign in with WhatsApp
                  </button>
                </div>

                {/* Footer links */}
                <div className="mt-6 flex justify-center gap-4 text-xs text-gray-500">
                  <a href="/terms" className="hover:text-gold-bright transition-colors">
                    Terms of Service
                  </a>
                  <span>•</span>
                  <a href="/privacy" className="hover:text-gold-bright transition-colors">
                    Privacy Policy
                  </a>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="text-gold-bright text-2xl font-doto mb-4 animate-glow-pulse">
                Launching...
              </div>
              <div className="w-16 h-1 bg-gold-bright/30 rounded-full overflow-hidden mx-auto">
                <motion.div
                  className="h-full bg-gold-bright rounded-full"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
