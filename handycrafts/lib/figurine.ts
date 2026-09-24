import type { ProductId, SubjectId } from "@/lib/catalog";

const kinds: Record<ProductId, string> = {
  figurine: "collectible resin figurine standing on a low plain round base",
  keychain: "small chunky keychain figurine with a large head and a metal ring attached to the top",
};

const framing =
  "Framing: square image, the figurine centered and filling most of the frame, soft warm studio light, plain cream seamless background, gentle contact shadow, no text, no logo, no watermark.";

export function figurinePrompt(input: {
  product: ProductId;
  subject: SubjectId;
  cm: number;
  clothes: string;
  pose: string;
}) {
  const extras = input.clothes.trim();

  if (input.subject === "pet") {
    const pose = input.pose.trim() || "sitting calmly and looking at the camera";
    return [
      `Turn this photo into a studio product photo of one physical ${kinds[input.product]} of this exact pet, about ${input.cm} cm tall.`,
      "Keep the pet recognizable: same species and breed, fur color and pattern, markings, eye color, ear shape and tail.",
      extras ? `Accessories: ${extras}.` : "No clothes, only a collar if one is visible in the photo.",
      `Pose: ${pose}. Whole animal visible, nothing cropped.`,
      "Style: premium hand-painted stylized resin miniature, cute but faithful proportions, slightly larger head and big bright eyes, fur sculpted in soft clean clumps, smooth matte finish.",
      framing,
    ].join(" ");
  }

  const pose = input.pose.trim() || "a calm natural standing pose";
  return [
    `Turn this photo into a studio product photo of one physical full-body ${kinds[input.product]}, about ${input.cm} cm tall.`,
    "Keep this exact person recognizable: face shape, age, hairstyle, glasses, skin tone and distinguishing features.",
    `Clothes and details: ${extras || "the clothes visible in the photo"}.`,
    `Pose: ${pose}. Full subject visible, nothing cropped.`,
    "Style: premium hand-painted stylized resin miniature, soft matte finish, clean sculpted hair, slightly larger head, friendly expression, eyes sharp.",
    framing,
  ].join(" ");
}
