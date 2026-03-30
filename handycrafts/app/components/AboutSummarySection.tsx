export default function AboutSummarySection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
            За нас
          </p>

          <h2 className="mb-6 text-3xl font-bold text-neutral-900 md:text-4xl">
            Надежден партньор за 3D печат, сканиране и моделиране
          </h2>
        </div>

        <div className="text-lg leading-8 text-neutral-700">
          Работим по проекти за прототипи, функционални детайли, резервни части,
          персонализирани продукти и визуални концепции. Комбинираме технически
          подход, внимание към детайла и модерни 3D технологии, за да превърнем
          идеите в реални обекти.
        </div>
      </div>
    </section>
  );
}