export default function ProgressBar({ value, size = 'md' }) {
  const heightClass = size === 'sm' ? 'h-1.5' : 'h-2';

  return (
    <div className={`w-full bg-line rounded-full overflow-hidden ${heightClass}`}>
      <div
        className="h-full bg-amber rounded-full transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
