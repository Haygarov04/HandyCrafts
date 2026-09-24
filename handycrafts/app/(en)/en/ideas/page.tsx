import type { Metadata } from "next";
import Ideas from "@/app/components/pages/Ideas";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("en", "/idei", {
  title: "Figurine and gift ideas from a photo",
  description: "Figurines from a photo for weddings, birthdays, anniversaries, Christmas, pets, kids, grandparents and colleagues.",
});

export default function Page() {
  return <Ideas lang="en" />;
}
