import type { Chapter } from "./courses";

type DetailedLesson = Omit<Chapter, "source"> & { reading: string; page: number };

// Reading ranges refer to the supplied 2016 PDFs, counting from the first PDF page.
// Cases, figures and questions below are original teaching adaptations.
export const PPP_LESSONS: Record<string, DetailedLesson[]> = {
  "ppp-overview": [
    {
      id: "ppp-models", title: "DBOM, DBFOM va to‘lov modellari", minutes: 14, page: 26, reading: "26–43-betlar, 2.1–2.3-bo‘limlar",
      objectives: ["Shartnoma doirasini uning nomidan ajratish", "Foydalanuvchi va davlat to‘lovlari o‘rtasidagi farqni tushuntirish"],
      terms: [{ term: "DBFOM", meaning: "Loyihalash, qurish, moliyalashtirish, foydalanish va texnik xizmat." }, { term: "User-pays", meaning: "Daromad asosan xizmat foydalanuvchilarining to‘lovidan keladigan model." }],
      body: `# Bitta loyiha, turli shartnoma modellari

Shahar yangi avtobus terminaliga muhtoj. Davlat faqat binoni qurdirishi yoki qurilish bilan keyingi xizmatni bir shartnomaga birlashtirishi mumkin. Farq qisqartmada emas: **kim qaysi ishni bajaradi, kim riskni oladi va pul qanday natija uchun to‘lanadi?**

## Qurilishdan hayot davriga

Oddiy **Design–Build** buyurtmasida pudratchi loyihalaydi va quradi. Keyingi foydalanish va katta ta’mirlashni davlat tashkil qiladi. Arzon qurilish keyinchalik qimmat xizmatga aylanishi mumkin; bu xarajat quruvchining o‘ziga qaytmasligi ehtimoli bor.

**DBOM** qurilish va keyingi xizmatni birlashtiradi; moliyalashtirish davlat tomonidan berilishi mumkin. **DBFOM** esa xususiy hamkor zimmasiga moliyalashtirish vazifasini ham qo‘shadi. Shu sabab qo‘llanma xususiy moliyalashtirishni har qanday PPPning yagona belgisi deb olmaydi. Natijaga bog‘langan haq va muhim risklarni olish ham tekshiriladi.

## Kim to‘laydi?

Foydalanuvchi to‘laydigan terminalda yo‘lovchi yoki tashuvchi to‘lovi loyiha daromadiga aylanadi. Talab kamayishi daromadni qisqartirishi mumkin. Davlat to‘laydigan modelda esa haq, masalan, terminalning foydalanishga tayyorligi va xizmat sifatiga bog‘lanadi. Talab riski kimda qolishi shartnomaga bog‘liq.

Aralash model ham mumkin: foydalanuvchi to‘lovi xarajatning bir qismini, davlat yordami boshqa qismini qoplaydi. Davlat to‘lovi mavjud bo‘lsa, uning uzoq muddatli budjet ta’siri alohida baholanadi.

## Nomga qarab hukm chiqarmang

Turli mamlakatlarda concession, BOT yoki PPP nomlari bir xil doirani anglatmasligi mumkin. Tahlilda besh vazifani yozing: loyihalash, qurish, moliyalashtirish, foydalanish, texnik xizmat. So‘ng to‘lov va risklarni xaritaga qo‘shing. Shunda loyihaning haqiqiy tuzilishi ko‘rinadi.`,
      flow: [{ title: "Ishlar", description: "Qurilish va xizmat doirasi" }, { title: "Risk", description: "Kim nazorat qiladi?" }, { title: "To‘lov", description: "Kim, nima uchun to‘laydi?" }],
      exercise: { title: "Terminal modelini taning", situation: "Hamkor terminalni quradi, moliyalashtiradi va 20 yil xizmat ko‘rsatadi. Davlat tayyor platformalar va tozalik ko‘rsatkichiga qarab haq to‘laydi.", question: "Ushbu misolga qaysi tavsif mos?", hint: "Besh vazifa va daromad manbasini alohida belgilang.", choices: [{ label: "Faqat Design–Build", feedback: "Bu yerda qurilishdan keyingi xizmat ham, moliyalashtirish ham hamkor zimmasida." }, { label: "Davlat to‘laydigan DBFOM", feedback: "Besh vazifa birlashtirilgan; davlat to‘lovi xizmat natijasiga bog‘langan." }, { label: "Foydalanuvchi to‘laydigan model", feedback: "Misolda to‘lov yo‘lovchidan emas, davlatdan kelmoqda." }], answer: 1 },
      quiz: [{ question: "DBOMda moliyalashtirish davlatdan bo‘lishi mumkinmi?", options: ["Ha, ishlar doirasi va moliyalashtirish manbasi alohida masala", "Yo‘q, barcha modellar faqat bank qarzi bilan ishlaydi", "Faqat aktiv sotib yuborilsa"], answer: 0, explanation: "Qo‘llanmada davlat moliyalashtiradigan DBOM ham ko‘riladi. Xususiy moliya PPPning barcha ko‘rinishlari uchun majburiy yagona belgi emas." }, { question: "User-pays modelida talab kamayishi avvalo nimaga ta’sir qiladi?", options: ["Kompaniya nomiga", "Shartnoma tiliga", "Foydalanuvchi to‘lovidan keladigan daromadga"], answer: 2, explanation: "Foydalanish hajmi daromadni o‘zgartiradi; yakuniy risk taqsimoti kafolat va shartnomaga ham bog‘liq." }],
    },
    {
      id: "ppp-project-finance", title: "SPV, qarz va kapital: pulning yo‘li", minutes: 15, page: 83, reading: "83–103-betlar, 6–7.2.1-bo‘limlar",
      objectives: ["Loyiha kompaniyasining rolini ko‘rsatish", "Boshlang‘ich moliyalashtirish va xarajatni qoplashni ajratish"],
      terms: [{ term: "SPV", meaning: "Muayyan loyihani amalga oshirish uchun tuzilgan alohida kompaniya." }, { term: "Equity", meaning: "Investorning loyiha kompaniyasiga kiritgan kapitali." }, { term: "Project finance", meaning: "Qarzni qaytarishda asosan loyihaning pul oqimiga tayanadigan moliyalashtirish." }],
      body: `# Qurilishni kim moliyalashtiradi, qarzni kim qaytaradi?

Xususiy konsorsium odatda alohida **SPV** tashkil qiladi. Davlat PPP shartnomasini shu loyiha kompaniyasi bilan tuzadi. SPV esa quruvchi, operator, investor va kreditorlar bilan alohida munosabatlarni boshqaradi. Quruvchi bilan loyiha kompaniyasi bir xil vazifani bajarmaydi.

## Moliyalashtirishning ikki asosiy qatlami

**Qarz** — kelishilgan jadval va shartlar bo‘yicha qaytariladigan mablag‘. **Kapital** — investorning tavakkal ostidagi ulushi; unga taqsimot qarz va boshqa majburiyatlar bajarilishi hamda shartlarga bog‘liq. Kapitalni oddiy foizli qarz bilan almashtirib bo‘lmaydi.

Shartli terminal qurilishi 100 birlik turadi: investor 25 birlik kapital, bank 75 birlik qarz beradi. Bu mablag‘ qurilish boshlanishini ta’minlaydi. Ammo 100 birlik topilgani terminal o‘z xarajatini qoplay olishini hali isbotlamaydi.

## Qurilish davridan foydalanish davriga

Qurilishda SPV jalb qilingan mablag‘ni pudratchiga to‘laydi. Xizmat ishga tushgach, foydalanuvchi yoki davlat to‘lovi kiradi. Undan operatsion xarajatlar, soliqlar, qarz xizmati va zarur rezervlar qoplanadi; shartlar bajarilgandan keyingina investor taqsimot olishi mumkin.

**Project finance**da kreditor loyihaning kelajakdagi pul oqimi va shartnomalariga katta ahamiyat beradi. Cheklangan regress investor hech qanday majburiyat olmaydi degani emas: qurilish kafolatlari va boshqa qo‘llab-quvvatlash shartlari bo‘lishi mumkin.

## Ikki savolni yozib qo‘ying

“Qurilish uchun bugun pul qayerdan keladi?” — moliyalashtirish savoli. “Xizmat davomida xarajatlar va qarz nimadan qoplanadi?” — daromad/to‘lov manbasi savoli. Har ikkala javobni yozmasdan loyihani tayyor deb hisoblamang.`,
      flow: [{ title: "Investor + bank", description: "Kapital va qarz" }, { title: "SPV", description: "Qurilish va xizmat shartnomalari" }, { title: "Xizmat daromadi", description: "Xarajatlar, qarz, so‘ng taqsimot" }],
      exercise: { title: "100 birlik topildi", situation: "Terminal qurilishi uchun mablag‘ to‘liq jalb qilindi. Biroq foydalanish davridagi daromad prognozi hali tekshirilmagan.", question: "Qaysi xulosa asosli?", hint: "Bugungi qurilish puli va ertangi qarz xizmati bir xil oqim emas.", choices: [{ label: "Loyiha barcha tekshiruvlardan o‘tdi", feedback: "Moliyalashtirish topilishi iqtisodiy asos, affordability va kelajak pul oqimini tasdiqlamaydi." }, { label: "Qarz endi qaytarilmaydi", feedback: "Qarz jalb qilingani bilan uni qaytarish majburiyati yo‘qolmaydi." }, { label: "Daromad va qarzga xizmat qilish imkoniyatini baholash kerak", feedback: "Qurilish manbasi bor; endi foydalanish pul oqimining yetarliligi tekshiriladi." }], answer: 2 },
      quiz: [{ question: "Davlat bilan asosiy PPP shartnomasini odatda kim imzolaydi?", options: ["Har bir yo‘lovchi", "Loyiha kompaniyasi — SPV", "Faqat uskuna yetkazib beruvchi"], answer: 1, explanation: "SPV davlat shartnomasining xususiy tomoni bo‘ladi va quyi shartnomalar orqali ishlarni tashkil qiladi." }, { question: "Investor kapitalining daromadi nimaga bog‘liq?", options: ["Faqat loyiha nomiga", "Qarzdan oldin kafolatli taqsimotga", "Loyiha natijasi, majburiyatlar va taqsimot shartlariga"], answer: 2, explanation: "Kapital tavakkal ostida; investor taqsimoti mavjud pul oqimi va moliyalashtirish kelishuvlari bilan cheklanadi." }],
    },
  ],
  "ppp-framework": [
    {
      id: "ppp-governance", title: "Vakolatlar va bosqichma-bosqich tasdiqlash", minutes: 12, page: 64, reading: "64–77-betlar, 1.7-bo‘lim",
      objectives: ["Tashabbus, ekspert yordami va tasdiq vazifalarini ajratish", "Har qaror uchun kerakli dalilni belgilash"],
      terms: [{ term: "PPP unit", meaning: "DXSh bo‘yicha tajriba va muvofiqlashtirish vazifalarini bajaradigan bo‘linma; vakolati tizimga qarab farq qiladi." }],
      body: `# Loyihani ilgari surish va uni tekshirish

Terminal tashabbuskori loyiha tez boshlanishini istaydi. Moliyaviy nazorat guruhi esa kelajak majburiyatlarini tekshiradi. Bu vazifalar bir-biriga zid bo‘lishi shart emas: ular bir qarorning turli tomonlariga javob beradi.

## To‘rtta mas’uliyat

Qo‘llanma loyihani aniqlash va xarid qilish, muvofiqlashtirish, davlat moliyasini boshqarish hamda tasdiqlashni ajratadi. Kim bajarishini mamlakatning mavjud institutlari belgilaydi. Yangi PPP bo‘linmasi ochilgani barcha vakolat avtomatik ravishda unga o‘tdi degani emas.

Tashabbuskor xizmat talabini yozadi va loyiha tayyorlashni boshqaradi. Mutaxassislar uslubiy sifatni tekshiradi. Moliya organi budjet to‘lovlari va risklarni ko‘radi. Vakolatli organ yetarli dalil asosida keyingi bosqichga ruxsat beradi.

## Tasdiq bir martalik tadbir emas

Dastlabki saralashdan keyingi ruxsat faqat batafsil baholashga resurs sarflash uchun bo‘lishi mumkin. Tender oldidan esa xizmat talabi, risk taqsimoti, budjet ta’siri va xarid hujjatlari qayta tekshiriladi. Yangi ma’lumot eski qarorni o‘zgartirishi mumkin.

Shartli loyiha guruhida “kim javobgar?” jadvalini tuzing. Har ish uchun bajaruvchi, tekshiruvchi, tasdiqlovchi va topshiriladigan hujjatni belgilang. Bir kishining yo‘qligida ish butunlay to‘xtamasligi uchun hujjatlar va qarorlar tarixi saqlanadi.

## Qarorning izi

“Rahbar ma’qulladi” degan og‘zaki xabar yetarli emas. Qaysi variant, qanday shartlar bilan va qaysi dalil asosida ma’qullangani yoziladi. Kamchilik qolsa, unga mas’ul va muddat beriladi. Bu dars xalqaro boshqaruv mantiqini tushuntiradi; muayyan davlatdagi vakolatlar amaldagi tartibdan olinadi.`,
      flow: [{ title: "Tayyorlash", description: "Muammo va variantlar" }, { title: "Tekshirish", description: "Sifat, risk va budjet" }, { title: "Tasdiqlash", description: "Dalilli qaror va shartlar" }],
      exercise: { title: "Ekspert yordami tasdiqmi?", situation: "PPP bo‘linmasi terminal hujjatiga maslahat berdi. Jamoa buni tender boshlash uchun yakuniy ruxsat deb talqin qildi.", question: "Nimani aniqlashtirish kerak?", hint: "Maslahat berish va qaror qabul qilish vakolatlari farq qiladi.", choices: [{ label: "Vakolatli tasdiqlovchi organ va zarur tekshiruvlarni", feedback: "Ekspert maslahati tegishli organ ruxsatining o‘rnini avtomatik bosmaydi." }, { label: "Faqat loyiha logotipini", feedback: "Asosiy noma’lum — qarorning vakolati va uning dalillari." }, { label: "Hech narsani, maslahatning o‘zi yetadi", feedback: "Maslahat, moliyaviy tekshiruv va rasmiy tasdiq turli vazifalar." }], answer: 0 },
      quiz: [{ question: "Dastlabki saralash ruxsati nimani anglatishi mumkin?", options: ["Shartnoma avtomatik imzolandi", "Batafsil baholashga o‘tish mumkin", "Budjet nazorati kerak emas"], answer: 1, explanation: "Ruxsat bosqichga tegishli bo‘ladi; yakuniy xarid qarori uchun qo‘shimcha dalillar talab etiladi." }, { question: "Qaror qaydida nima bo‘lishi kerak?", options: ["Faqat yig‘ilish sanasi", "Faqat loyiha narxi", "Tanlangan variant, asos, shart va mas’uliyat"], answer: 2, explanation: "Qaror izini tiklash va shartlar bajarilishini tekshirish uchun mazmunli qayd kerak." }],
    },
    {
      id: "ppp-fiscal-commitments", title: "Budjet to‘lovlari va yashirin majburiyatlar", minutes: 14, page: 78, reading: "78–92-betlar, 1.8-bo‘lim",
      objectives: ["Bevosita va shartli majburiyatni misolda ajratish", "Kafolatni ham risk reyestriga kiritish"],
      terms: [{ term: "Contingent liability", meaning: "Belgilangan hodisa yuz bersa haqiqiy to‘lovga aylanadigan shartli majburiyat." }],
      body: `# Bugun to‘lanmagan pul ham majburiyat bo‘lishi mumkin

DXSh qurilish uchun darhol katta davlat xarajatini talab qilmasligi mumkin. Lekin xizmat uchun kelajak to‘lovlari, subsidiyalar va kafolatlar budjetga ta’sir qiladi. Ularni joriy yil xarajatida ko‘rinmayotgani uchun nol deb olish noto‘g‘ri.

## Bevosita majburiyat

Davlat xizmat mavjudligi uchun har yil haq to‘lashga kelishsa, bu rejalashtiriladigan majburiyat. Miqdor indeksatsiya yoki sifat chegirmalari bilan o‘zgarishi mumkin, ammo loyiha amalga oshsa to‘lov oqimi bor. Kapital subsidiyasi ham bevosita majburiyat bo‘lishi mumkin.

## Shartli majburiyat

Davlat daromadning belgilangan chegaradan tushgan qismini qoplashga kafolat bersa, haqiqiy to‘lov talabga bog‘liq. Asosiy prognozda kafolat ishga tushmasligi uning qiymati va riski yo‘qligini anglatmaydi.

Shartli misol: yillik xizmat haqi 8 birlik, daromad kafolati bo‘yicha qo‘shimcha to‘lov yomon ssenariyda 3 birlik. Asosiy ssenariy xarajati 8, ushbu yomon ssenariy xarajati 11 birlik. Buni barcha loyihalar uchun universal hisoblash usuli deb qabul qilmaymiz: amalda ehtimollar, shartnoma chegaralari va bir-biriga bog‘liq risklar tekshiriladi.

## Bitta loyihadan portfelga

Bir necha loyiha bir vaqtda iqtisodiy pasayishga duch kelishi mumkin. Har biri alohida maqbul ko‘rinsa ham, jami kafolat to‘lovlari budjetga og‘ir tushishi mumkin. Shu sabab reyestrda majburiyat turi, ishga tushish sharti, bahosi, mas’ul va yangilanish sanasi saqlanadi.

Budjetga sig‘ish tekshiruvi qaror oldidan tugab qolmaydi. Prognozlar va risklar foydalanish davrida ham yangilanadi. “Xususiy hamkor pul topdi” iborasi davlatning uzoq muddatli mas’uliyatini yo‘qotmaydi.`,
      exercise: { title: "Kafolat ishga tushdi", situation: "Shartli terminal uchun davlatning yillik haqi 8 birlik. Talab pasaygani sabab shartnomadagi qo‘shimcha kafolat to‘lovi 3 birlik bo‘ldi.", question: "Ushbu ssenariyda jami to‘lov qancha?", hint: "Rejalashtirilgan haq bilan yuzaga kelgan kafolat to‘lovini qo‘shing.", choices: [{ label: "8 birlik", feedback: "Bu faqat bevosita to‘lov; kafolatning ishga tushgan qismi ham qo‘shiladi." }, { label: "11 birlik", feedback: "8 + 3 = 11 birlik. Shartli majburiyat ushbu hodisada haqiqiy xarajatga aylandi." }, { label: "3 birlik", feedback: "Kafolat qo‘shimcha to‘lov; u asosiy xizmat haqini almashtirmaydi." }], answer: 1 },
      quiz: [{ question: "Asosiy ssenariyda kafolat to‘lovi nol. Qaysi xulosa to‘g‘ri?", options: ["Riskni ham nol deb yozamiz", "Kafolatni reyestrdan o‘chiramiz", "Boshqa ssenariylar va ishga tushish shartlarini tekshiramiz"], answer: 2, explanation: "Shartli majburiyatning kutilmagan xarajatga aylanish ehtimoli asosiy ssenariydan tashqarida qolishi mumkin." }, { question: "Portfel darajasida nima muhim?", options: ["Risklar bir vaqtda yuzaga kelishi", "Faqat bitta loyiha nomi", "Faqat qurilish tugagan sana"], answer: 0, explanation: "O‘zaro bog‘liq risklar bir nechta kafolatni bir paytda ishga tushirishi mumkin." }],
    },
  ],
  "ppp-screening": [
    {
      id: "ppp-options", title: "Muqobillar va iqtisodiy foyda", minutes: 13, page: 13, reading: "13–30-betlar, 5–8-bo‘limlar",
      objectives: ["Muammoni bino yoki qurilish yechimidan ajratish", "Jamiyat foydasini loyiha daromadi bilan chalkashtirmaslik"],
      terms: [{ term: "CBA", meaning: "Loyihaning jamiyat uchun xarajat va foydasini taqqoslaydigan tahlil." }, { term: "Externality", meaning: "Loyiha narxida to‘liq aks etmaydigan tashqi ta’sir, masalan shovqin yoki ifloslanish." }],
      body: `# Terminal kerakmi yoki xizmatni yaxshilash kerakmi?

Muammo “terminal yo‘q” deb yozilsa, yagona yechim yangi terminal bo‘lib ko‘rinadi. Muammo “yo‘lovchilar uzoq kutmoqda va avtobuslar tartibsiz to‘xtamoqda” deb yozilsa, bir necha muqobil ochiladi. Xizmat ehtiyoji loyiha ro‘yxatining boshlanish nuqtasidir.

## Muqobillarni bir mezonda taqqoslang

Yangi bino qurish, mavjud bekatni qayta tashkil qilish va qatnov jadvalini yaxshilashni tekshiring. Har variant uchun talab, xizmat sifati, kapital xarajat, foydalanish xarajati va ijtimoiy ta’sirni bir xil davrda ko‘ring. Turli usul va taxminlardan foydalanish taqqoslashni buzishi mumkin.

Hech narsa o‘zgarmasa nima bo‘lishini ham yozing. Bu taqqoslashning boshlang‘ich holati. Variantning butun foydasini emas, shu boshlang‘ich holatga nisbatan qo‘shimcha foyda va xarajatini ajrating.

## Daromad iqtisodiy foydaning o‘zi emas

Chipta yoki xizmat haqi loyiha kompaniyasi pul oqimidir. Yo‘lovchilarning vaqt tejashi, avariya kamayishi yoki atrof-muhit ta’siri esa jamiyat nuqtayi nazaridan muhim bo‘lishi mumkin. Ular kompaniya hisobidagi daromadga to‘liq kirmaydi.

CBA shunday oqibatlarni tartibli baholaydi. Vaqt bo‘yicha turli xarajat va foydalar taqqoslanadigan qiymatga keltiriladi. Soliq va resurs narxlarini iqtisodiy tahlilga o‘tkazish alohida uslub talab qiladi; moliyaviy modeldagi summalarni mexanik ko‘chirish yetarli emas.

## Qaror uchun kerakli dalil

Talab prognozi qayerdan olingan? Mavjud xizmat qanchalik band? Kim yutadi, kim zarar ko‘rishi mumkin? Shu savollarga javob yig‘ilgach, eng asosli texnik yechim tanlanadi. Uni DXSh orqali qilish-qilmaslik esa keyingi, alohida qarordir.`,
      exercise: { title: "Yechimni erta tanlash", situation: "Jamoa yo‘lovchilarning uzoq kutishi muammosiga javoban faqat yangi terminal variantini baholadi.", question: "Tahlilda nima yetishmayapti?", hint: "Bir muammoni kapital qurilishsiz ham kamaytirish mumkinmi?", choices: [{ label: "Muqobil xizmat yechimlari va boshlang‘ich holat bilan taqqoslash", feedback: "Jadvalni yaxshilash yoki mavjud bekatni qayta tashkil qilish ham tekshiriladigan variant bo‘lishi mumkin." }, { label: "Faqat binoning rangi", feedback: "Asosiy qaror xizmat muammosi va muqobillar haqidagi dalilga tayanadi." }, { label: "Tayyor g‘olib kompaniya", feedback: "Yechim va xarid modeli asoslanmasdan g‘olibni tanlashga o‘tib bo‘lmaydi." }], answer: 0 },
      quiz: [{ question: "Yo‘lovchi vaqtining tejalishi qaysi tahlilda muhim?", options: ["Faqat kompaniya logotipida", "Iqtisodiy xarajat–foyda tahlilida", "Hech qaysisida"], answer: 1, explanation: "Jamiyat foydasi pul tushumidan kengroq: vaqt va tashqi ta’sirlar ham baholanadi." }, { question: "Muqobillar qanday taqqoslanadi?", options: ["Har biri uchun turli muddat bilan", "Faqat birinchi yil xarajati bilan", "Bir xil xizmat maqsadi, davr va asoslangan taxminlar bilan"], answer: 2, explanation: "Izchil mezonlar bo‘lmasa, natijalar variantlarning haqiqiy farqini ko‘rsatmaydi." }],
    },
    {
      id: "ppp-screening-report", title: "Saralash hisoboti va manfaatdor tomonlar", minutes: 12, page: 33, reading: "33–46 va 56–58-betlar, 10–15-bo‘limlar va Appendix A",
      objectives: ["DXShga moslikni dalil bilan baholash", "Noma’lum ma’lumotlarni qaror hisobotida ko‘rsatish"],
      terms: [{ term: "Stakeholder", meaning: "Loyihaga ta’sir qiladigan yoki uning ta’sirini sezadigan shaxs va tashkilot." }, { term: "Screening", meaning: "Batafsil tayyorlashdan oldingi dastlabki moslik tekshiruvi." }],
      body: `# Saralash natijasi — dalilli keyingi qadam

Iqtisodiy jihatdan kerakli terminal xususiy hamkor uchun boshqariladigan va bozorda qiziqish uyg‘otadigan loyiha bo‘lishi ham kerak. Dastlabki saralashning vazifasi barcha tafsilotni tugatish emas, keyingi qimmat tayyorlash ishiga asos borligini aniqlashdir.

## Moslikni tekshirish

Xizmat natijasi o‘lchanadimi? Yer masalasi hal bo‘lishi mumkinmi? Risklar xususiy hamkor boshqara oladigan darajadami? Loyiha bozordagi kompaniyalar uchun juda katta yoki murakkab emasmi? Tayyorlash va tender xarajati loyiha hajmiga mosmi? Dastlabki budjet imkoniyati bormi?

Javoblar faqat “ha” va “yo‘q”dan iborat bo‘lishi shart emas. “Ma’lumot yetishmaydi” ham foydali natija, agar qanday ma’lumotni kim va qachon topishi yozilsa. Noaniqlikni ijobiy belgi bilan yashirish keyingi bosqichdagi xarajatni oshiradi.

## Kim bilan gaplashish kerak?

Yo‘lovchilar, tashuvchilar, atrofdagi aholi, xizmat idoralari va loyiha ta’sir qiladigan bizneslar turli ehtiyojga ega. Muloqot faqat tayyor qarorni e’lon qilish emas: u talab, xavotir va yechimga qo‘yiladigan shartlarni aniqlashga yordam beradi.

Qisqa xaritada tomon, unga ta’sir, kerakli ma’lumot va aloqa usulini belgilang. E’tirozning mavjudligi avtomatik rad javobi emas; e’tiroz nimaga tayanishini tushunish loyiha dizaynini yaxshilashi mumkin.

## Hisobotning yakuni

Hisobot xizmat muammosi, tanlangan variant, dastlabki xarajat, DXShga moslik, asosiy risk va keyingi ish rejasini birlashtiradi. Tavsiya davom etish, qo‘shimcha ma’lumot yig‘ish, qayta ishlash yoki to‘xtatish bo‘lishi mumkin. Ijobiy saralash tender e’lon qilish uchun to‘liq asos emas.`,
      exercise: { title: "Yer haqida ma’lumot yo‘q", situation: "Terminal uchun tanlangan yerning mavjudligi tasdiqlanmagan. Hisobot tayyorlovchi barcha qatorlarga “mos” deb yozmoqchi.", question: "Qanday qayd foydaliroq?", hint: "Noaniqlikni yo‘q deb ko‘rsatish bilan uni boshqarish farq qiladi.", choices: [{ label: "Yer masalasini olib tashlash", feedback: "Bu muhim riskni yashiradi va baholashni zaiflashtiradi." }, { label: "Tenderdan keyin o‘ylash", feedback: "Yer mavjudligi loyiha doirasi va narxiga oldindan ta’sir qiladi." }, { label: "Noma’lum holat, tekshiruvchi va muddatni yozish", feedback: "Hisobot cheklovni ochiq ko‘rsatadi va keyingi qaror uchun dalil yig‘ish vazifasini beradi." }], answer: 2 },
      quiz: [{ question: "Ijobiy saralashdan keyin odatda nima kerak?", options: ["Batafsil baholash", "Darhol yakuniy to‘lov", "Xizmat monitoringini bekor qilish"], answer: 0, explanation: "Saralash keyingi tayyorlashga asos beradi, yakuniy baholashning o‘rnini bosmaydi." }, { question: "Aholi bilan erta muloqotning vazifasi nima?", options: ["Barcha fikrlarni avtomatik qabul qilish", "Ehtiyoj, ta’sir va xavotirlarni aniqlash", "Moliyaviy modelni butunlay almashtirish"], answer: 1, explanation: "Muloqot loyiha shartlarini yaxshilashga dalil beradi; boshqa tahlillar ham bajariladi." }],
    },
  ],
  "ppp-appraisal": [
    {
      id: "ppp-cashflow", title: "Pul oqimi, DSCR va stress ssenariysi", minutes: 16, page: 22, reading: "22–41-betlar, 6–8.1.2-bo‘limlar",
      objectives: ["Bir davr uchun DSCRni hisoblash", "Bazaviy prognoz va salbiy ssenariyni solishtirish"],
      terms: [{ term: "DSCR", meaning: "Qarzga xizmat qilish uchun mavjud pul oqimi / shu davrdagi qarz xizmati." }, { term: "Base case", meaning: "Asoslangan eng ehtimolli taxminlarga tayangan bazaviy ssenariy." }],
      body: `# Daromad borligi qarzga pul yetishini anglatmaydi

Moliyaviy model pul qachon kirishi va qachon chiqishini ko‘rsatadi. Terminal yil davomida daromad olsa ham, katta ta’mirlash yoki qarz to‘lovi keladigan davrda pul yetishmasligi mumkin. Shu sabab umumiy foyda bilan birga davrlar kesimidagi pul oqimi tekshiriladi.

## Modelning kirishlari

Qurilish va uskunalar, foydalanish xarajatlari, yangilash, daromad, soliq, qarz va investor kapitali bir-biriga bog‘lanadi. Valyuta kursi, inflyatsiya va ishga tushish sanasi kabi taxminlarning manbasi yoziladi. Faqat yakuniy chiroyli raqamni ko‘rsatadigan model tekshirish uchun yetarli emas.

## DSCRni o‘qing

Shartli misolda qarzga xizmat qilish uchun mavjud yillik pul oqimi **12 birlik**, shu yilgi asosiy qarz va foiz to‘lovi **10 birlik**. DSCR = 12 / 10 = **1,2**. Bu ayni davrda mavjud pul qarz xizmatidan 20% ko‘p ekanini bildiradi.

1,2 barcha banklar uchun majburiy yoki yetarli chegara emas. Zarur koeffitsiyent loyiha va moliyalashtirish shartiga bog‘liq. Suratdagi pul oqimini oddiy tushum bilan almashtirmang: undan operatsion va boshqa tegishli xarajatlar allaqachon hisobga olingan bo‘lishi kerak.

## Taxminni o‘zgartiring

Talab pasayib, mavjud pul oqimi 9 birlik bo‘lsa, qarz xizmati o‘zgarmagan holatda DSCR = 0,9. Endi ayni davrdagi pul yetarli emas. Zaxira hisoblari yoki qo‘shimcha yordam bo‘lsa, ular alohida ko‘rsatiladi.

Sezgirlik tahlili bitta omilni, ssenariy tahlili esa bir nechta bog‘liq o‘zgarishni tekshirishi mumkin. Qurilish kechikishi, xarajat oshishi va talab pasayishini sinab ko‘ring. Modelning vazifasi oldindan belgilangan natijani oqlash emas, zaif joylarni ochishdir.`,
      flow: [{ title: "Bazaviy taxmin", description: "Mavjud pul: 12; qarz: 10" }, { title: "Talab pasayadi", description: "Mavjud pul: 9; qarz: 10" }, { title: "Qoplash", description: "DSCR: 1,2 dan 0,9 ga" }],
      exercise: { title: "Qarz xizmatiga pul yetadimi?", situation: "Yangi variant: qarzga xizmat qilish uchun mavjud pul 15 birlik, qarz xizmati 12 birlik.", question: "DSCR nechaga teng?", hint: "Mavjud pul oqimini qarz xizmati summasiga bo‘ling.", choices: [{ label: "0,8", feedback: "Nisbat teskari olingan: 12/15 emas, 15/12 kerak." }, { label: "1,25", feedback: "15 / 12 = 1,25. Bu davrdagi pul qarz xizmatining 125 foiziga teng." }, { label: "3", feedback: "3 birlik farq, DSCR esa ayirma emas, nisbatdir." }], answer: 1 },
      quiz: [{ question: "DSCR 0,9 bo‘lsa, nimani bildiradi?", options: ["Qarz xizmati uchun davrdagi mavjud pul yetarli emas", "Investor 90% foyda oladi", "Loyiha barcha mezonlardan o‘tdi"], answer: 0, explanation: "1dan kichik nisbat shu davrdagi pul oqimi qarz xizmatidan kamligini bildiradi." }, { question: "Bazaviy ssenariy nimaga tayanadi?", options: ["Faqat eng yaxshi natijaga", "Tasodifiy raqamlarga", "Manbasi ko‘rsatilgan asosli taxminlarga"], answer: 2, explanation: "Bazaviy holatni tekshirish uchun taxmin, davr va ma’lumot manbalari aniq bo‘lishi kerak." }],
    },
    {
      id: "ppp-value-for-money", title: "VfM: arzon qurilishdan kengroq qaror", minutes: 15, page: 74, reading: "74–85-betlar, 16-bo‘lim",
      objectives: ["Bir xil xizmatni butun hayot davri bo‘yicha taqqoslash", "Raqamli natijaning cheklovlarini tushuntirish"],
      terms: [{ term: "PSC", meaning: "Xizmat davlatning an’anaviy xaridi bilan bajarilgandagi taqqoslash qiymati." }, { term: "VfM", meaning: "Hayot davri xarajati, sifat va risklar hisobga olingandagi qiymat." }],
      body: `# Eng arzon bino eng yaxshi xizmatmi?

Terminalning qurilish narxi taklifning ko‘zga tez tashlanadigan qismi. Lekin keyingi ta’mirlash, energiya, xizmat sifati va risk xarajatlari uzoq davr davom etadi. VfM shu kattaroq manzarani boshqa xarid usuli bilan taqqoslashga yordam beradi.

## Teng asosdan boshlang

Davlat xaridi va PPP bir xil xizmat hajmi, sifat va davrni qamrashi kerak. Bir variant 20 yillik ta’mirlashni o‘z ichiga olsa, boshqasi faqat qurilishni qamrasa, yalang‘och narxlar tenglashtirilmagan. Davlat nuqtayi nazaridan xarajat va daromadlarning joriy qiymati tekshiriladi.

**PSC** davlatning an’anaviy yo‘li bo‘yicha asoslangan taqqoslashidir. U sun’iy ravishda qimmatlashtirilsa, PPP foydali degan xulosa oldindan yasab qo‘yiladi. Riskni ikki marta hisoblash yoki bir variantdan butunlay chiqarish ham natijani buzadi.

## Shartli misol

Bir xil sifat va davr uchun joriy qiymatlar berilgan: davlat varianti qurilish 80 va xizmat 50 — jami **130 birlik**. PPP varianti qurilish 95 va xizmat 25 — jami **120 birlik**. Qurilishga qaralsa davlat arzon, jami xarajatga qaralsa PPP arzonroq.

Bu 10 birlik farq hali yakuniy qaror emas. Moliyalashtirish, risk, nazorat, tranzaksiya xarajatlari va sifat haqidagi taxminlar to‘liq tekshirilmagan. Raqamlar faqat hayot davri fikrlashini mashq qilish uchun berilgan.

## Natijani sinang

Ta’mirlash yoki risk bahosi o‘zgarsa ustunlik saqlanadimi? Davlat xizmat natijasini o‘lchay oladimi? Bozorda raqobat bormi? Qo‘llanma raqamli tahlilga sezgirlik va sifat jihatidan baholashni qo‘shadi. Bitta musbat foiz avtomatik ravishda “PPPni tanlang” degan buyruq emas.`,
      exercise: { title: "Ta’mirlash taxmini o‘zgardi", situation: "Shartli PPP variantida qurilish 95, xizmat xarajatining joriy qiymati endi 40 birlik. Davlat variantining taqqoslanadigan jami qiymati 130 birlik.", question: "Faqat ushbu xarajatlar bo‘yicha nima o‘zgardi?", hint: "95 + 40ni 130 bilan solishtiring.", choices: [{ label: "PPP hali 10 birlik arzon", feedback: "Eski 25 birlik xizmat bahosi o‘zgardi; jami xarajatni qayta hisoblash kerak." }, { label: "Ikkalasi teng", feedback: "PPP jami 135, davlat varianti 130 birlik." }, { label: "PPP 5 birlik qimmatroq bo‘ldi", feedback: "95 + 40 = 135. Natija xizmat xarajati taxminiga sezgir ekanini ko‘rdingiz." }], answer: 2 },
      quiz: [{ question: "VfMda taqqoslashning asosi nima?", options: ["Bir xil xizmat, sifat va davr", "Faqat qurilish narxi", "Faqat investor daromadi"], answer: 0, explanation: "Teng bo‘lmagan xizmatlarni yalang‘och narx bilan solishtirish noto‘g‘ri qarorga olib kelishi mumkin." }, { question: "Musbat raqamli VfM nimani almashtirmaydi?", options: ["Loyiha nomini", "Sezgirlik va sifat tahlilini", "Hisobot sarlavhasini"], answer: 1, explanation: "Risk baholari va xarajat taxminlari noaniq; sifat omillari bilan birga qaraladi." }],
    },
  ],
  "ppp-structuring": [
    {
      id: "ppp-risk-matrix", title: "Risk matritsasini tuzish", minutes: 15, page: 73, reading: "73–103-betlar, 5-bo‘lim",
      objectives: ["Risk hodisasi, oqibati va chorasini ajratish", "Taqsimotni boshqarish qobiliyati bilan asoslash"],
      terms: [{ term: "Retained risk", meaning: "Davlat tomonida qoladigan risk." }, { term: "Risk premium", meaning: "Riskni qabul qilish va boshqarish uchun narxga kiritiladigan qo‘shimcha haq." }],
      body: `# Riskni topshirishdan oldin uni tushuning

“Qurilish riski — xususiy hamkorda” degan bitta qator yetarli emas. Qanday hodisa, qaysi sababdan va qanday oqibat bilan yuz berishi mumkinligini yozish kerak. Masalan, uskuna kech kelishi bilan yer o‘z vaqtida berilmasligi bir xil sababga ega emas.

## Matritsaning ustunlari

Har risk uchun hodisa, ehtimoliy sabab, xizmat yoki xarajatga ta’sir, boshqaruvchi tomon va kamaytirish chorasi belgilanadi. Ma’lumot yetarli bo‘lsa ehtimol va moliyaviy ta’sir baholanadi. Oddiy ball berish noaniqlikni yo‘qotmaydi; asos ham yoziladi.

Terminalda uskunaning muddatidan oldin buzilishi dizayn, tanlov va texnik xizmatga bog‘liq bo‘lishi mumkin. Bularni hamkor boshqarsa, riskni unga berish sifatli uskuna va muntazam xizmatni rag‘batlantiradi. Davlat o‘zi bajarishi lozim bo‘lgan yer topshirishni kechiktirsa, uni hamkor boshqara oladimi — alohida savol.

## Maksimal emas, samarali taqsimot

Hamkor nazorat qila olmaydigan barcha hodisani unga yuklash riskni yo‘q qilmaydi. U yuqori narx taklif qilishi yoki qatnashmasligi mumkin. Davlat ham xizmat uchun yakuniy jamoatchilik mas’uliyatidan to‘liq chiqib ketmaydi.

Ba’zi risklar bo‘linadi: chegara, sug‘urta, kompensatsiya hodisasi yoki qayta ko‘rib chiqish tartibi belgilanadi. Bular universal qoidalar emas; loyiha, bozor va huquqiy sharoitga bog‘liq.

## Jadvaldan shartnomaga

Risk matritsasidagi qaror to‘lov, muddat, xabarnoma va tuzatish bandlarida aks etishi kerak. “Kim javobgar?” bilan birga “hodisa yuz bersa nima qilamiz?”ga javob yozing. So‘ng taqsimotning narx va moliyalashtirishga ta’sirini qayta tekshiring.`,
      flow: [{ title: "Aniqlash", description: "Hodisa va sabab" }, { title: "Baholash", description: "Ehtimol va oqibat" }, { title: "Taqsimlash", description: "Nazorat va rag‘bat" }, { title: "Kuzatish", description: "Chora va dalil" }],
      exercise: { title: "Uskunani kim tanlaydi?", situation: "Hamkor terminal uskunasini tanlaydi, o‘rnatadi va unga xizmat ko‘rsatadi. Arzon, tez buziladigan uskuna xizmatni to‘xtatishi mumkin.", question: "Shu shartlarda riskni boshqarishga kim yaqinroq?", hint: "Uskuna sifati va texnik xizmat bo‘yicha qarorni kim qabul qilmoqda?", choices: [{ label: "Yo‘lovchilar", feedback: "Yo‘lovchilar uskuna tanlovi va texnik xizmatni boshqarmaydi." }, { label: "Xususiy hamkor", feedback: "Hamkor tanlash va xizmat ko‘rsatishni boshqaradi; natijaga javobgarlik sifatga rag‘bat beradi." }, { label: "Hech kim", feedback: "Mas’uliyatsiz qoldirish hodisa va uning xizmatga ta’sirini yo‘qotmaydi." }], answer: 1 },
      quiz: [{ question: "Riskni hamkorga topshirishning chegarasi nimaga bog‘liq?", options: ["Riskni boshqarish imkoniyati va narxga ta’siriga", "Faqat kompaniya yoshiga", "Risk nomining uzunligiga"], answer: 0, explanation: "Maqsad maksimal transfer emas, samarali boshqarish va qiymat yaratishdir." }, { question: "Risk matritsasidan keyin nima kerak?", options: ["Uni hech qachon yangilamaslik", "Uni yashirish", "Taqsimotni shartnomaning ishlaydigan bandlariga o‘tkazish"], answer: 2, explanation: "Risk qarori to‘lov, muddat, xabar va tuzatish jarayonlarida bajariladigan bo‘lishi kerak." }],
    },
    {
      id: "ppp-payment-design", title: "Xizmat ko‘rsatkichi va to‘lov mexanizmi", minutes: 14, page: 50, reading: "50–72-betlar, 4.7–4.10-bo‘limlar",
      objectives: ["O‘lchanadigan xizmat natijasini yozish", "Sifat buzilishi bilan to‘lov o‘rtasidagi bog‘lanishni tushuntirish"],
      terms: [{ term: "Availability payment", meaning: "Xizmat yoki aktivning kelishilgan sharoitda mavjudligi uchun to‘lov." }, { term: "Deduction", meaning: "Shartnoma shartlari bo‘yicha to‘lovdan chegirma." }],
      body: `# To‘lov qaysi xatti-harakatni rag‘batlantiradi?

Davlat “terminal yaxshi ishlasin” desa, hamkor va tekshiruvchi buni turlicha tushunishi mumkin. To‘lov mexanizmi aniq xizmat natijasiga tayanadi: nima o‘lchanadi, qanday dalil olinadi va yetishmovchilik bo‘lsa nima yuz beradi?

## Natijani o‘lchanadigan qiling

Masalan, “kelishilgan ish vaqtida platformalar foydalanishga tayyor bo‘lsin” degan talab mavjudlikka tegishli. Tekshiruvda qaysi platforma, qaysi soat va qaysi sabab bilan ishlamagani qayd etiladi. Xavfsizlik talablari ham mavjudlik ta’rifining bir qismi bo‘lishi mumkin.

Binoni qurishga sarflangan beton miqdori xizmat natijasining o‘zi emas. Chiqishga yo‘naltirilgan talab hamkorga samarali yechim tanlash imkonini beradi, lekin natijani tekshirish imkoniyati davlatda bo‘lishi kerak.

## Chegirma mantiqi

Shartli mashqda oylik bazaviy to‘lov 100 birlik. Kelishilgan mezon bo‘yicha tasdiqlangan chegirma 7 birlik bo‘lsa, boshqa o‘zgarishlar yo‘q holatda to‘lov **93 birlik**. Bu oddiy arifmetika; haqiqiy shartnomada vaznlar, chegaralar, tiklash muddatlari va istisnolar bo‘lishi mumkin.

Takroriy yoki asosiy xizmatni buzadigan hodisaga kuchliroq moliyaviy oqibat belgilanishi mumkin. Juda yengil chegirma tuzatishga rag‘bat bermasligi, haddan tashqari og‘ir mexanizm esa narx yoki bankabilityga salbiy ta’sir qilishi mumkin.

## Dalil va tortishuv

Monitoring natijasini kim taqdim etishi, kim tekshirishi va xatoga qanday e’tiroz bildirish mumkinligi oldindan yoziladi. Maqsad har qanday narxda jarima yig‘ish emas, kelishilgan xizmatni ta’minlashdir. To‘lov dizaynini risk taqsimoti va moliyaviy model bilan birga sinang.`,
      exercise: { title: "Xizmatga bog‘langan to‘lov", situation: "Shartli oy uchun bazaviy haq 120 birlik. Tasdiqlangan xizmat chegirmasi 9 birlik. Boshqa tuzatish yo‘q.", question: "To‘lanadigan summa qancha?", hint: "Bazaviy to‘lovdan tasdiqlangan chegirmani ayiring.", choices: [{ label: "111 birlik", feedback: "120 − 9 = 111. Bu mashqda chegirma miqdori tayyor berilgan; real formulani shartnoma belgilaydi." }, { label: "129 birlik", feedback: "Chegirma to‘lovga qo‘shilmaydi, undan ayriladi." }, { label: "120 birlik", feedback: "Tasdiqlangan xizmat yetishmovchiligining moliyaviy oqibati hisobga olinmay qoldi." }], answer: 0 },
      quiz: [{ question: "Qaysi talab o‘lchanadigan natijaga yaqin?", options: ["Eng zo‘r terminal bo‘lsin", "Kelishilgan soatlarda platformalarning foydalanishga tayyorligi", "Hamkor har doim mamnun bo‘lsin"], answer: 1, explanation: "Davr, obyekt va foydalanishga tayyorlik talabi tekshiriladigan ko‘rsatkichga aylantirilishi mumkin." }, { question: "Chegirmani qo‘llash uchun nima muhim?", options: ["Faqat taxmin", "Faqat xodim fikri", "Shartnomadagi mezon va tekshirilgan dalil"], answer: 2, explanation: "To‘lov oqibati oldindan belgilangan, dalil bilan tekshiriladigan tartibga tayanadi." }],
    },
  ],
  "ppp-tender": [
    {
      id: "ppp-bid-evaluation", title: "Tenderda teng axborot va baholash", minutes: 13, page: 17, reading: "17–30-betlar, 5–11-bo‘limlar",
      objectives: ["Tushuntirishni yashirin ustunlikdan ajratish", "Taklifni e’lon qilingan mezonlar bilan tekshirish"],
      terms: [{ term: "RFP", meaning: "Loyiha bo‘yicha taklif berish talablari va baholash tartibini belgilovchi hujjatlar." }],
      body: `# Raqobatga tayyor hujjat — jarayonning boshlanishi

Tender boshlanganidan keyin ham davlat jamoasining ishi davom etadi. Ishtirokchi savollari, hujjatga o‘zgartirish, taklifni qabul qilish va baholash tartibli boshqarilishi kerak. Yaxshi loyiha teng bo‘lmagan axborot sababli zaif natija berishi mumkin.

## Tushuntirishning chegarasi

Ishtirokchi o‘z texnik yechimi haqida maxfiy savol berishi mumkin. Bunday tijoriy ma’lumotni boshqa ishtirokchilarga tarqatish to‘g‘ri emas. Ammo xizmat talabi yoki hamma taklif narxiga ta’sir qiladigan umumiy tushuntirishni faqat bittasiga berish ham ustunlik yaratadi.

Savollar ro‘yxati, yozma javoblar, uchrashuv qaydlari va zarur umumiy tushuntirishlar uchun bir xil jarayon belgilanadi. Material o‘zgarish taklif tayyorlashga ta’sir qilsa, hujjatlar va muddat masalasi ko‘rib chiqiladi.

## Takliflarni tekshirish

Avval muvofiqlik va belgilangan talablar, so‘ng e’lon qilingan sifat va narx mezonlari tekshiriladi. Baholashdan keyin yoqqan ishtirokchini g‘olib qilish uchun mezonni almashtirish jarayon ishonchliligini buzadi.

Eng past narx har doim bajariladigan va eng yaxshi taklif degani emas. Moliyaviy taxminlar, risklar, xizmat doirasi va talabga moslik tegishli mezonlar bo‘yicha baholanadi. Baholovchilar asoslarini yozib qoldirishi kerak.

## Qaror va keyingi tekshiruv

Vakolatli organ baholash natijasiga tayanib qaror qiladi. Tasdiq yoki e’tiroz tartibi mamlakat va tender qoidalariga bog‘liq. Kelishuvlar natijasida taklif o‘zgarsa, VfM va bajarish imkoniyati saqlanganini qayta ko‘rish kerak. Tender jarayonining o‘zi ham audit uchun iz qoldiradi.`,
      exercise: { title: "Faqat bir ishtirokchi biladi", situation: "Davlat talab qilinadigan xizmat soatini o‘zgartirdi, lekin buni faqat bitta taklif beruvchiga aytdi.", question: "Jarayonni qanday to‘g‘rilash kerak?", hint: "Bu umumiy xizmat talabi; tijoriy maxfiy yechim emas.", choices: [{ label: "O‘zgarishni g‘olib tanlanguncha yashirish", feedback: "Boshqa takliflar eski shartda tayyorlanadi va taqqoslash teng bo‘lmaydi." }, { label: "Umumiy o‘zgarishni belgilangan tartibda barchaga yetkazish", feedback: "Talabdagi umumiy o‘zgarish barcha ishtirokchilarga bir xil asos yaratishi kerak; muddatga ta’sir ham ko‘riladi." }, { label: "Mezonlarni takliflar ochilgach tanlash", feedback: "Mezonlar oldindan ma’lum bo‘lishi kerak." }], answer: 1 },
      quiz: [{ question: "Baholash mezonlari qachon belgilanadi?", options: ["Takliflar natijasiga qarab", "G‘olib e’lon qilingandan keyin", "Tender hujjatlarida oldindan"], answer: 2, explanation: "Oldindan e’lon qilingan mezonlar teng va izchil baholash asosidir." }, { question: "Ishtirokchining maxfiy texnik yechimi bilan nima qilinadi?", options: ["Maxfiylik qoidalariga muvofiq himoyalanadi", "Har doim ommaga tarqatiladi", "Boshqa ishtirokchi nomidan yuboriladi"], answer: 0, explanation: "Teng axborot tamoyili ishtirokchining tijoriy maxfiyligini avtomatik bekor qilmaydi." }],
    },
    {
      id: "ppp-financial-close", title: "Shartnoma imzosi va financial close", minutes: 12, page: 30, reading: "30–36-betlar, 11–14-bo‘limlar",
      objectives: ["Contract signature va financial closeni ajratish", "Mablag‘ olishning old shartlarini tushuntirish"],
      terms: [{ term: "Financial close", meaning: "Moliyalashtirish kelishuvlari va mablag‘dan foydalanishning tegishli old shartlari bajarilgan bosqich." }, { term: "Direct agreement", meaning: "Davlat, loyiha kompaniyasi va kreditor huquqlarini bog‘laydigan kelishuv." }],
      body: `# Imzo qo‘yildi. Pulni ishlatish mumkinmi?

Tender g‘olibi bilan PPP shartnomasi imzolanishi katta bosqich. Ammo bu hodisa har doim bank mablag‘i darhol foydalanishga tayyor degani emas. Qo‘llanma shartnoma imzosi va **financial close**ni alohida ko‘radi.

## Ikki xil yakun

PPP shartnomasi davlat va xususiy hamkorning xizmat, risk va to‘lov munosabatini belgilaydi. Moliyalashtirish hujjatlari qarz shartlari, xavfsizlik mexanizmlari, kapital kiritish va mablag‘ olish talablarini belgilaydi. Bu kelishuvlar bir-biriga mos bo‘lishi kerak.

Ba’zi loyihalarda imzo va moliyaviy yopilish deyarli bir vaqtda, boshqalarida oralig‘i uzoqroq bo‘ladi. Davrning o‘zi yaxshi yoki yomon loyiha mezoni emas; bajarilishi lozim bo‘lgan ish va risklar aniqlanadi.

## Old shartlar ro‘yxati

Shartli terminal uchun talab etilgan kapital kiritilishi, sug‘urta hujjatlari, ruxsatlar va kelishilgan kafolatlar tekshirilishi mumkin. Haqiqiy ro‘yxat tegishli kelishuvdan olinadi. “Bank qiziqyapti” degan xat mablag‘ olishning barcha shartlari bajarilganini anglatmaydi.

Davlat moliyalashtirish hujjatlari PPP shartnomasida ko‘zda tutilmagan qo‘shimcha majburiyat yuklamasligini tekshiradi. Kreditorning step-in huquqi kabi masalalar shartnomalar o‘rtasida muvofiqlashtiriladi.

## Oraliq davr riski

Imzo bilan moliyaviy yopilish oralig‘ida stavkalar yoki bozor sharoiti o‘zgarishi mumkin. Kim qaysi riskni olishi va muddat bajarilmasa nima bo‘lishi oldindan belgilanadi. Loyiha jamoasi bajarilmagan shart, mas’ul, muddat va tasdiqlovchi hujjatni kuzatadi. Bu bosqich qurilish va xizmat majburiyatlariga tayyorlikni mustahkamlaydi.`,
      flow: [{ title: "G‘olib", description: "Baholash va qaror" }, { title: "Shartnoma", description: "PPP majburiyatlari" }, { title: "Moliyaviy yopilish", description: "Moliyalashtirish shartlari bajariladi" }],
      exercise: { title: "Bankning qiziqish xati", situation: "PPP shartnomasi imzolandi. Bank qiziqish bildirdi, ammo qarz kelishuvi va old shartlar hali tugamagan.", question: "Financial close bo‘ldimi?", hint: "Qiziqish bildirishni mablag‘ olish shartlari bilan solishtiring.", choices: [{ label: "Yo‘q, moliyalashtirish shartlari hali bajarilmagan", feedback: "Imzo va bank qiziqishi yakunlangan moliyalashtirish kelishuvlari o‘rnini bosmaydi." }, { label: "Ha, bank nomi ma’lum", feedback: "Bank nomi yoki qiziqish xati financial close dalili emas." }, { label: "Ha, loyiha haqida e’lon bor", feedback: "Ommaviy e’lon moliyalashtirishning old shartlari bajarilganini isbotlamaydi." }], answer: 0 },
      quiz: [{ question: "Financial close uchun nimani kuzatish kerak?", options: ["Faqat yangiliklar sonini", "Moliyalashtirish hujjatlari va old shartlarni", "Faqat imzo rasmini"], answer: 1, explanation: "Mablag‘dan foydalanishga tayyorlik kelishuv va shartlar bajarilishiga tayanadi." }, { question: "Davlat moliyalashtirish kelishuvini nega ko‘radi?", options: ["Har bir qarzni o‘zi qaytarish uchun", "Investor o‘rniga daromad olish uchun", "PPP shartnomasiga zid qo‘shimcha majburiyatlar paydo bo‘lmasligi uchun"], answer: 2, explanation: "Moliyalashtirish tuzilishi davlatning kelishilgan huquq va majburiyatlariga mos bo‘lishi kerak." }],
    },
  ],
  "ppp-construction": [
    {
      id: "ppp-contract-team", title: "Shartnomani boshqaradigan jamoa", minutes: 12, page: 12, reading: "12–28 va 85–87-betlar, 4 va 12-bo‘limlar",
      objectives: ["Nazorat va bajarish mas’uliyatini ajratish", "Hujjatlar va qarorlar izini rejalashtirish"],
      terms: [{ term: "Contract management manual", meaning: "Shartnomani kundalik boshqarish jarayonlari, vakolatlari va hujjatlarini tushuntiruvchi qo‘llanma." }],
      body: `# Imzolangan shartnoma o‘zini o‘zi boshqarmaydi

PPP uzoq muddat davom etadi. Tenderni tayyorlagan odamlar keyinchalik boshqa lavozimga o‘tishi mumkin. Shartnomadagi kelishuvlar yangi jamoaga tushunarli jarayon va hujjat sifatida o‘tmasa, bilim yo‘qoladi.

## Davlatning vazifasi

Xususiy hamkor ishlarni bajaradi va o‘z zimmasidagi risklarni boshqaradi. Davlat shartnoma natijalari, o‘z majburiyatlari, o‘zgarishlar va to‘lovlarni nazorat qiladi. Har bir texnik qarorni davlatning o‘zi qabul qilishi risk va mas’uliyat chegarasini chalkashtirishi mumkin.

Jamoaga shartnoma, texnika, moliya va hujjat boshqaruvi qobiliyatlari kerak. Aniq tarkib loyiha murakkabligiga mos belgilanadi. Mas’ul shaxslar va muammo qaysi darajaga olib chiqilishi oldindan ma’lum bo‘ladi.

## Kundalik qo‘llanma

Boshqaruv qo‘llanmasida hisobot taqvimi, to‘lovni tekshirish, o‘zgarishni ko‘rib chiqish, xabarnoma, nizo va favqulodda vaziyat tartibi tushuntiriladi. U shartnomani almashtirmaydi; jamoaga uni izchil bajarishga yordam beradi.

Terminalda uskuna almashtirish taklifi kelganda kim ko‘radi? Sifat dalilini kim tekshiradi? Xarajat va muddatga ta’sirni kim baholaydi? Qaysi organ tasdiqlaydi? Bu savollar hodisa sodir bo‘lgach birinchi marta berilmasligi kerak.

## Bilimni saqlash

Chizmalar versiyasi, yig‘ilish qarorlari, risklar, xabarnomalar va sinov natijalari tartibli saqlanadi. Hujjatning kimga ochiqligi ham belgilanadi. Eng so‘nggi chizma o‘rniga eski nusxa ishlatilsa, texnik va shartnomaviy nizolar chiqishi mumkin. Tizimning qiymati dastur nomida emas, jamoaning undan izchil foydalanishidadir.`,
      exercise: { title: "Jamoa almashdi", situation: "Yangi menejer terminaldagi o‘zgarish nima uchun tasdiqlanganini topa olmadi. Faqat og‘zaki eslatma bor.", question: "Qaysi amaliyot buni oldini oladi?", hint: "Natijani emas, qarorning asosi va versiyasini ham saqlash kerak.", choices: [{ label: "Hamma hujjatni bitta noma’lum papkaga tashlash", feedback: "Tartib va versiya bo‘lmasa, kerakli dalilni topish qiyin." }, { label: "Qaror reyestri, asoslar va hujjat versiyalarini yuritish", feedback: "Yangi jamoa nima, kim tomonidan va nima sababdan tasdiqlanganini tiklay oladi." }, { label: "Avvalgi xodimni doim telefon qilishga majbur etish", feedback: "Bilim faqat bitta odam xotirasida qolishi barqaror boshqaruv emas." }], answer: 1 },
      quiz: [{ question: "Boshqaruv qo‘llanmasi shartnomani almashtiradimi?", options: ["Yo‘q, uni bajarish jarayonini tushuntiradi", "Ha, barcha bandlarni bekor qiladi", "Faqat birinchi oyda"], answer: 0, explanation: "Qo‘llanma kundalik bajarishni tartibga soladi; asosiy huquq va majburiyatlar shartnomada qoladi." }, { question: "Bilim boshqaruvida nima muhim?", options: ["Faqat dastur brendi", "Faqat fayllar soni", "Mas’ul, versiya, kirish va saqlash tartibi"], answer: 2, explanation: "Hujjatlarni ishonchli topish va qo‘llash uchun boshqariladigan jarayon kerak." }],
    },
    {
      id: "ppp-commissioning", title: "Qurilishdan ishlaydigan xizmatga", minutes: 13, page: 48, reading: "48–60-betlar, 6.1.4 va 7.1–7.4-bo‘limlar",
      objectives: ["Qurilish tayyorligi va xizmat tayyorligini ajratish", "Sinov dalillari va qolgan kamchiliklarni qayd etish"],
      terms: [{ term: "Commissioning", meaning: "Aktivning kelishilgan tarzda ishlashini sinash va xizmatga tayyorligini tekshirish jarayoni." }, { term: "Independent certifier", meaning: "Shartnomada belgilangan doirada mustaqil tekshiruv va tasdiqlashni bajaruvchi mutaxassis." }],
      body: `# Bino bitdi, lekin xizmat boshlanishga tayyormi?

Terminalning devorlari va tomi tayyor bo‘lishi yo‘lovchilarga xavfsiz xizmat ko‘rsatish mumkinligini hali bildirmaydi. Uskunalar, xavfsizlik, aloqa, foydalanish jarayoni va xodimlar tayyorligi ham tekshiriladi.

## Sinovni oldindan rejalashtiring

Qabul mezonlari, sinovlar, hujjatlar va vakolatlar shartnomaga muvofiq belgilanadi. Sinov natijasini kim tekshirishi va qaysi kamchilik xizmat boshlanishiga to‘sqinlik qilishi oldindan tushunarli bo‘lishi kerak.

Shartli terminalda elektr uzilganda zaxira tizimi ishlaydimi? Odamlar chiqishi xavfsizmi? Platforma va axborot uskunalari kelishilgan ko‘rsatkichga yetadimi? Bu savollar oddiy “qurilish foizi” bilan yopilmaydi.

## Davlat va mustaqil tekshiruvchi

Davlat nazorati hamkorning loyihalash va qurilish mas’uliyatini avtomatik o‘ziga olmaydi. Mustaqil tasdiqlovchi shartnomadagi vakolat doirasida dalil beradi. Uning vazifasi, haq to‘lash manbasi va qaroriga e’tiroz tartibi aniq bo‘lishi kerak.

Kamchiliklar ro‘yxatida tavsif, xavf, mas’ul, tuzatish muddati va qayta tekshiruv bo‘ladi. Mayda nuqson bilan asosiy xavfsizlik talabining buzilishini bir xil darajada ko‘rish noto‘g‘ri.

## Operatorga o‘tish

Foydalanish jamoasi chizmalar, uskunalar qo‘llanmasi, texnik xizmat rejasi va zarur tayyorgarlikni oladi. Xizmat boshlanish sanasi to‘lov va risklar taqsimotiga ta’sir qilishi mumkin; u dalil bilan tasdiqlanadi. Aniq huquqiy oqibatlar har loyihaning shartnomasidan olinadi.

Qurilish tugaganligi, sinovdan o‘tganligi va xizmat boshlanganligini alohida kuzatish jamoaga noto‘g‘ri erta tasdiq berishdan saqlanishga yordam beradi.`,
      flow: [{ title: "Qurilish", description: "Aktiv yaratiladi" }, { title: "Sinov", description: "Talablar va dalillar" }, { title: "Tayyorlik", description: "Operator va hujjatlar" }, { title: "Xizmat", description: "Kelishilgan ish boshlanadi" }],
      exercise: { title: "Zaxira tizimi ishlamadi", situation: "Terminal qurilishi tugadi. Lekin xizmat boshlanishi uchun zarur deb belgilangan xavfsizlik sinovi muvaffaqiyatsiz bo‘ldi.", question: "Qaysi qadam mos?", hint: "Qabul mezoni bajarilganmi?", choices: [{ label: "Faqat tashqi ko‘rinishiga qarab qabul qilish", feedback: "Ko‘rinish xavfsizlik sinovi o‘rnini bosa olmaydi." }, { label: "Sinov natijasini yashirish", feedback: "Bu xizmat tayyorligi haqidagi dalilni buzadi." }, { label: "Kamchilikni tuzatish va qayta sinash", feedback: "Belgilangan zarur mezon bajarilmaguncha tayyorlikni tasdiqlashga asos yo‘q." }], answer: 2 },
      quiz: [{ question: "Commissioning nimani tekshiradi?", options: ["Faqat devor rangini", "Aktivning kelishilgan ishlashi va xizmatga tayyorligini", "Faqat kompaniya foydasini"], answer: 1, explanation: "Qurilish tugashi va foydalanishga yaroqlilik turli dalillar bilan tasdiqlanadi." }, { question: "Operatorga nimalar kerak?", options: ["Hujjatlar, xizmat rejasi va tayyorgarlik", "Faqat kalit", "Faqat tender e’loni"], answer: 0, explanation: "Xizmatni uzluksiz boshlash uchun texnik va tashkiliy topshirish ham bajariladi." }],
    },
  ],
  "ppp-operations": [
    {
      id: "ppp-performance", title: "Monitoring, takroriy nosozlik va o‘zgarish", minutes: 14, page: 15, reading: "15–28 va 31–34-betlar, 3.2–7.6-bo‘limlar",
      objectives: ["Xizmat hisobotini dalil bilan tekshirish", "Nosozlikni tuzatish va shartnoma o‘zgarishini ajratish"],
      terms: [{ term: "Performance monitoring", meaning: "Kelishilgan xizmat natijalarini muntazam kuzatish va tekshirish." }, { term: "Variation", meaning: "Shartnomada ko‘zda tutilgan tartibda xizmat yoki ish doirasini o‘zgartirish." }],
      body: `# Xizmat boshlanganidan keyin o‘quv sikli tugamaydi

Terminal ishlayotgani uning har kuni kelishilgan sifatda xizmat berayotganini anglatmaydi. Monitoring mavjudlik, sifat, javob berish vaqti va boshqa kelishilgan ko‘rsatkichlarni davrlar bo‘yicha kuzatadi.

## Hisobotdan dalilga

Operator hisobotini tekshiruvchi uchun ma’lumot manbasi, o‘lchash davri va mezon kerak. Bir soatlik tekshiruvni butun oy natijasi deb ko‘rsatish yoki qulay vaqtni tanlab o‘lchash xulosani buzadi. Dalilni tekshirish huquqi va tartibi shartnomada aniqlanadi.

Nosozlik qayd etilgach, uning sababi, ta’siri va bartaraf etish vaqti yoziladi. Moliyaviy chegirma tegishli mexanizmga muvofiq hisoblanadi. Asosiy vazifa xizmatni qayta tiklash va takrorlanish sababini kamaytirishdir.

## Takroriy xatoni ko‘ring

Har safar kichik chegirma to‘lash hamkor uchun nosozlikni tuzatishdan arzonroq bo‘lsa, rag‘bat noto‘g‘ri ishlashi mumkin. Qo‘llanmada takroriy buzilishlar uchun kuchayuvchi oqibatlar muhokama qilinadi. Bunday mexanizm oldindan belgilangan bo‘lishi kerak; nazoratchi uni o‘zi xohlagancha o‘zgartirmaydi.

## Tuzatish yoki yangi talab?

Kelishilgan uskunani ishlaydigan qilish — mavjud majburiyatni bajarish. Davlatning terminalga qo‘shimcha yangi platforma qo‘shish talabi esa doira o‘zgarishi bo‘lishi mumkin. Yangi talabning narx, muddat, risk va moliyalashtirishga ta’siri belgilangan tartibda ko‘riladi.

Har muammoni shartnomani qayta yozishga aylantirish ham, hech qanday moslashuvga yo‘l bermaslik ham zarar keltirishi mumkin. Yozma jarayon jamoaga xizmatni saqlab, qarorning oqibatlarini tushunishga yordam beradi.`,
      exercise: { title: "Tuzatishmi yoki yangi ishmi?", situation: "Davlat terminalning kelishilgan doirasiga kirmagan ikkita yangi platforma qo‘shishni so‘radi.", question: "Avval nima qilish kerak?", hint: "Yangi ishning mavjud majburiyatdan farqini va ta’sirini ko‘ring.", choices: [{ label: "O‘zgarish tartibida narx, muddat va riskni baholash", feedback: "Qo‘shimcha doira uchun shartnomadagi o‘zgarish jarayoni va zarur tasdiqlar qo‘llanadi." }, { label: "Hech qanday tahlilsiz talab qilish", feedback: "Qo‘shimcha ishning resurs va moliyalashtirishga ta’siri bor." }, { label: "Uni avtomatik xizmat nosozligi deb jarimalash", feedback: "Avvalgi doiraga kirmagan ish bajarilmagani odatdagi nosozlik bilan bir xil emas." }], answer: 0 },
      quiz: [{ question: "Takroriy nosozlikda nima o‘rganiladi?", options: ["Faqat birinchi xabar sanasi", "Sabab, xizmatga ta’sir va tuzatish rag‘bati", "Faqat operator nomi"], answer: 1, explanation: "Takrorlanish joriy choralar yetarli emasligini ko‘rsatishi mumkin." }, { question: "Monitoring natijasi nimaga tayanadi?", options: ["Faqat og‘zaki va’daga", "Tasodifiy qulay bir soatga", "Kelishilgan mezon, davr va tekshiriladigan dalilga"], answer: 2, explanation: "Davr va usul aniqlanmasa, ko‘rsatkich xizmatning haqiqiy holatini aks ettirmasligi mumkin." }],
    },
    {
      id: "ppp-handback-plan", title: "Hand-back: aktiv va xizmatni topshirish", minutes: 13, page: 41, reading: "41–48-betlar, 9–11-bo‘limlar",
      objectives: ["Muddat tugashi va erta bekor qilishni ajratish", "Aktiv holati va xizmat uzluksizligi uchun reja tuzish"],
      terms: [{ term: "Hand-back", meaning: "Aktivni kelishilgan holatda davlatga qaytarish jarayoni." }, { term: "Residual life", meaning: "Aktivning topshirish paytida qolgan foydali xizmat muddati." }],
      body: `# Oxirgi kun uchun ish oldindan boshlanadi

Terminal shartnomasi tugaganda davlatga faqat bino emas, keyingi xizmatni davom ettirish imkoniyati ham kerak. Uskunalar bir vaqtda yaroqsiz bo‘lib qolsa, shartnoma muddatining tugashi katta yangi xarajatga aylanadi.

## Aktivning qanday holati kelishilgan?

Hand-back talablari aktiv holati, qolgan xizmat muddati, hujjatlar va tekshiruvlarni belgilaydi. Aktiv mutlaqo yangi bo‘lishi shart degan universal qoida yo‘q; kelishilgan talab va xizmatni davom ettirishga yaroqlilik muhim.

Tekshiruvda kamchiliklar ro‘yxati tuziladi, ta’mirlash dasturi va xarajati aniqlanadi, bajarilgan ish qayta ko‘riladi. Buni oxirgi haftaga qoldirish tuzatish uchun vaqt bermasligi mumkin. Shartnomada nazarda tutilgan rezerv yoki ta’minot majburiyat bajarilishini qo‘llab-quvvatlashi mumkin.

## Xizmatning ertangi kuni

Keyingi operator kim? Texnik ma’lumot, ehtiyot qismlar, xodim tayyorgarligi va foydalanuvchilar bilan aloqa qanday topshiriladi? Davlat o‘zi boshqarish yoki yangi xizmat xarid qilish variantlarini oldindan ko‘radi. Shartnomani uzaytirish mumkin bo‘lsa ham, bu avtomatik eng yaxshi qaror emas.

## Tugash holatlarini aralashtirmang

Rejali muddat tugashi, davlat yoki hamkor majburiyatni buzishi va favqulodda sabab tufayli erta tugatish turli holatlardir. Ularning kompensatsiyasi va jarayoni bir xil bo‘lmaydi. Aniq oqibatlar shartnoma va tegishli huquqiy tartibdan olinadi.

Yakuniy reja aktiv holati, tuzatish, hujjatlar, xizmatni o‘tkazish, mas’ullar va muddatlarni bog‘laydi. Loyiha tugagach, xizmat sifati va qiymat bo‘yicha olingan saboqlar keyingi loyihaga qaytariladi. Shunda hayot davri xaritasi yangi loyiha uchun bilimga aylanadi.`,
      flow: [{ title: "Tekshiruv", description: "Holat va qolgan xizmat muddati" }, { title: "Tuzatish", description: "Reja, xarajat va qayta nazorat" }, { title: "Topshirish", description: "Aktiv, hujjat va jamoa" }, { title: "Davomiylik", description: "Keyingi operatorning xizmati" }],
      exercise: { title: "Kalit bor, hujjat yo‘q", situation: "Aktiv jismonan topshirildi. Lekin texnik hujjatlar va keyingi operatorning xizmat rejasi tayyor emas.", question: "Qaysi xulosa mos?", hint: "Jismoniy topshirish xizmat uzluksizligining faqat bir qismi.", choices: [{ label: "Kalit berilgani barcha ish tugaganini bildiradi", feedback: "Hujjat va operator tayyorligisiz xizmat to‘xtashi mumkin." }, { label: "Xizmatni o‘tkazish rejasi va hujjatlarni yakunlash kerak", feedback: "Hand-back aktiv bilan birga keyingi xizmatni uzluksiz davom ettirishga tayyorgarlikni talab qiladi." }, { label: "Barcha uskunani avtomatik yo‘q qilish kerak", feedback: "Aktiv holati kelishilgan talab bilan tekshiriladi; avtomatik almashtirish yoki yo‘q qilish xulosasi yo‘q." }], answer: 1 },
      quiz: [{ question: "Hand-back tekshiruvi qachon boshlanadi?", options: ["Tuzatishga vaqt yetadigan darajada oldindan", "Faqat oxirgi soatda", "Xizmat uzilganidan keyin"], answer: 0, explanation: "Tekshiruv, xarajat va tuzatish dasturini bajarish uchun yetarli muddat kerak." }, { question: "Rejali tugash va erta bekor qilish bir xilmi?", options: ["Ha, har doim", "Faqat nomi farq qiladi", "Yo‘q, asos va oqibatlari farqlanadi"], answer: 2, explanation: "Turli tugash holatlariga tegishli jarayon va kompensatsiya shartlari alohida belgilanadi." }],
    },
  ],
};
