import type { ProductId } from "@/lib/catalog";

const kinds: Record<ProductId, string> = {
  figurine: "a full-body collectible resin figurine standing on a low plain round base",
  keychain:
    "a small chunky keychain figurine with a large head, a metal ring attached to the top of the head",
};

export function figurinePrompt(input: {
  product: ProductId;
  cm: number;
  clothes: string;
  pose: string;
}) {
  const clothes = input.clothes.trim() || "the clothes visible in the photo";
  const pose = input.pose.trim() || "a calm natural standing pose";

  return [
    `Turn this photo into a studio product photo of one physical ${kinds[input.product]}, about ${input.cm} cm tall.`,
    "Keep this exact person recognizable: face shape, age, hairstyle, glasses, skin tone and distinguishing features.",
    `Clothes and details: ${clothes}.`,
    `Pose: ${pose}. Full subject visible, nothing cropped.`,
    "Style: premium hand-painted stylized resin miniature, soft matte finish, clean sculpted hair, slightly larger head, friendly expression, eyes sharp.",
    "Framing: square image, the figurine centered and filling most of the frame, soft warm studio light, plain cream seamless background, gentle contact shadow, no text, no logo, no watermark.",
  ].join(" ");
}
