// What comes in the paint-it-yourself box, shown on the home page and in the studio.

const icons = [
  // The figurine
  <path key="f" d="M12 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM8.5 21v-5.5L7 11.5a2 2 0 0 1 2-2.5h6a2 2 0 0 1 2 2.5l-1.5 4V21M5 21h14" />,
  // Paint pots
  <path key="p" d="M4 10h6v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zM14 10h6v9a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zM4 10l1-3h4l1 3M14 10l1-3h4l1 3" />,
  // Brush
  <path key="b" d="M14.5 4.5l5 5-7.5 7.5-5-5zM7 12l-2.5 2.5c-1 1-1 4-1 6 2 0 5 0 6-1L12 17" />,
  // Colour guide
  <path key="g" d="M6 3h9l4 4v14H6zM15 3v4h4M9 12h2M9 16h2M13 12h3M13 16h3" />,
];

export default function KitBox({ items, dark }: { items: { title: string; text: string }[]; dark?: boolean }) {
  return (
    <ul className="grid grid-cols-2 gap-2.5">
      {items.map((item, index) => (
        <li key={item.title} className={`flex items-start gap-3 rounded-2xl p-3 ${dark ? "bg-paper/[0.07]" : "bg-white"}`}>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ember text-ink">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              {icons[index]}
            </svg>
          </span>
          <span className="min-w-0">
            <strong className="block text-sm font-semibold leading-tight">{item.title}</strong>
            <span className={`mt-0.5 block text-xs leading-snug ${dark ? "text-paper/60" : "text-ink/55"}`}>{item.text}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
