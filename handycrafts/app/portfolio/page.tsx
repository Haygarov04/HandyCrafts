"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const portfolioItems = [
  // { title: "Детайл по идея", category: "3D Принтиране", image: "/portfolio/p1.jpg" },
  { title: "Авто елемент", category: "Custom", image: "/portfolio/p2.JPG" },
  { title: "Фигура", category: "3D Принтиране", image: "/portfolio/p3.JPG" },
  { title: "Персонализиран модел", category: "3D Моделиране", image: "/portfolio/p4.JPG" },
  { title: "Функционален компонент", category: "3D Принтиране", image: "/portfolio/p5.JPG" },
  { title: "Малък custom детайл", category: "Custom", image: "/portfolio/p6.JPG" },
  { title: "Брандиран елемент", category: "3D Принтиране", image: "/portfolio/p7.JPG" },
  { title: "Техническа част", category: "3D Моделиране", image: "/portfolio/p8.JPG" },
  { title: "Прототип", category: "3D Принтиране", image: "/portfolio/p9.JPG" },
  { title: "Мини проект", category: "Custom", image: "/portfolio/p10.JPG" },
  { title: "Декоративен модел", category: "3D Принтиране", image: "/portfolio/p11.JPG" },
  { title: "Комплект части", category: "3D Моделиране", image: "/portfolio/p12.JPG" },
  { title: "Книжен аксесоар", category: "Custom", image: "/portfolio/p13.JPG" },
  { title: "CAD подготовка", category: "3D Моделиране", image: "/portfolio/p14.JPG" },
  { title: "Практичен детайл", category: "3D Принтиране", image: "/portfolio/p15.JPG" },
  { title: "Серия изделия", category: "3D Принтиране", image: "/portfolio/p16.JPG" },
  { title: "Малки елементи", category: "3D Принтиране", image: "/portfolio/p17.JPG" },
  { title: "Компонент в ръка", category: "Custom", image: "/portfolio/p18.JPG" },
  { title: "Декоративна форма", category: "3D Принтиране", image: "/portfolio/p19.PNG" },
  { title: "Подаръчен модел", category: "Custom", image: "/portfolio/p20.PNG" },
  { title: "Печатен детайл", category: "3D Принтиране", image: "/portfolio/p21.PNG" },
  { title: "Продуктов елемент", category: "Custom", image: "/portfolio/p22.PNG" },
  { title: "Визуализация", category: "3D Моделиране", image: "/portfolio/p23.PNG" },
  { title: "Персонализиран подарък", category: "Custom", image: "/portfolio/p24.PNG" },
  { title: "Luxury box detail", category: "Custom", image: "/portfolio/p25.PNG" },
  { title: "Резбован модел", category: "3D Моделиране", image: "/portfolio/p26.JPG" },
  { title: "Функционална геометрия", category: "3D Принтиране", image: "/portfolio/p27.JPG" },
  { title: "Реален процес", category: "3D Принтиране", image: "/portfolio/p28.PNG" },
  { title: "Сферичен елемент", category: "3D Принтиране", image: "/portfolio/p29.JPG" },
  // { title: "Технически корпус", category: "3D Моделиране", image: "/portfolio/p30.JPG" },
  { title: "Концептуален модел", category: "3D Моделиране", image: "/portfolio/p31.jpeg" },
  { title: "Интериорен mini setup", category: "Custom", image: "/portfolio/p32.jpg" },
  { title: "Органайзер", category: "3D Принтиране", image: "/portfolio/p33.jpg" },
  { title: "Реална употреба", category: "3D Принтиране", image: "/portfolio/p34.jpg" },
  { title: "Ключодържатели", category: "Custom", image: "/portfolio/p35.jpg" },
  { title: "Артистичен бюст", category: "3D Принтиране", image: "/portfolio/p36.jpg" },
];

function PortfolioCard({
  title,
  category,
  image,
}: {
  title: string;
  category: string;
  image: string;
}) {
  return (
    <div className="group relative z-0 h-[320px] min-w-[280px] overflow-hidden rounded-[28px] bg-neutral-200 shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition duration-300 hover:z-20 hover:-translate-y-2 hover:scale-[1.04] hover:shadow-[0_30px_80px_rgba(0,0,0,0.18)] md:min-w-[360px]">
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover transition duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition duration-300 group-hover:from-black/80" />
      <div className="absolute bottom-0 left-0 p-6 text-white">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-300">
          {category}
        </p>
        <h3 className="text-2xl font-bold">{title}</h3>
      </div>
    </div>
  );
}

function SlidingRow({
  items,
  reverse = false,
}: {
  items: typeof portfolioItems;
  reverse?: boolean;
}) {
  const doubled = [...items, ...items];
  const [paused, setPaused] = useState(false);

  return (
    <div
      className="overflow-x-hidden overflow-y-visible py-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className={`portfolio-row flex w-max gap-6 ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        }`}
        style={{ animationPlayState: paused ? "paused" : "running" }}
      >
        {doubled.map((item, index) => (
          <PortfolioCard
            key={`${item.title}-${index}`}
            title={item.title}
            category={item.category}
            image={item.image}
          />
        ))}
      </div>
    </div>
  );
}

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-white pb-20 pt-36">
      <section className="px-6">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
            Портфолио
          </p>

          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="mb-6 text-4xl font-bold text-neutral-900 md:text-6xl">
                Реални проекти, 3D детайли и визуални резултати
              </h1>
              <p className="text-lg leading-8 text-neutral-700">
                Тук можете да покажете различни типове проекти — функционални
                части, прототипи, сканирани обекти, моделиране по идея и custom
                изработка. Дизайнът е направен така, че като качиш снимки, всичко
                да изглежда премиум.
              </p>
            </div>

            <Link
              href="/upload"
              className="inline-block rounded-full bg-orange-500 px-8 py-4 font-semibold text-white transition hover:bg-orange-600"
            >
              Качи твоя проект
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-12 space-y-6">
        <SlidingRow items={portfolioItems.slice(0, 16)} />
        <SlidingRow items={portfolioItems.slice(16, 36)} reverse />
      </section>

      <section className="mt-28 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
              Featured Project
            </p>

            <h2 className="text-4xl font-bold tracking-tight text-neutral-900 md:text-6xl">
              Smart Shift Knob с кръгъл дисплей и custom UI система
            </h2>
          </div>

          <div className="grid gap-10 xl:grid-cols-[1.05fr_0.95fr] xl:items-start">
            <div className="relative overflow-hidden rounded-[36px] bg-neutral-950 shadow-[0_30px_80px_rgba(0,0,0,0.14)]">
              <div className="relative h-[520px] sm:h-[620px] lg:h-[760px] xl:h-[820px]">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover"
                >
                  <source src="/Shift.mp4" type="video/mp4" />
                </video>
              </div>

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

              <div className="absolute left-5 top-5 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/90">
                  Automotive Prototype
                </p>
              </div>
            </div>

            <div className="xl:pt-4">
              <p className="mb-6 text-lg leading-8 text-neutral-700 md:text-xl">
                Smart Shift Knob е концептуален и функционален automotive проект
                за умен скоростен лост с интегриран кръгъл дисплей, custom корпус
                и собствен интерфейс, създаден за интерактивно управление в
                автомобила. Проектът комбинира индустриален дизайн, 3D
                моделиране, 3D принтиране, хардуерна интеграция и UI/UX
                разработка в един завършен premium prototype.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] border border-black/5 bg-neutral-50 p-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">
                    Услуги
                  </p>
                  <h3 className="mb-2 text-lg font-bold text-neutral-900">
                    Full product workflow
                  </h3>
                  <p className="leading-7 text-neutral-700">
                    3D моделиране, 3D принтиране, продуктов дизайн, прототипиране
                    и UI/UX разработка.
                  </p>
                </div>

                <div className="rounded-[24px] border border-black/5 bg-neutral-50 p-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">
                    Приложение
                  </p>
                  <h3 className="mb-2 text-lg font-bold text-neutral-900">
                    Smart automotive accessory
                  </h3>
                  <p className="leading-7 text-neutral-700">
                    Интериорен продукт за автомобил с фокус върху функционалност,
                    интерактивност и premium визия.
                  </p>
                </div>

                <div className="rounded-[24px] border border-black/5 bg-neutral-50 p-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">
                    Конструкция
                  </p>
                  <h3 className="mb-2 text-lg font-bold text-neutral-900">
                    Хардуерна интеграция
                  </h3>
                  <p className="leading-7 text-neutral-700">
                    Корпус с M12 монтажна резба, интегриран дисплей модул и
                    вътрешно пространство за електроника и захранване.
                  </p>
                </div>

                <div className="rounded-[24px] border border-black/5 bg-neutral-50 p-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">
                    Функции
                  </p>
                  <h3 className="mb-2 text-lg font-bold text-neutral-900">
                    Custom UI experience
                  </h3>
                  <p className="leading-7 text-neutral-700">
                    Music control, gear indicator, speed display, 0–100 / 0–60
                    timer, themes и персонализация.
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-5">
                <p className="leading-8 text-neutral-700">
                  Софтуерната концепция е изградена около Apple Watch–style home
                  menu с бърза навигация чрез swipe жестове и tap взаимодействия.
                  Системата включва приложения за музикален контрол, индикация на
                  предавка, визуализация на скорост, таймер за ускорение, lock
                  screen, startup animation и централизирани настройки.
                </p>

                <p className="leading-8 text-neutral-700">
                  Дизайнът е разработен с фокус върху ергономична форма, premium
                  усещане и реална възможност за производство. Формата комбинира
                  текстуриран долен захват, изчистен горен модул и кръгъл дисплей,
                  който превръща стандартния скоростен лост в интелигентен и
                  визуално отличим продукт за модерния автомобилен интериор.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}