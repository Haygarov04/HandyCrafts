import Link from "next/link";
import { dict, localize, type Lang } from "@/lib/i18n";

export default function Thanks({ lang, number }: { lang: Lang; number: string }) {
  const t = dict[lang].thanks;
  const accepted = number ? t.accepted(number) : null;

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-xl flex-col items-center justify-center px-4 pb-20 pt-32 text-center">
      <span className="grid h-20 w-20 place-items-center rounded-full bg-ember text-4xl">✓</span>
      <h1 className="mt-8 text-3xl sm:text-5xl">{t.title}</h1>
      {accepted ? (
        <p className="mt-4 text-lg">
          {accepted[0]} <span className="font-semibold">{accepted[1]}</span> {accepted[2]}
        </p>
      ) : null}
      <div className="mt-8 w-full space-y-3 rounded-[2rem] bg-white p-6 text-left text-sm leading-6 text-ink/70">
        {t.steps.map((step) => (
          <p key={step}>{step}</p>
        ))}
      </div>
      <Link href={localize(lang, "/")} className="mt-8 rounded-full bg-ink px-7 py-3.5 font-semibold text-paper">
        {t.home}
      </Link>
    </div>
  );
}
