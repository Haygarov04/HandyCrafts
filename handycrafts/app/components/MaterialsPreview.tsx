const materials = [
  "PLA",
  "PETG",
  "ABS",
  "TPU",
  "Resin",
  "И други според проекта",
];

export default function MaterialsPreview() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
            Материали и приложения
          </p>
          <h2 className="text-3xl font-bold text-neutral-900 md:text-4xl">
            Подходящ материал за всяка идея
          </h2>
        </div>

        <div className="mb-10 flex flex-wrap gap-4">
          {materials.map((material) => (
            <div
              key={material}
              className="rounded-full border border-orange-200 bg-orange-50 px-5 py-3 font-semibold text-neutral-800"
            >
              {material}
            </div>
          ))}
        </div>

        <p className="max-w-4xl text-lg leading-8 text-neutral-700">
          Подборът на материал зависи от предназначението на детайла — визуален
          прототип, функционална част, гъвкав елемент, фини детайли или по-здрава
          инженерна употреба. При нужда помагаме с избор според конкретния проект.
        </p>
      </div>
    </section>
  );
}