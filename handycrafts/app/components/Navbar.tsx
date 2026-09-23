"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/studio", label: "Студио" },
  { href: "/portfolio", label: "Портфолио" },
  { href: "/upload", label: "Качи файл" },
  { href: "/contact", label: "Контакти" },
  { href: "/crm", label: "Поръчки" },
];

const services = [
  { href: "/services/printing", label: "3D принтиране" },
  { href: "/services/scanning", label: "3D сканиране" },
  { href: "/services/modeling", label: "3D моделиране" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition ${
        scrolled || open
          ? "border-ink/10 bg-paper/95 backdrop-blur-md"
          : "border-transparent bg-paper/80 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-ink">
            <Image
              src="/logo-remove.png"
              alt=""
              width={44}
              height={44}
              className="h-11 w-11 object-cover"
              priority
            />
          </span>
          <span className="leading-tight">
            <span className="block text-[15px] font-semibold tracking-tight">
              HandyCrafts 3D
            </span>
            <span className="hidden text-xs text-ink/55 sm:block">
              Русе · печат и фигурки
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm lg:flex">
          <Link href="/studio" className="transition hover:text-ember-deep">
            Студио
          </Link>
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              type="button"
              className="transition hover:text-ember-deep"
              aria-expanded={servicesOpen}
              onClick={() => setServicesOpen((value) => !value)}
            >
              Услуги
            </button>
            <div
              className={`absolute left-1/2 top-full w-56 -translate-x-1/2 pt-3 ${
                servicesOpen ? "visible" : "invisible"
              }`}
            >
              <div className="rounded-2xl border border-ink/10 bg-paper p-2 shadow-[0_20px_50px_rgba(22,21,19,0.12)]">
                {services.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-xl px-3 py-2.5 hover:bg-sand"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Link href="/portfolio" className="transition hover:text-ember-deep">
            Портфолио
          </Link>
          <Link href="/upload" className="transition hover:text-ember-deep">
            Качи файл
          </Link>
          <Link href="/contact" className="transition hover:text-ember-deep">
            Контакти
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/studio"
            className="hidden rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-paper transition hover:bg-ember hover:text-ink sm:inline-flex"
          >
            Създай фигурка
          </Link>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full border border-ink/15 lg:hidden"
            aria-label={open ? "Затвори менюто" : "Отвори менюто"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="relative block h-4 w-4">
              <span
                className={`absolute left-0 top-1/2 h-[1.5px] w-4 -translate-y-1/2 bg-ink transition ${
                  open ? "rotate-45" : "-translate-y-[5px]"
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 h-[1.5px] w-4 -translate-y-1/2 bg-ink transition ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 h-[1.5px] w-4 -translate-y-1/2 bg-ink transition ${
                  open ? "-rotate-45" : "translate-y-[5px]"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-ink/10 bg-paper px-4 py-4 lg:hidden">
          <div className="mx-auto flex max-w-6xl flex-col">
            {[...links.slice(0, 1), ...services, ...links.slice(1)].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-ink/8 py-3.5 text-lg"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/studio"
              onClick={() => setOpen(false)}
              className="mt-4 rounded-full bg-ember py-3.5 text-center font-semibold text-ink"
            >
              Създай фигурка
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
