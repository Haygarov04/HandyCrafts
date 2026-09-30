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
  },
  {
    result: "/real/man-keychain.webp",
    caption: { bg: "Фигурка по снимка", en: "Figurine from a photo" },
  },
];
