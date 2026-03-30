import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-neutral-950 px-6 py-12 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
        <div>
          <h3 className="mb-4 text-xl font-bold">HandyCrafts 3D</h3>
          <p className="text-white/70">
            3D принтиране, 3D сканиране и 3D моделиране за модерни проекти и реални приложения.
          </p>
        </div>

        <div>
          <h4 className="mb-4 font-semibold">Услуги</h4>
          <div className="space-y-2 text-white/70">
            <Link href="/services/printing" className="block hover:text-white">
              3D Принтиране
            </Link>
            <Link href="/services/scanning" className="block hover:text-white">
              3D Сканиране
            </Link>
            <Link href="/services/modeling" className="block hover:text-white">
              3D Моделиране
            </Link>
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-semibold">Навигация</h4>
          <div className="space-y-2 text-white/70">
            <Link href="/" className="block hover:text-white">Начало</Link>
            <Link href="/portfolio" className="block hover:text-white">Портфолио</Link>
            <Link href="/upload" className="block hover:text-white">Качи файл</Link>
            <Link href="/contact" className="block hover:text-white">Контакти</Link>
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-semibold">Контакт</h4>
          <div className="space-y-2 text-white/70">
            <p>info@handycrafts3d.com</p>
            <p>Русе, България</p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-sm text-white/50">
        © 2026 HandyCrafts 3D. Всички права запазени.
      </div>
    </footer>
  );
}