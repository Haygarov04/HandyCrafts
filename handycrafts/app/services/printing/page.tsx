import Link from "next/link";

export default function PrintingPage() {
  return (
    <main className="min-h-screen bg-white px-6 pb-20 pt-36">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
          Услуга
        </p>

        <h1 className="mb-6 text-4xl font-bold text-neutral-900 md:text-5xl">
          3D Принтиране
        </h1>

        <p className="mb-10 max-w-4xl text-lg leading-8 text-neutral-700">
          Изработваме 3D детайли за прототипиране, функционални приложения,
          резервни части, персонализирани изделия и малки серии. Подходът се
          избира според предназначението, необходимата здравина, визията и
          нивото на детайлност.
        </p>

        <div className="mb-10 grid gap-8 md:grid-cols-3">
          <div className="rounded-[28px] bg-neutral-50 p-8">
            <h3 className="mb-4 text-xl font-bold">За какво е подходящо</h3>
            <p className="leading-7 text-neutral-700">
              Прототипи, корпуси, монтажни елементи, custom части, декоративни
              и функционални изделия, единични бройки и тестови модели.
            </p>
          </div>

          <div className="rounded-[28px] bg-neutral-50 p-8">
            <h3 className="mb-4 text-xl font-bold">Материали</h3>
            <p className="leading-7 text-neutral-700">
              PLA, PETG, ABS, TPU, Resin и други варианти според конкретния
              случай, нужната устойчивост и крайния външен вид.
            </p>
          </div>

          <div className="rounded-[28px] bg-neutral-50 p-8">
            <h3 className="mb-4 text-xl font-bold">Какво получавате</h3>
            <p className="leading-7 text-neutral-700">
              Консултация, подготовка на модела, препоръка за подходящ материал
              и добре изработен детайл с баланс между точност, здравина и визия.
            </p>
          </div>
        </div>

        <div className="mb-10 rounded-[32px] border border-black/5 bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.04)]">
          <h2 className="mb-4 text-2xl font-bold text-neutral-900">
            Как протича услугата
          </h2>
          <div className="grid gap-6 md:grid-cols-4">
            <div>
              <p className="mb-2 font-bold text-orange-500">01</p>
              <p className="text-neutral-700">Изпращате файл, идея или снимка.</p>
            </div>
            <div>
              <p className="mb-2 font-bold text-orange-500">02</p>
              <p className="text-neutral-700">Уточняваме материал, размери и приложение.</p>
            </div>
            <div>
              <p className="mb-2 font-bold text-orange-500">03</p>
              <p className="text-neutral-700">Подготвяме модела и настройките за печат.</p>
            </div>
            <div>
              <p className="mb-2 font-bold text-orange-500">04</p>
              <p className="text-neutral-700">Изработваме детайла и преминаваме към предаване.</p>
            </div>
          </div>
        </div>

        <Link
          href="/upload"
          className="inline-block rounded-full bg-orange-500 px-8 py-4 font-semibold text-white transition hover:bg-orange-600"
        >
          Качи файл
        </Link>
      </div>
    </main>
  );
}