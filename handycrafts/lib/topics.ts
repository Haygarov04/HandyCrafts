import type { LandingContent } from "@/app/components/Landing";
import type { ProductId } from "@/lib/catalog";
import type { Lang } from "@/lib/i18n";
import { topicSlugs } from "@/lib/topic-slugs";

type Img = "figurine" | "pet" | "keychain" | "hero" | "process" | "petKeychain";

const images: Record<Img, { src: string; ratio: string }> = {
  figurine: { src: "/shop/figurine.webp", ratio: "aspect-[9/16] max-h-[36rem]" },
  pet: { src: "/shop/pet.webp", ratio: "aspect-[16/9]" },
  keychain: { src: "/shop/keychain.webp", ratio: "aspect-[9/16] max-h-[36rem]" },
  hero: { src: "/shop/hero-mobile.webp", ratio: "aspect-[9/16] max-h-[36rem]" },
  process: { src: "/shop/process-mobile.webp", ratio: "aspect-[9/16] max-h-[36rem]" },
  petKeychain: { src: "/shop/pet-keychain.webp", ratio: "aspect-[9/16] max-h-[36rem]" },
};

type Copy = {
  crumb: string;
  metaTitle: string;
  kicker: string;
  title: string;
  lead: string;
  cta: string;
  alt: string;
  sections: { title: string; text: string[] }[];
  faq: { q: string; a: string }[];
};

type Topic = {
  slug: string;
  product: ProductId;
  pet?: boolean;
  image: Img;
  bg: Copy;
  en: Copy;
};

const priceBg = {
  figurine: "Фигурка 10 см е 50 €, 15 см е 80 €, 20 см е 100 €.",
  keychain: "Ключодържател 5 см е 30 €, 6 см е 40 €.",
};
const priceEn = {
  figurine: "A figurine is €50 for 10 cm, €80 for 15 cm and €100 for 20 cm.",
  keychain: "A keychain is €30 for 5 cm and €40 for 6 cm.",
};

const topics: Topic[] = [
  {
    slug: "figurka-za-svatbena-torta",
    product: "figurine",
    image: "figurine",
    bg: {
      crumb: "Фигурка за сватбена торта",
      metaTitle: "Фигурка за сватбена торта по снимка на младоженците",
      kicker: "Сватба",
      title: "Фигурки за сватбена торта по снимка",
      lead: "Младоженците върху тортата — с истинските им лица, роклята и костюма. След сватбата фигурките остават на рафта като спомен.",
      cta: "Направи фигурките",
      alt: "Фигурки на двойка по снимка за сватбена торта",
      sections: [
        { title: "Как става", text: ["Качваш снимка на булката и отделно на младоженеца (студиото прави по един човек) и описваш роклята, костюма и позата. След минута виждаш визуализация на всяка фигурка.", "За тортата препоръчваме размер 10 или 15 см — достатъчно стабилни и лесни за поставяне."] },
        { title: "Кога да поръчаш", text: ["Поръчай поне 3 седмици преди сватбата. Напиши датата в бележката към поръчката и ще се съобразим."] },
      ],
      faq: [
        { q: "Може ли двамата на една основа?", a: "Студиото прави по един човек. Пиши ни за обща основа и ще ти дадем цена." },
        { q: "Безопасни ли са върху торта?", a: "Фигурките не са за консумация. Поставяй ги върху подложка или диск, а не директно в крема." },
        { q: "Колко струват?", a: priceBg.figurine },
      ],
    },
    en: {
      crumb: "Wedding cake topper",
      metaTitle: "Custom wedding cake topper from a photo of the couple",
      kicker: "Wedding",
      title: "Wedding cake toppers made from your photo",
      lead: "The bride and groom on top of the cake — with their real faces, the dress and the suit. After the wedding they stay on the shelf as a keepsake.",
      cta: "Make the toppers",
      alt: "Couple figurines made from a photo as a wedding cake topper",
      sections: [
        { title: "How it works", text: ["Upload a photo of the bride and a separate one of the groom (the studio makes one person at a time) and describe the dress, suit and pose. You see a preview of each figurine in a minute.", "For a cake we recommend 10 or 15 cm — stable and easy to place."] },
        { title: "When to order", text: ["Order at least 3 weeks before the wedding and add the date to the order note."] },
      ],
      faq: [
        { q: "Can both be on one base?", a: "The studio makes one person at a time. Write to us for a shared base and we'll send a quote." },
        { q: "Are they safe on a cake?", a: "The figurines are not edible. Place them on a small board or disc, not directly in the cream." },
        { q: "How much are they?", a: priceEn.figurine },
      ],
    },
  },
  {
    slug: "figurka-na-dvoyka",
    product: "figurine",
    image: "figurine",
    bg: {
      crumb: "Фигурка на двойка",
      metaTitle: "Фигурка на двойка по снимка — подарък за половинката",
      kicker: "За двама",
      title: "Фигурка на двойка по снимка",
      lead: "Ти и половинката ти в мини версия — с дрехите, прическите и усмивките от любимата ви снимка.",
      cta: "Направи двойката",
      alt: "Фигурка на двойка, хваната за ръце",
      sections: [
        { title: "Две фигурки, една история", text: ["Студиото прави всеки човек поотделно, така че всяка фигурка е с максимален детайл. Поставени една до друга, изглеждат като двойка.", "Добави ги в количката заедно и поръчай наведнъж."] },
        { title: "Идеи", text: ["Годишнина, годеж, Свети Валентин, нов дом — или просто за да ви има на рафта."] },
      ],
      faq: [
        { q: "Може ли на една основа?", a: "Пиши ни и ще ти дадем цена за обща основа." },
        { q: "Трябва ли снимка на двамата заедно?", a: "Най-добре по една ясна снимка на всеки, в цял ръст." },
        { q: "Колко струва?", a: priceBg.figurine + " За двойка се поръчват две фигурки." },
      ],
    },
    en: {
      crumb: "Couple figurine",
      metaTitle: "Couple figurine from a photo — a gift for your partner",
      kicker: "For two",
      title: "A couple figurine from your photo",
      lead: "You and your partner in mini — with the clothes, hair and smiles from your favourite photo.",
      cta: "Make the couple",
      alt: "Couple figurine holding hands",
      sections: [
        { title: "Two figurines, one story", text: ["The studio makes each person separately, so every figurine gets full detail. Side by side, they look like a couple.", "Add both to the cart and order together."] },
        { title: "Ideas", text: ["An anniversary, an engagement, Valentine's Day, a new home — or just to have you both on the shelf."] },
      ],
      faq: [
        { q: "Can they be on one base?", a: "Write to us for a quote on a shared base." },
        { q: "Do I need a photo of both together?", a: "Ideally one clear full-body photo of each person." },
        { q: "How much is it?", a: priceEn.figurine + " A couple is two figurines." },
      ],
    },
  },
  {
    slug: "podarak-za-godishnina",
    product: "figurine",
    image: "figurine",
    bg: {
      crumb: "Подарък за годишнина",
      metaTitle: "Подарък за годишнина — фигурка по снимка",
      kicker: "Годишнина",
      title: "Подарък за годишнина, който никой друг няма",
      lead: "Фигурка на двама ви или на него/нея по ваша снимка. Виждаш визуализацията веднага и плащаш при доставка.",
      cta: "Направи подаръка",
      alt: "Фигурка на двойка като подарък за годишнина",
      sections: [
        { title: "Защо фигурка", text: ["Цветята увяхват, а фигурката остава. Направена е по конкретна снимка — от сватбата, от първата ви почивка, от вчера."] },
        { title: "Навреме", text: ["Изработката е 7–12 работни дни. Напиши датата на годишнината в бележката и ще ти кажем дали успяваме."] },
      ],
      faq: [
        { q: "Какво да подаря за първа годишнина?", a: "Фигурка на двама ви (две фигурки) или ключодържател с мини версията му/ѝ." },
        { q: "Ще го види ли преди подаръка?", a: "Не. Визуализацията виждаш само ти." },
        { q: "Колко струва?", a: priceBg.figurine },
      ],
    },
    en: {
      crumb: "Anniversary gift",
      metaTitle: "Anniversary gift — a figurine from your photo",
      kicker: "Anniversary",
      title: "An anniversary gift nobody else has",
      lead: "A figurine of the two of you, or of them, made from your photo. See the preview right away and pay on delivery.",
      cta: "Make the gift",
      alt: "Couple figurine as an anniversary gift",
      sections: [
        { title: "Why a figurine", text: ["Flowers fade, a figurine stays. It's made from a specific photo — from the wedding, your first trip, yesterday."] },
        { title: "On time", text: ["Making takes 7–12 working days. Add the anniversary date to the order note and we'll tell you if we can make it."] },
      ],
      faq: [
        { q: "What should I give for a first anniversary?", a: "A figurine of the two of you (two figurines) or a keychain with a mini version of them." },
        { q: "Will they see it before?", a: "No. Only you see the preview." },
        { q: "How much is it?", a: priceEn.figurine },
      ],
    },
  },
  {
    slug: "podarak-za-rozhden-den",
    product: "figurine",
    image: "hero",
    bg: {
      crumb: "Подарък за рожден ден",
      metaTitle: "Оригинален подарък за рожден ден — фигурка по снимка",
      kicker: "Рожден ден",
      title: "Оригинален подарък за рожден ден",
      lead: "Фигурка на рожденика по негова снимка — с любимите му дрехи, хоби или предмет в ръката.",
      cta: "Направи подаръка",
      alt: "Фигурка на момиче до снимката ѝ — подарък за рожден ден",
      sections: [
        { title: "Персонално до детайла", text: ["Опиши в студиото какво обича рожденикът — китара, топка, чаша кафе, любимата тениска — и то ще е във визуализацията."] },
        { title: "За всяка възраст", text: ["За дете, приятелка, мама, татко или колега. Ако бюджетът е по-малък, ключодържателят е от 30 €."] },
      ],
      faq: [
        { q: "Ще стане ли до рождения ден?", a: "Изработката е 7–12 работни дни плюс 1–2 дни доставка. Напиши датата в бележката." },
        { q: "Може ли с надпис?", a: "Пиши ни за надпис върху основата и ще ти кажем възможно ли е." },
        { q: "Колко струва?", a: priceBg.figurine + " " + priceBg.keychain },
      ],
    },
    en: {
      crumb: "Birthday gift",
      metaTitle: "A unique birthday gift — a figurine from a photo",
      kicker: "Birthday",
      title: "A unique birthday gift",
      lead: "A figurine of the birthday person made from their photo — with their favourite clothes, hobby or something in their hand.",
      cta: "Make the gift",
      alt: "Figurine of a girl next to her photo — a birthday gift",
      sections: [
        { title: "Personal down to the detail", text: ["Describe what they love in the studio — a guitar, a ball, a cup of coffee, a favourite T-shirt — and it will be in the preview."] },
        { title: "For any age", text: ["For a child, a friend, mum, dad or a colleague. On a smaller budget, keychains start at €30."] },
      ],
      faq: [
        { q: "Will it arrive before the birthday?", a: "Making takes 7–12 working days plus 1–2 days delivery. Add the date to the note." },
        { q: "Can it have a name on it?", a: "Write to us about text on the base and we'll tell you if it's possible." },
        { q: "How much is it?", a: priceEn.figurine + " " + priceEn.keychain },
      ],
    },
  },
  {
    slug: "podarak-za-sveti-valentin",
    product: "keychain",
    image: "keychain",
    bg: {
      crumb: "Подарък за Свети Валентин",
      metaTitle: "Подарък за Свети Валентин — фигурка или ключодържател по снимка",
      kicker: "14 февруари",
      title: "Подарък за Свети Валентин по снимка",
      lead: "Ключодържател с мини версията ти, за да си винаги с него/нея, или фигурка на двама ви за рафта.",
      cta: "Направи подаръка",
      alt: "Ключодържател по снимка като подарък за Свети Валентин",
      sections: [
        { title: "Поръчай навреме", text: ["Около празника има много поръчки. Поръчай до края на януари, за да пристигне спокойно."] },
        { title: "Две идеи", text: ["Ключодържател с твоята фигурка — малък, но много личен. Или две фигурки — ти и той/тя."] },
      ],
      faq: [
        { q: "Кога да поръчам за 14 февруари?", a: "Най-късно до края на януари." },
        { q: "Може ли в подаръчна опаковка?", a: "Всяка фигурка е в кутия. Напиши в бележката, че е подарък, и няма да слагаме цената вътре." },
        { q: "Колко струва?", a: priceBg.keychain + " " + priceBg.figurine },
      ],
    },
    en: {
      crumb: "Valentine's Day gift",
      metaTitle: "Valentine's Day gift — a figurine or keychain from a photo",
      kicker: "14 February",
      title: "A Valentine's Day gift from your photo",
      lead: "A keychain with a mini you so you're always with them, or a figurine of the two of you for the shelf.",
      cta: "Make the gift",
      alt: "Keychain from a photo as a Valentine's Day gift",
      sections: [
        { title: "Order in time", text: ["There are many orders around the holiday. Order by the end of January so it arrives comfortably."] },
        { title: "Two ideas", text: ["A keychain with your figurine — small but very personal. Or two figurines — you and them."] },
      ],
      faq: [
        { q: "When should I order for 14 February?", a: "By the end of January at the latest." },
        { q: "Is it gift-wrapped?", a: "Every figurine comes in a box. Mention it's a gift in the note and we won't put the price inside." },
        { q: "How much is it?", a: priceEn.keychain + " " + priceEn.figurine },
      ],
    },
  },
  {
    slug: "koleden-podarak",
    product: "figurine",
    image: "hero",
    bg: {
      crumb: "Коледен подарък",
      metaTitle: "Коледен подарък по снимка — фигурка или ключодържател",
      kicker: "Коледа",
      title: "Коледен подарък, направен по снимка",
      lead: "Фигурка на мама, татко, баба или на любимия домашен любимец под елхата. Виждаш я преди да поръчаш.",
      cta: "Направи коледния подарък",
      alt: "Фигурка по снимка като коледен подарък",
      sections: [
        { title: "Поръчай до началото на декември", text: ["Преди Коледа поръчките са най-много. Поръчай до 5 декември, за да пристигне преди празниците."] },
        { title: "За цялото семейство", text: ["Можеш да поръчаш няколко фигурки или ключодържатели наведнъж — всяка по отделна снимка."] },
      ],
      faq: [
        { q: "До кога да поръчам за Коледа?", a: "Най-добре до 5 декември." },
        { q: "Може ли в коледни дрехи?", a: "Да — опиши в студиото пуловер, шапка на Дядо Коледа или шал." },
        { q: "Колко струва?", a: priceBg.figurine + " " + priceBg.keychain },
      ],
    },
    en: {
      crumb: "Christmas gift",
      metaTitle: "Christmas gift from a photo — a figurine or keychain",
      kicker: "Christmas",
      title: "A Christmas gift made from a photo",
      lead: "A figurine of mum, dad, grandma or the family pet under the tree. See it before you order.",
      cta: "Make the Christmas gift",
      alt: "Figurine from a photo as a Christmas gift",
      sections: [
        { title: "Order by early December", text: ["Orders peak before Christmas. Order by 5 December so it arrives before the holidays."] },
        { title: "For the whole family", text: ["You can order several figurines or keychains at once — each from its own photo."] },
      ],
      faq: [
        { q: "When should I order for Christmas?", a: "Ideally by 5 December." },
        { q: "Can they wear Christmas clothes?", a: "Yes — describe a jumper, a Santa hat or a scarf in the studio." },
        { q: "How much is it?", a: priceEn.figurine + " " + priceEn.keychain },
      ],
    },
  },
  {
    slug: "podarak-za-abiturient",
    product: "figurine",
    image: "hero",
    bg: {
      crumb: "Подарък за абитуриент",
      metaTitle: "Подарък за абитуриент — фигурка по снимка от бала",
      kicker: "Бал",
      title: "Подарък за абитуриент по снимка от бала",
      lead: "Фигурка на абитуриента в роклята или костюма от бала. Спомен, който ще стои на рафта години наред.",
      cta: "Направи подаръка",
      alt: "Фигурка по снимка като подарък за абитуриент",
      sections: [
        { title: "От снимката от бала", text: ["Използвай снимка в цял ръст от бала или от фотосесията. Можеш да добавиш диплома, букет или шапка в ръката."] },
      ],
      faq: [
        { q: "Може ли в роклята от бала?", a: "Да — снимката и описанието определят облеклото." },
        { q: "Колко време отнема?", a: "7–12 работни дни плюс доставка." },
        { q: "Колко струва?", a: priceBg.figurine },
      ],
    },
    en: {
      crumb: "Graduation gift",
      metaTitle: "Graduation gift — a figurine from a prom photo",
      kicker: "Prom",
      title: "A graduation gift from a prom photo",
      lead: "A figurine of the graduate in their prom dress or suit. A keepsake that stays on the shelf for years.",
      cta: "Make the gift",
      alt: "Figurine from a photo as a graduation gift",
      sections: [
        { title: "From the prom photo", text: ["Use a full-body photo from prom or the photo shoot. You can add a diploma, flowers or a cap in the hand."] },
      ],
      faq: [
        { q: "Can it wear the prom dress?", a: "Yes — the photo and your description set the outfit." },
        { q: "How long does it take?", a: "7–12 working days plus delivery." },
        { q: "How much is it?", a: priceEn.figurine },
      ],
    },
  },
  {
    slug: "figurka-na-dete",
    product: "figurine",
    image: "hero",
    bg: {
      crumb: "Фигурка на дете",
      metaTitle: "Фигурка на дете по снимка — спомен от детството",
      kicker: "Деца",
      title: "Фигурка на дете по снимка",
      lead: "Запази как изглежда детето ти точно сега — с любимата тениска, играчка или костюм за карнавала.",
      cta: "Направи фигурката",
      alt: "Фигурка по снимка на дете",
      sections: [
        { title: "Спомен, който расте с тях", text: ["Децата се променят бързо. Фигурка на всеки рожден ден е чудесна традиция — рафт с мини версии през годините."] },
        { title: "Снимка", text: ["Най-добре детето е право, в цял ръст, на дневна светлина."] },
      ],
      faq: [
        { q: "Подходяща ли е за игра?", a: "Фигурката е декоративна, с малки части, и не е играчка за деца под 3 години." },
        { q: "Може ли с любимата играчка?", a: "Да — опиши я в полето за аксесоари." },
        { q: "Колко струва?", a: priceBg.figurine },
      ],
    },
    en: {
      crumb: "Child figurine",
      metaTitle: "Child figurine from a photo — a childhood keepsake",
      kicker: "Kids",
      title: "A child figurine from your photo",
      lead: "Keep how your child looks right now — with their favourite T-shirt, toy or carnival costume.",
      cta: "Make the figurine",
      alt: "Figurine of a child made from a photo",
      sections: [
        { title: "A keepsake that grows with them", text: ["Kids change fast. A figurine every birthday is a lovely tradition — a shelf of minis over the years."] },
        { title: "The photo", text: ["Ideally the child stands straight, full body, in daylight."] },
      ],
      faq: [
        { q: "Is it a toy?", a: "The figurine is decorative with small parts and is not a toy for children under 3." },
        { q: "Can it hold a favourite toy?", a: "Yes — describe it in the accessories field." },
        { q: "How much is it?", a: priceEn.figurine },
      ],
    },
  },
  {
    slug: "podarak-za-baba-i-dyado",
    product: "figurine",
    image: "process",
    bg: {
      crumb: "Подарък за баба и дядо",
      metaTitle: "Подарък за баба и дядо — фигурка на внуците по снимка",
      kicker: "Семейство",
      title: "Подарък за баба и дядо",
      lead: "Фигурка на внучето, на самите тях или на цялото семейство — подарък, който баба и дядо ще показват на всеки гост.",
      cta: "Направи подаръка",
      alt: "Фигурка на човек до снимката му",
      sections: [
        { title: "Идеи", text: ["Фигурка на внука или внучката. Фигурка на баба и дядо от стара снимка. Или по една фигурка на всяко внуче."] },
        { title: "От стара снимка", text: ["Работи и със стари снимки, стига лицето да е ясно. Можеш да опишеш цветовете на дрехите, ако снимката е черно-бяла."] },
      ],
      faq: [
        { q: "Може ли от черно-бяла снимка?", a: "Да. Опиши цветовете на дрехите и косата в студиото." },
        { q: "Може ли цялото семейство?", a: "Студиото прави по един човек — поръчай отделна фигурка за всеки." },
        { q: "Колко струва?", a: priceBg.figurine },
      ],
    },
    en: {
      crumb: "Gift for grandparents",
      metaTitle: "Gift for grandparents — a figurine of the grandkids from a photo",
      kicker: "Family",
      title: "A gift for grandparents",
      lead: "A figurine of the grandchild, of them, or of the whole family — a gift grandparents will show every guest.",
      cta: "Make the gift",
      alt: "Figurine of a man next to his photo",
      sections: [
        { title: "Ideas", text: ["A figurine of the grandchild. A figurine of grandma and grandpa from an old photo. Or one for each grandchild."] },
        { title: "From an old photo", text: ["Old photos work too as long as the face is clear. Describe the colours if the photo is black and white."] },
      ],
      faq: [
        { q: "Can you use a black and white photo?", a: "Yes. Describe the colours of the clothes and hair in the studio." },
        { q: "Can the whole family be in it?", a: "The studio makes one person at a time — order a separate figurine for each." },
        { q: "How much is it?", a: priceEn.figurine },
      ],
    },
  },
  {
    slug: "figurka-na-kuche",
    product: "figurine",
    pet: true,
    image: "pet",
    bg: {
      crumb: "Фигурка на куче",
      metaTitle: "Фигурка на куче по снимка — всяка порода",
      kicker: "Кучета",
      title: "Фигурка на куче по снимка",
      lead: "Твоето куче, а не просто порода — със същите петна, уши и изражение. За всяка порода и за мелези.",
      cta: "Направи фигурка на кучето",
      alt: "Фигурка на кученце до снимката му",
      sections: [
        { title: "Точно твоето куче", text: ["Работим по твоята снимка, затова фигурката пази белезите, по които го познаваш — петното на муцуната, клепналото ухо, цвета на козината."] },
        { title: "Аксесоари и поза", text: ["Нашийник, бандана с името, топка в устата. Седнал, легнал или с наклонена глава."] },
      ],
      faq: [
        { q: "Правите ли мелези?", a: "Да — именно затова работим по снимка, а не по порода." },
        { q: "Каква снимка е най-добра?", a: "Цялото куче в кадъра, на светло, муцуната към теб." },
        { q: "Колко струва?", a: priceBg.figurine },
      ],
    },
    en: {
      crumb: "Dog figurine",
      metaTitle: "Dog figurine from a photo — any breed",
      kicker: "Dogs",
      title: "A dog figurine from your photo",
      lead: "Your dog, not just a breed — with the same spots, ears and expression. Any breed and mixed breeds too.",
      cta: "Make a dog figurine",
      alt: "Puppy figurine next to its photo",
      sections: [
        { title: "Exactly your dog", text: ["We work from your photo, so the figurine keeps the markings you know them by — the spot on the nose, the floppy ear, the coat colour."] },
        { title: "Accessories and pose", text: ["A collar, a bandana with their name, a ball in the mouth. Sitting, lying down or with a tilted head."] },
      ],
      faq: [
        { q: "Do you make mixed breeds?", a: "Yes — that's exactly why we work from a photo, not a breed." },
        { q: "What photo works best?", a: "The whole dog in the shot, well lit, face towards you." },
        { q: "How much is it?", a: priceEn.figurine },
      ],
    },
  },
  {
    slug: "figurka-na-kotka",
    product: "figurine",
    pet: true,
    image: "pet",
    bg: {
      crumb: "Фигурка на котка",
      metaTitle: "Фигурка на котка по снимка",
      kicker: "Котки",
      title: "Фигурка на котка по снимка",
      lead: "Котката ти в мини версия — с цвета на очите, шарките и характерната поза. Изработена на ръка в Русе.",
      cta: "Направи фигурка на котката",
      alt: "Фигурка на домашен любимец по снимка",
      sections: [
        { title: "Шарките са важни", text: ["Тигрова, трицветна, черна с бели лапи — пазим шарките от снимката, за да е точно твоята котка."] },
        { title: "Поза", text: ["Седнала, свита на кълбо, с опашка около лапите — опиши я в студиото."] },
      ],
      faq: [
        { q: "Котката не стои мирно за снимка. Какво да правя?", a: "Всяка ясна снимка, на която се вижда цялата котка и муцуната, става. Позата можеш да опишеш с думи." },
        { q: "Може ли две котки?", a: "Направи по една фигурка за всяка." },
        { q: "Колко струва?", a: priceBg.figurine },
      ],
    },
    en: {
      crumb: "Cat figurine",
      metaTitle: "Cat figurine from a photo",
      kicker: "Cats",
      title: "A cat figurine from your photo",
      lead: "Your cat in mini — with its eye colour, markings and signature pose. Handmade in Ruse, Bulgaria.",
      cta: "Make a cat figurine",
      alt: "Pet figurine made from a photo",
      sections: [
        { title: "Markings matter", text: ["Tabby, calico, black with white paws — we keep the markings from the photo so it's exactly your cat."] },
        { title: "Pose", text: ["Sitting, curled up, tail around the paws — describe it in the studio."] },
      ],
      faq: [
        { q: "My cat won't sit still for a photo. What now?", a: "Any clear photo showing the whole cat and its face works. You can describe the pose in words." },
        { q: "Can I have two cats?", a: "Make one figurine for each." },
        { q: "How much is it?", a: priceEn.figurine },
      ],
    },
  },
  {
    slug: "figurka-v-pamet-na-lyubimets",
    product: "figurine",
    pet: true,
    image: "pet",
    bg: {
      crumb: "Фигурка в памет на любимец",
      metaTitle: "Фигурка в памет на куче или котка по снимка",
      kicker: "Спомен",
      title: "Фигурка в памет на любимец",
      lead: "Когато любимецът вече не е до теб, фигурката по негова снимка го връща на рафта. Работим внимателно и с уважение.",
      cta: "Направи фигурката",
      alt: "Фигурка на кученце до снимката му",
      sections: [
        { title: "От стара снимка", text: ["Снимката може да е стара или на телефон — важно е животното да се вижда цялото и муцуната да е ясна. Ако имаш няколко, избери най-ясната."] },
        { title: "Ако нещо не е точно", text: ["Визуализацията виждаш преди поръчката. Ако нещо не е като него, промени описанието и опитай пак, или ни пиши."] },
      ],
      faq: [
        { q: "Имам само размазани снимки.", a: "Пиши ни с няколко снимки и ще преценим заедно." },
        { q: "Може ли с любимата му играчка?", a: "Да — опиши я в полето за аксесоари." },
        { q: "Колко струва?", a: priceBg.figurine },
      ],
    },
    en: {
      crumb: "Pet memorial figurine",
      metaTitle: "Pet memorial figurine of a dog or cat from a photo",
      kicker: "In memory",
      title: "A memorial figurine of your pet",
      lead: "When your pet is no longer with you, a figurine from their photo brings them back to the shelf. We work carefully and respectfully.",
      cta: "Make the figurine",
      alt: "Puppy figurine next to its photo",
      sections: [
        { title: "From an old photo", text: ["The photo can be old or from a phone — what matters is that the whole animal and its face are clear. If you have several, pick the clearest."] },
        { title: "If something isn't right", text: ["You see the preview before ordering. If something isn't like them, change the description and try again, or write to us."] },
      ],
      faq: [
        { q: "I only have blurry photos.", a: "Write to us with a few photos and we'll decide together." },
        { q: "Can it have their favourite toy?", a: "Yes — describe it in the accessories field." },
        { q: "How much is it?", a: priceEn.figurine },
      ],
    },
  },
  {
    slug: "podarak-za-kolega",
    product: "keychain",
    image: "keychain",
    bg: {
      crumb: "Подарък за колега",
      metaTitle: "Подарък за колега — ключодържател по снимка",
      kicker: "Работа",
      title: "Подарък за колега, който ще го разсмее",
      lead: "Ключодържател с мини версията на колегата — за рожден ден, напускане или добре свършен проект. От 30 €.",
      cta: "Направи ключодържател",
      alt: "Ключодържател по снимка на мъж с палец нагоре",
      sections: [
        { title: "За целия екип", text: ["Можеш да поръчаш по ключодържател за всеки от екипа — всеки по негова снимка. В количката добавяш до 5 бройки от всеки."] },
      ],
      faq: [
        { q: "Може ли в работно облекло?", a: "Да — опиши униформа, престилка или каска." },
        { q: "Правите ли по-големи количества?", a: "Пиши ни за повече от 5 бройки." },
        { q: "Колко струва?", a: priceBg.keychain },
      ],
    },
    en: {
      crumb: "Gift for a colleague",
      metaTitle: "Gift for a colleague — a keychain from a photo",
      kicker: "Work",
      title: "A gift that will make your colleague laugh",
      lead: "A keychain with a mini version of your colleague — for a birthday, a farewell or a job well done. From €30.",
      cta: "Make a keychain",
      alt: "Keychain from a photo of a man giving a thumbs up",
      sections: [
        { title: "For the whole team", text: ["Order a keychain for everyone on the team — each from their own photo. You can add up to 5 of each in the cart."] },
      ],
      faq: [
        { q: "Can it wear a work uniform?", a: "Yes — describe the uniform, apron or hard hat." },
        { q: "Do you do larger quantities?", a: "Write to us for more than 5." },
        { q: "How much is it?", a: priceEn.keychain },
      ],
    },
  },
  {
    slug: "figurka-po-profesiya",
    product: "figurine",
    image: "process",
    bg: {
      crumb: "Фигурка по професия",
      metaTitle: "Фигурка на лекар, учител, готвач и всяка професия по снимка",
      kicker: "Професии",
      title: "Фигурка на лекар, учител или готвач",
      lead: "Фигурка по снимка в работно облекло — лекар в престилка, учител с книга, готвач с шапка, пожарникар, пилот.",
      cta: "Направи фигурката",
      alt: "Фигурка на човек по снимка",
      sections: [
        { title: "Опиши професията", text: ["В полето за дрехи опиши униформата и предмета в ръката — стетоскоп, тиган, книга, китара. Визуализацията ще ти покаже резултата."] },
        { title: "Подарък за край на годината", text: ["Популярен подарък за учители, лекари и треньори в края на годината или при пенсиониране."] },
      ],
      faq: [
        { q: "Може ли с лого на фирма?", a: "Не използваме лога и търговски марки без разрешение на притежателя." },
        { q: "Може ли с предмет в ръката?", a: "Да — опиши го в студиото." },
        { q: "Колко струва?", a: priceBg.figurine },
      ],
    },
    en: {
      crumb: "Profession figurine",
      metaTitle: "Figurine of a doctor, teacher, chef or any profession from a photo",
      kicker: "Professions",
      title: "A figurine of a doctor, teacher or chef",
      lead: "A figurine from a photo in work clothes — a doctor in a coat, a teacher with a book, a chef in a hat, a firefighter, a pilot.",
      cta: "Make the figurine",
      alt: "Figurine of a man made from a photo",
      sections: [
        { title: "Describe the job", text: ["In the clothes field, describe the uniform and what's in the hand — a stethoscope, a pan, a book, a guitar. The preview shows you the result."] },
        { title: "An end-of-year gift", text: ["A popular gift for teachers, doctors and coaches at the end of the year or at retirement."] },
      ],
      faq: [
        { q: "Can it have a company logo?", a: "We don't use logos or trademarks without the owner's permission." },
        { q: "Can it hold something?", a: "Yes — describe it in the studio." },
        { q: "How much is it?", a: priceEn.figurine },
      ],
    },
  },
  {
    slug: "podarak-za-mazh",
    product: "figurine",
    image: "process",
    bg: {
      crumb: "Подарък за мъж",
      metaTitle: "Оригинален подарък за мъж — фигурка или ключодържател по снимка",
      kicker: "За него",
      title: "Оригинален подарък за мъж",
      lead: "Фигурка на него с любимия екип, китарата или кучето. Или ключодържател за ключовете от колата.",
      cta: "Направи подаръка",
      alt: "Фигурка на мъж до снимката му",
      sections: [
        { title: "За гаджето, съпруга, баща или брат", text: ["Добави хобито му — футболна фланелка, въдица, геймърски слушалки, мотоциклетна каска — и подаръкът става истински личен."] },
      ],
      faq: [
        { q: "Какво да подаря на мъж, който има всичко?", a: "Нещо, което не може да си купи — фигурка по негова снимка." },
        { q: "Може ли с кучето му?", a: "Студиото прави по един герой — поръчай фигурка на него и отделно на кучето." },
        { q: "Колко струва?", a: priceBg.figurine + " " + priceBg.keychain },
      ],
    },
    en: {
      crumb: "Gift for him",
      metaTitle: "A unique gift for him — a figurine or keychain from a photo",
      kicker: "For him",
      title: "A unique gift for him",
      lead: "A figurine of him in his favourite kit, with his guitar or his dog. Or a keychain for his car keys.",
      cta: "Make the gift",
      alt: "Figurine of a man next to his photo",
      sections: [
        { title: "For a boyfriend, husband, dad or brother", text: ["Add his hobby — a football shirt, a fishing rod, gaming headphones, a motorbike helmet — and the gift becomes truly personal."] },
      ],
      faq: [
        { q: "What do you give a man who has everything?", a: "Something he can't buy — a figurine from his photo." },
        { q: "Can his dog be in it?", a: "The studio makes one character at a time — order one of him and one of the dog." },
        { q: "How much is it?", a: priceEn.figurine + " " + priceEn.keychain },
      ],
    },
  },
  {
    slug: "podarak-za-zhena",
    product: "figurine",
    image: "hero",
    bg: {
      crumb: "Подарък за жена",
      metaTitle: "Оригинален подарък за жена — фигурка по снимка",
      kicker: "За нея",
      title: "Оригинален подарък за жена",
      lead: "Фигурка на нея в любимата рокля или с любимото куче. Подарък, който показва, че си се замислил.",
      cta: "Направи подаръка",
      alt: "Фигурка на момиче до снимката ѝ",
      sections: [
        { title: "За приятелка, съпруга, майка или сестра", text: ["Избери снимка, на която тя се харесва. Опиши роклята, прическата, чантата или цветята в ръката."] },
      ],
      faq: [
        { q: "Ще ѝ хареса ли как изглежда?", a: "Виждаш визуализацията преди поръчката и можеш да я пробваш няколко пъти." },
        { q: "Може ли по-малък подарък?", a: "Ключодържателят е от 30 €." },
        { q: "Колко струва?", a: priceBg.figurine },
      ],
    },
    en: {
      crumb: "Gift for her",
      metaTitle: "A unique gift for her — a figurine from a photo",
      kicker: "For her",
      title: "A unique gift for her",
      lead: "A figurine of her in her favourite dress or with her favourite dog. A gift that shows you really thought about it.",
      cta: "Make the gift",
      alt: "Figurine of a girl next to her photo",
      sections: [
        { title: "For a girlfriend, wife, mum or sister", text: ["Pick a photo she likes herself in. Describe the dress, hair, bag or flowers in her hand."] },
      ],
      faq: [
        { q: "Will she like how it looks?", a: "You see the preview before ordering and can try it several times." },
        { q: "Is there a smaller gift?", a: "Keychains start at €30." },
        { q: "How much is it?", a: priceEn.figurine },
      ],
    },
  },
];

export const topicList = topics.map((topic) => topic.slug);

export function topicContent(slug: string, lang: Lang): LandingContent | null {
  const topic = topics.find((item) => item.slug === slug);
  if (!topic) return null;
  const copy = topic[lang];
  const image = images[topic.image];
  const studio = `/studio?product=${topic.product}${topic.pet ? "&subject=pet" : ""}`;
  return {
    metaTitle: copy.metaTitle,
    path: `/idei/${topic.slug}`,
    crumb: copy.crumb,
    kicker: copy.kicker,
    title: copy.title,
    lead: copy.lead,
    cta: { label: copy.cta, href: studio },
    image: { src: image.src, alt: copy.alt, ratio: image.ratio },
    product: topic.product,
    productName: copy.title,
    sections: copy.sections,
    faq: copy.faq,
  };
}

export function topicCards(lang: Lang) {
  return topics.map((topic) => ({
    slug: topic.slug,
    en: topicSlugs[topic.slug],
    title: topic[lang].crumb,
    lead: topic[lang].lead,
    image: images[topic.image].src,
  }));
}
