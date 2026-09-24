import Link from "next/link";
import { localize, type Lang } from "@/lib/i18n";
import { legalDoc, legalUpdated, type LegalId } from "@/lib/legal";

const related: Record<LegalId, { path: string; label: Record<Lang, string> }> = {
  terms: { path: "/terms", label: { bg: "Общи условия", en: "Terms and conditions" } },
  privacy: { path: "/poveritelnost", label: { bg: "Поверителност", en: "Privacy policy" } },
  returns: { path: "/vrashtane", label: { bg: "Връщане и рекламации", en: "Returns and complaints" } },
  delivery: { path: "/dostavka", label: { bg: "Доставка и плащане", en: "Delivery and payment" } },
};

export default function Legal({ id, lang }: { id: LegalId; lang: Lang }) {
  const doc = legalDoc(id, lang);
  const en = lang === "en";
  return (
    <div className="px-4 pb-24 pt-32 sm:px-6 sm:pt-40">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-ember-deep">{doc.kicker}</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">{doc.title}</h1>
        <p className="mt-3 text-sm text-ink/50">
          {en ? "Last updated" : "Последна актуализация"}: {legalUpdated}
        </p>
        <nav className="mt-6 flex flex-wrap gap-2">
          {(Object.keys(related) as LegalId[]).map((key) => (
            <Link
              key={key}
              href={localize(lang, related[key].path)}
              aria-current={key === id ? "page" : undefined}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${key === id ? "bg-ink text-paper" : "bg-white hover:bg-sand"}`}
            >
              {related[key].label[lang]}
            </Link>
          ))}
        </nav>
        <ol className="mt-8 space-y-4">
          {doc.sections.map((section, index) => (
            <li key={section.title} className="rounded-[2rem] bg-white p-6 sm:p-8">
              <h2 className="flex items-center gap-3 text-lg sm:text-xl">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-paper text-sm text-ember-deep">
                  {index + 1}
                </span>
                {section.title}
              </h2>
              {section.body.map((part, i) =>
                Array.isArray(part) ? (
                  <ul key={i} className="mt-3 list-disc space-y-1.5 pl-5 leading-7 text-ink/70 marker:text-ember">
                    {part.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                ) : (
                  <p key={i} className="mt-3 leading-7 text-ink/70">
                    {part}
                  </p>
                )
              )}
            </li>
          ))}
        </ol>
        <p className="mt-10 text-ink/60">
          {en ? "Questions?" : "Въпроси?"}{" "}
          <Link href={localize(lang, "/contact")} className="font-semibold underline decoration-ember underline-offset-4">
            {en ? "Write to us" : "Пиши ни"}
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
