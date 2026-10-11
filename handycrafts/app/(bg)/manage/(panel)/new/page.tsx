import Link from "next/link";
import ManualOrderForm from "../manual-order-form";

export const dynamic = "force-dynamic";

export default function NewOrderPage() {
  return (
    <div className="space-y-5">
      <Link href="/manage" className="text-sm text-ink/55 hover:text-ink">
        ‹ Всички поръчки
      </Link>
      <div>
        <h1 className="text-3xl">Ръчна поръчка</h1>
        <p className="mt-1 text-sm text-ink/55">За поръчки от Facebook, Instagram, TikTok или по телефона. Попълни само каквото имаш.</p>
      </div>
      <ManualOrderForm />
    </div>
  );
}
