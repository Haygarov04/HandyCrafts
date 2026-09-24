import Link from "next/link";
import { dict, localize, type Lang } from "@/lib/i18n";

export default function TermsPage({ lang }: { lang: Lang }) {
  const t = dict[lang].terms;
  const sections = t.sections;
  return (
    <div className="px-4 pb-24 pt-32 sm:px-6 sm:pt-40">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-ember-deep">{t.kicker}</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">{t.title}</h1>
        <ol className="mt-10 space-y-4">
          {sections.map((section, index) => (
            <li key={section.title} className="rounded-[2rem] bg-white p-6 sm:p-8">
              <h2 className="flex items-center gap-3 text-lg sm:text-xl">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-paper text-sm text-ember-deep">
                  {index + 1}
                </span>
                {section.title}
              </h2>
              <p className="mt-3 leading-7 text-ink/70">{section.text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-10 text-ink/60">
          {t.questions}{" "}
          <Link href={localize(lang, "/contact")} className="font-semibold underline decoration-ember underline-offset-4">
            {t.write}
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
