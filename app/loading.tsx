export default function Loading() {
  return (
    <div
      aria-live="polite"
      className="my-auto flex min-h-64 items-center justify-center text-center text-white/80"
    >
      <p className="animate-pulse">Loading page…</p>
    </div>
  );
}
