import type { ProductId, SubjectId } from "@/lib/catalog";

const kinds: Record<ProductId, string> = {
  figurine: "collectible resin figurine standing on a low plain round base",
  keychain: "small chunky keychain figurine with a large head and a metal ring attached to the top",
};

const framing =
  "Framing: square image, the figurine centered and filling most of the frame, soft warm studio light, plain cream seamless background, gentle contact shadow. No watermark and no text or logo floating on the image itself; logos, names and prints on the clothes or items are fine.";

// Previews went wrong in the same few ways: extra feet when the photo pose was crouching,
// busts instead of full bodies, and results that looked like a real child rather than a figurine.
const anatomy =
  "Correct anatomy for every figure: exactly two arms, two hands with five fingers, two legs and two feet each, no extra, merged or missing limbs.";
const toy =
  "It must clearly read as a small physical painted resin figurine, not a real person and not a photo: stylized sculpted forms, simplified smooth skin, painted details.";
const fullBody = "Full body from the top of the head to the shoes, both feet resting flat on the base — never a bust or a half body.";

export function figurinePrompt(input: {
  product: ProductId;
  subject: SubjectId;
  people?: number;
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

  const people = input.people ?? 1;
  if (people > 1) {
    const pose = input.pose.trim() || "standing upright side by side, close together, natural and friendly (do not copy a sitting or crouching pose from the photo)";
    return [
      `Turn this photo into a studio product photo of one physical ${kinds[input.product].replace("a low plain round base", "one shared low plain round base")} showing exactly ${people} people from the photo together, about ${input.cm} cm tall${input.product === "keychain" ? ", with one metal ring on top" : ""}.`,
      "Keep every person recognizable: face shape, age, hairstyle, skin tone and distinguishing features. Add glasses only if the person clearly wears them in the photo — never invent glasses, jewellery or other accessories that are not there.",
      `Clothes and details: ${extras || "the clothes visible in the photo"}.`,
      `Pose: ${pose}. All ${people} people fully visible, nothing cropped.`,
      input.product === "figurine" ? fullBody : "",
      anatomy,
      "Style: premium hand-painted stylized resin miniature, soft matte finish, clean sculpted hair, slightly larger heads, friendly expressions, eyes sharp.",
      toy,
      framing,
    ]
      .filter(Boolean)
      .join(" ");
  }

  const pose = input.pose.trim() || "standing upright in a calm natural pose (do not copy a sitting or crouching pose from the photo)";
  return [
    `Turn this photo into a studio product photo of one physical full-body ${kinds[input.product]}, about ${input.cm} cm tall.`,
    "Keep this exact person recognizable: face shape, age, hairstyle, skin tone and distinguishing features. Add glasses only if the person clearly wears them in the photo — never invent glasses, jewellery or other accessories that are not there.",
    `Clothes and details: ${extras || "the clothes visible in the photo"}.`,
    `Pose: ${pose}. Full subject visible, nothing cropped.`,
    input.product === "figurine" ? fullBody : "",
    anatomy,
    "Style: premium hand-painted stylized resin miniature, soft matte finish, clean sculpted hair, slightly larger head, friendly expression, eyes sharp.",
    toy,
    framing,
  ]
    .filter(Boolean)
    .join(" ");
}

/**
 * A change asked for in the studio chat. <IMAGE_0> is the current preview, <IMAGE_1> the customer's
 * original photo (for the likeness) and <IMAGE_2>, if there is one, a photo they just added.
 */
export function editPrompt(input: { product: ProductId; subject: SubjectId; request: string; extraPhoto: boolean; hasOriginal: boolean }) {
  return [
    `<IMAGE_0> is a studio product photo of a custom ${kinds[input.product]}.`,
    input.hasOriginal ? `<IMAGE_1> is the customer's reference photo: keep the likeness that <IMAGE_0> already has, use <IMAGE_1> only to keep it faithful.` : "",
    input.extraPhoto
      ? `<IMAGE_${input.hasOriginal ? 2 : 1}> is an extra reference photo the customer added for this change — use it for what they describe.`
      : "",
    `Edit <IMAGE_0> to make exactly this change the customer asked for (it may be written in Bulgarian or English): "${input.request}".`,
    "Change only that. Do not add glasses or accessories that are not already there unless asked. Keep everything else the same: the same figurine, style, colors, base, pose and framing, unless the request says otherwise.",
    input.subject === "pet" ? "" : anatomy,
    toy,
    framing,
  ]
    .filter(Boolean)
    .join(" ");
}
