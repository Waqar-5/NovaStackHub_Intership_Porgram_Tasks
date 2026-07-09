const variants = {
  level: 'bg-ink/5 text-ink border-ink/10',
  category: 'bg-amber/15 text-amber-dark border-amber/30',
  success: 'bg-moss/10 text-moss border-moss/25',
};

export default function Badge({ children, variant = 'level' }) {
  return (
    <span
      className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-chip border ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
