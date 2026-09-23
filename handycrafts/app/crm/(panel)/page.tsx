import Link from "next/link";
import { crmOpenInDev } from "@/lib/crm-auth";
import { statusLabel } from "@/lib/order-types";
import { listOrders, storageMode } from "@/lib/orders";

export const dynamic = "force-dynamic";

export default async function CrmPage() {
  const orders = await listOrders();
  const storage = storageMode();

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-28 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ember-deep">Работилница</p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-5xl sm:text-6xl">Поръчки</h1>
        <Link href="/studio" className="text-sm font-semibold underline decoration-ember underline-offset-4">
          Нова от студиото
        </Link>
      </div>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-ink/60">
        Всяка поръчка пази снимката, визуализацията и 3D файла, ако го има.
        {storage.database
          ? " Записите са в базата."
          : " Сега са на този компютър. На Vercel добави Postgres, за да се ползва POSTGRES_URL."}
        {storage.files === "vercel-blob"
          ? " Файловете са в Blob."
          : " Файловете са локални, докато не добавиш Blob и BLOB_READ_WRITE_TOKEN."}
      </p>
      {crmOpenInDev() ? (
        <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-950">
          Локално CRM е отворено без парола. Преди качване сложи CRM_PASSWORD.
        </p>
      ) : null}

      {orders.length === 0 ? (
        <div className="mt-10 rounded-[1.6rem] border border-ink/10 bg-white p-8">
          <p className="font-display text-3xl">Още няма поръчки.</p>
          <p className="mt-2 text-sm text-ink/60">Пусни една от студиото и тя ще се появи тук със файла.</p>
        </div>
      ) : (
        <>
        <div className="mt-8 grid gap-3 md:hidden">
          {orders.map((order) => (
            <Link key={order.id} href={`/crm/${order.id}`} className="rounded-[1.4rem] border border-ink/10 bg-white p-4">
              <span className="flex items-center justify-between gap-3">
                <span className="font-semibold">{order.name}</span>
                <span className="text-sm text-ink/55">{statusLabel[order.status]}</span>
              </span>
              <span className="mt-1 block text-sm text-ink/50">{order.email}</span>
              <span className="mt-3 block text-sm">
                {order.product} · {order.size}
                {order.files.glb ? " · 3D" : ""}
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-8 hidden overflow-x-auto rounded-[1.6rem] border border-ink/10 bg-white md:block">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink/10 text-xs uppercase tracking-[0.16em] text-ink/45">
              <tr>
                <th className="px-4 py-3 font-medium">Кога</th>
                <th className="px-4 py-3 font-medium">Клиент</th>
                <th className="px-4 py-3 font-medium">Поръчка</th>
                <th className="px-4 py-3 font-medium">Статус</th>
                <th className="px-4 py-3 font-medium">Файл</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-ink/5 last:border-0">
                  <td className="px-4 py-4 text-ink/55">
                    {new Date(order.createdAt).toLocaleString("bg-BG", { dateStyle: "medium", timeStyle: "short" })}
                  </td>
                  <td className="px-4 py-4">
                    <Link href={`/crm/${order.id}`} className="font-semibold hover:text-ember-deep">
                      {order.name}
                    </Link>
                    <span className="mt-1 block text-ink/50">{order.email}</span>
                  </td>
                  <td className="px-4 py-4">
                    {order.product}
                    <span className="mt-1 block text-ink/50">{order.size}</span>
                  </td>
                  <td className="px-4 py-4">{statusLabel[order.status]}</td>
                  <td className="px-4 py-4 text-ink/60">
                    {order.files.photo ? "снимка" : "—"}
                    {order.files.glb ? " · 3D" : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      )}
    </div>
  );
}
