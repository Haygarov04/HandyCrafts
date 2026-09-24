import { productionDays } from "@/lib/catalog";
import type { Lang } from "@/lib/i18n";
import type { LandingContent } from "@/app/components/Landing";

const productionDaysEn = "7–12 working days";

export type LandingId = "figurine" | "pet" | "keychain" | "gift";

export const landingIds: LandingId[] = ["figurine", "pet", "keychain", "gift"];

export const landingContent: Record<LandingId, Record<Lang, LandingContent>> = {
  figurine: {
    bg: {
    metaTitle: "Фигурка по снимка — 3D фигурка на човек от 50 €",
    path: "/figurka-po-snimka",
    crumb: "Фигурка по снимка",
    kicker: "3D фигурка по снимка",
    title: "Фигурка по снимка на човек",
    lead: "Персонализирана 3D фигурка на човек по една снимка. Виждаш визуализацията за минута, а готовата фигурка се изработва на ръка в Русе.",
    cta: { label: "Създай фигурка", href: "/studio?product=figurine" },
    image: { src: "/shop/figurine.webp", alt: "Фигурка на двойка, изработена по снимка", ratio: "aspect-[9/16] max-h-[36rem]" },
    product: "figurine",
    productName: "Персонализирана 3D фигурка по снимка",
    sections: [
      {
        title: "Какво представлява фигурката по снимка",
        text: [
          "Това е малка скулптура в цял ръст на конкретен човек — със същата прическа, очила, дрехи и усмивка като на снимката. Пропорциите са леко стилизирани, с малко по-голяма глава, за да е фигурката симпатична и да се виждат добре чертите на лицето.",
          "Фигурката стои на кръгла основа и се предлага в три размера: 10 см за бюро или рафт, 15 см като основен подарък и 20 см, когато искаш повече детайл.",
        ],
      },
      {
        title: "Каква снимка да използваш",
        text: [
          "Най-добре работи ясна снимка на дневна светлина, в която лицето гледа напред. Ако искаш фигурка в цял ръст с конкретни дрехи, избери снимка от главата до краката. Без силни филтри и тъмни очила.",
          "Можеш да опишеш и промени: друг цвят на дрехите, предмет в ръката, поза. Визуализацията ти показва резултата, преди да поръчаш.",
        ],
      },
      {
        title: "Цена и доставка",
        text: [
          "Фигурка 10 см струва 50 €, 15 см — 80 €, 20 см — 100 €. Плащаш с наложен платеж при получаване, доставката е с Еконт или Спиди до офис или адрес в цяла България.",
        ],
      },
    ],
    faq: [
      { q: "Колко струва фигурка по снимка?", a: "Фигурка 10 см е 50 €, 15 см е 80 €, а 20 см е 100 €. Плащаш с наложен платеж при получаване." },
      { q: "Колко ще прилича на човека?", a: "Визуализацията запазва лицето, прическата, очилата и дрехите от снимката. Готовата фигурка се довършва на ръка по нея, затова малки разлики в детайлите са нормални." },
      { q: "Може ли фигурка на двойка?", a: "Студиото прави по един човек. За двойка направи две фигурки или ни пиши и ще ти дадем цена за обща основа." },
    ],
    },
    en: {
      metaTitle: "Custom figurine from a photo — 3D figurine of a person from €50",
      path: "/figurka-po-snimka",
      crumb: "Custom figurine from a photo",
      kicker: "3D figurine from a photo",
      title: "A figurine made from your photo",
      lead: "A custom 3D figurine of a person made from a single photo. See the preview in a minute; the finished figurine is made by hand in Ruse, Bulgaria.",
      cta: { label: "Create a figurine", href: "/studio?product=figurine" },
      image: { src: "/shop/figurine.webp", alt: "Figurine of a couple made from a photo", ratio: "aspect-[9/16] max-h-[36rem]" },
      product: "figurine",
      productName: "Custom 3D figurine from a photo",
      sections: [
        {
          title: "What a figurine from a photo is",
          text: [
            "It's a small full-body sculpture of a specific person — with the same hairstyle, glasses, clothes and smile as in the photo. The proportions are slightly stylised, with a bigger head, so the figurine is charming and the face reads clearly.",
            "The figurine stands on a round base and comes in three sizes: 10 cm for a desk or shelf, 15 cm as the classic gift and 20 cm when you want more detail.",
          ],
        },
        {
          title: "Which photo to use",
          text: [
            "A clear daylight photo with the face looking forward works best. For a full-body figurine with specific clothes, choose a head-to-toe photo. No heavy filters or sunglasses.",
            "You can also describe changes: another clothing colour, something in the hand, a pose. The preview shows you the result before you order.",
          ],
        },
        {
          title: "Price and delivery",
          text: [
            "A figurine costs €50 for 10 cm, €80 for 15 cm and €100 for 20 cm. You pay cash on delivery; we ship with Econt or Speedy to an office or address anywhere in Bulgaria.",
          ],
        },
      ],
      faq: [
        { q: "How much is a figurine from a photo?", a: "€50 for 10 cm, €80 for 15 cm and €100 for 20 cm. You pay cash on delivery." },
        { q: "How much will it look like the person?", a: "The preview keeps the face, hairstyle, glasses and clothes from the photo. The finished figurine is completed by hand from it, so small differences in detail are normal." },
        { q: "Can you make a couple?", a: "The studio makes one person at a time. For a couple, make two figurines or write to us for a quote on a shared base." },
      ],
    },
  },
  pet: {
    bg: {
    metaTitle: "Фигурка на куче или котка по снимка — от 50 €",
    path: "/figurka-na-domashen-lyubimets",
    crumb: "Фигурка на домашен любимец",
    kicker: "Куче, котка и всеки любимец",
    title: "Фигурка на домашен любимец по снимка",
    lead: "3D фигурка на твоето куче или котка — със същата окраска, петна и изражение. Качваш снимка, виждаш визуализацията и поръчваш с наложен платеж.",
    cta: { label: "Създай фигурка на любимеца", href: "/studio?product=figurine&subject=pet" },
    image: { src: "/shop/pet.webp", alt: "Фигурка на кученце до снимката, по която е направена", ratio: "aspect-[16/9]" },
    product: "figurine",
    productName: "3D фигурка на домашен любимец по снимка",
    sections: [
      {
        title: "Фигурка на куче или котка, която наистина прилича",
        text: [
          "Всяко животно е различно — формата на ушите, петната по козината, цветът на очите. Затова работим по твоята снимка и запазваме точно тези белези, а не правим обща фигурка на породата.",
          "Можеш да добавиш нашийник, бандана с името или любимата играчка. Позата също избираш: седнал, легнал или с наклонена глава.",
        ],
      },
      {
        title: "Спомен за любимец, който вече не е до теб",
        text: [
          "Много хора поръчват фигурка в памет на куче или котка. Снимката може да е стара — важно е животното да се вижда цялото и муцуната да е ясна.",
        ],
      },
      {
        title: "Размери и цена",
        text: [
          "Фигурка на любимец 10 см е 50 €, 15 см е 80 €, 20 см е 100 €. Ако предпочиташ нещо по-малко, има и ключодържател на любимец от 30 €.",
        ],
      },
    ],
    faq: [
      { q: "Каква снимка на кучето е най-добра?", a: "Снимка на светло, в която се вижда цялото животно и муцуната гледа към теб. Най-добре без други животни и хора в кадъра." },
      { q: "Правите ли котки, зайци и птици?", a: "Да. Генераторът работи с всякакви домашни любимци. Ако животното е по-необичайно, прегледай визуализацията и ни пиши при въпроси." },
      { q: "Може ли човек и куче в една фигурка?", a: "Засега студиото прави по един герой. Пиши ни за обща фигурка и ще ти дадем цена." },
    ],
    },
    en: {
      metaTitle: "Pet figurine from a photo — dog or cat from €50",
      path: "/figurka-na-domashen-lyubimets",
      crumb: "Pet figurine from a photo",
      kicker: "Dogs, cats and every pet",
      title: "A pet figurine from your photo",
      lead: "A 3D figurine of your dog or cat — with the same colouring, spots and expression. Upload a photo, see the preview and order with cash on delivery.",
      cta: { label: "Create a pet figurine", href: "/studio?product=figurine&subject=pet" },
      image: { src: "/shop/pet.webp", alt: "Puppy figurine next to the photo it was made from", ratio: "aspect-[16/9]" },
      product: "figurine",
      productName: "3D pet figurine from a photo",
      sections: [
        {
          title: "A dog or cat figurine that really looks like them",
          text: [
            "Every animal is different — the shape of the ears, the spots on the fur, the colour of the eyes. That's why we work from your photo and keep exactly those markings instead of making a generic breed figurine.",
            "You can add a collar, a bandana with their name or a favourite toy. You choose the pose too: sitting, lying down or with a tilted head.",
          ],
        },
        {
          title: "A keepsake for a pet who is no longer with you",
          text: [
            "Many people order a figurine in memory of a dog or cat. The photo can be old — what matters is that the whole animal is visible and the face is clear.",
          ],
        },
        {
          title: "Sizes and price",
          text: [
            "A pet figurine is €50 for 10 cm, €80 for 15 cm and €100 for 20 cm. If you prefer something smaller, there's a pet keychain from €30.",
          ],
        },
      ],
      faq: [
        { q: "What's the best photo of my dog?", a: "A well-lit photo showing the whole animal with the face looking at you. Ideally without other animals or people in the shot." },
        { q: "Do you make cats, rabbits and birds?", a: "Yes. The studio works with all kinds of pets. If your pet is more unusual, check the preview and write to us with any questions." },
        { q: "Can a person and a dog be in one figurine?", a: "For now the studio makes one character at a time. Write to us about a shared figurine and we'll send a quote." },
      ],
    },
  },
  keychain: {
    bg: {
    metaTitle: "Ключодържател по снимка — 3D мини фигурка от 30 €",
    path: "/klyuchodarzhatel-po-snimka",
    crumb: "Ключодържател по снимка",
    kicker: "Мини фигурка с халка",
    title: "Ключодържател по снимка",
    lead: "Персонализиран 3D ключодържател на човек или домашен любимец, направен по твоя снимка. 5 или 6 см, с метална халка, от 30 €.",
    cta: { label: "Създай ключодържател", href: "/studio?product=keychain" },
    image: { src: "/shop/keychain.webp", alt: "Ключодържател фигурка на мъж по снимка", ratio: "aspect-[9/16] max-h-[36rem]" },
    product: "keychain",
    productName: "Персонализиран 3D ключодържател по снимка",
    sections: [
      {
        title: "Малък подарък, който се ползва всеки ден",
        text: [
          "Ключодържателят е мини фигурка в цял ръст с метална халка отгоре. Малък е, но запазва прическата, дрехите и изражението от снимката. Подходящ е за колеги, приятели, половинката или като сувенир за група.",
        ],
      },
      {
        title: "Човек или любимец",
        text: [
          "В студиото избираш дали ключодържателят да е на човек или на домашен любимец. За куче или котка работим по окраската и белезите на конкретното животно.",
        ],
      },
      {
        title: "Цена",
        text: ["Ключодържател 5 см е 30 €, а 6 см е 40 €. Плащаш с наложен платеж при получаване."],
      },
    ],
    faq: [
      { q: "Колко е голям ключодържателят?", a: "5 или 6 см на височина, без халката. Достатъчно малък за джоб и достатъчно голям, за да се вижда лицето." },
      { q: "Колко е здрав?", a: "Изработва се с 3D печат и се довършва на ръка. Халката и верижката са метални." },
      { q: "Може ли няколко еднакви ключодържателя?", a: "Да. В количката увеличаваш бройката до 5. За по-голямо количество ни пиши." },
    ],
    },
    en: {
      metaTitle: "Custom keychain from a photo — 3D mini figure from €30",
      path: "/klyuchodarzhatel-po-snimka",
      crumb: "Custom keychain from a photo",
      kicker: "Mini figure with a ring",
      title: "A keychain made from your photo",
      lead: "A custom 3D keychain of a person or pet made from your photo. 5 or 6 cm with a metal ring, from €30.",
      cta: { label: "Create a keychain", href: "/studio?product=keychain" },
      image: { src: "/shop/keychain.webp", alt: "Keychain figure of a man made from a photo", ratio: "aspect-[9/16] max-h-[36rem]" },
      product: "keychain",
      productName: "Custom 3D keychain from a photo",
      sections: [
        {
          title: "A small gift used every day",
          text: [
            "The keychain is a full-body mini figure with a metal ring on top. It's small but keeps the hairstyle, clothes and expression from the photo. Great for colleagues, friends, your partner or as a keepsake for a group.",
          ],
        },
        {
          title: "A person or a pet",
          text: [
            "In the studio you choose whether the keychain is of a person or a pet. For a dog or cat we follow the colouring and markings of your animal.",
          ],
        },
        {
          title: "Price",
          text: ["A keychain is €30 for 5 cm and €40 for 6 cm. You pay cash on delivery."],
        },
      ],
      faq: [
        { q: "How big is the keychain?", a: "5 or 6 cm tall, not counting the ring. Small enough for a pocket, big enough to see the face." },
        { q: "How sturdy is it?", a: "It's 3D printed and finished by hand. The ring and chain are metal." },
        { q: "Can I order several of the same keychain?", a: "Yes. In the cart you can set up to 5. For larger quantities, write to us." },
      ],
    },
  },
  gift: {
    bg: {
    metaTitle: "Персонализиран подарък по снимка — фигурка от 30 €",
    path: "/personaliziran-podarak",
    crumb: "Персонализиран подарък",
    kicker: "Подарък, който не се забравя",
    title: "Персонализиран подарък по снимка",
    lead: "Фигурка или ключодържател по снимка на човека, на когото подаряваш. За рожден ден, годишнина, сватба, Свети Валентин или Коледа — от 30 €, с наложен платеж.",
    cta: { label: "Направи подаръка", href: "/studio" },
    image: { src: "/shop/hero-mobile.webp", alt: "Фигурка на момиче до снимката, по която е направена", ratio: "aspect-[9/16] max-h-[36rem]" },
    product: "figurine",
    productName: "Персонализиран подарък — 3D фигурка по снимка",
    sections: [
      {
        title: "Идея за подарък за всеки повод",
        text: [
          "Персонализираната фигурка е подарък, който няма как да е купен от магазина — направена е точно за конкретния човек. Затова предизвиква усмивка още при отварянето на кутията.",
          "Подходяща е за рожден ден, годишнина, сватба, абитуриент, за колега при напускане, за баба и дядо или в памет на домашен любимец.",
        ],
      },
      {
        title: "Изненада без риск",
        text: [
          "Преди да поръчаш, виждаш визуализация. Така знаеш какъв ще е подаръкът, а плащаш чак когато пратката пристигне.",
          `Изработката отнема ${productionDays}. Ако подаръкът ти трябва за конкретна дата, напиши я в бележката към поръчката.`,
        ],
      },
    ],
    faq: [
      { q: "Ще стигне ли навреме за празника?", a: `Обикновено изпращаме за ${productionDays} от потвърждението. Напиши датата в бележката и ще ти кажем по телефона дали успяваме.` },
      { q: "Мога ли да поръчам без знанието на човека?", a: "Да. Трябва ти само една негова снимка. Визуализацията виждаш само ти." },
      { q: "Какво да подаря на половинката за годишнина?", a: "Фигурка на двама ви (две фигурки) или ключодържател с неговата или нейната мини версия. И двете виждаш преди да поръчаш." },
    ],
    },
    en: {
      metaTitle: "Personalised gift from a photo — figurine from €30",
      path: "/personaliziran-podarak",
      crumb: "Personalised gift",
      kicker: "A gift they won't forget",
      title: "A personalised gift from a photo",
      lead: "A figurine or keychain made from a photo of the person you're giving it to. For birthdays, anniversaries, weddings, Valentine's Day or Christmas — from €30, cash on delivery.",
      cta: { label: "Make the gift", href: "/studio" },
      image: { src: "/shop/hero-mobile.webp", alt: "Figurine of a girl next to the photo it was made from", ratio: "aspect-[9/16] max-h-[36rem]" },
      product: "figurine",
      productName: "Personalised gift — 3D figurine from a photo",
      sections: [
        {
          title: "A gift idea for every occasion",
          text: [
            "A custom figurine is a gift you can't buy in a shop — it's made for one specific person. That's why it gets a smile the moment the box is opened.",
            "It works for birthdays, anniversaries, weddings, graduations, a colleague who is leaving, grandparents or in memory of a pet.",
          ],
        },
        {
          title: "A surprise without the risk",
          text: [
            "Before you order, you see a preview. So you know what the gift will be, and you only pay when the parcel arrives.",
            `Making it takes ${productionDaysEn}. If you need the gift by a certain date, add it to the order note.`,
          ],
        },
      ],
      faq: [
        { q: "Will it arrive in time for the holiday?", a: `We usually ship within ${productionDaysEn} of confirmation. Add the date to the note and we'll tell you by phone whether we can make it.` },
        { q: "Can I order without the person knowing?", a: "Yes. All you need is one photo of them. Only you see the preview." },
        { q: "What should I give my partner for our anniversary?", a: "A figurine of the two of you (two figurines) or a keychain with a mini version of them. You see both before you order." },
      ],
    },
  },
};
