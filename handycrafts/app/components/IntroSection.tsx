export default function IntroSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
            За HandyCrafts 3D
          </p>

          <h2 className="text-3xl font-bold leading-tight text-neutral-900 md:text-5xl">
            Партньор за модерни 3D услуги — от идея до готов детайл
          </h2>
        </div>

        <div className="text-lg leading-8 text-neutral-700">
          Работим по разнообразни проекти — от единични детайли и прототипи до
          визуални концепции, сканиране на реални обекти и създаване на модели за
          печат. Комбинираме технически подход, внимание към детайла и модерен
          дизайн, за да постигнем резултат, който изглежда и работи както трябва.
        </div>
      </div>
    </section>
  );
}