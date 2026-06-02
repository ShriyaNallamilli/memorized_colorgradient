import { motion } from 'framer-motion';

export default function TimerBar({ secondsLeft, totalSeconds, phaseLabel }) {
  const progress = Math.max(0, Math.min(100, (secondsLeft / totalSeconds) * 100));

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/20 backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/60">
        <span>{phaseLabel}</span>
        <span>{secondsLeft}s</span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-emerald-300 to-pink-400"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}