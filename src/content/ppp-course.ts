import type { Course } from "./courses";
import { PPP_LESSONS } from "./ppp-lessons";

const PPP_BASE: Course = {
  slug: "davlat-xususiy-sheriklik",
  title: "Davlat-xususiy sheriklik: g‘oyadan xizmatgacha",
  shortTitle: "Davlat-xususiy sheriklik (PPP)",
  description: "Loyihani tanlashdan aktivni qaytarishgacha: 8 bobli o‘zbekcha darslik, moliyaviy misollar, qaror qabul qilish mashqlari va 11 asl PDF manba. PPP Guide 2016 asosida.",
  level: "O'rta",
  tag: "new",
  icon: "trending",
  emoji: "🏗️",
  outcomes: [
    "DXSh modelini oddiy davlat xaridi va xususiylashtirishdan farqlash",
    "Loyihaning butun hayot davri va asosiy qaror bosqichlarini tushunish",
    "Iqtisodiy foyda, budjet imkoniyati va moliyalashtirishni ajratish",
    "Risklar, xizmat sifati va to‘lovlar orasidagi bog‘lanishni izohlash",
    "Inglizcha PPP atamalarini o‘qish va bilimni mashq savollari bilan tekshirish",
  ],
  sourceNote: "Manba: ADB, EBRD, IDB, IsDB va WBG (2016), The APMG Public-Private Partnership (PPP) Certification Guide, Washington, DC: World Bank Group. Qo‘llanma litsenziyasi: CC BY 3.0 IGO. Finora darslari asl qo‘llanmaning mustaqil qisqartirilgan moslashtirmasidir; rasmiy tarjima emas. Moslashtirmadagi fikrlar Finoraga tegishli va manba tashkilotlari tomonidan tasdiqlanmagan; ular tarjimadagi xatolar uchun javobgar emas. Misollar va interaktiv savollar Finora tomonidan tuzilgan. Kurs CP3P sertifikatini bermaydi. Namunaviy savollar PDFi: © The APM Group Limited 2016, alohida huquq shartlari faylda ko‘rsatilgan.",
  chapters: [
    {
      id: "ppp-overview", title: "1. DXSh nima va qanday ishlaydi?", minutes: 12,
      source: { title: "Chapter 1: PPP — Introduction and Overview", file: "chapter-1-ppp-introduction-and-overview.pdf", pages: 180, reading: "12–20, 60–75 va 83–100-betlar" },
      body: `# Davlat-xususiy sheriklik nima?

**DXSh** — davlat xizmatini yoki infratuzilmani yaratish va boshqarishda davlat bilan xususiy hamkor o‘rtasidagi uzoq muddatli shartnomaviy munosabat. Inglizcha nomi **Public-Private Partnership (PPP)**. Bu kursda 2016-yilgi xalqaro qo‘llanmaning tushunchalarini o‘rganamiz.

## Asosiy belgilar

- Davlat aholiga qanday xizmat va sifat kerakligini belgilaydi.
- Xususiy hamkor kelishilgan ishlarni bajaradi va muhim risklarning bir qismini oladi.
- To‘lov xizmatning mavjudligi, sifati yoki undan foydalanish bilan bog‘lanadi.
- Qurilishdan tashqari foydalanish va ta’mirlash xarajatlari ham hisobga olinadi.

**Xususiylashtirishda** mulk va xizmat uchun mas’uliyat doimiy ravishda xususiy sektorga o‘tishi mumkin. DXShda davlatning shartnoma bo‘yicha nazorat va hamkorlik roli saqlanadi. Oddiy qurilish buyurtmasining o‘zi ham avtomatik ravishda DXSh bo‘lavermaydi.

## Pul qayerdan keladi?

Qurilish boshida qarz va investor kapitali kerak bo‘lishi mumkin. Keyinchalik xarajatlar **foydalanuvchi to‘lovlari**, **davlat to‘lovlari** yoki ularning aralashmasidan qoplanadi. Boshlang‘ich moliyalashtirish mavjudligi xizmatning aholi yoki budjet uchun arzonligini anglatmaydi.

## O‘quv misoli

Shahar yoritish tizimi uchun xususiy hamkor chiroqlarni o‘rnatadi va ularga xizmat ko‘rsatadi. Davlat to‘lovini ishlaydigan chiroqlar ulushi va nosozlikni bartaraf etish tezligiga bog‘laydi. Shunda hamkor faqat arzon uskuna o‘rnatishga emas, uning uzoq ishlashiga ham qiziqadi. Bu shartli misol; haqiqiy loyiha shartlari alohida baholanadi.

## Amaliy topshiriq

Bir davlat xizmatini tanlang. Foydalanuvchi kim, to‘lovni kim qiladi va xizmat sifati qanday o‘lchanishini uch jumlada yozing. Xususiy hamkor boshqara oladigan bitta riskni belgilang.`,
      quiz: [{ question: "Yoritish loyihasida xizmat sifatiga bog‘langan to‘lov nimani rag‘batlantiradi?", options: ["Faqat qurilishni tez tugatishni", "Chiroqlarning kelishilgan darajada ishlashini", "Davlat nazoratini bekor qilishni"], answer: 1, explanation: "Natijaga bog‘langan to‘lov hamkorning daromadini xizmat sifati bilan bog‘laydi. Qurilishdan keyingi ishlash ham ahamiyatli." }],
    },
    {
      id: "ppp-framework", title: "2. DXSh tizimi va davlatning vazifalari", minutes: 12,
      source: { title: "Chapter 2: Establishing a PPP Framework", file: "chapter-2-establishing-ppp-framework.pdf", pages: 112, reading: "6–16, 64–84 va 93–103-betlar" },
      body: `# DXSh uchun qanday tizim kerak?

**PPP framework** — loyihani tanlash, tasdiqlash, amalga oshirish va nazorat qilishga yo‘l ko‘rsatadigan siyosat, qoidalar, jarayonlar va tashkilotlar majmui. Faqat bitta qonun bilan cheklanmaydi.

## Vazifalarni ajrating

1. **Loyiha tashabbuskori:** muammoni aniqlaydi, xizmat talabi va loyiha taklifini tayyorlaydi.
2. **Moliyaviy nazorat:** davlatning kelajakdagi to‘lovlari va risklarini baholaydi.
3. **DXSh mutaxassislari:** uslubiy yordam va tajriba bilan ta’minlaydi.
4. **Tasdiqlovchi va nazorat qiluvchi organlar:** qarorlarni vakolati doirasida tekshiradi.

Aniq vakolatlar har mamlakat tizimiga bog‘liq. Qo‘llanmadagi xalqaro yondashuvni O‘zbekistonning amaldagi tartibi deb qabul qilmaymiz.

## Ikki turdagi budjet majburiyati

**Bevosita majburiyat** — loyiha bo‘yicha rejalashtirilgan to‘lov, masalan, xizmat mavjudligi uchun davriy haq. **Shartli majburiyat** — ma’lum hodisa yuz bersa paydo bo‘ladigan to‘lov, masalan, shartnomada belgilangan daromad kafolati ishga tushishi.

Xususiy hamkor qurilishga pul topgani davlatning barcha kelajakdagi xarajatlarini yo‘qotmaydi. Tizim bu majburiyatlarni qayd etish, budjetga sig‘ishini tekshirish va oshkor qilishga yordam beradi.

## O‘quv misoli

Avtobus terminali loyihasida transport tashkiloti xizmat talabini belgilaydi. Moliyaviy guruh yillik to‘lovlar va kafolatlarni ko‘rib chiqadi. Shu vazifalar ajratilsa, loyiha tashabbusi bilan uni moliyaviy tekshirish bir-birini to‘ldiradi.

## Amaliy topshiriq

Tanlagan loyihangiz uchun to‘rtta vazifani yozing: kim tayyorlaydi, kim moliyaviy tekshiradi, kim tasdiqlaydi, kim xizmatni nazorat qiladi? Bitta bevosita va bitta shartli majburiyat misolini keltiring.`,
      quiz: [{ question: "Shartnomadagi daromad kafolati faqat talab pasayganda to‘lov keltirib chiqaradi. Bu nima?", options: ["Shartli majburiyat", "Har doim bir xil bo‘ladigan xizmat haqi", "Investor kapitali"], answer: 0, explanation: "To‘lov noaniq kelajak hodisasiga bog‘liq. Shuning uchun u shartli majburiyat sifatida tahlil qilinadi." }],
    },
    {
      id: "ppp-screening", title: "3. Loyiha tanlash va dastlabki saralash", minutes: 12,
      source: { title: "Chapter 3: Project Identification and PPP Screening", file: "chapter-3-project-id-ppp-screening.pdf", pages: 58, reading: "9–18, 30–40 va 46-betlar" },
      body: `# Avval muammoni, keyin yechimni tanlang

Loyiha tanlashning boshlang‘ich savoli: **aholiga qanday xizmat yetishmayapti?** Darhol yangi bino qurishni tanlash mavjud tizimni yaxshilash kabi muqobillarni chetda qoldirishi mumkin.

## Ikki alohida qaror

1. **Loyiha kerakmi?** Ehtiyoj, muqobil yechimlar, xarajat va jamiyat oladigan foyda tekshiriladi.
2. **DXSh mosmi?** Kerakli loyihani aynan shu shartnoma modeli bilan bajarish maqsadga muvofiqligi baholanadi.

Yaxshi loyiha har doim yaxshi DXSh loyihasi bo‘lavermaydi. Dastlabki saralash batafsil tayyorlashga resurs sarflashdan oldingi tekshiruvdir; u yakuniy tasdiq emas.

## Saralash savollari

- Xizmat natijasini aniq o‘lchash mumkinmi?
- Qurilish va keyingi xizmatni birlashtirish foyda beradimi?
- Xususiy hamkor muhim risklarni boshqara oladimi?
- Loyiha hajmi murakkab tayyorlash xarajatini oqlaydimi?
- Bozorda yetarli qiziqish va imkoniyat bormi?
- Davlat yoki foydalanuvchi kelajakdagi to‘lovni ko‘tara oladimi?

## O‘quv misoli

Shahardagi tirbandlikni kamaytirish uchun yangi yo‘l, avtobus yo‘nalishlarini yaxshilash va harakatni boshqarish tizimi solishtiriladi. Muammo uchun maqbul yechim tanlangach, uni DXSh orqali amalga oshirish imkoniyati alohida tekshiriladi.

## Amaliy topshiriq

Tanlagan muammo uchun uchta yechim yozing. Har biriga kutiladigan foyda va bitta cheklov qo‘shing. Eng ma’qul yechimni tanlab, yuqoridagi olti savolga “ha”, “yo‘q” yoki “ma’lumot yetishmaydi” deb javob bering. Yetishmayotgan ma’lumotlarni saralash hisobotiga kiriting.`,
      quiz: [{ question: "Dastlabki saralash ijobiy tugasa, keyingi mantiqiy qadam qaysi?", options: ["Darhol shartnomani imzolash", "Barcha risklarni davlatga qoldirish", "Batafsil baholash va tayyorlashga o‘tish"], answer: 2, explanation: "Saralash istiqbolli variantni ajratadi. Batafsil asoslanganlik, to‘lov imkoniyati va risklar keyingi bosqichda tekshiriladi." }],
    },
    {
      id: "ppp-appraisal", title: "4. Loyiha bahosi: foyda, xarajat va imkoniyat", minutes: 15,
      source: { title: "Chapter 4: Appraising PPP Projects", file: "chapter-4-appraising-ppp-projects.pdf", pages: 110, reading: "22–55 va 61–85-betlar" },
      body: `# Loyihani bir nechta nuqtayi nazardan tekshiring

**Appraisal** — loyiha bo‘yicha davom etish, qayta ishlash yoki to‘xtatish qaroriga asos beradigan batafsil baholash. Bitta daromad hisob-kitobi yetarli emas.

## Bir-biridan farqli savollar

- **Texnik imkoniyat:** xizmatni belgilangan sharoit va sifatda taqdim etish mumkinmi?
- **Iqtisodiy asos:** jamiyat oladigan foyda sarflanadigan resurslarni oqlaydimi?
- **Tijoriy imkoniyat:** investor va kreditor uchun loyiha maqbulmi?
- **Budjet imkoniyati (affordability):** davlat uzoq muddatdagi to‘lovlarni ko‘tara oladimi?
- **Value for Money (VfM):** boshqa xarid usuliga nisbatan DXSh butun hayot davrida yaxshiroq qiymat beradimi?

Ekologik, ijtimoiy va huquqiy imkoniyatlar ham tekshiriladi. Bank moliyalashtirishga tayyor bo‘lishi barcha boshqa tekshiruvlar o‘tdi degani emas.

## Moliyaviy model

Modelga qurilish xarajati, foydalanish va ta’mirlash, yangilash, daromad, qarz va kapital oqimlari kiritiladi. Asosiy ssenariydan tashqari talab kamayishi, xarajat oshishi yoki ishga tushish kechikishi ta’siri sinab ko‘riladi.

## Shartli hisob misoli

Bir xil sifatdagi xizmat uchun ikki variant olaylik. Birinchisida qurilish 80 birlik, keyingi xizmat xarajatlarining joriy qiymati 50 birlik: jami 130. Ikkinchisida 95 va 25 birlik: jami 120. Faqat qurilish narxi bo‘yicha tanlash boshqa natija berardi. Bu soddalashtirilgan mashq; to‘liq VfM tahlili risk, vaqt va xizmat sifatini ham hisobga oladi.

## Amaliy topshiriq

Loyihangiz uchun yuqoridagi beshta savolga bittadan dalil yoki kerakli ma’lumot yozing. Talab kamayganda qaysi daromad yoki davlat to‘lovi o‘zgarishini izohlang.`,
      quiz: [{ question: "Kreditor loyiha uchun qarz ajratishga tayyor. Bundan nimani xulosa qilish mumkin?", options: ["Loyiha albatta eng yaxshi VfM beradi", "Moliyalashtirish imkoniyati bor, boshqa baholar ham kerak", "Davlatning kelajak to‘lovlari bo‘lmaydi"], answer: 1, explanation: "Bankability, affordability va VfM turli savollarga javob beradi. Birining ijobiy natijasi boshqalarini isbotlamaydi." }],
    },
    {
      id: "ppp-structuring", title: "5. Risklar, to‘lov va shartnoma tuzilishi", minutes: 15,
      source: { title: "Chapter 5: Structuring and Drafting the Tender and Contract", file: "chapter-5-struct-draft-tender-contract.pdf", pages: 198, reading: "73–103, 108–133 va 138–161-betlar" },
      body: `# Baholashni ishlaydigan shartnomaga aylantiring

Bu bosqichda xizmat talablari, to‘lov mexanizmi, risklar, tanlov mezonlari va shartnoma qoidalari aniqlashtiriladi. Ular bir-biriga mos bo‘lishi kerak.

## Riskni kim oladi?

Asosiy tamoyil — riskni uni eng samarali boshqara oladigan tomonga taqsimlash. Bunda hodisaning oldini olish va oqibatini kamaytirish qobiliyati hisobga olinadi. Barcha riskni xususiy hamkorga berish maqsad emas: boshqarib bo‘lmaydigan risk taklif narxini oshirishi yoki ishtirokchilarni uzoqlashtirishi mumkin.

**Risk matritsasi** uchun to‘rtta ustun yetarli: hodisa, oqibat, mas’ul tomon, kamaytirish chorasi. Dastlabki matritsa loyiha bahosiga ta’sir qiladi; shartnomada u aniq majburiyat va tartiblarga aylantiriladi.

## Natija va to‘lov

“Yaxshi xizmat ko‘rsatish” o‘rniga tekshirish mumkin bo‘lgan ko‘rsatkichlar belgilanadi: mavjudlik, javob berish vaqti, sifat. Kamchilikni qayd etish, tuzatish muddati va to‘lovga ta’siri oldindan tushunarli bo‘lishi kerak.

## Tender hujjatlari

**RFQ** ishtirokchining malakasini tekshirishga, **RFP** loyiha bo‘yicha taklif olishga xizmat qiladi. Baholash mezonlari, hujjatlar, muddatlar va shartnoma loyihasi raqobatga tayyorlanadi. Shartnoma o‘zgarishlar, nizolar, muddatidan oldin tugatish va aktivni qaytarish masalalarini ham qamrab oladi.

## Amaliy topshiriq

Yoritish loyihasi uchun uskuna buzilishi, elektr ta’minoti uzilishi va ish hajmi o‘zgarishini risk matritsasiga yozing. Har birini kim boshqara olishini asoslang. So‘ng bitta o‘lchanadigan xizmat ko‘rsatkichi va unga mos tuzatish tartibini taklif qiling.`,
      quiz: [{ question: "Xususiy hamkor ta’sir qila olmaydigan riskni unga to‘liq berish qanday oqibat keltirishi mumkin?", options: ["Risk o‘z-o‘zidan yo‘qoladi", "Nazoratga ehtiyoj qolmaydi", "Narx oshishi yoki raqobat kamayishi mumkin"], answer: 2, explanation: "Hamkor boshqara olmaydigan risk uchun qo‘shimcha haq talab qilishi yoki tenderda qatnashmasligi mumkin. Taqsimot boshqarish qobiliyatiga asoslanadi." }],
    },
    {
      id: "ppp-tender", title: "6. Tenderdan moliyaviy yopilishgacha", minutes: 12,
      source: { title: "Chapter 6: Tendering and Awarding the Contract", file: "chapter-6-tendering-awarding-contract.pdf", pages: 105, reading: "17–36-betlar; xususiy sektor nuqtayi nazari — ilova" },
      body: `# Tender — oldindan e’lon qilingan qoidalar asosidagi tanlov

Tayyorlangan tender hujjatlari e’lon qilingach, tashkilot jarayonni faol boshqaradi. Maqsad — yetarli raqobat, adolatli baholash va bajarilishi mumkin bo‘lgan shartnomaga erishish.

## Jarayonning asosiy ishlari

1. Ishtirokchilarga taklif tayyorlash uchun ma’lumot va vaqt berish.
2. Savollar va tushuntirishlarni belgilangan tartibda boshqarish.
3. Takliflarning hujjatlarga muvofiqligi, sifati va narxini e’lon qilingan mezonlar bilan tekshirish.
4. Tanlov qarori, zarur old shartlar va shartnoma imzolanishini rasmiylashtirish.
5. Moliyalashtirish shartlari bajarilishini yakunlash.

Dialog yoki muzokarali jarayonning shakli tanlangan tender tartibiga bog‘liq. Bir ishtirokchiga adolatsiz axborot ustunligi berilmasligi va maxfiy tijoriy ma’lumotlar boshqarilishi kerak.

## Imzo va moliyaviy yopilish

**Shartnomani imzolash** tomonlarning loyiha majburiyatlarini belgilaydi. **Financial close** esa moliyalashtirish hujjatlari imzolanishi bilan birga, mablag‘dan foydalanish uchun zarur old shartlar bajarilganini bildiradi. Ikkalasi har doim bir kunda sodir bo‘lmaydi.

## O‘quv misoli

Terminal loyihasida g‘olib aniqlandi va shartnoma imzolandi. Lekin kreditdan foydalanish uchun talab etilgan sug‘urta hali rasmiylashmadi. Faqat imzo mavjudligiga qarab moliyaviy yopilish bo‘ldi deb ayta olmaymiz.

## Amaliy topshiriq

Tender jadvalini besh bosqichga ajrating. Har bosqich yakunida qanday hujjat yoki dalil bo‘lishini yozing. Shartnoma imzosi bilan moliyaviy yopilish orasidagi farqni o‘z so‘zingiz bilan tushuntiring.`,
      quiz: [{ question: "Kredit hujjatlari imzolangan, ammo mablag‘ olishning old shartlari bajarilmagan. Qaysi fikr to‘g‘ri?", options: ["Moliyaviy yopilish hali yakunlanmagan", "Moliyaviy yopilish albatta tugagan", "Xizmat davri yakunlangan"], answer: 0, explanation: "Qo‘llanmada moliyaviy yopilish uchun hujjatlar imzolanishi va moliyalashtirish mavjudligining old shartlari bajarilishi birgalikda talab etiladi." }],
    },
    {
      id: "ppp-construction", title: "7. Qurilish va xizmatni ishga tushirish", minutes: 12,
      source: { title: "Chapter 7: Managing the Contract — Strategy, Delivery and Commissioning", file: "chapter-7-strat-deliv-commissioning.pdf", pages: 99, reading: "7–28, 48–60, 61–76 va 85–87-betlar" },
      body: `# Shartnomani boshqarish qurilish paytidayoq boshlanadi

Davlat vazifasi tender g‘olibini tanlash bilan tugamaydi. Shartnomadagi natijalarga erishilishini kuzatish uchun vakolat, odamlar, axborot va aniq jarayon kerak.

## Boshqaruv tizimi

- Mas’ul jamoa va qaror qabul qilish vakolatlari belgilanadi.
- Majburiyatlar, muddatlar va hisobotlar boshqaruv rejasiga kiritiladi.
- Risklar, o‘zgarishlar va talablar qayd etiladi.
- Xodimlar almashganda hujjatlar va tajriba yangi jamoaga topshiriladi.

Nazorat qilish xususiy hamkorning bajarish uchun javobgarligini davlat o‘z zimmasiga oladi degani emas. Tomonlar shartnomadagi vazifalariga amal qiladi.

## O‘zgarishni boshqarish

Qurilish hajmini o‘zgartirish narx, muddat va kelajakdagi xizmatga ta’sir qilishi mumkin. Shuning uchun taklif qayd etiladi, oqibatlari baholanadi va vakolatli tartibda tasdiqlanadi. Og‘zaki kelishuv bilan kuzatuvsiz qo‘shimcha ish berish nizolarni ko‘paytirishi mumkin.

## Ishga tushirish

Qurilish tugashi xizmatni qabul qilish bilan aynan bir xil emas. Sinovlar va shartnomadagi qabul mezonlari tizim ishlashini tekshiradi. Kamchiliklar, ularni tuzatish va foydalanishga o‘tish rejasi kelishilgan tartibda boshqariladi.

## O‘quv misoli va topshiriq

Yangi terminal binosi bitdi, lekin xavfsizlik tizimi sinovdan o‘tmadi. “Bino tayyor” va “xizmatga tayyor” holatlarini ajrating. Qabul qilish uchun uchta dalil yozing: sinov natijasi, talabga muvofiqlik va foydalanishga tayyor jamoa. Keyin qo‘shimcha platforma qurish taklifi narx va muddatga qanday ta’sir qilishini qayd eting.`,
      quiz: [{ question: "Bino bitgan, lekin majburiy xizmat sinovlari yakunlanmagan. Nima qilish kerak?", options: ["Barcha qabul mezonlarini bajarilgan deb hisoblash", "Qolgan sinovlar va qabul shartlarini tekshirish", "Shartnoma hujjatlarini yopib qo‘yish"], answer: 1, explanation: "Qurilish yakuni va xizmatni shartnoma talablariga muvofiq qabul qilish alohida tekshiriladi." }],
    },
    {
      id: "ppp-operations", title: "8. Xizmat sifati va aktivni qaytarish", minutes: 12,
      source: { title: "Chapter 8: Managing the Contract — Operations and Hand-Back", file: "chapter-8-operations-handback.pdf", pages: 54, reading: "8–28 va 39–48-betlar" },
      body: `# Uzoq muddat davomida xizmatni saqlash

Foydalanish davrida asosiy e’tibor kelishilgan xizmat natijasiga qaratiladi. Xizmatni o‘lchash, kamchilikni bartaraf etish va to‘lovni tekshirish muntazam bajariladi.

## Kuzatishdan to‘lovgacha

1. Shartnomadagi ko‘rsatkich bo‘yicha dalil yig‘iladi.
2. Natija belgilangan sifat va mavjudlik talabi bilan solishtiriladi.
3. Kamchilik bo‘lsa, xabar berish va tuzatish tartibi qo‘llanadi.
4. To‘lov, chegirma yoki boshqa chora shartnoma asosida hisoblanadi.

Ko‘rsatkichni yozib qo‘yish yetmaydi: ma’lumot ishonchliligi va uni kim tekshirishi ham aniq bo‘lishi kerak. Budjet to‘lovlari, favqulodda holatlar, ta’mirlash va yangilash ehtiyoji boshqariladi.

## Hand-back — aktivni qaytarish

Shartnoma oxirida aktiv belgilangan holatda topshirilishi va xizmat uzluksizligi ta’minlanishi kerak. Tekshiruv, zarur ta’mirlash, hujjatlar va keyingi operatorga o‘tish rejasi muddat tugashidan oldin tayyorlanadi. Oxirgi kunni kutish kamchiliklarni tuzatishga vaqt qoldirmasligi mumkin.

Shartnoma muddati tugashi, tomon majburiyatini buzishi va favqulodda sabab bilan erta tugatish turli holatlardir. Oqibat va hisob-kitoblar tegishli shartlar asosida aniqlanadi.

## O‘quv misoli

Terminal topshirilishiga yaqin uskunalarning holati tekshirilib, kelishilgan talabga yetmaydigan qismlar uchun tuzatish rejasi tuziladi. Faqat kalitni berish xizmatning ertasi kuni uzluksiz ishlashini kafolatlamaydi.

## Amaliy topshiriq

Loyihangiz uchun oylik nazorat varag‘ini yozing: ko‘rsatkich, dalil, tekshiruvchi, tuzatish. Alohida aktiv holati, texnik hujjatlar va keyingi xizmat ko‘rsatuvchiga topshirish bo‘yicha uch band qo‘shing.`,
      quiz: [{ question: "Aktivni qaytarishga tayyorgarlik qachon rejalashtiriladi?", options: ["Faqat shartnomaning oxirgi kuni", "Xizmat to‘xtaganidan keyin", "Tekshiruv va tuzatishga vaqt qoladigan tarzda oldindan"], answer: 2, explanation: "Hand-back rejasi aktivning shartnomadagi holatini va xizmat uzluksizligini ta’minlash uchun oldindan bajariladigan ishlarni qamrab oladi." }],
    },
    {
      id: "ppp-glossary", title: "9. Asosiy atamalarni tushunish", minutes: 10,
      source: { title: "PPP Certification Guide — Glossary", file: "PPP-Certification-Guide-Glossary.pdf", pages: 53, reading: "Alifbo tartibidagi lug‘at; atamalarni inglizcha nomi bilan toping" },
      body: `# Atamalarni ma’nosi bilan o‘rganing

Inglizcha PDFlarni o‘qiyotganda bu tushunchalar ko‘p uchraydi. Quyidagilar qisqa o‘quv izohlari; batafsil ta’rif va kontekst asl lug‘atda berilgan.

- **Affordability:** davlatning loyiha to‘lovlarini vaqt davomida budjet imkoniyatiga sig‘dira olishi.
- **Appraisal:** loyihani tasdiqlash, qayta ishlash yoki to‘xtatishga asos bo‘ladigan baholashlar.
- **Availability:** aktiv yoki xizmatning kelishilgan sharoit va sifatda foydalanishga tayyorligi.
- **Bankability:** loyihaning kreditorlar uchun moliyalashtirishga maqbulligi.
- **Financial close:** moliyalashtirish hujjatlari va mablag‘ olishning old shartlari yakunlanadigan bosqich.
- **Risk allocation:** risklarning shartnomadagi tomonlar orasida taqsimlanishi.
- **Value for Money:** xarajat, risk va sifatni butun hayot davrida hisobga olganda olingan qiymat.
- **Hand-back:** shartnomada belgilangan tartib va holatda aktivni davlatga qaytarish.

## Bir-biriga o‘xshash so‘zlarni ajrating

Bankability kreditorning savoliga javob beradi: qarzga xizmat qilish uchun maqbul asos bormi? Affordability davlat budjetining savoliga javob beradi: to‘lovlarni ko‘tara olamizmi? VfM xarid usullarini qiymat jihatidan solishtiradi. Ularni bitta “foydali loyiha” iborasiga birlashtirish aniqlikni yo‘qotadi.

## O‘quv mashqi

“Terminalni moliyalashtirish mumkin, lekin yillik davlat to‘lovi budjet chegarasidan yuqori” jumlasida qaysi ikki tushuncha bor? Moliyalashtirishga maqbullik va davlatning to‘lov imkoniyati alohida ko‘rilmoqda.

## Amaliy topshiriq

Uchta atamani tanlang. Har biri uchun o‘zbekcha izoh, o‘zingiz tuzgan misol va u bilan chalkashishi mumkin bo‘lgan boshqa atamani yozing. PDF lug‘atida inglizcha so‘z bo‘yicha qidirib, ta’rifni solishtiring.`,
      quiz: [{ question: "Davlatning kelajakdagi loyiha to‘lovlarini budjetga sig‘dira olishi qaysi atama?", options: ["Affordability", "Hand-back", "Financial close"], answer: 0, explanation: "Affordability — davlatning vaqt davomida moliyaviy majburiyatlarini budjet imkoniyatiga mos bajarishi." }],
    },
    {
      id: "ppp-acronyms", title: "10. PPP qisqartmalarini o‘qish", minutes: 10,
      source: { title: "PPP Certification Guide — List of Acronyms", file: "PPP-Certification-Guide-Acronym-List.pdf", pages: 5, reading: "1–5-betlar" },
      body: `# Qisqartmalarni vazifasiga qarab eslab qoling

Qisqartmalar ro‘yxatini birdan yodlash o‘rniga ularni loyihaning qaysi qismida ishlatilishiga qarab ajrating.

## Tuzilma va shartnoma

- **PPP — Public-Private Partnership:** davlat-xususiy sheriklik.
- **SPV — Special Purpose Vehicle:** muayyan loyiha uchun tuzilgan alohida kompaniya.
- **DBFOM — Design-Build-Finance-Operate-Maintain:** loyihalash, qurish, moliyalashtirish, foydalanish va texnik xizmatni birlashtiruvchi model.
- **O&M — Operations and Maintenance:** foydalanish va texnik xizmat.

## Xarajat va baholash

- **Capex — Capital expenditure:** kapital xarajatlar, masalan, qurilish va asosiy uskunalar.
- **Opex — Operating expenditure:** faoliyatni yuritish xarajatlari.
- **CBA — Cost-Benefit Analysis:** xarajat va foydani tahlil qilish.
- **VfM — Value for Money:** sarflangan resursga nisbatan olingan qiymat.
- **DSCR — Debt Service Coverage Ratio:** qarzga xizmat qilish uchun mavjud pul oqimining tegishli davrdagi qarz xizmati to‘lovlariga nisbati.

## Tender

- **RFQ — Request for Qualifications:** malaka bo‘yicha ma’lumot so‘rovi.
- **RFP — Request for Proposals:** loyiha bo‘yicha takliflar so‘rovi.

## O‘quv misoli

“SPV DBFOM shartnomasi bo‘yicha Capex va O&M xarajatlarini rejalashtiradi” jumlasida alohida loyiha kompaniyasi, ishlar doirasi va xarajatlar bor. Har bir qisqartmani to‘liq yozib chiqsangiz, jumla ancha tushunarli bo‘ladi.

## Amaliy topshiriq

O‘zingiz tanlagan loyiha haqida yuqoridagi beshta qisqartmadan foydalanib uch jumla yozing. Keyin ularni qisqartmasiz qayta yozing. Ma’nosi o‘zgarmaganini tekshiring. To‘liq ro‘yxatda ayrim qisqartmalar kontekstga qarab turlicha ma’no berishini kuzating.`,
      quiz: [{ question: "Tenderda kompaniyaning tajribasi va malakasini tekshirishga qaysi so‘rov mos?", options: ["O&M", "RFQ", "Capex"], answer: 1, explanation: "RFQ malaka ma’lumotlarini olishga xizmat qiladi. O&M ishlar turi, Capex esa xarajat toifasi." }],
    },
    {
      id: "ppp-practice", title: "11. Namunaviy savollar bilan mustaqil mashq", minutes: 20,
      source: { title: "CP3P Foundation Exam — Sample Questions (2016)", file: "CP3P Foundation Exam - Sample Questions.pdf", pages: 10, reading: "2–5-betlar: 12 savol; 7–10-betlar: javoblar va izohlar" },
      body: `# Bilimingizni tushuntirish orqali tekshiring

Yuklangan 2016-yilgi namunaviy PDFda **12 ta savol**, javoblar va ularning izohlari bor. Muqovadagi 50 savol va 40 daqiqa matni umumiy imtihon yo‘riqnomasidir; ushbu faylning o‘zi 50 savollik to‘liq test emas. Bu darsdagi mashqlar hozirgi rasmiy imtihon formatini tasdiqlamaydi.

## Qanday ishlash kerak?

1. PDFning savollar qismini oching, javoblar sahifasiga hali o‘tmang.
2. Har savol uchun bitta javob va uning sababini yozing.
3. Javoblar bo‘limidagi izoh bilan taqqoslang.
4. Xato savol qaysi tushunchaga tegishli ekanini belgilang.
5. Manbada ko‘rsatilgan mavzuga qaytib, farqni o‘z so‘zingiz bilan izohlang.

## Xatolarni guruhlash

- **Atama:** SPV, PPP framework yoki PPP process ma’nolari chalkashdi.
- **Model:** oddiy xizmat shartnomasi bilan DXSh farqi aniq emas.
- **Moliyalashtirish:** qarz, kapital yoki davlat yordami farqlanmadi.
- **Savolni o‘qish:** “eng mos”, “qaysi biri emas” kabi shart e’tibordan chetda qoldi.

Natijani faqat to‘g‘ri javoblar soni bilan baholamang. Nega qolgan variantlar mos emasligini tushuntira olish ham bilimni ko‘rsatadi.

## Yakuniy amaliy topshiriq

Avvalgi darslarda tanlagan loyihangiz uchun bir sahifalik reja yozing: ehtiyoj, muqobil yechim, DXShga moslik, to‘lov manbasi, asosiy risklar, xizmat ko‘rsatkichi va aktivni qaytarish. Qaysi ma’lumotlar hali yetishmasligini alohida belgilang.

Quyidagi interaktiv savollar Finora tuzgan o‘quv mashqlaridir. Natija shu sahifadagi mashq uchun ko‘rsatiladi; rasmiy imtihon bali yoki sertifikat hisoblanmaydi.`,
      quiz: [
        { question: "Terminal foydali ko‘rinyapti, lekin DXShga mosligi tekshirilmagan. Qaysi ish kerak?", options: ["Darhol tenderni e’lon qilish", "Foydali bo‘lsa, boshqa baholarni bekor qilish", "DXSh modelining mosligi va muqobillarini tekshirish"], answer: 2, explanation: "Loyihaning kerakligi va uni DXSh sifatida amalga oshirish maqbulligi alohida qarorlardir." },
        { question: "Xizmat to‘lovi o‘z vaqtida to‘lanmoqda, lekin sifat ko‘rsatkichlari tekshirilmayapti. Nima yetishmayapti?", options: ["Shartnoma bo‘yicha natijani kuzatish va tekshirish", "Yana bir loyiha kompaniyasi", "Barcha riskni foydalanuvchiga berish"], answer: 0, explanation: "To‘lov bilan birga kelishilgan xizmat natijasining dalillari va kamchiliklarni bartaraf etish jarayoni ham kuzatiladi." },
        { question: "Taklifda qurilish arzon, ammo uzoq muddatli ta’mirlash juda qimmat. Qanday taqqoslash kerak?", options: ["Faqat qurilish narxi bo‘yicha", "Hayot davri xarajatlari, risk va xizmat sifatini birga hisobga olib", "Ta’mirlashni hisobdan chiqarib"], answer: 1, explanation: "Butun hayot davrini ko‘rish arzon qurilish ortidagi keyingi xarajatlarni yashirmaydi va VfM tahliliga mos keladi." },
      ],
    },
  ],
};

const moduleDescriptions = [
  ["DXSh asoslari", "Modelni taning, ishtirokchilar va pul oqimini tushuning."],
  ["Davlat va boshqaruv", "Vakolat, tasdiqlash va budjet majburiyatlarini ajrating."],
  ["Loyiha tanlash", "Ehtiyojni aniqlang, muqobillarni baholang va saralang."],
  ["Loyihani baholash", "Pul oqimi, DSCR, ssenariy va VfM bilan ishlang."],
  ["Risk va shartnoma", "Riskni taqsimlang, xizmat natijasini to‘lovga bog‘lang."],
  ["Tender va moliyalashtirish", "Teng raqobatdan moliyaviy yopilishgacha o‘rganing."],
  ["Qurilish va ishga tushirish", "Jamoa, sinovlar va xizmatga tayyorlikni boshqaring."],
  ["Xizmat va qaytarish", "Natijani kuzating va aktivni topshirishni rejalashtiring."],
];

/** Barcha PPP boblari bitta ro'yxatda — pastda CP3P'ning 3 bosqichiga bo'linadi. */
const PPP_FULL: Course = {
  ...PPP_BASE,
  chapters: PPP_BASE.chapters.flatMap((chapter) => [
    { ...chapter, title: chapter.title.replace(/^\d+\.\s*/, ""), source: chapter.source && { ...chapter.source, startPage: Number(chapter.source.reading.match(/^\d+/)?.[0] ?? 1) } },
    ...(PPP_LESSONS[chapter.id] ?? []).map(({ reading, page, ...lesson }) => ({
      ...lesson,
      source: { ...chapter.source!, reading, startPage: page },
    })),
  ]),
  modules: [
    ...PPP_BASE.chapters.slice(0, 8).map((chapter, index) => ({
      id: chapter.id,
      title: moduleDescriptions[index][0],
      description: moduleDescriptions[index][1],
      chapterIds: [chapter.id, ...PPP_LESSONS[chapter.id].map((lesson) => lesson.id)],
    })),
    { id: "ppp-reference", title: "Lug‘at va yakuniy mashq", description: "Atamalar, qisqartmalar va mustaqil bilim tekshiruvi.", chapterIds: ["ppp-glossary", "ppp-acronyms", "ppp-practice"] },
  ],
};

/** Eski manzillar — eski havolalar yangi kursga yo'naltiriladi. */
export const LEGACY_PPP_SLUG = "davlat-xususiy-sheriklik";
/** 24.09.2026 da bir necha soat «Implementation» nomi bilan turgan. */
export const LEGACY_EXECUTION_SLUG = "cp3p-implementation";

type Stage = Pick<Course, "slug" | "title" | "shortTitle" | "description" | "level" | "emoji" | "outcomes"> & { moduleIds: string[]; moduleNotes?: Record<string, string> };

/** APMG CP3P (2016 Guide, ppp-certification.com/faqs): Foundation = Glossary + 1-bob; Preparation = 2, 3, 4-bob + 5-bob 1–5.8 va 9.9;
 * Execution = 5-bob to'liq, 6, 7, 8. 5-bob ikkala kursda — progressi umumiy (lib/progress). Eski izoh: Foundation (1–2-bob), Preparation (3–5), Execution (6–8) — har birining alohida imtihoni bor. */
function stage({ moduleIds, moduleNotes = {}, ...meta }: Stage): Course {
  const modules = PPP_FULL.modules!
    .filter((m) => moduleIds.includes(m.id))
    .map((m) => (moduleNotes[m.id] ? { ...m, description: moduleNotes[m.id] } : m));
  const ids = new Set(modules.flatMap((m) => m.chapterIds));
  return { ...PPP_FULL, ...meta, tag: "new", modules, chapters: PPP_FULL.chapters.filter((ch) => ids.has(ch.id)) };
}

export const PPP_FOUNDATION: Course = stage({
  slug: "cp3p-foundation",
  title: "CP3P Foundation: PPP introduction and frameworks",
  shortTitle: "CP3P Foundation",
  description: "Stage 1 of the CP3P certification (PPP Guide chapter 1 + Glossary): what a PPP is, how it works, its benefits and limits, and the language of PPPs. Exam: 50 multiple-choice questions, 40 minutes, closed book, pass mark 25/50.",
  level: "Boshlang'ich",
  emoji: "🧭",
  outcomes: [
    "Distinguish a PPP from traditional public procurement and privatisation",
    "Explain the PPP life cycle and its key decision points",
    "Explain the main PPP models, funding sources and payment mechanisms",
    "Read common PPP terms and acronyms with confidence",
    "Check your knowledge with Foundation-style practice questions",
  ],
  moduleIds: ["ppp-overview", "ppp-reference"],
});

export const PPP_PREPARATION: Course = stage({
  slug: "cp3p-preparation",
  title: "CP3P Preparation: identifying, appraising and structuring PPPs",
  shortTitle: "CP3P Preparation",
  description: "Stage 2 of the CP3P certification (PPP Guide chapters 2–4 and chapter 5 sections 1–5.8 and 9.9): the PPP framework, project identification and screening, appraisal (value for money, affordability, bankability) and early structuring. Exam: scenario-based, 80 marks, 150 minutes, open book (PPP Guide), pass mark 40/80.",
  level: "O'rta",
  emoji: "📐",
  outcomes: [
    "Describe the legal and institutional PPP framework and the roles of government",
    "Identify and screen projects for PPP suitability",
    "Separate economic value, affordability and financing in an appraisal",
    "Read a financial model and a DSCR calculation",
    "Allocate risks and design the payment mechanism",
    "Structure the tender documents and draft contract",
  ],
  moduleIds: ["ppp-framework", "ppp-screening", "ppp-appraisal", "ppp-structuring"],
  moduleNotes: { "ppp-structuring": "Preparation examines chapter 5 sections 1–5.8 and 9.9 only; the full chapter is examined at Execution." },
});

export const PPP_EXECUTION: Course = stage({
  slug: "cp3p-execution",
  title: "CP3P Execution: tendering, delivery and contract management",
  shortTitle: "CP3P Execution",
  description: "Stage 3 of the CP3P certification (PPP Guide chapters 5–8): structuring and drafting the tender and contract, running the tender to commercial and financial close, construction and commissioning, operations and hand-back. Exam: scenario-based, 80 marks, 150 minutes, open book (PPP Guide), pass mark 40/80.",
  level: "Yuqori",
  emoji: "🏗️",
  outcomes: [
    "Structure the tender and draft the PPP contract",
    "Run a fair tender and evaluate bids against published criteria",
    "Reach commercial and financial close",
    "Manage construction, testing and commissioning",
    "Monitor service performance and apply the payment mechanism",
    "Prepare the asset for hand-back at the end of the contract",
  ],
  moduleIds: ["ppp-structuring", "ppp-tender", "ppp-construction", "ppp-operations"],
});

export const PPP_COURSES: Course[] = [PPP_FOUNDATION, PPP_PREPARATION, PPP_EXECUTION];

/** Eski /davlat-xususiy-sheriklik havolasi uchun: bob qaysi yangi kursda ekanini topadi. */
export function pppCourseForChapter(chapterId: string): Course {
  return PPP_COURSES.find((c) => c.chapters.some((ch) => ch.id === chapterId)) ?? PPP_FOUNDATION;
}
