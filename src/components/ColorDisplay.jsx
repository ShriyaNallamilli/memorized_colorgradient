import { motion, AnimatePresence } from 'framer-motion';
import { hslToCss } from '../utils/color';

export default function ColorDisplay({ color, revealed, label }) {
  const colorCss = hslToCss(color);

  return (
    <motion.div
      layout
      className="relative overflow-hidden rounded-[1.25rem] border border-white/10"
    >
      <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-white/70">
        <span>{label}</span>
        <span>{revealed ? 'showing' : 'hidden'}</span>
      </div>

      <AnimatePresence mode="wait">
        {revealed ? (
          <motion.div
            key="revealed"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35 }}
            className="relative h-[52vh] min-h-[300px] overflow-hidden rounded-[1rem] border border-white/10"
            style={{ background: `linear-gradient(135deg, ${colorCss}, rgba(255,255,255,0.08))` }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22),transparent_28%)]" />
            <div className="absolute inset-x-4 bottom-4 rounded-xl border border-white/15 bg-black/20 px-3 py-2 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.28em] text-white/80">memorize</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="hidden"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35 }}
            className="relative flex h-[52vh] min-h-[300px] items-center justify-center overflow-hidden rounded-[1rem] border border-white/10 bg-[#12131a]"
          >
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.03)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.03)_50%,rgba(255,255,255,0.03)_75%,transparent_75%,transparent)] bg-[length:20px_20px] opacity-15" />
            <div className="relative z-10 text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full border border-white/10 bg-white/5" />
              <p className="text-sm uppercase tracking-[0.28em] text-white/80">Color hidden</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}