/** A small label on example pictures that are generated previews, until photos of real pieces replace them. */
export default function VisualTag({ label, className = "left-3 top-3" }: { label: string; className?: string }) {
  return (
    <span
      className={`pointer-events-none absolute z-10 rounded-full bg-ink/65 px-2.5 py-1 text-[11px] font-semibold text-paper backdrop-blur-sm ${className}`}
    >
      {label}
    </span>
  );
}
