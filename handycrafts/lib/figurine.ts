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
    `Turn this photo into one physical ${kind}, studio product photo, about ${input.size} tall when printed.`,
    "Keep this exact person recognizable: face, age, hairstyle, glasses, and distinguishing features.",
    `Clothes and details: ${clothes}.`,
    `Pose: ${pose}. Full subject visible, nothing cropped, feet or base fully in frame.`,
    "Style: slightly stylized resin miniature, smooth matte plastic, solid sculpted hair with no loose strands, clothing as solid volumes with few seams, chunky separated hands.",
    "Scene: one figure only, centered, seamless light gray background, soft even lighting, no text, no logo, no extra people, no scenery.",
  ].join(" ");
}
