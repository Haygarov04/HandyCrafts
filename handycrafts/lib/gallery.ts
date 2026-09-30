// Photos of real, finished figurines. The home page shows them right under the hero;
// while this list is empty the section stays hidden. Files go in public/real/.

export type RealPiece = {
  /** Photo of the finished figurine or keychain, e.g. "/real/maria.webp". */
  result: string;
  /** The customer's photo it was made from, shown small in the corner (optional). */
  photo?: string;
  caption: { bg: string; en: string };
};

export const realPieces: RealPiece[] = [];
