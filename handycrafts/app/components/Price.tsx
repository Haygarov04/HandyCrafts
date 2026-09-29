/** A price, with the crossed-out regular price in front of it. */
export default function Price({ now, was, money }: { now: number; was?: number | null; money: (value: number) => string }) {
  return (
    <>
      {was ? <s className="mr-1.5 font-normal opacity-50">{money(was)}</s> : null}
      {money(now)}
    </>
  );
}
