export const products = {
  figurine: {
    label: "Фигурка",
    line: "Цяла фигура върху ниска овална основа.",
    prompt:
      "a full-body collectible resin figurine standing on a low plain oval base",
  },
  keychain: {
    label: "Ключодържател",
    line: "Малка плътна фигура с халка на основата.",
    prompt:
      "a small chunky keychain figurine with a solid round loop attached to a low base",
  },
  bust: {
    label: "Бюст",
    line: "Глава и рамене върху прост постамент.",
    prompt:
      "a chest-up bust figurine on a simple rectangular plinth, face large and clear",
  },
} as const;

export const sizes = ["6 см", "10 см", "15 см", "20 см"] as const;

export type ProductId = keyof typeof products;

export function isProductId(value: string): value is ProductId {
  return value in products;
}

export function figurinePrompt(input: {
  product: ProductId;
  size: string;
  clothes: string;
  pose: string;
}) {
  const kind = products[input.product].prompt;
  const clothes = input.clothes.trim() || "the clothes visible in the photo";
  const pose = input.pose.trim() || "a calm standing pose with arms slightly away from the body";

  return [
    `Turn this photo into one physical ${kind} for image-to-3D conversion, about ${input.size} tall when printed.`,
    "Keep this exact person recognizable: face shape, age, hairstyle, glasses, and distinguishing features.",
    `Clothes and details: ${clothes}.`,
    `Pose: ${pose}. Front view, full subject visible, both arms slightly away from the torso, feet separated, nothing cropped.`,
    "Style: clean stylized resin miniature, smooth matte plastic, solid sculpted hair with no loose strands, clothing as simple solid volumes, chunky separated hands, face large and sharp.",
    "Framing: square image, one figure only, centered, the figure fills most of the frame, plain seamless light gray background, even soft light, no floor shadow, no table, no text, no logo.",
    "Base: one simple low cylinder under the feet, not a thick podium.",
  ].join(" ");
}
