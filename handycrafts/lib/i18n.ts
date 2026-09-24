import type { ProductId, SubjectId } from "@/lib/catalog";
import { topicSlugs } from "@/lib/topic-slugs";

export type Lang = "bg" | "en";
export const langs: Lang[] = ["bg", "en"];

/** Bulgarian path → English path. Everything else under /en is the same path with the prefix. */
const enPaths: Record<string, string> = {
  "/": "/en",
  "/figurka-po-snimka": "/en/custom-figurine-from-photo",
  "/figurka-na-domashen-lyubimets": "/en/pet-figurine-from-photo",
  "/klyuchodarzhatel-po-snimka": "/en/custom-keychain-from-photo",
  "/personaliziran-podarak": "/en/personalized-gift",
  "/poveritelnost": "/en/privacy",
  "/vrashtane": "/en/returns",
  "/dostavka": "/en/delivery",
};

const bgPaths = Object.fromEntries(Object.entries(enPaths).map(([bg, en]) => [en, bg]));

export function langFromPath(pathname: string): Lang {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "bg";
}

/** Takes a Bulgarian path (with optional ?query or #hash) and returns it for the given language. */
export function localize(lang: Lang, href: string) {
  if (lang === "bg") return href;
  const match = href.match(/^([^?#]*)(.*)$/);
  const path = match?.[1] || "/";
  const rest = match?.[2] || "";
  if (enPaths[path]) return path === "/" && rest.startsWith("#") ? `/en${rest}` : `${enPaths[path]}${rest}`;
  if (path === "/idei") return `/en/ideas${rest}`;
  const topic = path.match(/^\/idei\/([^/]+)$/);
  if (topic && topicSlugs[topic[1]]) return `/en/ideas/${topicSlugs[topic[1]]}${rest}`;
  // City pages exist only in Bulgarian.
  if (path.startsWith("/figurka-po-snimka/")) return "/en/custom-figurine-from-photo";
  return `/en${path}${rest}`;
}

const bgTopics = Object.fromEntries(Object.entries(topicSlugs).map(([bg, en]) => [en, bg]));

/** The same page in the other language, for the BG/EN switch. */
export function switchPath(pathname: string) {
  if (langFromPath(pathname) === "en") {
    if (bgPaths[pathname]) return bgPaths[pathname];
    if (pathname === "/en/ideas") return "/idei";
    const topic = pathname.match(/^\/en\/ideas\/([^/]+)$/);
    if (topic && bgTopics[topic[1]]) return `/idei/${bgTopics[topic[1]]}`;
    return pathname.replace(/^\/en/, "") || "/";
  }
  return localize("en", pathname);
}

/** hreflang links for a Bulgarian path. */
export function alternates(bgPath: string, lang: Lang) {
  const en = localize("en", bgPath);
  return {
    canonical: lang === "en" ? en : bgPath,
    languages: { bg: bgPath, en, "x-default": bgPath },
  };
}

const bg = {
  htmlLang: "bg",
  ogLocale: "bg_BG",
  cm: "см",
  from: "от",
  money: (value: number) => `${value} €`,
  itemLabel: (product: ProductId, subject: SubjectId = "person") =>
    ({ figurine: "Фигурка", keychain: "Ключодържател" })[product] + (subject === "pet" ? " на любимец" : ""),
  product: {
    figurine: { label: "Фигурка", short: "Цяла фигура върху основа" },
    keychain: { label: "Ключодържател", short: "Мини фигура с халка" },
  } as Record<ProductId, { label: string; short: string }>,
  delivery: { econt: "Офис на Еконт", speedy: "Офис на Спиди", address: "До адрес" },
  meta: {
    title: "Фигурки и ключодържатели по снимка от 30 € | HandyCrafts",
    description:
      "3D фигурка или ключодържател по твоя снимка от 30 €. Виждаш визуализацията за минута, плащаш с наложен платеж. Изработено на ръка в Русе, доставка в цяла България.",
    ogTitle: "HandyCrafts — фигурка по снимка",
    ogDescription: "Качи снимка, виж фигурката си веднага и я поръчай с наложен платеж.",
    studioTitle: "Създай фигурка по снимка",
    studioDescription:
      "Качи снимка и за минута виж как ще изглежда твоята 3D фигурка или ключодържател. Човек или домашен любимец, от 30 €. Плащане с наложен платеж.",
    contactTitle: "Контакти",
    contactDescription: "Въпрос за фигурка по снимка, поръчка на няколко души или по-голям размер? Пиши на HandyCrafts, Русе.",
    termsTitle: "Общи условия",
    termsDescription:
      "Условия за поръчка на персонализирани фигурки и ключодържатели: цени, наложен платеж, срокове, снимки и лични данни.",
    cartTitle: "Количка",
    thanksTitle: "Благодарим!",
    storeDescription: "3D фигурки и ключодържатели по снимка на хора и домашни любимци, изработени на ръка.",
    country: "България",
    payment: "Наложен платеж",
  },
  nav: {
    figurines: "Фигурки",
    pets: "Любимци",
    keychains: "Ключодържатели",
    how: "Как работи",
    faq: "Въпроси",
    contact: "Контакти",
    order: "Поръчай",
    openMenu: "Отвори менюто",
    closeMenu: "Затвори менюто",
    cart: (count: number) => `Количка, ${count} продукта`,
    switchTo: "EN",
    switchLabel: "English version",
  },
  footer: {
    about: "Фигурки и ключодържатели по снимка, изработени в Русе. Виждаш визуализацията веднага и плащаш с наложен платеж.",
    shop: "Магазин",
    contact: "Контакт",
    city: "Русе, България",
    write: "Пиши ни",
    terms: "Общи условия",
    bottom: "Наложен платеж · Еконт и Спиди",
  },
  drawer: {
    title: "Количка",
    close: "Затвори",
    closeCart: "Затвори количката",
    empty: "Количката е празна",
    emptyText: "Качи снимка, виж визуализацията и добави фигурката тук.",
    create: "Създай фигурка",
    remove: "Махни",
    each: "бр.",
    total: "Общо",
    shipping: "+ доставка по тарифа на куриера. Плащаш при получаване.",
    checkout: "Към поръчката",
    keepBrowsing: "Продължи да разглеждаш",
  },
  qty: { less: "Намали", more: "Увеличи" },
  home: {
    heroTitle: ["Твоята фигурка", "по една снимка."],
    heroText: "Качваш снимка, за минута виждаш фигурката и плащаш чак при доставка.",
    create: "Създай фигурка",
    pricesFrom: "Цени от",
    heroAlt: "Фигурка на момиче с къдрава коса до снимката, по която е направена",
    heroBadge: "Виждаш фигурката преди да поръчаш",
    perks: [
      { icon: "◎", title: "Виждаш я веднага", text: "Визуализация за около минута" },
      { icon: "€", title: "Наложен платеж", text: "Плащаш, когато я получиш" },
      { icon: "✦", title: "Ръчно довършена", text: "Всяка фигурка минава през ръце" },
      { icon: "➜", title: "Еконт и Спиди", text: "Изпращаме за 7–12 работни дни" },
    ],
    productsTitle: ["Три начина", "да го запазиш."],
    productsText: "Фигурка за рафта, любимец за спомен или ключодържател за джоба.",
    products: [
      { title: "Фигурки по снимка", text: "Ти, половинката ти или цялото семейство — на рафта." },
      { title: "Любимци", text: "Кучето или котката ти, с всяко петно на козината." },
      { title: "Ключодържатели", text: "Малка версия, която пътува с ключовете ти." },
    ],
    sizeTitle: "Колко голяма е?",
    sizeKeychain: "ключодържател",
    sizeFigurine: "фигурка",
    howTitle: ["От снимка", "до кутия."],
    processAlt: "Снимка на човек и готовата му фигурка една до друга",
    steps: [
      { title: "Качваш снимка", text: "Една ясна снимка на човека или любимеца." },
      { title: "Одобряваш визуализацията", text: "Виждаш я за минута. Поръчваш само ако ти харесва." },
      { title: "Получаваш по куриер", text: "Изработваме я на ръка и я пращаме с Еконт или Спиди." },
    ],
    madeTitle: "Изработено в Русе.",
    madeText: "Всяка фигурка минава през нашите ръце, преди да тръгне към теб.",
    startWithPhoto: "Започни със снимка",
    giftKicker: "Търсиш подарък? ♡",
    giftTitle: ["Подарък, който", "никой друг няма."],
    occasions: ["Рожден ден", "Годишнина", "Сватба", "Свети Валентин", "Коледа", "Абитуриент", "За колега", "За баба и дядо"],
    giftButton: "Започни подаръка",
    keychainAlt: "Ключодържател по снимка",
    faqKicker: "Въпроси",
    faqTitle: "Често питат",
    faqMore: "Друго? Пиши ни на",
    productFigurineName: "Персонализирана 3D фигурка по снимка",
    productFigurineText: "3D фигурка на човек или домашен любимец по снимка, 10, 15 или 20 см.",
    productKeychainName: "Персонализиран 3D ключодържател по снимка",
    productKeychainText: "Мини фигурка с метална халка по снимка на човек или любимец, 5 или 6 см.",
  },
  faq: [
    {
      q: "Каква снимка работи най-добре?",
      a: "Ясна снимка на дневна светлина, лицето гледа напред и се вижда цялото. За фигурка в цял ръст е добре да се виждат и краката. Без слънчеви очила и силни филтри.",
    },
    {
      q: "Ще видя ли фигурката, преди да поръчам?",
      a: "Да. След като качиш снимката, за около минута получаваш визуализация на фигурката. Ако не ти харесва, промени описанието и я направи отново. Поръчваш само когато си доволен.",
    },
    {
      q: "Колко струва и как се плаща?",
      a: "Фигурка 10 см е 50 €, 15 см е 80 €, 20 см е 100 €. Ключодържател 5 см е 30 €, 6 см е 40 €. Плащаш с наложен платеж при получаване. Доставката е по тарифа на Еконт или Спиди.",
    },
    {
      q: "За колко време става?",
      a: "Обикновено 7–12 работни дни от потвърждението по телефона до изпращането. Ако ти трябва за конкретна дата, напиши го в бележката към поръчката.",
    },
    {
      q: "Колко точно ще прилича готовата фигурка на визуализацията?",
      a: "Визуализацията показва стила, позата и дрехите. Готовата фигурка се моделира и довършва на ръка по нея и по оригиналната снимка, затова малки разлики в детайлите са нормални.",
    },
    {
      q: "Правите ли фигурки на домашни любимци?",
      a: "Да. В студиото избери „Домашен любимец“ и качи снимка, на която се вижда цялото животно и муцуната. Цените са същите като за човек.",
    },
    {
      q: "Може ли няколко души или човек с любимеца си в една фигурка?",
      a: "Засега студиото прави по един герой. За двойка, семейство или човек с кучето си направи отделни фигурки или ни пиши и ще ти дадем цена.",
    },
  ],
  studio: {
    steps: ["Продукт", "Снимка", "Детайли", "Визуализация"],
    close: "Затвори студиото",
    chooseTitle: "Какво да направим?",
    chooseText: "Избери кого, формата и размера. Цената е крайна за изработката.",
    person: "Човек",
    pet: "Домашен любимец",
    size: "Размер",
    uploadTitle: "Качи снимка",
    uploaded: "Качената снимка",
    pick: "Избери снимка",
    formats: "JPG, PNG или WEBP до 8 MB",
    change: "Смени снимката",
    private: "Снимката се пази затворена и се ползва само за твоята поръчка.",
    detailsTitle: "Детайли",
    detailsText: "По желание. Остави празно и ще копираме снимката.",
    pose: "Поза",
    disabled: "Визуализациите са временно изключени. Пиши ни на handycraftshelp@gmail.com със снимката.",
    making: "Създаваме фигурката…",
    yours: "Твоята фигурка",
    previewAlt: "Визуализация на фигурката",
    aboutMinute: "Около минута",
    noPreview: "Няма визуализация.",
    previewNote: "Визуализацията показва стила и позата. Готовата фигурка се довършва на ръка по нея.",
    editDetails: "Промени детайлите",
    retry: "Нов опит",
    added: "Добавено в количката ✓",
    checkout: "Към поръчката",
    another: "Направи още една",
    back: "‹ Назад",
    next: "Напред →",
    create: "Създай ✦",
    addToCart: "В количката",
    addedShort: "Добавено ✓",
    badType: "Качи снимка в JPG, PNG или WEBP.",
    tooBig: "Снимката е над 8 MB. Избери по-малка.",
    failed: "Визуализацията не се получи.",
    wrong: "Нещо се обърка.",
    copy: {
      person: {
        photo: "Един човек, лицето отпред и на светло. За фигурка в цял ръст — снимка от главата до краката.",
        tips: ["✓ Ясно лице", "✓ Дневна светлина", "✗ Без тъмни очила"],
        extrasLabel: "Дрехи и аксесоари",
        extrasHint: "Напр. бяла риза, тъмни дънки, червени кецове, държи букет",
        poseHint: "Напр. стои изправен и маха с ръка",
        poses: ["Стои естествено", "Ръце на кръста", "Маха с ръка", "Ръце в джобовете", "Скръстени ръце"],
      },
      pet: {
        photo: "Едно животно, цялото в кадъра, на светло. Най-добре муцуната гледа към теб.",
        tips: ["✓ Цялото животно", "✓ Ясни очи и муцуна", "✓ Истинските цветове"],
        extrasLabel: "Аксесоари",
        extrasHint: "Напр. червен нашийник, бандана с име, звънче",
        poseHint: "Напр. седи и гледа нагоре",
        poses: ["Седи", "Лежи", "Стои на четири лапи", "С топка в устата", "Наклонена глава"],
      },
    },
  },
  cart: {
    emptyTitle: "Количката е празна",
    emptyText: "Качи снимка, виж визуализацията и я добави тук.",
    create: "Създай фигурка",
    title: "Поръчка",
    intro: "Плащаш с наложен платеж при получаване. Ще ти се обадим, за да потвърдим.",
    you: "Твоите данни",
    name: "Име и фамилия",
    phone: "Телефон",
    email: "Имейл (за потвърждение)",
    delivery: "Доставка",
    city: "Град",
    street: "Улица, номер, вход, етаж",
    office: "Кой офис (име или адрес)",
    note: "Бележка (по желание) — напр. трябва ми до 14 февруари",
    payment: "Плащане",
    cod: "Наложен платеж",
    codText: "Плащаш на куриера при получаване",
    agree: ["Приемам", "общите условия", "и", "политиката за поверителност", "и разбирам, че фигурката се изработва по моя снимка и не подлежи на връщане без причина."],
    newsletter: "Искам да получавам идеи за подаръци по имейл (около веднъж в месеца).",
    mustAgree: "Потвърди общите условия.",
    sending: "Изпращаме…",
    submit: "Поръчка със задължение за плащане ·",
    failed: "Поръчката не мина.",
    inCart: "В количката",
    remove: "Махни",
    products: "Продукти",
    shipping: "Доставка",
    shippingValue: "по тарифа на куриера",
    total: "Общо",
    timing: "Изработка и изпращане: 7–12 работни дни.",
    addMore: "+ Добави още една фигурка",
  },
  thanks: {
    title: "Благодарим!",
    accepted: (n: string) => ["Поръчка", n, "е приета."],
    steps: [
      "① Ще ти се обадим в работно време, за да потвърдим поръчката.",
      "② Изработваме фигурката на ръка — 7–12 работни дни.",
      "③ Изпращаме с куриер. Плащаш при получаване.",
    ],
    home: "Към началото",
  },
  contact: {
    kicker: "Контакти",
    title: "Пиши ни",
    text: "Въпрос за поръчка, фигурка на няколко души или по-голям размер? Пиши ни и ще отговорим в рамките на работния ден.",
    email: "Имейл:",
    workshop: "Работилница:",
    city: "Русе, България",
    name: "Име",
    mail: "Имейл",
    phone: "Телефон (по желание)",
    message: "Съобщение",
    sending: "Изпращане…",
    send: "Изпрати",
    sent: "Съобщението е изпратено. Ще ти отговорим скоро.",
    failed: "Грешка при изпращане.",
  },
  landing: {
    home: "Начало",
    breadcrumbs: "Навигация",
    how: "Как става",
    faq: "Въпроси",
    more: "Виж още",
    free: "Визуализацията е безплатна. Плащаш при получаване.",
    steps: [
      ["01", "Качваш снимка", "Една ясна снимка стига. Можеш да опишеш дрехи, поза или аксесоари."],
      ["02", "Виждаш визуализация", "За около минута. Не ти харесва? Промени описанието и опитай пак."],
      ["03", "Поръчваш с наложен платеж", "Потвърждаваме по телефона, изработваме за 7–12 работни дни и пращаме с куриер."],
    ],
  },
};

export type Dict = typeof bg;

const en: Dict = {
  htmlLang: "en",
  ogLocale: "en_US",
  cm: "cm",
  from: "from",
  money: (value: number) => `€${value}`,
  itemLabel: (product, subject = "person") =>
    subject === "pet"
      ? ({ figurine: "Pet figurine", keychain: "Pet keychain" })[product]
      : ({ figurine: "Figurine", keychain: "Keychain" })[product],
  product: {
    figurine: { label: "Figurine", short: "Full figure on a base" },
    keychain: { label: "Keychain", short: "Mini figure with a ring" },
  },
  delivery: { econt: "Econt office", speedy: "Speedy office", address: "To an address" },
  meta: {
    title: "Custom figurines and keychains from a photo, from €30 | HandyCrafts",
    description:
      "A 3D figurine or keychain made from your photo, from €30. See the preview in a minute and pay cash on delivery. Handmade in Ruse, Bulgaria.",
    ogTitle: "HandyCrafts — a figurine from your photo",
    ogDescription: "Upload a photo, see your figurine right away and order with cash on delivery.",
    studioTitle: "Create a figurine from a photo",
    studioDescription:
      "Upload a photo and see your 3D figurine or keychain in about a minute. A person or a pet, from €30. Cash on delivery.",
    contactTitle: "Contact",
    contactDescription: "A question about a custom figurine, a group order or a bigger size? Write to HandyCrafts in Ruse, Bulgaria.",
    termsTitle: "Terms and conditions",
    termsDescription: "Terms for ordering custom figurines and keychains: prices, cash on delivery, timing, photos and personal data.",
    cartTitle: "Cart",
    thanksTitle: "Thank you!",
    storeDescription: "Custom 3D figurines and keychains of people and pets made from a photo and finished by hand.",
    country: "Bulgaria",
    payment: "Cash on delivery",
  },
  nav: {
    figurines: "Figurines",
    pets: "Pets",
    keychains: "Keychains",
    how: "How it works",
    faq: "FAQ",
    contact: "Contact",
    order: "Order",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    cart: (count) => `Cart, ${count} items`,
    switchTo: "BG",
    switchLabel: "Българска версия",
  },
  footer: {
    about: "Figurines and keychains made from a photo in Ruse, Bulgaria. See the preview right away and pay cash on delivery.",
    shop: "Shop",
    contact: "Contact",
    city: "Ruse, Bulgaria",
    write: "Write to us",
    terms: "Terms and conditions",
    bottom: "Cash on delivery · Econt and Speedy",
  },
  drawer: {
    title: "Cart",
    close: "Close",
    closeCart: "Close cart",
    empty: "Your cart is empty",
    emptyText: "Upload a photo, see the preview and add the figurine here.",
    create: "Create a figurine",
    remove: "Remove",
    each: "each",
    total: "Total",
    shipping: "+ courier delivery fee. You pay when it arrives.",
    checkout: "Checkout",
    keepBrowsing: "Keep browsing",
  },
  qty: { less: "Decrease", more: "Increase" },
  home: {
    heroTitle: ["Your figurine,", "from one photo."],
    heroText: "Upload a photo, see your figurine in a minute and pay only on delivery.",
    create: "Create a figurine",
    pricesFrom: "Prices from",
    heroAlt: "Figurine of a girl with curly hair next to the photo it was made from",
    heroBadge: "See the figurine before you order",
    perks: [
      { icon: "◎", title: "See it right away", text: "A preview in about a minute" },
      { icon: "€", title: "Cash on delivery", text: "Pay when it arrives" },
      { icon: "✦", title: "Finished by hand", text: "Every figurine passes through our hands" },
      { icon: "➜", title: "Econt and Speedy", text: "Shipped in 7–12 working days" },
    ],
    productsTitle: ["Three ways", "to keep it."],
    productsText: "A figurine for the shelf, a pet keepsake or a keychain for your pocket.",
    products: [
      { title: "Figurines from a photo", text: "You, your partner or the whole family — on the shelf." },
      { title: "Pets", text: "Your dog or cat, down to every spot on the fur." },
      { title: "Keychains", text: "A tiny version that travels with your keys." },
    ],
    sizeTitle: "How big is it?",
    sizeKeychain: "keychain",
    sizeFigurine: "figurine",
    howTitle: ["From photo", "to parcel."],
    processAlt: "Photo of a man next to his finished figurine",
    steps: [
      { title: "You upload a photo", text: "One clear photo of the person or pet." },
      { title: "You approve the preview", text: "See it in a minute. Order only if you like it." },
      { title: "It arrives by courier", text: "We make it by hand and ship it with Econt or Speedy." },
    ],
    madeTitle: "Made in Ruse.",
    madeText: "Every figurine passes through our hands before it heads to you.",
    startWithPhoto: "Start with a photo",
    giftKicker: "Looking for a gift? ♡",
    giftTitle: ["A gift nobody", "else has."],
    occasions: ["Birthday", "Anniversary", "Wedding", "Valentine's Day", "Christmas", "Graduation", "For a colleague", "For grandparents"],
    giftButton: "Start the gift",
    keychainAlt: "Keychain made from a photo",
    faqKicker: "FAQ",
    faqTitle: "Common questions",
    faqMore: "Something else? Write to",
    productFigurineName: "Custom 3D figurine from a photo",
    productFigurineText: "A 3D figurine of a person or pet made from a photo, 10, 15 or 20 cm.",
    productKeychainName: "Custom 3D keychain from a photo",
    productKeychainText: "A mini figurine with a metal ring made from a photo of a person or pet, 5 or 6 cm.",
  },
  faq: [
    {
      q: "What kind of photo works best?",
      a: "A clear photo in daylight with the face looking forward and fully visible. For a full-body figurine, the feet should be in the shot too. No sunglasses or heavy filters.",
    },
    {
      q: "Will I see the figurine before I order?",
      a: "Yes. After you upload a photo you get a preview of the figurine in about a minute. If you don't like it, change the description and try again. You only order when you're happy.",
    },
    {
      q: "How much does it cost and how do I pay?",
      a: "A figurine is €50 for 10 cm, €80 for 15 cm and €100 for 20 cm. A keychain is €30 for 5 cm and €40 for 6 cm. You pay cash on delivery. Delivery is charged at the Econt or Speedy rate.",
    },
    {
      q: "How long does it take?",
      a: "Usually 7–12 working days from the phone confirmation to shipping. If you need it by a certain date, add it to the order note.",
    },
    {
      q: "How closely will the finished figurine match the preview?",
      a: "The preview shows the style, pose and clothes. The finished figurine is modelled and finished by hand from it and from the original photo, so small differences in detail are normal.",
    },
    {
      q: "Do you make pet figurines?",
      a: "Yes. In the studio choose “Pet” and upload a photo that shows the whole animal and its face. Prices are the same as for a person.",
    },
    {
      q: "Can several people, or a person with their pet, be in one figurine?",
      a: "For now the studio makes one character at a time. For a couple, a family or a person with their dog, make separate figurines or write to us for a quote.",
    },
  ],
  studio: {
    steps: ["Product", "Photo", "Details", "Preview"],
    close: "Close the studio",
    chooseTitle: "What shall we make?",
    chooseText: "Choose who, the product and the size. The price covers the whole piece.",
    person: "Person",
    pet: "Pet",
    size: "Size",
    uploadTitle: "Upload a photo",
    uploaded: "Your uploaded photo",
    pick: "Choose a photo",
    formats: "JPG, PNG or WEBP up to 8 MB",
    change: "Change photo",
    private: "Your photo is stored privately and used only for your order.",
    detailsTitle: "Details",
    detailsText: "Optional. Leave it empty and we'll follow the photo.",
    pose: "Pose",
    disabled: "Previews are switched off for now. Email us at handycraftshelp@gmail.com with your photo.",
    making: "Creating your figurine…",
    yours: "Your figurine",
    previewAlt: "Preview of the figurine",
    aboutMinute: "About a minute",
    noPreview: "No preview yet.",
    previewNote: "The preview shows the style and pose. The finished figurine is completed by hand from it.",
    editDetails: "Edit details",
    retry: "Try again",
    added: "Added to cart ✓",
    checkout: "Checkout",
    another: "Make another one",
    back: "‹ Back",
    next: "Next →",
    create: "Create ✦",
    addToCart: "Add to cart",
    addedShort: "Added ✓",
    badType: "Please upload a JPG, PNG or WEBP photo.",
    tooBig: "The photo is over 8 MB. Choose a smaller one.",
    failed: "The preview didn't work.",
    wrong: "Something went wrong.",
    copy: {
      person: {
        photo: "One person, face forward and well lit. For a full-body figurine, use a photo from head to toe.",
        tips: ["✓ Clear face", "✓ Daylight", "✗ No sunglasses"],
        extrasLabel: "Clothes and accessories",
        extrasHint: "E.g. white shirt, dark jeans, red sneakers, holding flowers",
        poseHint: "E.g. standing straight and waving",
        poses: ["Standing naturally", "Hands on hips", "Waving", "Hands in pockets", "Arms crossed"],
      },
      pet: {
        photo: "One animal, fully in the shot and well lit. Best if the face looks at the camera.",
        tips: ["✓ Whole animal", "✓ Clear eyes and face", "✓ True colours"],
        extrasLabel: "Accessories",
        extrasHint: "E.g. red collar, bandana with a name, a little bell",
        poseHint: "E.g. sitting and looking up",
        poses: ["Sitting", "Lying down", "Standing", "Ball in mouth", "Head tilted"],
      },
    },
  },
  cart: {
    emptyTitle: "Your cart is empty",
    emptyText: "Upload a photo, see the preview and add it here.",
    create: "Create a figurine",
    title: "Checkout",
    intro: "You pay cash on delivery. We'll call you to confirm the order.",
    you: "Your details",
    name: "Full name",
    phone: "Phone",
    email: "Email (for the confirmation)",
    delivery: "Delivery",
    city: "City",
    street: "Street, number, entrance, floor",
    office: "Which office (name or address)",
    note: "Note (optional) — e.g. I need it by 14 February",
    payment: "Payment",
    cod: "Cash on delivery",
    codText: "Pay the courier when it arrives",
    agree: ["I accept the", "terms and conditions", "and the", "privacy policy", "and understand that the figurine is made from my photo and can't be returned without a reason."],
    newsletter: "Send me gift ideas by email (about once a month).",
    mustAgree: "Please accept the terms and conditions.",
    sending: "Sending…",
    submit: "Order with obligation to pay ·",
    failed: "The order didn't go through.",
    inCart: "In your cart",
    remove: "Remove",
    products: "Products",
    shipping: "Delivery",
    shippingValue: "courier rate",
    total: "Total",
    timing: "Making and shipping: 7–12 working days.",
    addMore: "+ Add another figurine",
  },
  thanks: {
    title: "Thank you!",
    accepted: (n) => ["Order", n, "is confirmed."],
    steps: [
      "① We'll call you during working hours to confirm the order.",
      "② We make the figurine by hand — 7–12 working days.",
      "③ We ship it by courier. You pay when it arrives.",
    ],
    home: "Back to home",
  },
  contact: {
    kicker: "Contact",
    title: "Write to us",
    text: "A question about an order, a figurine of several people or a bigger size? Write to us and we'll reply within the working day.",
    email: "Email:",
    workshop: "Workshop:",
    city: "Ruse, Bulgaria",
    name: "Name",
    mail: "Email",
    phone: "Phone (optional)",
    message: "Message",
    sending: "Sending…",
    send: "Send",
    sent: "Message sent. We'll get back to you soon.",
    failed: "Sending failed.",
  },
  landing: {
    home: "Home",
    breadcrumbs: "Breadcrumbs",
    how: "How it works",
    faq: "Questions",
    more: "See also",
    free: "The preview is free. You pay when it arrives.",
    steps: [
      ["01", "Upload a photo", "One clear photo is enough. You can describe clothes, pose or accessories."],
      ["02", "See the preview", "In about a minute. Don't like it? Change the description and try again."],
      ["03", "Order with cash on delivery", "We confirm by phone, make it in 7–12 working days and ship by courier."],
    ],
  },
};

export const dict: Record<Lang, Dict> = { bg, en };
