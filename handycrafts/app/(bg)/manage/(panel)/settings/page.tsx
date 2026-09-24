import { hasBlob } from "@/lib/files";
import { hasRedis } from "@/lib/kv";
import { pushReady, subscriptionCount } from "@/lib/push";
import PushToggle from "../../PushToggle";
import LogoutButton from "../logout-button";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const devices = pushReady() ? await subscriptionCount() : 0;
  const checks = [
    { label: "База за поръчки (Redis)", ok: hasRedis() },
    { label: "Снимки (Blob, private)", ok: hasBlob() },
    { label: "Визуализации (XAI_API_KEY)", ok: Boolean(process.env.XAI_API_KEY) },
    { label: "Push известия (VAPID)", ok: pushReady() },
    { label: "Имейли (Resend)", ok: Boolean(process.env.RESEND_API_KEY) },
    { label: "Подател (EMAIL_FROM)", ok: Boolean(process.env.EMAIL_FROM) },
    { label: "Имейл за поръчки (CONTACT_TO)", ok: Boolean(process.env.CONTACT_TO) },
    { label: "Адрес на сайта (NEXT_PUBLIC_SITE_URL)", ok: Boolean(process.env.NEXT_PUBLIC_SITE_URL) },
  ];

  return (
    <div className="space-y-5">
      <h1 className="text-3xl">Настройки</h1>

      <section className="space-y-3">
        <h2 className="text-base">Известия</h2>
        <PushToggle />
        <p className="px-1 text-xs text-ink/50">
          Абонирани устройства: {devices}. Включи известията на всеки телефон, на който искаш да ги получаваш.
        </p>
      </section>

      <section className="rounded-3xl bg-white p-5">
        <h2 className="text-base">Приложение на телефона</h2>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-ink/70">
          <li>
            <b>iPhone:</b> отвори /manage в Safari → „Сподели“ → „Добави към началния екран“. Известията работят само
            от иконата.
          </li>
          <li>
            <b>Android:</b> в Chrome натисни ⋮ → „Инсталиране на приложението“.
          </li>
        </ul>
      </section>

      <section className="rounded-3xl bg-white p-5">
        <h2 className="text-base">Връзки</h2>
        <ul className="mt-3 divide-y divide-ink/5 text-sm">
          {checks.map((check) => (
            <li key={check.label} className="flex items-center justify-between gap-3 py-2.5">
              <span>{check.label}</span>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  check.ok ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"
                }`}
              >
                {check.ok ? "✓ Свързано" : "! Липсва"}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex items-center justify-between rounded-3xl bg-white p-5">
        <div>
          <h2 className="text-base">Изход</h2>
          <p className="text-xs text-ink/50">Излиза само от това устройство.</p>
        </div>
        <span className="rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold">
          <LogoutButton />
        </span>
      </section>
    </div>
  );
}
