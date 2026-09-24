import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-ink px-4 py-14 text-paper sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl">HandyCrafts</p>
          <p className="mt-4 max-w-xs text-sm leading-7 text-paper/65">
            Фигурки и ключодържатели по снимка, изработени в Русе. Виждаш
            визуализацията веднага и плащаш с наложен платеж.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-paper/45">Магазин</p>
          <div className="mt-4 space-y-2 text-sm text-paper/75">
            <Link href="/studio?product=figurine" className="block hover:text-paper">Фигурка по снимка</Link>
            <Link href="/studio?product=figurine&subject=pet" className="block hover:text-paper">Фигурка на любимец</Link>
            <Link href="/studio?product=keychain" className="block hover:text-paper">Ключодържател</Link>
            <Link href="/#how" className="block hover:text-paper">Как работи</Link>
            <Link href="/#faq" className="block hover:text-paper">Въпроси</Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-paper/45">Контакт</p>
          <div className="mt-4 space-y-2 text-sm text-paper/75">
            <a href="mailto:handycraftshelp@gmail.com" className="block hover:text-paper">handycraftshelp@gmail.com</a>
            <p>Русе, България</p>
            <Link href="/contact" className="block hover:text-paper">Пиши ни</Link>
            <Link href="/terms" className="block hover:text-paper">Общи условия</Link>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-2 border-t border-white/10 pt-6 text-xs text-paper/40 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} HandyCrafts 3D</p>
        <p>Наложен платеж · Еконт и Спиди</p>
      </div>
    </footer>
  );
}
