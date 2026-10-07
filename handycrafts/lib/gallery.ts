// Photos of real, finished figurines. The home page shows them right under the hero;
// while this list is empty the section stays hidden. Files go in public/real/ (4:5, ~1080×1350 webp).

export type RealPiece = {
  /** Photo of the finished figurine. */
  result: string;
  /** The customer's photo it was made from, shown small in the corner (optional, only with their consent). */
  photo?: string;
  caption: { bg: string; en: string };
  note?: { bg: string; en: string };
};

// Add photos of finished figurines here (the earlier keychain photos were removed with the keychains).
export const realPieces: RealPiece[] = [];
