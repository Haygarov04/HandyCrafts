import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-ink px-4 py-14 text-paper sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <p className="font-display text-3xl">HandyCrafts 3D</p>
          <p className="mt-4 max-w-xs text-sm leading-7 text-paper/65">
            Работилница в Русе за фигурки по снимка, 3D печат, сканиране и
            моделиране. Първо визуализация, после изработка.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-paper/45">
            Студио
          </p>
          <div className="mt-4 space-y-2 text-sm text-paper/75">
            <Link href="/studio" className="block hover:text-paper">
              Фигурка по снимка
            </Link>
            <Link href="/upload" className="block hover:text-paper">
              Качи файл
            </Link>
            <Link href="/portfolio" className="block hover:text-paper">
              Портфолио
            </Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-paper/45">
            Услуги
          </p>
          <div className="mt-4 space-y-2 text-sm text-paper/75">
            <Link href="/services/printing" className="block hover:text-paper">
              3D принтиране
            </Link>
            <Link href="/services/scanning" className="block hover:text-paper">
              3D сканиране
            </Link>
            <Link href="/services/modeling" className="block hover:text-paper">
              3D моделиране
            </Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-paper/45">
            Контакт
          </p>
          <div className="mt-4 space-y-2 text-sm text-paper/75">
            <a href="mailto:handycraftshelp@gmail.com" className="block hover:text-paper">
              handycraftshelp@gmail.com
            </a>
            <p>Русе, България</p>
            <Link href="/terms" className="block hover:text-paper">
              Общи условия
            </Link>
            <Link href="/crm" className="block hover:text-paper">
              Поръчки
            </Link>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-2 border-t border-white/10 pt-6 text-xs text-paper/40 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} HandyCrafts 3D</p>
        <p>Визуализацията се одобрява преди печат.</p>
      </div>
    </footer>
  );
}
