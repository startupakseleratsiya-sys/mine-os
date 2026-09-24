import { PPP_COURSE } from "./ppp-course";

/**
 * Kurslar va boblar — yagona manba.
 * Bazada faqat progress (kim qaysi bobni tugatdi) saqlanadi, kontent shu yerda.
 */

export type Chapter = {
  id: string;
  title: string;
  minutes: number;
  /** Markdown-lite: #, ##, ###, >, -, 1., **bold**, --- */
  body: string;
  source?: { title: string; file: string; pages: number; reading: string; startPage?: number };
  quiz?: QuizQuestion[];
  objectives?: string[];
  terms?: { term: string; meaning: string }[];
  flow?: { title: string; description: string }[];
  exercise?: {
    title: string;
    situation: string;
    question: string;
    hint: string;
    choices: { label: string; feedback: string }[];
    answer: number;
  };
};

export type QuizQuestion = {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type CourseIcon = "wallet" | "piggy" | "trending";

export type Course = {
  slug: string;
  title: string;
  /** Kartalar va nav uchun qisqa nom */
  shortTitle: string;
  description: string;
  level: "Boshlang'ich" | "O'rta" | "Yuqori";
  tag: "top" | "new" | null;
  icon: CourseIcon;
  emoji: string;
  outcomes: string[];
  chapters: Chapter[];
  sourceNote?: string;
  modules?: { id: string; title: string; description: string; chapterIds: string[] }[];
};

export const COURSES: Course[] = [
  {
    slug: "shaxsiy-budjet",
    title: "Shaxsiy budjet: Moliyaviy barqarorlik asoslari",
    shortTitle: "Shaxsiy budjet",
    description:
      "Daromad va xarajatlarni to'g'ri rejalashtirish, qarzlardan qutulish va 50/30/20 qoidasini kundalik hayotga tatbiq etish.",
    level: "Boshlang'ich",
    tag: "top",
    icon: "wallet",
    emoji: "📚",
    outcomes: [
      "Budjet tuzish va uni nazorat qilish usullari",
      "50/30/20 qoidasini amalda qo'llash",
      "Kutilmagan xarajatlar uchun moliyaviy yostiqcha yaratish",
      "Kredit va qarzlardan samarali qutulish strategiyalari",
    ],
    chapters: [
      {
        id: "mod-1",
        title: "1-Bob: Moliyaviy rejalashtirishga kirish",
        minutes: 15,
        body: `# Moliyaviy rejalashtirishga kirish

Budjet — bu cheklov emas, balki pulingiz qayerga ketayotganini **siz** hal qilishingiz. Rejasi yo'q pul har doim "qayoqqadir" ketadi.

## Nega ko'pchilik budjet tuzmaydi?

- "Daromadim kam, rejalashtirishga hojat yo'q" — aslida daromad qancha kam bo'lsa, reja shuncha muhim.
- "Hisob-kitob zerikarli" — birinchi oy 30 daqiqa, keyin haftasiga 5 daqiqa kifoya.
- "Baribir reja buziladi" — reja buzilishi normal; maqsad mukammallik emas, ko'rish.

## Uchta savol

Har qanday moliyaviy reja shu uchta savoldan boshlanadi:

1. **Qancha kiradi?** Oylik, qo'shimcha daromad, bonuslar — hammasi qo'lga tegadigan (soliqdan keyingi) summada.
2. **Qancha chiqadi?** Ijara, kommunal, oziq-ovqat, transport, kredit to'lovlari, obunalar.
3. **Farq qayerga ketadi?** Agar javob "bilmayman" bo'lsa — aynan shu joyda pul yo'qolmoqda.

> Qoida: o'lchanmagan narsani boshqarib bo'lmaydi. Avval bir oy faqat yozib boring, hech narsani o'zgartirmang.

## Amaliy topshiriq

Telefon eslatmasida yoki oddiy jadvalda oxirgi 30 kunlik xarajatlaringizni 5 ta toifaga ajrating: uy-joy, oziq-ovqat, transport, qarzlar, boshqa. Eng katta toifani belgilang — keyingi bobda aynan u bilan ishlaymiz.`,
      },
      {
        id: "mod-2",
        title: "2-Bob: 50/30/20 qoidasi nima?",
        minutes: 20,
        body: `# 50/30/20 qoidasi

Bu qoida murakkab jadvallarsiz budjetni uch qismga bo'lishning eng sodda usuli. Asos — **sof oylik daromad** (qo'lga tegadigan summa).

## Uchta savat

1. **50% — Ehtiyojlar.** Ularsiz yashab bo'lmaydi: ijara yoki ipoteka, kommunal, asosiy oziq-ovqat, ishga qatnov, majburiy kredit to'lovlari, dori.
2. **30% — Istaklar.** Hayotni yoqimli qiladi, lekin shart emas: kafe, kiyim, sayohat, obunalar, gadjetlar.
3. **20% — Kelajak.** Jamg'arma, favqulodda fond, qarzlarni muddatidan oldin yopish, investitsiya.

## Misol: 6 000 000 so'm

- Ehtiyojlar: 3 000 000 so'm
- Istaklar: 1 800 000 so'm
- Kelajak: 1 200 000 so'm

> Agar ehtiyojlar 50% dan oshsa (ko'p shaharlarda ijara tufayli shunday), istaklar ulushini kamaytiring, lekin **20% ni tegmang**. Kelajak savati — birinchi navbatda to'ldiriladigan savat.

## Ko'p uchraydigan xato

Ehtiyoj va istak chegarasi xiralashadi. Oziq-ovqat — ehtiyoj, lekin har kuni yetkazib berish xizmati — istak. Telefon — ehtiyoj, eng yangi modeli — istak. O'zingizga halol bo'ling.

## Amaliy topshiriq

Kalkulyatorlar bo'limidagi **"Oylik budjet (50/30/20)"** vositasiga o'z daromadingizni kiriting va oldingi bobda yozgan real xarajatlaringiz bilan solishtiring. Qaysi savat "to'lib ketgan"?`,
      },
      {
        id: "mod-3",
        title: "3-Bob: Xarajatlarni audit qilish",
        minutes: 15,
        body: `# Xarajatlarni audit qilish

Audit — bu o'zingizni ayblash emas. Bu "qaysi xarajat menga haqiqatan qiymat beradi?" degan savol.

## Uch turdagi "sizib chiqish"

- **Kichik, tez-tez.** Kuniga 25 000 so'mlik kofe — oyiga 750 000, yiliga 9 million so'm.
- **Unutilgan obunalar.** Ishlatilmayotgan ilovalar, sport zali, streaming — hisobdan avtomatik yechiladi.
- **Impulsiv xaridlar.** Chegirma "faqat bugun" — aslida sizga kerak emas edi.

## 4 qadamli audit

1. Oxirgi 3 oylik bank ko'chirmasini oching (ilovada "tarix" bo'limi).
2. Har bir xarajat oldiga belgi qo'ying: **K** (kerak), **X** (xohlagan edim, qiymat berdi), **B** (bekor).
3. Barcha **B** larni jamlang — bu sizning "yo'qolgan" pulingiz.
4. Shu summaning kamida yarmini keyingi oy jamg'armaga avtomatik o'tkazing.

> 72 soat qoidasi: 300 000 so'mdan qimmat rejalashtirilmagan xaridni 3 kun kutib turing. Ko'pincha istak o'tib ketadi.

## Amaliy topshiriq

Bugun telefoningizdagi barcha pullik obunalar ro'yxatini tuzing. Oxirgi 30 kunda ochmaganingizni bekor qiling.`,
      },
      {
        id: "mod-4",
        title: "4-Bob: Favqulodda vaziyatlar fondi",
        minutes: 25,
        body: `# Favqulodda vaziyatlar fondi (Emergency fund)

Bu — ishdan ayrilish, kasallik, mashina ta'miri kabi kutilmagan holatlar uchun **alohida** saqlanadigan pul. U investitsiya emas, u xavfsizlik yostig'i.

## Qancha bo'lishi kerak?

- **Boshlang'ich maqsad:** 1 oylik majburiy xarajat (ijara + oziq-ovqat + kommunal + kredit).
- **To'liq maqsad:** 3–6 oylik majburiy xarajat. Daromadi nobarqaror bo'lganlar (frilanser, tadbirkor) uchun 6–12 oy.

Masalan, majburiy xarajatlar oyiga 3 500 000 so'm bo'lsa, boshlang'ich maqsad — 3 500 000, to'liq maqsad — 10,5–21 million so'm.

## Qayerda saqlash kerak?

1. Kundalik kartadan **alohida** hisobda — ko'z oldida bo'lmasin.
2. Tez yechib olish mumkin bo'lsin (1–2 kun ichida).
3. Foiz beradigan, lekin xavfsiz joyda: bank depoziti (talab qilib olinadigan), jamg'arma hisob.

> Favqulodda fondni aksiya yoki kriptoga qo'ymang. Kerak bo'lgan kuni bozor pastda bo'lishi mumkin.

## Nima "favqulodda" emas?

Yangi telefon, ta'til, to'y sovg'asi — bular rejalashtiriladigan xarajatlar. Ular uchun alohida maqsadli jamg'arma oching.

## Amaliy topshiriq

Kalkulyatorlardagi **"Maqsad kalkulyatori"** ga o'zingizning 3 oylik majburiy xarajatingizni kiriting va 12 oy ichida yig'ish uchun oylik summani aniqlang. Shu summaga bugun avtomatik o'tkazma sozlang — oylik kelgan kuniga.`,
      },
    ],
  },
  {
    slug: "jamgarma-tizimi",
    title: "Jamg'arma tizimi: Pullarni ko'paytirish",
    shortTitle: "Jamg'arma tizimi",
    description:
      "Maqsadga muvofiq jamg'arma strategiyasi, inflyatsiyadan himoyalanish va pulni avtomatik to'plash tizimini o'rganing.",
    level: "Boshlang'ich",
    tag: null,
    icon: "piggy",
    emoji: "🐷",
    outcomes: [
      "SMART tamoyilida jamg'arma maqsadlarini belgilash",
      "Inflyatsiya ta'sirini tushunish va hisoblash",
      "Pulni avtomatlashtirilgan tarzda yig'ish tizimi",
    ],
    chapters: [
      {
        id: "mod-1",
        title: "1-Bob: Nega jamg'arish kerak?",
        minutes: 10,
        body: `# Nega jamg'arish kerak?

Jamg'arma — "qolgan pulni saqlash" emas. Jamg'arma — **avval o'zingizga to'lash**, keyin qolganini sarflash.

## Jamg'armaning uch vazifasi

1. **Himoya.** Kutilmagan xarajatda qarzga botmaslik (favqulodda fond).
2. **Erkinlik.** Yoqmagan ishdan ketish, o'qish, ko'chish uchun imkoniyat.
3. **O'sish.** Yig'ilgan pul investitsiyaga aylanib, o'zi daromad keltira boshlaydi.

## "Avval o'zingizga to'lang"

Ko'pchilik shunday qiladi: daromad → xarajatlar → qolgani jamg'arma (ko'pincha nol). Ishlaydigan tartib esa teskari:

> daromad → jamg'arma (avtomatik) → xarajatlar (qolgani bilan)

Oylik kelgan kuni 10–20% avtomatik alohida hisobga o'tsa, siz uni "yo'q" deb hisoblaysiz va xarajatlar o'z-o'zidan moslashadi.

## Kichik boshlang

Daromadning 5% idan boshlang. Uch oydan keyin 10% ga oshiring. Muhimi — summa emas, **odat**.

## Amaliy topshiriq

Bank ilovangizda "avtoto'lov" yoki "jamg'arma hisob" funksiyasini toping va oylik kelgan kunga daromadning 5% miqdorida avtomatik o'tkazma sozlang.`,
      },
      {
        id: "mod-2",
        title: "2-Bob: Inflyatsiya va pulning qadri",
        minutes: 15,
        body: `# Inflyatsiya va pulning qadri

Inflyatsiya — narxlarning umumiy o'sishi. Bu shuni anglatadiki, **yostiq ostidagi pul har yili kamayadi**, garchi raqam o'zgarmasa ham.

## Oddiy misol

Yillik inflyatsiya 10% bo'lsa:

- Bugun 1 000 000 so'mga olinadigan narsa bir yildan keyin 1 100 000 so'm turadi.
- Yostiq ostidagi 1 000 000 so'm bir yildan keyin bugungi 909 000 so'mga teng bo'ladi.
- 5 yilda uning qadri qariyb **40%** ga tushadi.

## "Real" va "nominal" daromad

- Depozit 18% bersa, inflyatsiya 10% bo'lsa — **real** daromadingiz taxminan 8%.
- Depozit 8% bersa, inflyatsiya 10% bo'lsa — siz aslida yiliga 2% **yo'qotyapsiz**, garchi hisob o'sayotgandek ko'rinsa ham.

> Qoida: jamg'armaning daromadi inflyatsiyadan yuqori bo'lishi kerak. Aks holda bu jamg'arma emas, sekin yo'qotish.

## O'zbekiston konteksti

Rasmiy inflyatsiya ko'rsatkichini Markaziy bank har oy e'lon qiladi. Depozit stavkalarini shu raqam bilan solishtiring. Ma'lumotlar o'zgarib turadi — qaror oldidan rasmiy manbani tekshiring.

## Amaliy topshiriq

Kalkulyatorlardagi **"Murakkab foiz"** vositasida 5 000 000 so'mni 5 yilga 8% va 18% stavkada solishtiring. Farq — inflyatsiyani yutish narxi.`,
      },
      {
        id: "mod-3",
        title: "3-Bob: SMART maqsadlar va avtomatlashtirish",
        minutes: 20,
        body: `# SMART maqsadlar va avtomatlashtirish

"Ko'proq jamg'arishim kerak" — bu maqsad emas, istak. Maqsad aniq, o'lchanadigan va muddatli bo'ladi.

## SMART

- **S — Specific (aniq):** "Noutbuk uchun" emas, "12 million so'mlik ish noutbuki".
- **M — Measurable (o'lchanadigan):** summa raqamda.
- **A — Achievable (erishish mumkin):** oylik daromadga mos.
- **R — Relevant (muhim):** bu haqiqatan sizga kerakmi?
- **T — Time-bound (muddatli):** "2027-yil mart".

Natija: **"2027-yil martgacha 12 000 000 so'm — oyiga 800 000 so'mdan."**

## Maqsadlarni ajrating

Har bir maqsad uchun alohida "konvert" (bank ilovalarida "maqsadli hisob" yoki "jamg'arma"):

1. Favqulodda fond — birinchi navbat.
2. Qisqa muddatli (1 yilgacha): sayohat, texnika.
3. O'rta muddatli (1–5 yil): mashina, boshlang'ich to'lov.
4. Uzoq muddatli (5+ yil): uy, pensiya, farzand ta'limi — bu yerda investitsiya ishga tushadi.

## Avtomatlashtirish — tizimning yuragi

> Iroda kuchiga tayanmang. Tizimga tayaning.

- Oylik kuni: avtomatik o'tkazma har bir maqsadga.
- Bonus yoki qo'shimcha daromad: kamida 50% i to'g'ridan-to'g'ri maqsadlarga.
- Har 3 oyda: summalarni qayta ko'rib chiqish (daromad oshdimi?).

## Amaliy topshiriq

Uchta SMART maqsad yozing (bittasi favqulodda fond bo'lsin). Har biri uchun **"Maqsad kalkulyatori"** da oylik summani hisoblang va bank ilovasida alohida jamg'arma oching.`,
      },
    ],
  },
  {
    slug: "investitsiya-asoslari",
    title: "Investitsiya asoslari: Kelajak poydevori",
    shortTitle: "Investitsiya asoslari",
    description:
      "Aksiyalar, obligatsiyalar, indeks fondlari va portfel diversifikatsiyasi haqida amaliy hamda nazariy tushunchalar.",
    level: "O'rta",
    tag: "new",
    icon: "trending",
    emoji: "📈",
    outcomes: [
      "Murakkab foiz va vaqtning kuchini tushunish",
      "Aksiya, obligatsiya va indeks fondlari farqi",
      "Tavakkalchilikni boshqarish va diversifikatsiya",
      "Uzoq muddatli portfel tuzish tamoyillari",
    ],
    chapters: [
      {
        id: "mod-1",
        title: "1-Bob: Sakkizinchi mo'jiza — murakkab foiz",
        minutes: 20,
        body: `# Murakkab foiz

Oddiy foizda daromad faqat asosiy summadan hisoblanadi. Murakkab foizda esa **foiz ham foiz keltiradi**. Vaqt o'tgan sari farq ulkan bo'ladi.

## Raqamlar bilan

10 000 000 so'm, yiliga 15%:

- 1 yil: 11 500 000
- 5 yil: 20 100 000
- 10 yil: 40 500 000
- 20 yil: 163 700 000

E'tibor bering: birinchi 10 yilda 30 million qo'shildi, keyingi 10 yilda — 123 million. **Vaqt — eng kuchli omil.**

## "72 qoidasi"

Pul necha yilda ikki barobar bo'lishini taxminan bilish uchun 72 ni yillik foizga bo'ling:

- 8% → 9 yil
- 12% → 6 yil
- 18% → 4 yil

## Erta boshlash

> Oyiga 500 000 so'mdan 25 yoshda boshlagan odam 45 yoshda oyiga 1 500 000 so'mdan 35 yoshda boshlagan odamdan ko'proq yig'adi (bir xil stavkada).

Shuning uchun "kam bo'lsa ham hozir" — "ko'p bo'lsa ham keyin" dan yaxshi.

## Amaliy topshiriq

**"Murakkab foiz"** kalkulyatorida o'zingizning real oylik jamg'armangizni kiriting va 10, 20, 30 yillik natijani solishtiring. Muddatning ta'sirini o'z raqamlaringizda ko'ring.`,
      },
      {
        id: "mod-2",
        title: "2-Bob: Aksiyalar bozori nima?",
        minutes: 25,
        body: `# Aksiyalar bozori

Aksiya — kompaniyaning kichik bir bo'lagi. Aksiya sotib olsangiz, siz kompaniyaning **hammuallifi** bo'lasiz: u o'ssa, sizning ulushingiz ham o'sadi; u foyda taqsimlasa (dividend), sizga ham tegadi.

## Daromad qayerdan keladi?

1. **Narx o'sishi.** 100 000 so'mga olib, 130 000 so'mga sotdingiz.
2. **Dividendlar.** Kompaniya foydasining bir qismi aksiyadorlarga to'lanadi.

## Narx nega tebranadi?

Kompaniya natijalari, iqtisodiy yangiliklar, foiz stavkalari va... odamlarning kayfiyati. Qisqa muddatda bozor — ovoz berish mashinasi, uzoq muddatda — tarozi.

> Kunlik narxga qarab qaror qilmang. Bir kunlik 5% tushish — 20 yillik rejada shovqin, xolos.

## Alohida aksiya vs indeks fondi

- **Alohida aksiya:** bitta kompaniyaga tikish. Yuqori potentsial, yuqori xavf, ko'p tahlil talab qiladi.
- **Indeks fondi (ETF):** bir vaqtning o'zida yuzlab kompaniya. Bitta kompaniya bankrot bo'lsa, portfelga ta'siri kichik. Ko'pchilik uchun boshlang'ich nuqta.

## O'zbekistonda

Toshkent fond birjasida mahalliy kompaniyalar aksiyalari savdosi mavjud; xalqaro bozorlarga chiqish uchun litsenziyalangan brokerlar orqali ishlanadi. Qonunchilik va soliq qoidalari o'zgarib turadi — har doim rasmiy manbani tekshiring.

## Amaliy topshiriq

Har kuni ishlatadigan 3 ta mahsulot yoki xizmatni yozing (telefon, ilova, do'kon). Ularning ortida qaysi kompaniya turganini va u ochiq savdoda ekanini aniqlang. Investor kabi fikrlashning birinchi qadami shu.`,
      },
      {
        id: "mod-3",
        title: "3-Bob: Obligatsiyalar va davlat qimmatli qog'ozlari",
        minutes: 20,
        body: `# Obligatsiyalar

Obligatsiya — bu **qarz**. Siz davlat yoki kompaniyaga pul berasiz, ular belgilangan muddatda foizi bilan qaytaradi. Aksiya sizni hammuallif qilsa, obligatsiya — kreditor.

## Asosiy tushunchalar

- **Nominal:** qaytariladigan asosiy summa.
- **Kupon:** davriy foiz to'lovi (masalan, yiliga 16%).
- **Muddat (maturity):** pul qachon qaytadi (1 yil, 3 yil, 10 yil).

## Nega kerak?

1. **Barqarorlik.** Daromad oldindan ma'lum, tebranish aksiyadan ancha kam.
2. **Muvozanat.** Bozor tushganda obligatsiyalar portfelni ushlab turadi.
3. **Yaqin maqsadlar.** 1–3 yil ichida kerak bo'ladigan pulni aksiyaga qo'ymang — obligatsiya yoki depozit.

## Xavflar bor

- **Emitent xavfi:** kompaniya to'lay olmasligi mumkin. Davlat obligatsiyalari odatda eng ishonchli.
- **Inflyatsiya xavfi:** 12% kupon, 14% inflyatsiya — real yo'qotish.
- **Foiz stavkasi xavfi:** stavkalar oshsa, eski obligatsiya narxi tushadi (muddatidan oldin sotmoqchi bo'lsangiz).

> Depozit va obligatsiya o'xshash, lekin obligatsiyani bozorda sotish mumkin, depozitni esa muddatidan oldin buzsangiz foizni yo'qotasiz.

## Amaliy topshiriq

Davlat qimmatli qog'ozlarining joriy daromadliligini (Moliya vazirligi yoki Markaziy bank sayti) rasmiy inflyatsiya bilan solishtiring. Real daromad musbatmi?`,
      },
      {
        id: "mod-4",
        title: "4-Bob: Diversifikatsiya va risklarni kamaytirish",
        minutes: 30,
        body: `# Diversifikatsiya

"Barcha tuxumni bitta savatga solmang." Diversifikatsiya — xavfni bir joyga to'plamaslik. Bu daromadni kafolatlamaydi, lekin **katta yo'qotishdan** himoya qiladi.

## Uch darajada tarqating

1. **Aktiv turlari:** aksiya + obligatsiya + naqd/depozit (+ ko'chmas mulk, oltin).
2. **Geografiya:** faqat bitta mamlakat iqtisodiga bog'lanmang.
3. **Sohalar:** texnologiya, bank, energetika, iste'mol — turli sohalar turli vaqtda o'sadi.

## Oddiy portfel namunasi

Yosh va xavfga chidamlilikka qarab (bu maslahat emas, tuzilma namunasi):

- **Agressiv (uzoq muddat, 10+ yil):** 80% aksiya indeksi, 20% obligatsiya.
- **Mo'tadil:** 60% aksiya, 30% obligatsiya, 10% naqd.
- **Konservativ (yaqin maqsad):** 30% aksiya, 50% obligatsiya, 20% depozit.

## Rebalanslash

Yilda bir marta portfelni dastlabki nisbatga qaytaring. Aksiyalar o'sib 80% dan 90% ga chiqqan bo'lsa — bir qismini sotib obligatsiyaga o'tkazing. Bu sizni **qimmatda sotib, arzonda olishga** majbur qiladi.

## Xavfni boshqarishning oltin qoidalari

- Favqulodda fondsiz investitsiya qilmang.
- Tushunmagan narsaga pul qo'ymang.
- "Kafolatlangan 5% oylik daromad" — deyarli har doim firibgarlik.
- Qarzga olib investitsiya qilmang.

> Investitsiya — bu marafon. Bozorda **qancha vaqt** bo'lganingiz, **qachon** kirganingizdan muhimroq.

## Yakuniy topshiriq

O'z holatingiz uchun (yosh, maqsad muddati, xavfga chidamlilik) taxminiy portfel nisbatini yozing. Keyin AI Tutorga ko'rsatib, har bir qismning vazifasini tushuntirib berishini so'rang — u sizga qaror emas, tushuncha beradi.`,
      },
    ],
  },
  PPP_COURSE,
];

export function getCourse(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug);
}

export function getChapter(slug: string, chapterId: string) {
  const course = getCourse(slug);
  if (!course) return undefined;
  const index = course.chapters.findIndex((ch) => ch.id === chapterId);
  if (index === -1) return undefined;
  return {
    course,
    chapter: course.chapters[index],
    index,
    prev: index > 0 ? course.chapters[index - 1] : null,
    next: index < course.chapters.length - 1 ? course.chapters[index + 1] : null,
  };
}

export function courseMinutes(course: Course) {
  return course.chapters.reduce((sum, ch) => sum + ch.minutes, 0);
}

export function formatMinutes(total: number) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h === 0) return `${m} daqiqa`;
  if (m === 0) return `${h} soat`;
  return `${h} soat ${m} daqiqa`;
}

export const TOTAL_CHAPTERS = COURSES.reduce((sum, c) => sum + c.chapters.length, 0);
