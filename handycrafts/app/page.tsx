import Image from "next/image";
import Link from "next/link";
import FaqList from "./components/FaqList";

const products = [
  {
    title: "Фигурка",
    text: "Цял човек, любимец или сцена. Стои на рафт.",
    image: "/portfolio/p20.PNG",
    href: "/studio?product=figurine",
  },
  {
    title: "Ключодържател",
    text: "Същият човек, в джоба. Малък и плътен.",
    image: "/portfolio/p35.jpg",
    href: "/studio?product=keychain",
  },
  {
    title: "Бюст",
    text: "Лицето отблизо. Повече място за чертите.",
    image: "/portfolio/p36.jpg",
    href: "/studio?product=bust",
  },
];

const gallery = [
  { src: "/portfolio/p3.jpg", alt: "Фигура", className: "sm:row-span-2" },
  { src: "/portfolio/p24.PNG", alt: "Персонализиран подарък", className: "" },
  { src: "/portfolio/p28.PNG", alt: "Печат в работилницата", className: "" },
  { src: "/portfolio/p25.PNG", alt: "Кутия за подарък", className: "sm:row-span-2" },
  { src: "/portfolio/p32.jpg", alt: "Мини постановка", className: "" },
  { src: "/portfolio/p19.PNG", alt: "Декоративна форма", className: "" },
];

const services = [
  {
    n: "01",
    title: "3D принтиране",
    text: "PLA, PETG, ABS, TPU и resin. Прототип, част или серия.",
    href: "/services/printing",
  },
  {
    n: "02",
    title: "3D сканиране",
    text: "Реален обект става модел, който може да се повтори.",
    href: "/services/scanning",
  },
  {
    n: "03",
    title: "3D моделиране",
    text: "От скица, снимка или файл до готов модел за печат.",
    href: "/services/modeling",
  },
];

export default function Home() {
  return (
    <>
      <section className="px-4 pb-8 pt-28 sm:px-6 sm:pt-32">
        <div className="mx-auto grid max-w-6xl items-end gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ember-deep">
              Работилница в Русе
            </p>
            <h1 className="mt-4 max-w-xl text-[3.1rem] leading-[0.92] text-ink sm:text-7xl">
              Фигурка по снимка.
              <span className="block text-ink/80">Детайл по идея.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-8 text-ink/70">
              Качваш ясна снимка, описваш дрехите и позата и виждаш
              визуализацията преди да я отпечатаме. За файлове и технически
              части работим по същия начин: първо ясно, после изработка.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/studio"
                className="rounded-full bg-ember px-6 py-3.5 text-center font-semibold text-ink transition hover:bg-ember-deep"
              >
                Създай фигурка
              </Link>
              <Link
                href="/portfolio"
                className="rounded-full border border-ink/15 px-6 py-3.5 text-center font-semibold transition hover:bg-sand"
              >
                Виж изработеното
              </Link>
            </div>
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-ink/10 pt-6 text-sm">
              <div>
                <dt className="text-ink/45">Преглед</dt>
                <dd className="mt-1 font-medium">преди печат</dd>
              </div>
              <div>
                <dt className="text-ink/45">Форми</dt>
                <dd className="mt-1 font-medium">фигура, бюст, ключ</dd>
              </div>
              <div>
                <dt className="text-ink/45">Място</dt>
                <dd className="mt-1 font-medium">Русе</dd>
              </div>
            </dl>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] bg-ink shadow-[0_30px_80px_rgba(22,21,19,0.18)]">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="aspect-[4/5] w-full object-cover sm:aspect-[5/6]"
                poster="/portfolio/p28.PNG"
              >
                <source src="/video.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="absolute -left-3 bottom-6 max-w-[15rem] rounded-2xl border border-ink/10 bg-paper/95 p-4 shadow-[0_16px_40px_rgba(22,21,19,0.12)] backdrop-blur sm:left-[-1.5rem]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ember-deep">
                Преди да печатаме
              </p>
              <p className="mt-2 text-sm leading-6">
                Одобряваш визуализацията. После моделът влиза в печат.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between gap-6">
            <h2 className="max-w-md text-4xl leading-none sm:text-5xl">
              Три начина да запазиш човека.
            </h2>
            <Link href="/studio" className="hidden text-sm font-semibold underline decoration-ember underline-offset-4 sm:inline">
              Отвори студиото
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {products.map((product, index) => (
              <Link
                key={product.title}
                href={product.href}
                className="lift-card group overflow-hidden rounded-[1.6rem] bg-white"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-sand">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(min-width: 768px) 30vw, 100vw"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-paper/90 px-3 py-1 text-xs font-semibold">
                    0{index + 1}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-3xl">{product.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink/65">{product.text}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink px-4 py-16 text-paper sm:px-6 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ember">
              Как става
            </p>
            <h2 className="mt-4 text-4xl leading-none sm:text-5xl">
              Малка процедура. Голям контрол.
            </h2>
          </div>
          <ol className="divide-y divide-white/10">
            {[
              ["01", "Качваш снимка", "Една ясна снимка. Лицето да се вижда, краката да не са отрязани, ако правим цяла фигура."],
              ["02", "Описваш дрехите", "Поза, цвят, предмет в ръката, надпис върху основата. Колкото по-конкретно, толкова по-близо е картинката."],
              ["03", "Одобряваш и печатаме", "Клиентът одобрява картинката. Ние преглеждаме модела и печатаме фигурката в Русе."],
            ].map(([n, title, text]) => (
              <li key={n} className="grid grid-cols-[auto_1fr] gap-5 py-6">
                <span className="font-display text-3xl text-ember">{n}</span>
                <div>
                  <h3 className="text-3xl">{title}</h3>
                  <p className="mt-2 max-w-xl leading-7 text-paper/70">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between gap-6">
            <h2 className="text-4xl leading-none sm:text-5xl">От масата.</h2>
            <Link href="/portfolio" className="text-sm font-semibold underline decoration-ember underline-offset-4">
              Цялото портфолио
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {gallery.map((item) => (
              <div
                key={item.src}
                className={`relative min-h-44 overflow-hidden rounded-[1.4rem] bg-sand ${item.className}`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 640px) 25vw, 50vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 sm:pb-24">
        <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.href}
              href={service.href}
              className="lift-card rounded-[1.6rem] border border-ink/10 bg-white p-6 sm:p-8"
            >
              <p className="text-xs font-semibold tracking-[0.22em] text-ember-deep">
                {service.n}
              </p>
              <h3 className="mt-6 text-4xl">{service.title}</h3>
              <p className="mt-3 leading-7 text-ink/65">{service.text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <h2 className="text-4xl leading-none sm:text-5xl">Малки въпроси.</h2>
          <FaqList />
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 rounded-[2rem] bg-sand px-6 py-10 sm:px-10 sm:py-14 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ember-deep">
              Следващата фигурка
            </p>
            <h2 className="mt-3 max-w-lg text-4xl leading-none sm:text-6xl">
              Една снимка е достатъчна за начало.
            </h2>
          </div>
          <Link
            href="/studio"
            className="rounded-full bg-ink px-6 py-3.5 font-semibold text-paper transition hover:bg-ember hover:text-ink"
          >
            Влез в студиото
          </Link>
        </div>
      </section>
    </>
  );
}
