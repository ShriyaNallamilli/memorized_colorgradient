export default function SliderControl({ label, value, min, max, accent, onChange }) {
  const progress = ((value - min) / (max - min)) * 100;
  const trackStyle = {
    background: `linear-gradient(90deg, ${accent} 0%, ${accent} ${progress}%, rgba(255,255,255,0.08) ${progress}%, rgba(255,255,255,0.08) 100%)`,
  };

  return (
    <label className="block rounded-3xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/20 backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between gap-3 text-sm font-medium text-white/90">
        <span>{label}</span>
        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-cyan-100/80">
          {value}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => {
          onChange(Number(event.target.value));
        }}
        style={trackStyle}
        className="w-full"
      />
    </label>
  );
}