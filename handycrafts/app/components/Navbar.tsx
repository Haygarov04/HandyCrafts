"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-black/35 text-white backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo-remove.png"
            alt="HandyCrafts 3D"
            width={44}
            height={44}
            className="h-10 w-auto object-contain sm:h-11"
            priority
          />
          <div className="leading-tight">
            <div className="text-base font-bold tracking-wide sm:text-lg">
              HandyCrafts 3D
            </div>
            <div className="hidden text-xs text-white/65 sm:block">
              3D Printing • Scanning • Modeling
            </div>
          </div>
        </Link>

        <div className="hidden items-center gap-6 lg:flex xl:gap-8">
          <Link href="/" className="transition hover:text-orange-400">
            Начало
          </Link>

          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="flex items-center gap-2 transition hover:text-orange-400"
            >
              Услуги
              <span className={`transition ${open ? "rotate-180" : ""}`}>▾</span>
            </button>

            <div
              className={`absolute left-0 top-10 w-72 rounded-2xl border border-black/10 bg-white p-2 text-black shadow-2xl transition-all duration-200 ${
                open
                  ? "visible translate-y-0 opacity-100"
                  : "invisible -translate-y-2 opacity-0"
              }`}
            >
              <Link
                href="/services/printing"
                className="block rounded-xl px-4 py-3 transition hover:bg-orange-50"
              >
                3D Принтиране
              </Link>
              <Link
                href="/services/scanning"
                className="block rounded-xl px-4 py-3 transition hover:bg-orange-50"
              >
                3D Сканиране
              </Link>
              <Link
                href="/services/modeling"
                className="block rounded-xl px-4 py-3 transition hover:bg-orange-50"
              >
                3D Моделиране
              </Link>
            </div>
          </div>

          <Link href="/portfolio" className="transition hover:text-orange-400">
            Портфолио
          </Link>

          <Link href="/upload" className="transition hover:text-orange-400">
            Качи файл
          </Link>

          <Link href="/contact" className="transition hover:text-orange-400">
            Контакти
          </Link>
        </div>

        <button
  onClick={() => setMobileOpen((prev) => !prev)}
  aria-label={mobileOpen ? "Затвори менюто" : "Отвори менюто"}
  className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 bg-white/10 transition hover:bg-white/20 lg:hidden"
>
  <span className="relative block h-5 w-5">
    <span
      className={`absolute left-1/2 top-1/2 block h-[2px] w-5 -translate-x-1/2 rounded-full bg-white transition-all duration-300 ${
        mobileOpen ? "-translate-y-1/2 rotate-45" : "-translate-y-[7px]"
      }`}
    />
    <span
      className={`absolute left-1/2 top-1/2 block h-[2px] w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-all duration-300 ${
        mobileOpen ? "opacity-0" : "opacity-100"
      }`}
    />
    <span
      className={`absolute left-1/2 top-1/2 block h-[2px] w-5 -translate-x-1/2 rounded-full bg-white transition-all duration-300 ${
        mobileOpen ? "-translate-y-1/2 -rotate-45" : "translate-y-[7px]"
      }`}
    />
  </span>
</button>
      </div>

      <div
        className={`overflow-hidden border-t border-white/10 bg-black/80 transition-all duration-300 lg:hidden ${
          mobileOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
          <Link href="/" className="rounded-xl px-3 py-3 hover:bg-white/10">
            Начало
          </Link>
          <Link
            href="/services/printing"
            className="rounded-xl px-3 py-3 hover:bg-white/10"
          >
            3D Принтиране
          </Link>
          <Link
            href="/services/scanning"
            className="rounded-xl px-3 py-3 hover:bg-white/10"
          >
            3D Сканиране
          </Link>
          <Link
            href="/services/modeling"
            className="rounded-xl px-3 py-3 hover:bg-white/10"
          >
            3D Моделиране
          </Link>
          <Link
            href="/portfolio"
            className="rounded-xl px-3 py-3 hover:bg-white/10"
          >
            Портфолио
          </Link>
          <Link href="/upload" className="rounded-xl px-3 py-3 hover:bg-white/10">
            Качи файл
          </Link>
          <Link href="/contact" className="rounded-xl px-3 py-3 hover:bg-white/10">
            Контакти
          </Link>
        </div>
      </div>
    </nav>
  );
}