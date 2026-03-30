"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
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
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo-remove.png"
            alt="HandyCrafts 3D"
            width={44}
            height={44}
            className="h-11 w-auto object-contain"
            priority
          />
          <div className="leading-tight">
            <div className="text-lg font-bold tracking-wide">HandyCrafts 3D</div>
            <div className="text-xs text-white/65">3D Printing • Scanning • Modeling</div>
          </div>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
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
      </div>
    </nav>
  );
}