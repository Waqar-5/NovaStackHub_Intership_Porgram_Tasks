export default function Topbar({ title, onMenuClick }) {
  return (
    <header className="sticky top-0 z-20 bg-paper/90 backdrop-blur-sm border-b border-line px-5 lg:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden text-ink text-xl leading-none"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          ☰
        </button>
        <h1 className="font-display text-xl text-ink">{title}</h1>
      </div>

      <div className="flex items-center gap-4 text-sm text-slate">
        <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs bg-chalk border border-line px-2.5 py-1 rounded-chip">
          <span className="text-amber-dark">●</span> 6-day streak
        </span>
      </div>
    </header>
  );
}
