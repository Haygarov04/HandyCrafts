// Photos of real, finished figurines. The home page shows them right under the hero;
// while this list is empty the section stays hidden. Files go in public/real/ (4:5, ~1080×1350 webp).

export type RealPiece = {
  /** Photo of the finished figurine or keychain. */
  result: string;
  /** The customer's photo it was made from, shown small in the corner (optional, only with their consent). */
  photo?: string;
  caption: { bg: string; en: string };
  note?: { bg: string; en: string };
};

export const realPieces: RealPiece[] = [
  {
    result: "/real/couple-keychain.webp",
    caption: { bg: "Ключодържател на двойка", en: "Keychain of a couple" },
    note: { bg: "Оцветен на ръка, по една снимка", en: "Hand-painted, from one photo" },
  },
  {
    result: "/real/man-keychain.webp",
    caption: { bg: "Ключодържател по снимка", en: "Keychain from a photo" },
    note: { bg: "С часовника и вратовръзката от снимката", en: "With the watch and tie from the photo" },
  },
];
