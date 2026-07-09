const variants = {
  primary: 'bg-ink text-paper hover:bg-ink/90',
  accent: 'bg-amber text-ink hover:bg-amber-dark',
  outline: 'bg-transparent border border-ink/20 text-ink hover:border-ink/40',
  ghost: 'bg-transparent text-slate hover:text-ink',
};

export default function Button({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={`px-4 py-2.5 rounded-chip text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
