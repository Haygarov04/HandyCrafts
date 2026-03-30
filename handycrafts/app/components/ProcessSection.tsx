const steps = [
  {
    number: "01",
    title: "Идея / Файл / Запитване",
    text: "Изпращате готов 3D файл, снимка, скица или просто описание на това, което искате да бъде изработено.",
  },
  {
    number: "02",
    title: "Анализ и избор на подход",
    text: "Преценяваме кой материал, технология и работен процес са най-подходящи според функцията и визията на проекта.",
  },
  {
    number: "03",
    title: "Подготовка и изработка",
    text: "Подготвяме модела за печат, корекции или сканиране и преминаваме към реалното изпълнение.",
  },
  {
    number: "04",
    title: "Финален резултат",
    text: "Получавате готов детайл, прототип или 3D модел с внимание към точност, детайл и използваемост.",
  },
];

export default function ProcessSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
            Процес
          </p>
          <h2 className="mb-5 text-3xl font-bold text-neutral-900 md:text-5xl">
            Как работим
          </h2>
          <p className="text-lg leading-8 text-neutral-700">
            Процесът е структуриран така, че да е лесен за клиента и ефективен за
            изпълнение — от първоначалната идея до реалния резултат.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative overflow-hidden rounded-[30px] border border-black/5 bg-neutral-50 p-8"
            >
              <div className="absolute right-6 top-6 text-6xl font-bold text-orange-100">
                {step.number}
              </div>

              <div className="relative z-10 max-w-xl">
                <div className="mb-4 h-1 w-16 rounded-full bg-orange-500" />
                <h3 className="mb-4 text-2xl font-bold text-neutral-900">
                  {step.title}
                </h3>
                <p className="leading-8 text-neutral-700">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}