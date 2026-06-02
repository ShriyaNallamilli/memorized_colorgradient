export default function OnboardTooltip({ onClose, anchor = 'bottom-right' }) {
  // Tooltip anchored to the bottom-center of the viewport by default
  return (
    <div className="fixed left-4 right-4 bottom-20 z-50 rounded-lg bg-black/85 border border-white/10 p-3 text-sm text-white/90 shadow-lg sm:left-auto sm:right-6 sm:w-[320px]">
      <div className="font-semibold mb-2">How to play</div>
      <div className="mb-3 text-xs text-white/70">
        Enter player names → click Start → memorize the gradient → recreate it with sliders → Submit → Next Player → Show Results.
      </div>
      <div className="flex justify-end">
        <button onClick={onClose} className="rounded-md bg-white/10 px-3 py-1 text-xs font-medium">Got it</button>
      </div>
    </div>
  );
}
