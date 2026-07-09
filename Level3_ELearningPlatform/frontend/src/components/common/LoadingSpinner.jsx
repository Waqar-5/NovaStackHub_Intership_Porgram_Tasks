export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate">
      <div className="w-8 h-8 border-2 border-line border-t-amber rounded-full animate-spin" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
