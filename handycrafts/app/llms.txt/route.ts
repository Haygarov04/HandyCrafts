import { catalog, priceFor, productionDays } from "@/lib/catalog";
import { landingLinks } from "@/lib/landing-links";
import { absolute, business, siteName, socials } from "@/lib/site";

// A plain-text summary of the shop for AI search (ChatGPT, Perplexity, Claude…), see llmstxt.org.
export const dynamic = "force-static";

const eur = (value: number | null) => `${value} €`;

export function GET() {
  const figurine = catalog.figurine.sizes.map((s) => `${s.cm} см — ${eur(s.price)} (2 души ${eur(s.group[2])}, 3 души ${eur(s.group[3])})`);
  const kit = catalog.kit.sizes.map(
    (s) => `${s.cm} см — ${eur(s.price)} (2 души ${eur(s.group[2])}, 3 души ${eur(s.group[3])}, домашен любимец ${eur(priceFor("kit", s.cm, 1, "pet"))})`
  );
  const keychain = catalog.keychain.sizes.map((s) => `${s.cm} см — ${eur(s.price)}`);
  const text = `# ${siteName} — персонализирани 3D фигурки по снимка

> ${siteName} (handy-crafts.digital) е работилница в ${business.city}, България, която прави персонализирани 3D фигурки по снимка на хора, двойки, семейства и домашни любимци. Клиентът качва снимка, вижда безплатна визуализация за около минута и поръчва с наложен платеж. Доставка с Еконт и Спиди в цяла България.

## Продукти и цени (EUR)

### Ръчно оцветена фигурка по снимка — от ${eur(catalog.figurine.sizes[0].price)}
${figurine.map((line) => `- ${line}`).join("\n")}

### „Оцвети сам“ — фигурка за оцветяване по снимка — от ${eur(priceFor("kit", catalog.kit.sizes[0].cm, 1, "pet"))}
Пристига бяла и грундирана, с 6 бои в нейните цветове, 2 четки и шаблон за оцветяване. Подарък за семейства и двойки.
${kit.map((line) => `- ${line}`).join("\n")}

### Ключодържател на домашен любимец — от ${eur(catalog.keychain.sizes[0].price)}
${keychain.map((line) => `- ${line}`).join("\n")}

## Как работи
- Качваш снимка на ${absolute("/studio")} и за около минута виждаш визуализация.
- Поръчваш само ако ти харесва; потвърждаваме по телефона.
- Изработка: ${productionDays}. Доставка: 1–2 работни дни с Еконт или Спиди.
- Плащане: наложен платеж при получаване.

## Страници
- [Начало](${absolute("/")})
- [Създай фигурка (визуализация)](${absolute("/studio")})
${landingLinks.map((page) => `- [${page.label.bg}](${absolute(page.path)})`).join("\n")}
- [Доставка](${absolute("/dostavka")})
- [Контакти](${absolute("/contact")})

## Контакти
- Имейл: ${business.email}
${socials.map((profile) => `- ${profile.name}: ${profile.url}`).join("\n")}
`;
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
