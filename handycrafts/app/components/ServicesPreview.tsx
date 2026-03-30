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
    <section id="services" className="bg-neutral-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
              Услуги
            </p>
            <h2 className="text-3xl font-bold text-neutral-900 md:text-5xl">
              Всичко важно за вашия 3D проект на едно място
            </h2>
          </div>

          <p className="max-w-xl text-lg leading-8 text-neutral-600">
            От идея и сканиране до готов 3D модел и реална изработка — покриваме
            основните стъпки, нужни за качествен краен резултат.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group rounded-[32px] border border-black/5 bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(0,0,0,0.08)]"
            >
              <div className="mb-8 flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-lg font-bold text-orange-600">
                  0{index + 1}
                </div>
                <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600">
                  {service.tag}
                </span>
              </div>

              <h3 className="mb-4 text-2xl font-bold text-neutral-900">
                {service.title}
              </h3>

              <p className="mb-8 leading-8 text-neutral-700">
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