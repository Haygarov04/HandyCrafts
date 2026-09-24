/** Bulgarian → English slugs of the /idei topic pages. Kept small so client code can import it. */
export const topicSlugs: Record<string, string> = {
  "figurka-za-svatbena-torta": "wedding-cake-topper",
  "figurka-na-dvoyka": "couple-figurine",
  "podarak-za-godishnina": "anniversary-gift",
  "podarak-za-rozhden-den": "birthday-gift",
  "podarak-za-sveti-valentin": "valentines-day-gift",
  "koleden-podarak": "christmas-gift",
  "podarak-za-abiturient": "graduation-gift",
  "figurka-na-dete": "child-figurine",
  "podarak-za-baba-i-dyado": "gift-for-grandparents",
  "figurka-na-kuche": "dog-figurine",
  "figurka-na-kotka": "cat-figurine",
  "figurka-v-pamet-na-lyubimets": "pet-memorial-figurine",
  "podarak-za-kolega": "gift-for-a-colleague",
  "figurka-po-profesiya": "profession-figurine",
  "podarak-za-mazh": "gift-for-him",
  "podarak-za-zhena": "gift-for-her",
};

/** Bulgarian city pages under /figurka-po-snimka/<slug>. */
export const citySlugs = ["sofia", "plovdiv", "varna", "burgas", "ruse", "stara-zagora", "pleven", "veliko-tarnovo"] as const;
