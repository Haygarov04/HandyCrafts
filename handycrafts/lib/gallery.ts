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
  { result: "/real/man-glasses.webp", caption: { bg: "Фигурка на мъж с очила и риза на палми", en: "Figurine of a man in glasses and a palm-print shirt" } },
  { result: "/real/office-panic.webp", caption: { bg: "Фигурка на мъж на бюро с лаптоп и бутон PANIC", en: "Figurine of a man at a desk with a laptop and a PANIC button" } },
  { result: "/real/man-tesla.webp", caption: { bg: "Фигурка на мъж, облегнат на колата си", en: "Figurine of a man leaning on his car" } },
  { result: "/real/man.webp", caption: { bg: "Фигурка на мъж с татуировки, оцветена на ръка", en: "Hand-painted figurine of a man with tattoos" } },
  { result: "/real/sisters.webp", caption: { bg: "Фигурка на сестра и братче", en: "Figurine of a sister and her little brother" } },
  { result: "/real/boy-hat.webp", caption: { bg: "Фигурка на момченце с шапка", en: "Figurine of a little boy in a hat" } },
  { result: "/real/gd-sport.webp", caption: { bg: "Фигурка на жена с табела за юбилей на клуб", en: "Figurine of a woman holding a club anniversary sign" } },
  { result: "/real/girl-jeans.webp", caption: { bg: "Фигурка на момиче с къдрава коса", en: "Figurine of a girl with curly hair" } },
  { result: "/real/woman-green.webp", caption: { bg: "Фигурка на жена със зелен гащеризон", en: "Figurine of a woman in a green jumpsuit" } },
  { result: "/real/girl-waving.webp", caption: { bg: "Фигурка на момиченце с розова рокля, което маха", en: "Figurine of a little girl in a pink dress waving" } },
  { result: "/real/couple-30.webp", caption: { bg: "Фигурка на двойка с табела за 30 години заедно", en: "Figurine of a couple with a 30 years together sign" } },
  { result: "/real/girl-blue.webp", caption: { bg: "Фигурка на момиче с дънков гащеризон", en: "Figurine of a girl in denim overalls" } },
  { result: "/real/girl-skirt.webp", caption: { bg: "Фигурка на момиче с пола на точки", en: "Figurine of a girl in a polka dot skirt" } },
  { result: "/real/woman-black.webp", caption: { bg: "Фигурка на жена с черно яке и дънки", en: "Figurine of a woman in a black jacket and jeans" } },
  { result: "/real/sister-yana.webp", caption: { bg: "Фигурка на жена с табела за сестра", en: "Figurine of a woman holding a sign for her sister" } },
];
