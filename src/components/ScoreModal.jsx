import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { hslToCss } from '../utils/color';

export default function ScoreModal({ open, score, feedback, targetColor, guessColor, bestScore, username, onPlayAgain }) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    if (!open) {
      setDisplayScore(0);
      return;
    }

    let frameId = 0;
    const startTime = performance.now();
    const duration = 900;

    const animateScore = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(1, elapsed / duration);
      setDisplayScore(Math.round(score * progress));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(animateScore);
      }
    };

    frameId = window.requestAnimationFrame(animateScore);

    return () => window.cancelAnimationFrame(frameId);
  }, [open, score]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.92, y: 28, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.94, y: 24, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 18 }}
            className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,33,0.98),rgba(4,8,20,0.98))] p-5 shadow-card"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,242,255,0.2),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,122,162,0.15),transparent_30%)]" />

            <div className="relative z-10">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-cyan-100/70">Result</p>
                  <h2 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">{feedback}</h2>
                  <p className="mt-3 max-w-md text-sm text-slate-300">
                    {username}, your score is saved locally for now.
                  </p>
                </div>

                <div className="rounded-[1.6rem] border border-white/10 bg-white/5 px-5 py-4 text-right shadow-glow">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/55">Best</p>
                  <p className="text-3xl font-bold text-white">{bestScore}%</p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-[1.05fr_0.95fr]">
                <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-white/50">Similarity</p>
                      <p className="mt-2 text-5xl font-black tracking-tight text-white md:text-6xl">{displayScore}%</p>
                    </div>
                    <div className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-cyan-100">
                      {score >= 90 ? 'Color Wizard' : 'Try again'}
                    </div>
                  </div>

                  <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-emerald-300 to-pink-400"
                      initial={false}
                      animate={{ width: `${score}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                <div className="grid gap-3 rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-white/50">Original</p>
                    <div className="mt-2 h-16 rounded-2xl border border-white/10" style={{ background: hslToCss(targetColor) }} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-white/50">Your color</p>
                    <div className="mt-2 h-16 rounded-2xl border border-white/10" style={{ background: hslToCss(guessColor) }} />
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onPlayAgain}
                  className="inline-flex flex-1 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 via-emerald-300 to-pink-400 px-5 py-4 text-sm font-bold text-slate-950 shadow-[0_0_30px_rgba(56,242,255,0.25)]"
                >
                  Play Again
                </motion.button>
                <div className="flex-1 rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm text-slate-300">
                  Simple, clean result screen.
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}