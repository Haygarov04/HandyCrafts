import type { Metadata } from "next";
import ReviewForm from "@/app/components/pages/ReviewForm";
import { getOrder } from "@/lib/orders";
import { displayName, reviewTokenValid } from "@/lib/reviews";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("en", "/review", { title: "Review", noindex: true });

type Props = { searchParams: Promise<{ o?: string; t?: string }> };

export default async function Page({ searchParams }: Props) {
  const { o = "", t = "" } = await searchParams;
  const order = reviewTokenValid(o, t) ? await getOrder(o) : null;
  return (
    <ReviewForm
      lang={"en"}
      token={t}
      order={order ? { id: order.id, number: order.number, name: displayName(order.customer.name) } : null}
    />
  );
}
