import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrder } from "@/lib/orders";
import ManualOrderForm from "../../manual-order-form";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditOrderPage({ params }: Props) {
  const order = await getOrder((await params).id);
  if (!order?.manual) notFound();
  return (
    <div className="space-y-5">
      <Link href={`/manage/${order.id}`} className="text-sm text-ink/55 hover:text-ink">
        ‹ {order.number}
      </Link>
      <h1 className="text-3xl">Редактирай поръчката</h1>
      <ManualOrderForm order={order} />
    </div>
  );
}
