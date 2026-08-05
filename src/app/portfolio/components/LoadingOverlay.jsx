import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const STATUS_MESSAGES = [
  "Initializing portfolio...",
  "Loading projects...",
  "Loading experience...",
  "Loading skills...",
  "Preparing interface...",
  "Optimizing assets...",
  "Almost ready...",
];

const CYCLE_INTERVAL_MS = 700;

/**
 * Premium full-screen loading overlay.
 *
 * Appears only during the initial portfolio data fetch.
 * Respects prefers-reduced-motion.
 * No artificial delays — disappears immediately when `isLoading` flips false.
 */
export default function LoadingOverlay({ isLoading }) {
  const prefersReduced = useReducedMotion();
  const [msgIndex, setMsgIndex] = useState(0);
  const [msgVisible, setMsgVisible] = useState(true);
  const intervalRef = useRef(null);

  // Rotate status messages only while loading
  useEffect(() => {
    if (!isLoading) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setMsgVisible(false);
      setTimeout(() => {
        setMsgIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
        setMsgVisible(true);
      }, 150);
    }, CYCLE_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isLoading]);

  // Entrance animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: prefersReduced ? 0 : 0.3,
        staggerChildren: prefersReduced ? 0 : 0.12,
      },
    },
    exit: {
      opacity: 0,
      filter: "blur(4px)",
      transition: { duration: prefersReduced ? 0 : 0.4, ease: "easeInOut" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReduced ? 0 : 0.4, ease: "easeOut" },
    },
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loading-overlay"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          role="status"
          aria-live="polite"
          aria-label="Portfolio loading"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-bg-dark overflow-hidden select-none"
        >
          {/* Subtle ambient grid (matches portfolio background) */}
          <div
            className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(var(--color-border-theme,rgba(255,255,255,0.08)) 1px, transparent 1px),
                linear-gradient(90deg, var(--color-border-theme,rgba(255,255,255,0.08)) 1px, transparent 1px)
              `,
              backgroundSize: "64px 64px",
            }}
          />

          {/* Soft ambient glow blobs */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-brand-red/5 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-brand-red/3 blur-[100px] pointer-events-none" />

          {/* Content card */}
          <motion.div
            variants={itemVariants}
            className="relative flex flex-col items-center gap-6 px-8 max-w-sm w-full text-center z-10"
          >
            {/* Name */}
            <motion.div variants={itemVariants} className="space-y-1">
              <h1 className="text-2xl min-[400px]:text-3xl font-black text-text-primary tracking-tight font-sans leading-tight">
                Harshwardhan Saini
              </h1>
              <p className="text-sm min-[400px]:text-base font-medium text-text-secondary font-sans tracking-wide">
                Full Stack Software Engineer
              </p>
            </motion.div>

            {/* Divider */}
            <motion.div
              variants={itemVariants}
              className="w-16 h-px bg-gradient-to-r from-transparent via-brand-red to-transparent"
            />

            {/* Progress bar */}
            <motion.div variants={itemVariants} className="w-full space-y-3">
              <p className="text-xs font-semibold text-brand-red uppercase tracking-widest">
                Loading Portfolio...
              </p>

              {/* Indeterminate progress bar */}
              <div className="relative w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                {/* Glow track */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-brand-red/10 to-transparent" />

                {/* Animated fill */}
                {!prefersReduced ? (
                  <motion.div
                    className="absolute top-0 left-0 h-full w-1/2 rounded-full bg-gradient-to-r from-brand-red/60 via-brand-red to-red-500 shadow-[0_0_12px_rgba(229,9,20,0.6)]"
                    animate={{ x: ["−100%", "200%"] }}
                    style={{ x: "-100%" }}
                    transition={{
                      duration: 1.4,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatType: "loop",
                    }}
                  />
                ) : (
                  <div className="absolute top-0 left-0 h-full w-1/2 rounded-full bg-brand-red" />
                )}
              </div>
            </motion.div>

            {/* Status message */}
            <motion.div
              variants={itemVariants}
              className="h-5 flex items-center justify-center"
              aria-live="polite"
            >
              <AnimatePresence mode="wait">
                {msgVisible && (
                  <motion.span
                    key={msgIndex}
                    initial={{ opacity: 0, y: prefersReduced ? 0 : 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: prefersReduced ? 0 : -4 }}
                    transition={{ duration: 0.15 }}
                    className="text-xs text-text-secondary font-mono tracking-wide"
                  >
                    {STATUS_MESSAGES[msgIndex]}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
