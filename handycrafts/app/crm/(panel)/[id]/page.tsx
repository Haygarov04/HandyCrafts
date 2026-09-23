import Link from "next/link";
import { notFound } from "next/navigation";
import ModelViewer from "@/app/components/ModelViewer";
import { getOrder } from "@/lib/orders";
import StatusForm from "../status-form";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

export default async function OrderPage(context: Context) {
  const { id } = await context.params;
  const order = await getOrder(id);
  if (!order) notFound();

  const fileUrl = (kind: string) => `/api/orders/${order.id}/file?kind=${kind}`;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-28 sm:px-6">
      <Link href="/crm" className="text-sm text-ink/55 hover:text-ink">
        ‹ Всички поръчки
      </Link>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ember-deep">
            {order.id.slice(0, 8)}
          </p>
          <h1 className="mt-2 text-5xl">{order.name}</h1>
        </div>
        <p className="text-sm text-ink/50">
          {new Date(order.createdAt).toLocaleString("bg-BG", { dateStyle: "medium", timeStyle: "short" })}
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <section className="rounded-[1.6rem] border border-ink/10 bg-white p-6">
          <StatusForm id={order.id} status={order.status} />
          <dl className="mt-6 grid gap-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-ink/5 py-2">
              <dt className="text-ink/45">Имейл</dt>
              <dd><a href={`mailto:${order.email}`}>{order.email}</a></dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-ink/5 py-2">
              <dt className="text-ink/45">Телефон</dt>
              <dd>{order.phone || "—"}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-ink/5 py-2">
              <dt className="text-ink/45">Поръчка</dt>
              <dd>{order.product} · {order.size} · {order.people}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-ink/5 py-2">
              <dt className="text-ink/45">Кутия</dt>
              <dd>{order.box === "premium" ? "Премиум" : "Стандартна"}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-ink/5 py-2">
              <dt className="text-ink/45">Добавки</dt>
              <dd>{[order.rush ? "бърза" : "", order.secondCopy ? "второ копие" : ""].filter(Boolean).join(", ") || "—"}</dd>
            </div>
          </dl>
          <div className="mt-6">
            <p className="text-xs uppercase tracking-[0.16em] text-ink/40">Дрехи</p>
            <p className="mt-2 leading-7">{order.clothes || "—"}</p>
            <p className="mt-4 text-xs uppercase tracking-[0.16em] text-ink/40">Поза</p>
            <p className="mt-2 leading-7">{order.pose || "—"}</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
            {order.files.photo ? <a className="underline decoration-ember underline-offset-4" href={`${fileUrl("photo")}&download=1`}>Снимка</a> : null}
            {order.files.preview ? <a className="underline decoration-ember underline-offset-4" href={`${fileUrl("preview")}&download=1`}>Визуализация</a> : null}
            {order.files.glb ? <a className="underline decoration-ember underline-offset-4" href={`${fileUrl("glb")}&download=1`}>GLB</a> : null}
            {order.files.stl ? <a className="underline decoration-ember underline-offset-4" href={`${fileUrl("stl")}&download=1`}>STL</a> : null}
          </div>
        </section>

        <section className="grid gap-4">
          {order.files.glb ? (
            <ModelViewer src={fileUrl("glb")} />
          ) : (
            <div className="grid h-[280px] place-items-center rounded-[1.6rem] bg-sand px-6 text-center text-sm leading-6 text-ink/55">
              Няма 3D файл още. Щом Meshy върне GLB към поръчката, тук се върти фигурката.
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            {order.files.photo ? (
              <figure>
                <img src={fileUrl("photo")} alt="Оригинална снимка" className="h-56 w-full rounded-[1.4rem] object-cover" />
                <figcaption className="mt-2 text-xs text-ink/45">Оригинал</figcaption>
              </figure>
            ) : null}
            {order.files.preview ? (
              <figure>
                <img src={fileUrl("preview")} alt="Визуализация" className="h-56 w-full rounded-[1.4rem] object-cover" />
                <figcaption className="mt-2 text-xs text-ink/45">Визуализация</figcaption>
              </figure>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
