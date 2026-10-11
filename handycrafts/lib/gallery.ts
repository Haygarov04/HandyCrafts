// Photos of real, finished figurines. The home page shows them right under the hero;
// while this list is empty the section stays hidden. Files go in public/real/ (3:4, 900×1200 webp).

export type RealPiece = {
  /** Photo of the finished figurine. */
  result: string;
  /** The customer's photo it was made from, shown small in the corner (optional, only with their consent). */
  photo?: string;
  /** Alt text; also shown under the photo when `showCaption` is set. */
  caption: { bg: string; en: string };
  showCaption?: boolean;
  note?: { bg: string; en: string };
};

export const realPieces: RealPiece[] = [
  { result: "/real/man.webp", caption: { bg: "Фигурка на мъж с татуировки, оцветена на ръка", en: "Hand-painted figurine of a man with tattoos" } },
  { result: "/real/sisters.webp", caption: { bg: "Фигурка на сестра и братче", en: "Figurine of a sister and her little brother" } },
  { result: "/real/boy-hat.webp", caption: { bg: "Фигурка на момченце с шапка", en: "Figurine of a little boy in a hat" } },
  { result: "/real/girl-jeans.webp", caption: { bg: "Фигурка на момиче с къдрава коса", en: "Figurine of a girl with curly hair" } },
];
