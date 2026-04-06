import Link from "next/link";

const services = [
  {
    title: "3D Принтиране",
    description:
      "Прототипи, функционални детайли, резервни части, персонализирани продукти и малки серии.",
    href: "/services/printing",
    tag: "FDM • SLA • Custom parts",
  },
  {
    title: "3D Сканиране",
    description:
      "Дигитализиране на реални обекти за обратен инженеринг, репликиране и последваща обработка.",
    href: "/services/scanning",
    tag: "Reverse engineering",
  },
  {
    title: "3D Моделиране",
    description:
      "Създаване и редакция на 3D модели по идея, чертеж, снимка или реален детайл.",
    href: "/services/modeling",
    tag: "CAD • Concept • Preparation",
  },
];

export default function ServicesPreview() {
  return (
    <section id="services" className="bg-neutral-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-14 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
              Услуги
            </p>
            <h2 className="text-3xl font-bold text-neutral-900 md:text-5xl">
              Всичко важно за вашия 3D проект на едно място
            </h2>
          </div>

          <p className="max-w-xl text-base leading-7 text-neutral-600 sm:text-lg sm:leading-8">
            От идея и сканиране до готов 3D модел и реална изработка — покриваме
            основните стъпки, нужни за качествен краен резултат.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="lift-card glow-orange group rounded-[28px] border border-black/5 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.05)] sm:rounded-[32px] sm:p-8"
            >
              <div className="mb-8 flex items-start justify-between gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-base font-bold text-orange-600 sm:h-14 sm:w-14 sm:text-lg">
                  0{index + 1}
                </div>
                <span className="rounded-full bg-neutral-100 px-3 py-1 text-[11px] font-semibold text-neutral-600 sm:text-xs">
                  {service.tag}
                </span>
              </div>

              <h3 className="mb-4 text-xl font-bold text-neutral-900 sm:text-2xl">
                {service.title}
              </h3>

              <p className="mb-8 leading-7 text-neutral-700 sm:leading-8">
                {service.description}
              </p>

              <Link
                href={service.href}
                className="inline-flex items-center gap-2 font-semibold text-orange-500 transition group-hover:gap-3"
              >
                Научи повече <span>→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}