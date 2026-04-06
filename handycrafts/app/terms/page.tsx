import Link from "next/link";

const sections = [
  {
    title: "1. Обща информация",
    text: "Настоящите общи условия уреждат използването на уебсайта HandyCrafts 3D и услугите, свързани с 3D принтиране, 3D моделиране, 3D сканиране, консултации и изпращане на запитвания чрез сайта.",
  },
  {
    title: "2. Характер на услугите",
    text: "Информацията в сайта има представителен и информативен характер. Всеки проект се разглежда индивидуално според предоставените файлове, снимки, размери, материали, сложност, предназначение и технически изисквания.",
  },
  {
    title: "3. Изпращане на файлове и запитвания",
    text: "Потребителят носи отговорност за съдържанието, което изпраща чрез сайта, включително файлове, изображения, описания и друга информация. С изпращането на запитване потребителят декларира, че има право да използва и предоставя съответните материали.",
  },
  {
    title: "4. Цени и оферти",
    text: "Посочените в сайта описания не представляват обвързваща оферта. Крайна цена, срок за изпълнение и технически параметри се уточняват след преглед на конкретното запитване и след обратна връзка към клиента.",
  },
  {
    title: "5. Срокове за изпълнение",
    text: "Сроковете зависят от сложността на проекта, наличните материали, необходимата подготовка, тестове, корекции и текущата натовареност. Посочените срокове са ориентировъчни, освен ако не е уговорено друго изрично.",
  },
  {
    title: "6. Отговорност за файлове и технически данни",
    text: "Клиентът носи отговорност за точността на предоставените размери, описания, файлове и указания. HandyCrafts 3D не носи отговорност за неточности, произтичащи от непълна или некоректна информация, предоставена от клиента.",
  },
  {
    title: "7. Ограничения",
    text: "Не се приемат поръчки, свързани с незаконно съдържание, опасни изделия, забранени компоненти или материали, чието производство, притежание или употреба противоречат на приложимото законодателство.",
  },
  {
    title: "8. Интелектуална собственост",
    text: "Всички текстове, елементи на дизайна, визуални материали и съдържание в сайта, освен когато е посочено друго, са собственост на HandyCrafts 3D или се използват законосъобразно. Използването им без разрешение не е позволено.",
  },
  {
    title: "9. Поверителност",
    text: "Информацията, изпратена чрез формите за контакт и качване, се използва единствено за обработка на запитвания, изготвяне на обратна връзка и комуникация с клиента във връзка с конкретния проект.",
  },
  {
    title: "10. Промени",
    text: "HandyCrafts 3D си запазва правото да актуализира тези общи условия по всяко време. Актуалната версия се публикува на тази страница.",
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white px-4 pb-20 pt-32 sm:px-6 sm:pt-36">
      <div className="mx-auto max-w-6xl">
        <section className="relative overflow-hidden rounded-[30px] border border-black/5 bg-gradient-to-br from-white via-orange-50/40 to-neutral-100 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] sm:p-10 md:p-14">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-orange-200/30 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-orange-100/50 blur-3xl" />

          <div className="relative z-10 max-w-4xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
              Правна информация
            </p>

            <h1 className="mb-6 text-4xl font-bold text-neutral-900 sm:text-5xl md:text-6xl">
              Общи условия
            </h1>

            <p className="max-w-3xl text-base leading-7 text-neutral-700 sm:text-lg sm:leading-8">
              Тази страница описва основните условия за използване на сайта
              HandyCrafts 3D, изпращане на запитвания, качване на файлове и
              комуникация относно 3D услуги, свързани с моделиране, сканиране и
              принтиране.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="inline-block rounded-full bg-orange-500 px-8 py-4 text-center font-semibold text-white transition hover:bg-orange-600"
              >
                Свържи се с нас
              </Link>

              <Link
                href="/upload"
                className="inline-block rounded-full border border-black/10 bg-white px-8 py-4 text-center font-semibold text-neutral-900 transition hover:bg-neutral-100"
              >
                Качи проект
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-12 grid gap-6">
          {sections.map((section, index) => (
            <div
              key={section.title}
              className="lift-card glow-orange group rounded-[28px] border border-black/5 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.04)] sm:p-8"
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl">
                  {section.title}
                </h2>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-base font-bold text-orange-600">
                  {String(index + 1).padStart(2, "0")}
                </div>
              </div>

              <p className="max-w-4xl leading-7 text-neutral-700 sm:leading-8">
                {section.text}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-12 rounded-[32px] border border-black/5 bg-neutral-50 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.04)] sm:p-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
            Контакт
          </p>

          <h2 className="mb-4 text-2xl font-bold text-neutral-900 sm:text-3xl">
            Въпроси относно условията
          </h2>

          <p className="max-w-3xl text-base leading-7 text-neutral-700 sm:text-lg sm:leading-8">
            Ако имате въпроси относно използването на сайта, изпращането на
            файлове, обработката на запитвания или конкретна услуга, можете да
            се свържете с нас през контактната страница.
          </p>

          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-block rounded-full bg-orange-500 px-8 py-4 font-semibold text-white transition hover:bg-orange-600"
            >
              Към контакти
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}