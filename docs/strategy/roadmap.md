# Finora pilotini qurish va bozorga olib chiqish rejasi

## Jamoa va muddat taxmini

Reja 12 haftalik kichik pilotga mo‘ljallangan: bir asosiy full-stack dasturchi, mahsulot va sotuvni yurituvchi asoschi, haftasiga taxminan bir kun moliya eksperti, bir kun dizayn/QA yordami. Bu mavjud xodimlar yoki tasdiqlangan budjet tavsifi emas. Dasturchi haftasiga 20 soatdan kam ajratsa yoki ekspert bo‘lmasa, doirani qisqartirish yoxud muddatni 16–20 haftaga uzaytirish kerak.

AI kod, test variantlari, kontent qoralamasi, tahlil va tarjima tezligini oshiradi. U moliyaviy formulalarni mustaqil tekshirish, haqiqiy suhbat yoki ekspert tasdig‘ini almashtirmaydi. Har hafta tugallangan foydalanuvchi oqimi ko‘rsatiladi; bajarilgan kod qatorlari yoki o‘rnatilgan skill soni muvaffaqiyat mezoni bo‘lmaydi.

## Bosqichlar va qaror darvozalari

| Hafta | Natija | Asosiy ish | Davom etish mezoni |
|---|---|---|---|
| 1 | Ishonchli hisob va xavfsiz kontent bazasi | CALC-01/02, TIME-01; PDF huquqi; testlarni CIga qo‘shish; privacy xaritasi | Formula regressiyalari o‘tgan; tarqatish huquqi noma’lum PDF ochiq chiqishga kirmaydi |
| 2 | Ikki segment uchun ehtiyoj dalili | 12 shaxsiy moliya, 6 PPP xaridori, 2 soha eksperti suhbati; bir xil muammo protokoli | Taxminlar dalil bilan yangilangan; suhbat bo‘lmagan bo‘lsa “talab tasdiqlandi” deyilmaydi |
| 3–4 | Bitta to‘liq ssenariy | Demo, input, deterministik oqibat, hint, yangi variant; 8 kuzatuvli usability testi | Kamida 6/8 ishtirokchi asosiy vazifani moderator yordamisiz tugatadi; kritik chalkashlik yo‘q |
| 5–6 | Ishlaydigan o‘quv sikli | Server attempt, progress/mastery ajratish, resume, review navbati, analytics | Idempotency, auth/RLS staging testlari o‘tadi; yordamsiz urinish alohida o‘lchanadi |
| 7–8 | 10 ssenariy va tekshirilgan AI | Ekspert kontent review; 120 eval holati; source retrieval, limit va fallback | Manba/raqam bo‘yicha kritik xato qolmagan; AI sifati yetmasa tayyor hint bilan pilot |
| 9–10 | Cheklangan pilot | 30–60 foydalanuvchi, D7 transfer; accessibility, telefon va yuk tekshiruvi | Ishlash va saqlash kritik xatolari yo‘q; natija va tashlab ketish hisoboti bor |
| 11–12 | Daromad tajribasi va qaror | Shaffof narx testi, kanal natijasi, unit economics; tuzatish va rollback | Pastdagi continue/pivot mezoni asosida keyingi sikl tanlangan |

Bu jadval to‘liq CP3P platformasi va shaxsiy moliya mahsulotini bir vaqtda qurishni nazarda tutmaydi. Bir oqim isbotlangach umumiy ssenariy dvigateli professional keysga tatbiq etilishi mumkin.

## Suhbat protokoli

Shaxsiy moliya suhbatida “shunday ilovani ishlatarmidingiz?” savoliga tayanilmaydi. Oxirgi real vaziyat so‘raladi: qachon qarz yoki budjet masalasida qiynaldi, qanday yechim izladi, qaysi vositani tashlab ketdi, qancha vaqt yoki pul sarfladi. Maxfiy bank ma’lumotlari kerak emas; ixtiyoriy taxminiy misollar yetarli.

PPP xaridoridan xodimlar qaysi vazifada xato qilishi, treningni kim tasdiqlashi, qanday xarid jarayoni va budjet sikli borligi so‘raladi. Ekspert bilan amaldagi syllabus, tarjima, keys yozish va baholash mehnati baholanadi. “Qiziq” degan javob sotuv dalili emas: aniq pilot sanasi, ishtirokchi va to‘lovga oid majburiyat kuchliroq signal.

Natija jadvali: respondent turi, oxirgi muammo, mavjud muqobil, oqibat, xarid vakolati, keyingi aniq qadam, qarshi dalil. Shaxsiy identifikatorlar minimal saqlanadi. Bu hujjat suhbatlar bajarilganini bildirmaydi; tashqi odamlarga xabar yuborilmagan.

## O‘quv natijasini baholash

Asosiy ko‘rsatkich — D7da yangi masalani AI yordamisiz muvaffaqiyatli yechganlar ulushi. Denominator oldindan belgilanadi: pilotga qabul qilingan barcha ishtirokchilar bo‘yicha konservativ natija va testni tugatganlar bo‘yicha natija alohida beriladi. Yo‘qolgan kuzatuvlar yashirilmaydi.

Boshlang‘ich test va yakuniy variant qiyinligi ekspert tomonidan tenglashtiriladi. Bir xil savolni yodlab qolishni o‘lchamaslik uchun son va vaziyat o‘zgaradi. Rubrika: shartni anglash, hisob yoki taqqoslash, qaror sababini tushuntirish. Faqat chiroyli yozilgan AI matni uchun ball berilmaydi.

Imkon bo‘lsa 60 ishtirokchi tasodifiy 30/30 guruhga ajratiladi: qisqa matn+test va interaktiv mashq+hint, vaqt va mavzu imkon qadar teng. Kichik pilot yo‘nalish ko‘rsatadi; kuch tahlilisiz statistik yoki bozorga umumlashtirilgan g‘alaba da’vo qilinmaydi. Ishonch oralig‘i, attrition va boshlang‘ich farq hisobotga kiradi.

| Ko‘rsatkich | Dastlabki qaror chegarasi — taxmin | Talqin |
|---|---|---|
| Aktivatsiya | Demo boshlaganlarning ≥60% birinchi mustaqil variantga yetishi | Past bo‘lsa onboarding va ssenariy tushunarliligini tuzatish |
| D7 mustaqil natija | Baselinega nisbatan ijobiy o‘zgarish; taqqoslash guruhiga nisbatan yo‘nalish ham ko‘riladi | Oldindan isbotlangan effekt yo‘q; faqat completion yetarli emas |
| D7 qaytish | Taklif olgan pilot ishtirokchilarining ≥30% | Dastlabki ichki maqsad, sanoat benchmarki emas |
| Pullik signal | 30 faol pilotdan kamida 5 ta haqiqiy xarid yoki hujjatlashtirilgan pilot buyurtma | Yetarli bozor hajmi yoki product-market fit isboti emas |
| Sifat | Belgilangan kritik hisob/manba/huquq/izolyatsiya xatosi ochiq qolmasligi | Xato bo‘lsa tegishli funksiyani cheklash va tuzatish |
| Xarajat | Bir faol o‘quvchi xarajati tanlangan narx va marja chegarasiga sig‘ishi | Tasdiqlangan token sarfi va haqiqiy hisob-faktura asosida |

Analitika hodisalari: `demo_started`, `attempt_submitted`, `hint_requested`, `transfer_completed`, `review_completed`, `source_opened`, `save_failed`, `tutor_failed`, `paywall_viewed`, `purchase_completed`. Xossa: anonim/ichki user ID, scenarioVersion, skill, hintLevel, vaqt, natija. Erkin chat matni, karta raqami va foydalanuvchi kiritgan moliyaviy tafsilotlar oddiy marketing analitikasiga yuborilmaydi.

## Pozitsiyalash va marketing

Birinchi xabar: “Oylik, zaxira va kredit qarorlarini o‘zbekcha mashqlarda sinab ko‘ring.” Demo reklamaning o‘zi bo‘ladi: uchta uzun feature blokidan oldin bir amaliy tanlov va natija ko‘rsatiladi. “Eng zo‘r AI”, “100% natija” yoki tekshirilmagan o‘quv samaradorligi raqami ishlatilmaydi.

Uch kanal kichik miqyosda solishtiriladi. Birinchisi — foydali ssenariy asosidagi Telegram/ijtimoiy kontent; ikkinchisi — o‘quv markazi yoki universitetdagi katta yoshli guruh; uchinchisi — ish beruvchi xodimlarining moliyaviy savodxonlik piloti. Bank hamkorligi keyingi bosqichda; hamkor mahsuloti tavsiya qilinsa manfaat ochiq ko‘rsatiladi.

Har kanal uchun bir xil demo, alohida referral kodi va oldindan belgilangan sarf chegarasi bo‘ladi. Click narxidan tashqari mustaqil mashqni tugatgan foydalanuvchi narxi o‘lchanadi. Kanalga ko‘p tashrif, lekin past o‘quv natija kelsa reklama ko‘paytirilmaydi.

## Narx va xarajat modeli

Bepul demo va cheklangan practice orqali qiymat ko‘rsatiladi. Pullik taklif kengaytirilgan ssenariylar, progress va qayta mashqni beradi. Xavfsizlik, maxfiylik yoki manba shaffofligi pullik imtiyoz emas. Tashkilot rejasi faqat xaridor ehtiyoji isbotlangach guruh hisobotini oladi; menejerga shaxsiy chat avtomatik ochilmaydi.

Narx bo‘yicha boshlang‘ich eksperiment: 29 000, 49 000 va 79 000 so‘m/oy variantlarini suhbat va teng taklifli kichik testda tekshirish. Bular bozor narxi yoki tavsiya etilgan yakuniy tarif emas. Odamning aytgan to‘lovga tayyorligi haqiqiy xarid bilan farq qiladi. To‘lov yo‘li tayyor bo‘lmaganda soxta checkout yoki soxta xarid ko‘rsatkichi ishlatilmaydi.

Hisoblash shabloni:

```text
AI_month = active_learners × sessions_per_learner × turns_per_session
           × ((input_tokens × input_price_per_million
               + output_tokens × output_price_per_million) / 1_000_000)
VariableCost = AI_month + variable_storage + payment_fees + variable_support
Contribution = net_collected_revenue - VariableCost
GrossMargin = Contribution / net_collected_revenue
BreakEvenPaid = fixed_monthly_cost / (net_price_per_payer - variable_cost_per_payer)
```

Nominal misol: 100 faol o‘quvchi × 8 sessiya × 4 AI navbati = 3 200 navbat/oy. Har navbat 1 500 input va 250 output token bo‘lsa 4.8 million input, 0.8 million output token chiqadi. Bu foydalanish prognozi emas, hisoblash stsenariysi. Provider narxi, caching va retry amalda o‘lchanib qo‘yiladi. Token tariflari bu hujjatda taxminan dollar narxiga aylantirilmagan.

Asoschi haftalik mehnat, ekspert soati, QA/dizayn, infra, AI, huquqiy ko‘rik, rekrut va reklama xarajatini alohida kiritadi. Konservativ reja: foydalanuvchi soni kamroq, AI sarfi ikki baravar, sotuv kechroq. Budjet noma’lum bo‘lgani uchun “12 haftada falon pulga tayyor” degan majburiyat yo‘q.

## Davom etish, yo‘nalishni o‘zgartirish yoki to‘xtatish

Shaxsiy moliya pilotida tushunarlilik va yordamsiz natija yaxshilansa, qaytish hamda haqiqiy pullik signal bo‘lsa keyingi 10 ssenariyga kengayish mumkin. Odamlar yoqtirib, lekin o‘rganmasa metod qayta ishlanadi. O‘rganib, lekin to‘lamasa B2B tarqatish tekshiriladi. Har ikkisi bo‘lmasa yangi interfeys bezagi bilan muammo yashirilmaydi.

PPPni oldinga chiqarish sharti: kamida 2 tashkilotdan aniq pullik pilot majburiyati, jami kamida 12 real ishtirokchi, kontentni tekshiradigan mutaxassis va 2026 nashri/huquqi uchun bajariladigan reja. Bu shartlar sotuv hujjatlari bilan tasdiqlanadi. Asoschining tayyor professional tarmog‘i aniqlansa jadval qayta ko‘rib chiqiladi.

## Dastlabki backlog

| Tartib | Natija | Bog‘liqlik |
|---|---|---|
| 1 | Hisob moduli + CALC-01/02 regressiya testlari | Stavka/badal konvensiyasi |
| 2 | Timezone sanog‘i + TIME-01 | User timezone siyosati |
| 3 | PDF rights/edition katalogi | Manba huquqi va amaldagi nashr |
| 4 | B01 vertikal prototip | Ekspert yozgan vaziyat va rubrika |
| 5 | 8 usability sessiyasi | Ishlaydigan prototip va ishtirokchilar |
| 6 | Server attempts/mastery | Qabul qilingan oqim; DB skilllari va migratsiya review |
| 7 | Source-grounded hint va fallback | Nashr qilingan kontent va eval korpusi |
| 8 | Review navbati va analitika | Barqaror urinish modeli |
| 9 | Staging xavfsizlik/accessibility/rollback | Test muhiti va hisoblar |
| 10 | Pilot va narx tajribasi | Sifat darvozasi yopilgan |

Har backlog bandi kichik PRga ajratiladi: muammo, o‘zgarish, dalil va qolgan cheklov. Faqat build o‘tdi degan sabab bilan moliyaviy yoki pedagogik band yopilmaydi.
