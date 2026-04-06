import HeroSection from "./components/HeroSection";
import IntroSection from "./components/IntroSection";
import ServicesPreview from "./components/ServicesPreview";
import ProcessSection from "./components/ProcessSection";
import WhyChooseUs from "./components/WhyChooseUs";
import MaterialsPreview from "./components/MaterialsPreview";
import CTASection from "./components/CTASection";
import Link from "next/link";

function UploadProcedurePreview() {
  const steps = [
    {
      number: "01",
      title: "Качвате файл или изпращате идея",
      text: "Можете да подадете STL, OBJ, STEP, 3MF, ZIP или просто да опишете какво искате да бъде изработено.",
    },
    {
      number: "02",
      title: "Избирате материал и предпочитания",
      text: "В страницата за качване ще можете да изберете материал, цвят, технология, количество и допълнителни уточнения.",
    },
    {
      number: "03",
      title: "Получавате обратна връзка",
      text: "Преглеждаме проекта, уточняваме детайлите и предлагаме най-подходящото решение според целта на изделието.",
    },
    {
      number: "04",
      title: "Преминаваме към изработка",
      text: "След потвърждение подготвяме модела и започваме реалната изработка или следващата техническа стъпка.",
    },
  ];

  return (
    <section className="bg-neutral-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-14 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
            Качване на проект
          </p>
          <h2 className="mb-5 text-3xl font-bold text-neutral-900 md:text-4xl">
            Ясна и удобна процедура за изпращане на файлове и запитвания
          </h2>
          <p className="text-base leading-7 text-neutral-700 sm:text-lg sm:leading-8">
            Не е нужно да имате всичко подготвено перфектно още в началото.
            Можете да качите готов модел, да изпратите идея, снимка или описание,
            а ние ще помогнем с правилния избор на материал, технология и следващи стъпки.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="lift-card glow-orange rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.05)] sm:p-8"
            >
              <div className="mb-4 text-sm font-bold tracking-[0.2em] text-orange-500">
                {step.number}
              </div>
              <h3 className="mb-4 text-xl font-bold text-neutral-900">
                {step.title}
              </h3>
              <p className="leading-7 text-neutral-700">{step.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/upload"
            className="inline-block rounded-full bg-orange-500 px-8 py-4 text-center font-semibold text-white transition hover:bg-orange-600"
          >
            Отвори страницата за качване
          </Link>

          <Link
            href="/contact"
            className="inline-block rounded-full border border-black/10 bg-white px-8 py-4 text-center font-semibold text-neutral-900 transition hover:bg-neutral-100"
          >
            Попитай преди да качиш
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <IntroSection />
      <ServicesPreview />
      <ProcessSection />
      <WhyChooseUs />
      <MaterialsPreview />
      <UploadProcedurePreview />
      <CTASection />
    </>
  );
}