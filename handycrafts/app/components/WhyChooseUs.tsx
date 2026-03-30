const points = [
  "Прецизна изработка и внимание към детайла",
  "Подходящо за прототипи, детайли и custom проекти",
  "Консултация при избор на материал и технология",
  "Възможност за работа по идея, снимка или реален обект",
  "Модерен подход и изчистена комуникация",
  "Фокус върху качество, а не просто бързина",
];

export default function WhyChooseUs() {
  return (
    <section className="bg-neutral-950 py-24 text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-orange-400">
            Защо да изберете нас
          </p>

          <h2 className="mb-6 text-3xl font-bold md:text-5xl">
            3D услуги с техническа логика и premium усещане
          </h2>

          <p className="max-w-2xl text-lg leading-8 text-white/75">
            Целта ни не е просто да отпечатаме нещо, а да помогнем проектът да
            стане правилно — с подходящ материал, добра подготовка и резултат,
            който изглежда професионално и работи надеждно.
          </p>
        </div>

        <div className="grid gap-4">
          {points.map((point) => (
            <div
              key={point}
              className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 text-white/90"
            >
              {point}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}