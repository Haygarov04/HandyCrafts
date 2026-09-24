import Link from "next/link";
import { productionDays } from "@/lib/catalog";

export const metadata = { title: "Благодарим!", robots: { index: false, follow: false } };

type Props = { searchParams: Promise<{ n?: string }> };

export default async function ThanksPage({ searchParams }: Props) {
  const { n } = await searchParams;
  const number = /^HC-\d+$/.test(n || "") ? n : "";

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-xl flex-col items-center justify-center px-4 pb-20 pt-32 text-center">
      <span className="grid h-20 w-20 place-items-center rounded-full bg-ember text-4xl">✓</span>
      <h1 className="mt-8 text-3xl sm:text-5xl">Благодарим!</h1>
      {number ? (
        <p className="mt-4 text-lg">
          Поръчка <span className="font-semibold">{number}</span> е приета.
        </p>
      ) : null}
      <div className="mt-8 w-full space-y-3 rounded-[2rem] bg-white p-6 text-left text-sm leading-6 text-ink/70">
        <p>① Ще ти се обадим в работно време, за да потвърдим поръчката.</p>
        <p>② Изработваме фигурката на ръка — {productionDays}.</p>
        <p>③ Изпращаме с куриер. Плащаш при получаване.</p>
      </div>
      <Link href="/" className="mt-8 rounded-full bg-ink px-7 py-3.5 font-semibold text-paper">
        Към началото
      </Link>
    </div>
  );
}
