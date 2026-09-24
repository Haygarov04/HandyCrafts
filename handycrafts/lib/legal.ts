import type { Lang } from "@/lib/i18n";

/**
 * Seller details required by the Consumer Protection Act (чл. 4 ЗЗП) and the
 * E-Commerce Act. Filled from Vercel environment variables so they can be
 * changed without a code change once the company is registered.
 */
export const seller = {
  name: process.env.LEGAL_NAME || "",
  eik: process.env.LEGAL_EIK || "",
  vat: process.env.LEGAL_VAT || "",
  address: process.env.LEGAL_ADDRESS || "",
  email: process.env.LEGAL_EMAIL || "handycraftshelp@gmail.com",
  phone: process.env.LEGAL_PHONE || "",
};

export function sellerComplete() {
  return Boolean(seller.name && seller.eik && seller.address);
}

export const legalUpdated = "24.09.2026";

export type LegalSection = { title: string; body: (string | string[])[] };
export type LegalDoc = { title: string; kicker: string; description: string; intro?: string; sections: LegalSection[] };
export type LegalId = "terms" | "privacy" | "returns" | "delivery";

function sellerLines(lang: Lang) {
  const en = lang === "en";
  if (!sellerComplete()) {
    return [
      en
        ? `HandyCrafts is operated from Ruse, Bulgaria. Email: ${seller.email}${seller.phone ? `, phone: ${seller.phone}` : ""}. The full company details (name, company ID and registered address) are published here as soon as the business is registered.`
        : `HandyCrafts се управлява от Русе, България. Имейл: ${seller.email}${seller.phone ? `, телефон: ${seller.phone}` : ""}. Пълните данни на търговеца (наименование, ЕИК и адрес на управление) се публикуват тук веднага след регистрацията на дейността.`,
    ];
  }
  return [
    en
      ? `Seller: ${seller.name}, company ID (EIK) ${seller.eik}${seller.vat ? `, VAT no. ${seller.vat}` : ", not registered for VAT"}, registered address: ${seller.address}. Email: ${seller.email}${seller.phone ? `, phone: ${seller.phone}` : ""}.`
      : `Търговец: ${seller.name}, ЕИК ${seller.eik}${seller.vat ? `, ДДС № ${seller.vat}` : ", нерегистриран по ЗДДС"}, адрес на управление: ${seller.address}. Имейл: ${seller.email}${seller.phone ? `, телефон: ${seller.phone}` : ""}.`,
  ];
}

/** Google Analytics / Ads are on only when their IDs are configured. */
const tracking = Boolean(process.env.NEXT_PUBLIC_GA_ID || process.env.NEXT_PUBLIC_GOOGLE_ADS_ID);

const days = { bg: "7–12 работни дни", en: "7–12 working days" };

export function legalDoc(id: LegalId, lang: Lang): LegalDoc {
  return lang === "en" ? en(id) : bg(id);
}

function bg(id: LegalId): LegalDoc {
  switch (id) {
    case "terms":
      return {
        kicker: "Правна информация",
        title: "Общи условия",
        description: "Общи условия за поръчка на персонализирани фигурки и ключодържатели по снимка от HandyCrafts.",
        sections: [
          { title: "Търговец", body: [...sellerLines("bg"), "Тези условия уреждат отношенията между търговеца и всеки, който поръчва през сайта handy-crafts.digital (наричан по-долу „клиент“)."] },
          {
            title: "Предмет",
            body: [
              "Чрез сайта клиентът поръчва персонализирани фигурки и ключодържатели, изработени по негова снимка и указания. Преди поръчката сайтът създава ориентировъчна визуализация с помощта на изкуствен интелект.",
              "Визуализацията показва стила, позата и облеклото. Готовото изделие се моделира, отпечатва с 3D принтер и довършва на ръка по нея и по оригиналната снимка, затова са възможни малки разлики в детайлите, цвета и пропорциите. Това не е несъответствие със стоката.",
            ],
          },
          {
            title: "Поръчка и сключване на договор",
            body: [
              "Клиентът избира продукт и размер, качва снимка, получава визуализация, добавя я в количката и попълва данните си за доставка. С натискане на бутона „Поръчка със задължение за плащане“ клиентът прави предложение за покупка.",
              "Получаването на поръчката се потвърждава по имейл (ако е посочен). Договорът се смята за сключен, когато търговецът потвърди поръчката по телефона или по имейл. Търговецът може да откаже поръчка, ако снимката е неподходяща, съдържанието е незаконно или изработката е технически невъзможна.",
            ],
          },
          {
            title: "Цени и плащане",
            body: [
              "Цените са в евро и са крайни за изработката на изделието. Разходите за доставка не са включени и се заплащат по тарифата на избрания куриер.",
              "Плащането е с наложен платеж — в брой или с карта на куриера при получаване на пратката, според възможностите на куриера. Търговецът издава документ за продажбата съгласно действащото законодателство.",
            ],
          },
          { title: "Срок на изработка и доставка", body: [`Обичайният срок за изработка е ${days.bg} от потвърждението на поръчката, след което пратката се предава на куриер. Подробности има в страницата „Доставка“.`] },
          {
            title: "Право на отказ",
            body: [
              "Съгласно чл. 57, т. 3 от Закона за защита на потребителите правото на отказ от договора в 14-дневен срок не се прилага за стоки, изработени по поръчка на потребителя или съобразени с неговите индивидуални изисквания. Фигурките и ключодържателите се изработват по снимка на клиента и попадат в това изключение.",
              "Клиентът може да откаже поръчката безплатно, докато тя не е потвърдена. Подробности има в страницата „Връщане и рекламации“.",
            ],
          },
          {
            title: "Законова гаранция и рекламации",
            body: [
              "Клиентът има право на законова гаранция за съответствие на стоката с договора за срок от 2 години от получаването ѝ съгласно Закона за предоставяне на цифрово съдържание и цифрови услуги и за продажба на стоки. Рекламации се приемат на имейл, както е описано в страницата „Връщане и рекламации“.",
            ],
          },
          {
            title: "Снимки и права",
            body: [
              "С качването на снимка клиентът декларира, че има право да я използва и че хората на нея са съгласни тя да бъде използвана за изработка на фигурка. Клиентът дава на търговеца право да използва снимката само за визуализацията и изработката на поръчката.",
              "Не приемаме снимки с незаконно, обидно или насилствено съдържание, снимки на непълнолетни без съгласие на родител, както и изображения, защитени с авторско право или търговска марка, без разрешение на притежателя.",
              "Снимки на готови изделия използваме в сайта или в социалните мрежи само с изрично съгласие на клиента.",
            ],
          },
          { title: "Лични данни", body: ["Обработването на личните данни е описано в страницата „Политика за поверителност“."] },
          {
            title: "Спорове",
            body: [
              "Спорове се решават по взаимно съгласие. Клиентът може да се обърне към Комисията за защита на потребителите (kzp.bg, гореща линия 0700 111 22) или към секторните помирителни комисии за извънсъдебно решаване на спора.",
              "За неуредените въпроси се прилага българското законодателство.",
            ],
          },
          { title: "Промени", body: [`Търговецът може да променя тези условия. За всяка поръчка важат условията, публикувани към момента на поръчката. Последна актуализация: ${legalUpdated}.`] },
        ],
      };
    case "privacy":
      return {
        kicker: "Лични данни",
        title: "Политика за поверителност",
        description: "Как HandyCrafts събира, използва и пази личните данни и снимките на клиентите.",
        sections: [
          { title: "Администратор", body: [...sellerLines("bg"), "Администраторът обработва личните данни съгласно Регламент (ЕС) 2016/679 (GDPR) и Закона за защита на личните данни."] },
          {
            title: "Какви данни събираме",
            body: [
              [
                "Снимката, която качваш в студиото, описанието на дрехите и позата и създадената визуализация.",
                "При поръчка: име, телефон, имейл (по желание), град, адрес или офис на куриер и бележка към поръчката.",
                "При абонамент за бюлетина: имейл и език.",
                "При съобщение през формата за контакт: име, имейл, телефон (по желание) и текста на съобщението.",
                "Технически данни: IP адрес, използван само временно за защита от злоупотреби (ограничаване на броя заявки).",
              ],
            ],
          },
          {
            title: "Цели и правно основание",
            body: [
              [
                "Изработка и доставка на поръчката, комуникация по нея — изпълнение на договор (чл. 6, ал. 1, б. „б“ GDPR).",
                "Счетоводни и данъчни задължения — законово задължение (чл. 6, ал. 1, б. „в“).",
                "Бюлетин — съгласие (чл. 6, ал. 1, б. „а“), което можеш да оттеглиш по всяко време чрез връзката в имейла.",
                "Защита на сайта от злоупотреби — легитимен интерес (чл. 6, ал. 1, б. „е“).",
              ],
            ],
          },
          {
            title: "Снимки и изкуствен интелект",
            body: [
              "За да създадем визуализацията, снимката ти се изпраща за обработка на xAI (модел Grok Imagine), САЩ. Използваме я само за генериране на визуализацията на твоята фигурка. Не използваме снимките за обучение на модели и не ги публикуваме без твое изрично съгласие.",
            ],
          },
          {
            title: "На кого предаваме данни",
            body: [
              [
                "Vercel Inc. — хостинг на сайта и затворено хранилище за снимки (Vercel Blob).",
                "Upstash (Redis) — база данни за поръчките, в ЕС (Франкфурт).",
                "xAI — генериране на визуализации.",
                "Resend — изпращане на имейли за поръчката и бюлетина.",
                "Еконт Експрес и Спиди — доставка на пратката (име, телефон, адрес).",
              ],
              "Когато данни се предават извън ЕС, това става въз основа на решение на ЕК за адекватност (Рамка за защита на данните ЕС–САЩ) или стандартни договорни клаузи.",
            ],
          },
          {
            title: "Колко дълго пазим данните",
            body: [
              [
                "Снимки и визуализации, за които не е направена поръчка — изтриват се автоматично до 30 дни.",
                "Снимки към изпълнени поръчки — изтриват се автоматично 12 месеца след поръчката или по-рано по твое искане.",
                "Данни за поръчката (име, адрес, сума) — докато това се изисква от счетоводното и данъчното законодателство.",
                "Бюлетин — до отписване.",
              ],
            ],
          },
          {
            title: "Бисквитки",
            body: [
              ...(tracking
                ? [
                    "Количката и напредъкът в създаването на фигурка се пазят в паметта на браузъра ти (localStorage и IndexedDB). При вход в панела за поръчки се използва една необходима бисквитка за сесия.",
                    "Ако натиснеш „Приемам“ в банера, използваме Google Analytics и Google Ads (Google Ireland Ltd.), за да измерваме посещенията и кои реклами водят до поръчки. Без съгласие тези бисквитки не се записват. Можеш да промениш избора си, като изтриеш данните на сайта от браузъра — банерът ще се покаже отново.",
                  ]
                : [
                    "Сайтът не използва рекламни или проследяващи бисквитки. Количката се пази в паметта на браузъра ти (localStorage), а при вход в панела за поръчки се използва една необходима бисквитка за сесия. Затова не показваме банер за бисквитки.",
                  ]),
            ],
          },
          {
            title: "Твоите права",
            body: [
              "Имаш право на достъп, коригиране, изтриване, ограничаване на обработването, преносимост, възражение и оттегляне на съгласие. За да ги упражниш, пиши ни на " + seller.email + ". Отговаряме до 30 дни.",
              "Имаш право и на жалба до Комисията за защита на личните данни — гр. София, бул. „Проф. Цветан Лазаров“ № 2, cpdp.bg.",
            ],
          },
          { title: "Промени", body: [`Последна актуализация: ${legalUpdated}.`] },
        ],
      };
    case "returns":
      return {
        kicker: "Клиенти",
        title: "Връщане и рекламации",
        description: "Кога може да се откаже поръчка, как се прави рекламация и какво става при повредена пратка.",
        sections: [
          {
            title: "Отказ преди потвърждение",
            body: ["Можеш да откажеш поръчката безплатно, докато не сме я потвърдили по телефона. Просто ни пиши или ни кажи при обаждането."],
          },
          {
            title: "Защо няма 14-дневно право на връщане",
            body: [
              "Всяка фигурка и всеки ключодържател се изработват специално по твоя снимка. Съгласно чл. 57, т. 3 от Закона за защита на потребителите правото на отказ в 14-дневен срок не се прилага за такива персонализирани стоки. Не можем да препродадем фигурка на друг човек.",
              "Ако откажеш да получиш пратка, която отговаря на поръчката, имаме право да поискаме разходите за изработката и доставката.",
            ],
          },
          {
            title: "Повредена пратка",
            body: [
              "Прегледай пратката пред куриера, преди да платиш. Ако е видимо повредена, откажи я или направи констативен протокол с куриера.",
              "Ако откриеш повреда след получаване, пиши ни възможно най-скоро — най-добре до 48 часа — със снимки на изделието и опаковката. Ще изработим нова фигурка без заплащане или ще върнем парите. Това не ограничава правата ти по законовата гаранция.",
            ],
          },
          {
            title: "Рекламация (законова гаранция)",
            body: [
              "Ако изделието не отговаря на поръчката — например грешен размер, липсващ елемент или дефект в изработката — имаш право на рекламация в рамките на 2 години от получаването.",
              [
                "Пиши на " + seller.email + " с номера на поръчката (HC-…), описание на проблема и снимки.",
                "Ще ти отговорим до 7 дни и ще предложим поправка, нова изработка или възстановяване на сумата.",
                "Рекламацията се решава до 1 месец от предявяването ѝ.",
              ],
              "Малки разлики спрямо визуализацията в детайлите, нюансите и пропорциите са естествени за ръчна изработка и не са дефект.",
            ],
          },
          { title: "Връщане на пари", body: ["При уважена рекламация връщаме сумата по банков път до 14 дни, по сметка, посочена от теб."] },
        ],
      };
    case "delivery":
      return {
        kicker: "Клиенти",
        title: "Доставка и плащане",
        description: "Срокове, куриери, цени на доставката и плащане с наложен платеж в цяла България.",
        sections: [
          {
            title: "Къде доставяме",
            body: ["Доставяме в цяла България — до офис на Еконт, до офис на Спиди или до адрес. Засега не изпращаме извън България."],
          },
          {
            title: "Срокове",
            body: [
              [
                "Потвърждаваме поръчката по телефона, обикновено в рамките на 1 работен ден.",
                `Изработка: ${days.bg} от потвърждението.`,
                "Доставка от куриера: обикновено 1–2 работни дни.",
              ],
              "Ако ти трябва за конкретна дата, напиши я в бележката към поръчката и ще ти кажем по телефона дали успяваме.",
            ],
          },
          {
            title: "Цена на доставката",
            body: [
              "Доставката се заплаща от получателя по тарифата на избрания куриер (Еконт или Спиди) и зависи от вида доставка — до офис или до адрес. Куриерът начислява и такса за наложения платеж по своята тарифа.",
            ],
          },
          {
            title: "Плащане",
            body: [
              "Плащаш с наложен платеж при получаване — на куриера, в брой или с карта, според възможностите на куриера. Имаш право да прегледаш пратката преди да платиш.",
            ],
          },
          {
            title: "Проследяване",
            body: ["Когато изпратим пратката, ще получиш имейл с номера на товарителницата и линк за проследяване (ако си посочил имейл)."],
          },
          {
            title: "Опаковка",
            body: ["Всяка фигурка пътува в кутия с мека защита. Ако е подарък, напиши го в бележката и няма да слагаме цената вътре."],
          },
        ],
      };
  }
}

function en(id: LegalId): LegalDoc {
  switch (id) {
    case "terms":
      return {
        kicker: "Legal",
        title: "Terms and conditions",
        description: "Terms for ordering custom figurines and keychains made from a photo from HandyCrafts.",
        sections: [
          { title: "Seller", body: [...sellerLines("en"), "These terms govern the relationship between the seller and anyone who orders through handy-crafts.digital (the “customer”)."] },
          {
            title: "Subject",
            body: [
              "Through the site the customer orders custom figurines and keychains made from their photo and instructions. Before ordering, the site creates an indicative preview with artificial intelligence.",
              "The preview shows the style, pose and clothes. The finished piece is modelled, 3D printed and finished by hand from it and from the original photo, so small differences in detail, colour and proportion are possible. They are not a lack of conformity.",
            ],
          },
          {
            title: "Ordering and the contract",
            body: [
              "The customer chooses a product and size, uploads a photo, gets a preview, adds it to the cart and fills in delivery details. Pressing “Order with obligation to pay” is an offer to buy.",
              "Receipt of the order is confirmed by email (if given). The contract is concluded when the seller confirms the order by phone or email. The seller may decline an order if the photo is unsuitable, the content is unlawful or the piece can't be made.",
            ],
          },
          {
            title: "Prices and payment",
            body: [
              "Prices are in euro and cover making the piece. Delivery is not included and is charged at the rate of the chosen courier.",
              "Payment is cash on delivery — to the courier on receipt, in cash or by card where the courier offers it. The seller issues a sales document as required by law.",
            ],
          },
          { title: "Making and delivery time", body: [`Making usually takes ${days.en} from confirmation, after which the parcel goes to the courier. See the “Delivery” page for details.`] },
          {
            title: "Right of withdrawal",
            body: [
              "Under Art. 57(3) of the Bulgarian Consumer Protection Act, the 14-day right of withdrawal does not apply to goods made to the consumer's specifications or clearly personalised. Figurines and keychains are made from the customer's photo and fall under this exception.",
              "The customer can cancel free of charge until the order is confirmed. See the “Returns and complaints” page.",
            ],
          },
          { title: "Legal guarantee and complaints", body: ["The customer has a 2-year legal guarantee of conformity from receipt of the goods under Bulgarian law. Complaints are accepted by email as described on the “Returns and complaints” page."] },
          {
            title: "Photos and rights",
            body: [
              "By uploading a photo the customer confirms they have the right to use it and that the people in it agree to it being used to make a figurine. The customer allows the seller to use the photo only for the preview and making the order.",
              "We don't accept photos with unlawful, offensive or violent content, photos of minors without a parent's consent, or images protected by copyright or trademark without the owner's permission.",
              "We show photos of finished pieces on the site or social media only with the customer's explicit consent.",
            ],
          },
          { title: "Personal data", body: ["How we process personal data is described in the “Privacy policy”."] },
          {
            title: "Disputes",
            body: [
              "Disputes are settled by agreement. The customer may contact the Bulgarian Commission for Consumer Protection (kzp.bg) or its conciliation committees for out-of-court resolution.",
              "Bulgarian law applies to matters not covered here.",
            ],
          },
          { title: "Changes", body: [`The seller may change these terms. Each order is governed by the terms published when it was placed. Last updated: ${legalUpdated}.`] },
        ],
      };
    case "privacy":
      return {
        kicker: "Personal data",
        title: "Privacy policy",
        description: "How HandyCrafts collects, uses and protects customers' personal data and photos.",
        sections: [
          { title: "Controller", body: [...sellerLines("en"), "The controller processes personal data under Regulation (EU) 2016/679 (GDPR) and the Bulgarian Personal Data Protection Act."] },
          {
            title: "What we collect",
            body: [
              [
                "The photo you upload in the studio, your description of clothes and pose, and the generated preview.",
                "When you order: name, phone, email (optional), city, address or courier office, and your order note.",
                "When you join the newsletter: email and language.",
                "When you use the contact form: name, email, phone (optional) and your message.",
                "Technical data: IP address, used only briefly to protect the site from abuse (rate limiting).",
              ],
            ],
          },
          {
            title: "Purposes and legal basis",
            body: [
              [
                "Making and delivering the order and talking to you about it — performance of a contract (Art. 6(1)(b) GDPR).",
                "Accounting and tax duties — legal obligation (Art. 6(1)(c)).",
                "Newsletter — consent (Art. 6(1)(a)), which you can withdraw at any time via the link in each email.",
                "Protecting the site from abuse — legitimate interest (Art. 6(1)(f)).",
              ],
            ],
          },
          {
            title: "Photos and artificial intelligence",
            body: [
              "To create the preview, your photo is sent for processing to xAI (Grok Imagine model), USA. We use it only to generate the preview of your figurine. We don't use photos to train models and don't publish them without your explicit consent.",
            ],
          },
          {
            title: "Who we share data with",
            body: [
              [
                "Vercel Inc. — website hosting and private photo storage (Vercel Blob).",
                "Upstash (Redis) — order database, in the EU (Frankfurt).",
                "xAI — generating previews.",
                "Resend — sending order and newsletter emails.",
                "Econt Express and Speedy — delivering the parcel (name, phone, address).",
              ],
              "Transfers outside the EU rely on an EU adequacy decision (EU–US Data Privacy Framework) or standard contractual clauses.",
            ],
          },
          {
            title: "How long we keep data",
            body: [
              [
                "Photos and previews that were not ordered — deleted automatically within 30 days.",
                "Photos for completed orders — deleted automatically 12 months after the order, or sooner if you ask.",
                "Order data (name, address, amount) — as long as accounting and tax law requires.",
                "Newsletter — until you unsubscribe.",
              ],
            ],
          },
          {
            title: "Cookies",
            body: [
              ...(tracking
                ? [
                    "Your cart and your progress in the studio are stored in your browser (localStorage and IndexedDB). One necessary session cookie is used when logging in to the order panel.",
                    "If you click \"Accept\" in the banner, we use Google Analytics and Google Ads (Google Ireland Ltd.) to measure visits and which ads lead to orders. Without consent these cookies are not set. You can change your choice by clearing the site's data in your browser — the banner will appear again.",
                  ]
                : [
                    "The site uses no advertising or tracking cookies. Your cart is stored in your browser (localStorage), and one necessary session cookie is used when logging in to the order panel. That's why there is no cookie banner.",
                  ]),
            ],
          },
          {
            title: "Your rights",
            body: [
              "You have the right of access, rectification, erasure, restriction, portability, objection and withdrawal of consent. To use them, email " + seller.email + ". We reply within 30 days.",
              "You can also complain to the Bulgarian Commission for Personal Data Protection — 2 Prof. Tsvetan Lazarov Blvd, Sofia, cpdp.bg.",
            ],
          },
          { title: "Changes", body: [`Last updated: ${legalUpdated}.`] },
        ],
      };
    case "returns":
      return {
        kicker: "Customers",
        title: "Returns and complaints",
        description: "When an order can be cancelled, how to make a complaint and what happens with a damaged parcel.",
        sections: [
          { title: "Cancelling before confirmation", body: ["You can cancel free of charge until we confirm the order by phone. Just write to us or tell us when we call."] },
          {
            title: "Why there is no 14-day return",
            body: [
              "Every figurine and keychain is made specially from your photo. Under Art. 57(3) of the Bulgarian Consumer Protection Act, the 14-day right of withdrawal does not apply to such personalised goods. We can't resell a figurine to someone else.",
              "If you refuse a parcel that matches the order, we may ask you to cover the cost of making and shipping it.",
            ],
          },
          {
            title: "Damaged parcel",
            body: [
              "Check the parcel in front of the courier before paying. If it is visibly damaged, refuse it or have the courier write a damage report.",
              "If you find damage after receipt, write to us as soon as possible — ideally within 48 hours — with photos of the piece and packaging. We'll make a new one free of charge or refund you. This doesn't limit your rights under the legal guarantee.",
            ],
          },
          {
            title: "Complaints (legal guarantee)",
            body: [
              "If the piece doesn't match the order — for example the wrong size, a missing element or a making defect — you can make a complaint within 2 years of receipt.",
              [
                "Email " + seller.email + " with the order number (HC-…), a description and photos.",
                "We reply within 7 days and offer a repair, a remake or a refund.",
                "Complaints are resolved within 1 month.",
              ],
              "Small differences from the preview in detail, shade and proportion are natural for handmade work and are not a defect.",
            ],
          },
          { title: "Refunds", body: ["For an accepted complaint we refund by bank transfer within 14 days to an account you give us."] },
        ],
      };
    case "delivery":
      return {
        kicker: "Customers",
        title: "Delivery and payment",
        description: "Timing, couriers, delivery costs and cash on delivery across Bulgaria.",
        sections: [
          { title: "Where we deliver", body: ["We deliver anywhere in Bulgaria — to an Econt office, a Speedy office or an address. For now we don't ship outside Bulgaria."] },
          {
            title: "Timing",
            body: [
              [
                "We confirm the order by phone, usually within 1 working day.",
                `Making: ${days.en} from confirmation.`,
                "Courier delivery: usually 1–2 working days.",
              ],
              "If you need it by a certain date, add it to the order note and we'll tell you by phone whether we can make it.",
            ],
          },
          { title: "Delivery cost", body: ["Delivery is paid by the recipient at the rate of the chosen courier (Econt or Speedy) and depends on office or address delivery. The courier also charges a cash-on-delivery fee at its own rate."] },
          { title: "Payment", body: ["You pay cash on delivery — to the courier, in cash or by card where offered. You may inspect the parcel before paying."] },
          { title: "Tracking", body: ["When we ship, you'll get an email with the tracking number and a tracking link (if you gave an email)."] },
          { title: "Packaging", body: ["Every figurine travels in a padded box. If it's a gift, say so in the note and we won't put the price inside."] },
        ],
      };
  }
}
