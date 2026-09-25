# Finora «Super Pro» — reja va texnik topshiriq (TZ)

_Sana: 2026-09-25. Asos: joriy kod (`main`, oxirgi commit `5e10788`), `docs/strategy/*`, `src/content/*`, `src/lib/*`, `supabase/migrations/*`. Hujjat Finora’ni CP3P’ga tayyorlovchi eng yaxshi mahsulotga aylantirish rejasi. Mahsulot tili — faqat ingliz; bu hujjat ichki, o‘zbekcha._

**Asosiy tamoyil:** interfeys sodda qoladi. Bitta o‘yinsimon yo‘l: **dars → test → keyingi dars ochiladi**. Yangi bo‘lim/sahifa qo‘shilmaydi; har yangi imkoniyat mavjud ekranlarga (dars sahifasi, kurs yo‘li, dashboard, imtihon sahifasi) joylanadi. 3D va og‘ir animatsiya yo‘q.

---

## 0. 2026-09-25 da bajarildi

- [x] Uchala kurs ochiq (Preparation/Execution endi Foundation’ni kutmaydi); kurs ichida dars → test → keyingi dars qulfi saqlandi.
- [x] Video va audio pleyer: sudraladigan umumiy vaqt chizig‘i, ±10 s, slayd/bo‘limga o‘tish, 1.5× tezlik, klaviatura, qulf ekrani boshqaruvi, to‘xtagan joydan davom (`src/features/lesson/use-playlist.ts`).
- [x] Test o‘yinlashtirildi: «🔥 N in a row» combo, +10 XP, 46/50 chizig‘i belgilangan progress, «You can still miss N», ovozli signal (o‘chirsa bo‘ladi), yulduzlar ketma-ket chiqadigan natija ekrani.
- [x] Kurs sahifasi o‘yin xaritasiga aylantirildi (to‘lqinsimon yo‘l, yulduzlar, joriy dars porlaydi, oxirida kubok = imtihon simulyatsiyasi).

## 1. Qisqa xulosa

### 1.1. Hozirgi holat (kod bo‘yicha, halol)

| Soha | Bor narsa | Kamchilik / ochiq masala |
|---|---|---|
| Kurslar | 3 kurs: Foundation 12, Preparation 18, Execution 14 = **44 dars** (`src/content/cp3p/*/*.json`); uchala kurs ochiq (`requires: null`) | Kurs ichida dars qulfi bor (to‘g‘ri). `courses.ts` izohida hali «≥80%» deyilgan, amalda 92% |
| Dars tarkibi | Maqsadlar, bo‘limlar, worked example, exam traps, key terms, summary, slaydlar (7–8 ta), **50 savollik test** | Matn va slaydlar yaxshi; lekin darsdagi «qayerda to‘xtadim» saqlanmaydi |
| Test | Server boshqaradi (`src/app/actions/progress.ts`): birinchi javob yakuniy, ball bazadan hisoblanadi, **46/50** o‘tish | Test o‘rtasida tark etilsa, urinish ochiq qoladi (tozalash yo‘q) |
| Media | Slayd-video + audio: har slayd/bo‘lak alohida MP3 (Supabase Storage, `audio.json`: 44 dars `published: true`), tezlik 0.85–1.3×, oldingi/keyingi slayd, to‘liq ekran | **2026-09-25 da qilindi:** butun dars bo‘yicha seek-bar (sudrash), ±10 s, slaydga bir bosishda o‘tish, tezlik 0.85–1.5×, klaviatura (Space/K, ←/→, J/L), Media Session (qulf ekrani), o‘rin brauzerda saqlanadi (Play bosilganda davom etadi). **Qolgan:** o‘rinni serverda saqlash (boshqa qurilma), `audio.json` durations, offline |
| O‘yin | XP: noyob to‘g‘ri savol 10, dars 100, o‘tilgan mock 300; daraja har 1000 XP; yulduz 46→1★, 48→2★, 50→3★ (`src/lib/gamification.ts`) | Kunlik maqsad, combo, streak freeze yo‘q. **Streak UTC bo‘yicha** hisoblanadi (audit TIME-01, Toshkentda xato). Achievement yorliqlari o‘zbekcha (`progress.ts: achievements`) — ingliz-only qoidaga zid |
| Imtihon | Foundation: 285 savollik bank, rasmiy format mock (50 savol / 40 daq, +10), server vaqti, readiness (har bo‘limda ≥8 javob, 70%); Preparation/Execution: **3 tadan** ssenariy paper (4 savol × 20 satr) | Ssenariy paperlari kam (raqobat ustunligi uchun 8–10 kerak). Mock holati `localStorage`da |
| Takrorlash | «Review my mistakes» (10 ta, oxirgi javobi xato savollar); glossary flashcards **515 karta**, Leitner (`src/lib/srs.ts`) | Flashcard holati **faqat `localStorage`da** — qurilma almashsa yo‘qoladi |
| AI ustoz | `/api/tutor`: auth, 30/soat va 120/kun limit, tarix 12 xabar, 16 000 belgi, `claude-opus-5`, 1500 output token | Kontekst **brauzerdan** keladi (600 belgi, audit AI-01); Guide bo‘yicha qidiruv (grounding) yo‘q; eng qimmat model har savolga; xarajat hisobi yo‘q |
| Sertifikat | Finora sertifikati: barcha darslar + o‘tilgan mock | Tekshirish havolasi (verify URL) yo‘q |
| Xavfsizlik | `00003_lock_results.sql`: foydalanuvchi natija jadvallariga o‘zi yoza olmaydi, faqat service role | **00003 jonli bazada qo‘llangani tasdiqlanmagan** (egasi qo‘llaydi) |
| Analitika | Yo‘q | KPI o‘lchab bo‘lmaydi |
| To‘lov / B2B | Yo‘q | Tashkilot, o‘rin (seat), menejer paneli yo‘q |
| Test / CI | `npm test` (4 fayl: calculators, exam, learning-path, scenario), `check:content`, `check:exam`, tsc, eslint → push = deploy | E2E yo‘q, RLS testlari yo‘q, preview/staging yo‘q |

Xulosa: **kontent va imtihon dvigateli kuchli** (44 dars × 50 savol = 2 200 dars savoli + 285 Foundation savoli + 6 ssenariy paper + 515 karta). Zaif joylar — media pleyerning qulayligi, o‘yin tizimining «kunlik odat» qismi, AI’ning grounding va xarajati, analitika, B2B va to‘lov.

### 1.2. Maqsad

**2026-yil oxirigacha:** CP3P’ning uchala bosqichiga ingliz tilida, o‘z tezligida tayyorlaydigan yagona self-serve platforma; Qozog‘iston va O‘zbekistondagi PPP konsalting firmalari uchun jamoaviy litsenziya bilan.

Muhim sanalar:
- **2026-11-30** — ingliz tilidagi v1 imtihonlarning oxirgi kuni; **2026-12-01** dan faqat v2 (2026 Guide). Finora darslari allaqachon «PPP Guide 2026» ga tayangan — bu ustunlik, marketingda aytiladi.
- Raqib PPP Expertise (rus tilida, jonli): Foundation 20–23 okt, Preparation 16–20 noy, Execution 7–11 dek 2026. Finora pozitsiyasi: «kohortaga qo‘shimcha va o‘rniga — ingliz tilidagi imtihon formatida, istalgan vaqtda, 10× arzon».

### 1.3. Muvaffaqiyat o‘lchovlari (KPI)

| KPI | Ta’rif (aniq formula) | Boshlang‘ich | Maqsad 2026-12-31 | Maqsad 2027-03-31 |
|---|---|---|---|---|
| Imtihondan o‘tish ulushi (pass-rate) | Haqiqiy APMG natijasini xabar qilganlar ichida o‘tganlar (`exam_outcome` so‘rovnomasi) | O‘lchanmagan | ≥ 85% (n ≥ 20) | ≥ 90% (n ≥ 60) |
| «Ready» → o‘tish | Readiness «Ready» bo‘lganlardan o‘tganlar | — | ≥ 90% | ≥ 95% |
| D7 retention | Ro‘yxatdan o‘tgan kuni + 7-kun (±1) faol bo‘lganlar ulushi | O‘lchanmagan | ≥ 35% | ≥ 40% |
| D30 retention | 30-kun (±3) faol | — | ≥ 20% | ≥ 25% |
| Dars yakunlash | Boshlangan darslardan testi o‘tilganlar | — | ≥ 70% | ≥ 75% |
| Birinchi dars aktivatsiyasi | Ro‘yxatdan o‘tgan kuni 1-dars testini o‘tganlar | — | ≥ 40% | ≥ 50% |
| Kurs yakunlash | Foundation’ni boshlagan → 12/12 dars | — | ≥ 30% | ≥ 40% |
| NPS | «Finora’ni hamkasbingizga tavsiya qilasizmi?» 0–10, 10-dars va mockdan keyin | — | ≥ 40 | ≥ 50 |
| B2B | To‘lagan tashkilotlar / o‘rinlar | 0 | 2 tashkilot / 20 o‘rin | 5 / 60 |
| AI xarajati | AI $ / faol o‘quvchi / oy | O‘lchanmagan | ≤ $1.00 | ≤ $0.70 |
| Tezlik | Dars sahifasi p75 LCP (Vercel Speed Insights) | O‘lchanmagan | ≤ 2.5 s | ≤ 2.0 s |

«Faol» = kun davomida kamida bitta hodisa: `lesson_media_progress`, `test_answer`, `flashcard_review` yoki `mock_started`.

---

## 2. Foydalanuvchi va o‘quv yo‘li

### 2.1. Personalar

| Persona | Kim | Maqsad | Og‘riq | Finora nima beradi |
|---|---|---|---|---|
| **A. Aigerim (Olmaota)** — asosiy B2B | PPP konsalting firmasi mutaxassisi, 28–40 yosh, ingliz tili B1–B2 | Firma akkreditatsiyasi uchun CP3P (2026-01-01 dan talab) | Kohorta rus tilida, qimmat ($1 200–1 940), sanaga bog‘liq; imtihon esa ingliz tilida | Ingliz tilidagi mashq, sekinlatilgan audio, glossary, readiness |
| **B. Menejer (firma rahbari/HR)** | Jamoani sertifikatlaydi | Kim qachon imtihonga tayyor — bilish | Nazorat yo‘q, pul behuda ketadi | Menejer paneli: progress, readiness, «ready to book» ro‘yxati |
| **C. Jasur (Toshkent)** — B2C | PPP agentligi / vazirlik / bank xodimi | Karyera, xalqaro loyihalar | Material kam, Preparation/Execution mashqi yo‘q | Ssenariy paperlari, mock, AI ustoz |
| **D. Xalqaro o‘quvchi** | Filippin, Nigeriya, Pokiston PPP bo‘limlari | Arzon tayyorlov | Kohorta narxi | Self-serve, 24/7 |

### 2.2. Yagona yo‘l

```
Kurs yo‘li (/courses/[slug])
  ● Dars 1 ✓★★★ → ● Dars 2 ✓★ → ◉ Dars 3 (joriy) → 🔒 Dars 4 … → 🏁 Final mock / paper → 🎓 Finora sertifikati
```

Qoidalar:
1. Uchala kurs ochiq; istalganidan boshlash mumkin (tavsiya: Foundation birinchi — kurs kartasida bir qator matn, qulf emas).
2. Kurs ichida: N-dars testini **46/50** bilan o‘tish (N+1)-darsni ochadi (`lessonUnlocked`, o‘zgarmaydi).
3. Kurs oxirida — final: Foundation’da rasmiy mock, Preparation/Execution’da ssenariy paper.
4. **Yangi sahifa yo‘q.** Takrorlash (review), flashcards, readiness mavjud joylarda qoladi; kunlik takrorlash «yo‘l» ichida bitta tugma sifatida chiqadi (2.4).

### 2.3. Dars ekrani (`/study/[course]/[chapter]`) — to‘liq tarkib

Tartib yuqoridan pastga (bitta ustun, `max-w-3xl`, hozirgidek):

| # | Blok | Hozir | Super Pro o‘zgarish |
|---|---|---|---|
| 1 | Sarlavha: «Lesson N of M», nom, daqiqa, Guide bo‘limi, ✓ Passed | Bor | + yulduzlar (★★☆) va «Continue from 3:42» yorlig‘i |
| 2 | **Video / Audio** tab | Bor | Yangi pleyer (4-bo‘lim): umumiy seek-bar, ±10 s, pozitsiya saqlanadi |
| 3 | «By the end of this lesson you can» | Bor | O‘zgarmaydi |
| 4 | Matn bo‘limlari | Bor | + o‘qish joyi (scroll) saqlanadi |
| 5 | Worked example | Bor | O‘zgarmaydi |
| 6 | Exam traps | Bor | O‘zgarmaydi |
| 7 | Key terms | Bor | «Add to my flashcards» — bitta tugma (server SRS’ga qo‘shadi) |
| 8 | Remember (summary) | Bor | O‘zgarmaydi |
| 9 | AI ustoz (yig‘iladigan) | Bor | Server grounding (6-bo‘lim); kontekst `lessonId` orqali |
| 10 | **Lesson test** (50 savol, 46 o‘tish) | Bor | + combo hisoblagich, kunlik maqsad chizig‘i, test o‘rtasida davom ettirish, natija ekranida XP taqsimoti |
| 11 | Natija | Bor (confetti) | «Next lesson →» asosiy tugma; xato savollar ro‘yxati; +XP; streak holati |

Qabul mezoni: dars sahifasida yangi yuqori darajadagi bo‘lim qo‘shilmaydi; faqat mavjud bloklar kengaytiriladi.

### 2.4. Kunlik takrorlash — yo‘l ichida

Kurs yo‘li va dashboard’dagi asosiy tugma («Continue») mantiqi:
1. Agar muddati kelgan takrorlash ≥ 10 ta bo‘lsa → «Daily review · 10 questions · ~5 min» (xato savollar + muddati kelgan flashcardlar aralash).
2. Aks holda → joriy dars.
3. Kurs tugagan bo‘lsa → final mock/paper.

Bu yangi sahifa emas: mavjud review oqimi (`startTest kind: "review"`) ishlatiladi.

---

## 3. Gamifikatsiya tizimi

Barcha hisob **serverda**, `xp_events` daftari orqali (8-bo‘lim). Brauzer XP yubormaydi.

### 3.1. XP qoidalari

| Hodisa | XP | Takrorlanish | Kalit (`source_key`, noyob) |
|---|---|---|---|
| Dars savoliga birinchi marta to‘g‘ri javob | 10 | Har savol umrida 1 marta | `q:<lessonId>#<i>` |
| Dars testini o‘tish (≥46) | 100 | Har dars 1 marta | `lesson:<lessonId>` |
| 2★ ga birinchi marta yetish (≥48) | +25 | 1 marta | `star2:<lessonId>` |
| 3★ ga birinchi marta yetish (50/50) | +50 | 1 marta | `star3:<lessonId>` |
| Combo bonusi (3.3) | 5–20 | Urinishda jami ≤ 50 | `combo:<attemptId>` |
| Kunlik takrorlash to‘plami (10 savol, ≥7 to‘g‘ri) | 30 | Kuniga 1 marta | `review:<YYYY-MM-DD>` |
| Flashcard sessiyasi (≥ 20 karta) | 20 | Kuniga 1 marta | `cards:<YYYY-MM-DD>` |
| Foundation mockni o‘tish | 300 | Imtihon bo‘yicha 1 marta | `mock:cp3p-foundation` |
| Mock topshirish (o‘tmasa ham, vaqtida) | 50 | Haftasiga 1 marta | `mocktry:<ISO-week>` |
| Ssenariy paperini o‘tish (≥40/80) | 300 | Har paper 1 marta | `paper:<paperId>` |
| Kunlik maqsad bajarildi | 10 | Kuniga 1 | `goal:<YYYY-MM-DD>` |

Taxminiy jami: 44 × (500 + 100 + 75) ≈ 29 700 + mock/paperlar ≈ 33 000 XP.

### 3.2. Daraja (level)

- Hozirgi formula saqlanadi: **daraja = floor(XP / 1000) + 1** (sodda, tushunarli).
- Har 5 darajaga nom (faqat yorliq): 1–4 *Observer*, 5–9 *Analyst*, 10–14 *Adviser*, 15–19 *Transaction Lead*, 20–29 *PPP Expert*, 30+ *PPP Master*.
- Daraja oshganda: bitta toast («Level 6 · Analyst»), animatsiyasiz yoki 300 ms CSS; confetti faqat kurs tugaganda.

### 3.3. Yulduz va combo

- Yulduz (mavjud `starsFor`): 46–47 → 1★, 48–49 → 2★, 50 → 3★. Eng yaxshi natija saqlanadi.
- **Combo** (test ichida ketma-ket to‘g‘ri javoblar): 5 ketma-ket → +5, 10 → +10, 15 → +15, 20+ → har 5 tasiga +20. Bir urinishda combo bonusi jami **≤ 50 XP**. Faqat **birinchi marta** to‘g‘ri topilgan savollar hisoblanadi (qayta topshirish combo «farm» qilmaydi).
- UI: test yuqorisida kichik «🔥 7 in a row» yozuvi; xatoda nolga tushadi, jazo yo‘q.

### 3.4. Kunlik maqsad (daily goal)

| Tanlov | XP/kun | Taxminan |
|---|---|---|
| Casual | 30 | ~10 daqiqa |
| Regular (standart) | 60 | ~20 daqiqa |
| Serious | 120 | ~40 daqiqa |
| Exam sprint | 200 | ~1 soat |

- Onboarding’da bir savol: «When is your exam?» (sana ixtiyoriy) + maqsad tanlash. Profilda o‘zgartiriladi.
- Exam date berilsa, tavsiya: qolgan darslar × 675 XP / qolgan kunlar → eng yaqin tanlov taklif qilinadi (majburiy emas).
- Dashboard va dars testi tepasida ingichka progress chizig‘i «42 / 60 XP today».

### 3.5. Streak va streak freeze

- **Kun** — foydalanuvchi vaqt zonasida (`users.timezone`, standart `Asia/Tashkent`, brauzerdan `Intl.DateTimeFormat().resolvedOptions().timeZone` bilan aniqlanadi). TIME-01 shu bilan yopiladi.
- Kun streakka qo‘shiladi, agar: **kunlik maqsad bajarilsa** YOKI dars testi o‘tilsa YOKI mock/paper topshirilsa.
- **Streak freeze:** har 7 kunlik uzluksiz streak uchun 1 ta freeze beriladi, **ko‘pi bilan 2 ta** saqlanadi. O‘tkazib yuborilgan kun avtomatik freeze bilan yopiladi (ketma-ket ko‘pi bilan 2 kun). Sotib olinmaydi.
- Streak uzilsa: «Your longest streak: 23 days» saqlanadi; ayblovchi matn yo‘q.
- Eslatma: B2C uchun ixtiyoriy email (kuniga ≤ 1, 19:00 foydalanuvchi vaqtida, faqat bugun faol bo‘lmasa, SMTP sozlangach). Push-bildirishnoma — keyingi bosqich (PWA).

### 3.6. Liga / reyting (ixtiyoriy, faqat B2B)

- B2C’da ommaviy liga **yo‘q** (sodda interfeys, ortiqcha bosim yo‘q).
- B2B: **Team board** — tashkilot ichida haftalik XP (dushanba 00:00 tashkilot vaqt zonasi), faqat ism + bosh harf, top-10. Menejer yoqadi/o‘chiradi (standart: o‘chiq). Har o‘quvchi «Hide me from the team board» bilan chiqib ketishi mumkin.
- Joy: dashboard’dagi bitta karta (yangi sahifa emas).

### 3.7. Yutuqlar (achievements) — ingliz tilida, aniq qoidalar

| ID | Nom | Qoida |
|---|---|---|
| first_lesson | First step | 1 ta dars testini o‘tish |
| perfect | Flawless | Istalgan darsda 50/50 |
| perfect_5 | Sharp mind | 5 ta darsda 3★ |
| streak_3 / 7 / 30 | On a roll / Week warrior / Habit formed | 3 / 7 / 30 kunlik streak |
| foundation_done | Foundation complete | 12/12 dars |
| preparation_done | Preparation complete | 18/18 dars |
| execution_done | Execution complete | 14/14 dars |
| mock_pass | Mock passed | Foundation mockni vaqtida o‘tish |
| paper_pass | Scenario solved | Istalgan ssenariy paperini o‘tish |
| glossary_100 | Word master | 100 ta glossary kartasi 4-qutiga yetgan |
| ready | Ready to book | Readiness «Ready» holati (5.4) |
| comeback | Comeback | 7+ kun tanaffusdan keyin qaytib, dars o‘tish |

Joy: `/progress` sahifasidagi mavjud blok. Hozirgi o‘zbekcha yorliqlar («Birinchi dars» va h.k.) inglizchaga almashtiriladi.

### 3.8. «Farm»ga qarshi qoidalar

1. XP faqat `xp_events` orqali; `unique(user_id, source_key)` — bir manbadan ikki marta XP yo‘q.
2. Dars savoli uchun XP faqat **birinchi to‘g‘ri** javobga (hozirgi `xpTotal` mantiqi saqlanadi).
3. Test urinishi: minimal vaqt — agar 50 savol < 150 soniyada javoblansa (o‘rtacha < 3 s), urinish natijasi saqlanadi, lekin **bonus XP (combo, yulduz bonusi) berilmaydi** va `suspicious_speed` belgisi qo‘yiladi.
4. Ochiq urinishlar: bir foydalanuvchida bir vaqtda bitta ochiq dars urinishi; 24 soatdan eski ochiq urinishlar yopiladi (`passed = false`).
5. Kunlik bonuslar (review, cards, goal) kuniga bir marta, foydalanuvchi vaqt zonasidagi sana bo‘yicha; vaqt zonasi 24 soatda bir martadan ko‘p o‘zgartirilmaydi.
6. Team board XP’si faqat dars/mock/paper XP’sidan (takrorlash bonuslarisiz) — «bir xil savolni qayta ishlash» ustunlik bermaydi.

---

## 4. Media: video va audio pleyer

### 4.1. Hozirgi arxitektura

Slayd-video = slayd (sarlavha + punktlar) + har slayd uchun MP3 (`{audioBase}/{n}.mp3`); audio dars = bo‘laklar `{audioBase}/p{n}.mp3`. Bo‘lak tugagach keyingisi o‘ynaydi. Bu arxitektura saqlanadi (arzon, yengil, 3D/video fayl yo‘q), lekin ustiga «virtual yagona vaqt o‘qi» quriladi.

### 4.2. Talablar

| ID | Talab | Qabul mezoni |
|---|---|---|
| MP-01 | **Umumiy vaqt o‘qi**: har MP3 davomiyligi `audio.json`ga yoziladi (`durations: number[]`, ms) — generatsiya skripti (`scripts/generate-lesson-audio.mjs`) to‘ldiradi | Pleyer «3:42 / 11:05» ko‘rsatadi; slayd chegaralari seek-barda nuqta bilan |
| MP-02 | **Seek-bar**: bosish/sudrash istalgan joyga; kerakli slayd + ichidagi vaqtga o‘tadi | Sichqoncha, touch va klaviatura bilan bir xil ishlaydi; `role="slider"`, `aria-valuetext="3 minutes 42 seconds"` |
| MP-03 | **−10 s / +10 s** tugmalari; slayd chegarasidan o‘tadi | 2-slaydning 4-soniyasida −10 → 1-slaydning oxiridan 6 s oldin |
| MP-04 | **Tezlik**: 0.75, 0.85, 1, 1.15, 1.25, 1.5, 1.75× | Tanlov `localStorage`da (qurilma darajasida) va profilda saqlanadi; keyingi bo‘lak ham shu tezlikda |
| MP-05 | **Pozitsiyani saqlash** har dars va har tab (video/audio) uchun | Har 10 s va `pagehide`/`visibilitychange`da saqlanadi (serverga `navigator.sendBeacon` yoki debounced server action). Qaytganda «Continue from 3:42 · Start over» |
| MP-06 | **Tugallanganlik**: ≥ 90% tinglangan/ko‘rilgan → `media_completed` | Dars test tugmasi yonida «✓ Watched»; test uchun majburiy emas |
| MP-07 | **Klaviatura**: Space/K — play/pause; ←/→ — ±10 s; J/L — ±10 s; Shift+←/→ — oldingi/keyingi slayd; F — to‘liq ekran; M — ovozsiz; `<`/`>` — tezlik | Fokus pleyerda bo‘lganda ishlaydi; matn maydonida yozishga xalaqit bermaydi |
| MP-08 | **Media Session API**: `navigator.mediaSession.metadata` (title = dars nomi, artist = «Finora · CP3P Foundation», artwork = 512 px PNG), handlers `play`, `pause`, `seekbackward`, `seekforward`, `seekto`, `previoustrack`, `nexttrack`; `setPositionState` | Android va iOS qulf ekranida boshqaruv ishlaydi; ekran o‘chsa ham audio dars davom etadi |
| MP-09 | **Fon rejimi**: audio tab ekran o‘chganda to‘xtamasligi uchun bo‘laklar almashishi `ended` hodisasida darhol; oldindan keyingi bo‘lak `preload` qilinadi | iOS Safari’da 3 bo‘lak ketma-ket ekran qulflangan holda o‘ynaydi (qo‘lda sinov) |
| MP-10 | **Offline / kesh**: Service Worker (PWA) — «Download for offline» tugmasi darsning barcha MP3 fayllarini Cache Storage’ga oladi; o‘ynaganda keshdan | Samolyot rejimida yuklangan dars ovozi o‘ynaydi; matn ham keshda. Kesh limiti: oxirgi 10 dars, eng eskisi o‘chiriladi |
| MP-11 | **Keshlash**: MP3 URL’lari o‘zgarmas (versiyali yo‘l `v2/…`), `Cache-Control: public, max-age=31536000, immutable` | Ikkinchi ochilishda tarmoq so‘rovi yo‘q |
| MP-12 | **Subtitr**: mavjud gap subtitri saqlanadi; «CC» tugmasi bilan yoqish/o‘chirish | Holat saqlanadi |
| MP-13 | **Xato**: bo‘lak yuklanmasa 1 marta avtomatik qayta urinish, keyin xabar + «Retry» | Hozirgi `failed` xabari saqlanadi |
| MP-14 | **Yengillik**: pleyer — `lucide-react` ikonkalari + CSS; yangi kutubxona yo‘q | Dars sahifasi JS o‘sishi ≤ 8 KB gz |

### 4.3. Kontent sifati

| Band | Talab |
|---|---|
| Ovoz | Hozirgi TTS ovozi saqlanadi; talaffuz lug‘ati (VfM, PPP, SPV, EPC, O&M, DBFO) — generatsiyada bir xil o‘qilishi |
| Tekshiruv | Har dars uchun ichki ekspert ko‘rigi: Guide bo‘limiga moslik, 50 savol javob kaliti, «should/must/will» farqi |
| Savol sifati | Har savolda `explanation` ≥ 1 gap; «All of the above» yo‘q; javob pozitsiyalari balanslangan (A/B/C/D ≈ 25% ± 5) — `check-lessons.mjs`ga qo‘shiladi |
| Xato xabari | Har savol ostida «Report a problem» (kichik havola) → `content_reports` jadvali; egasi haftada ko‘radi |
| Versiya | Dars JSON’ida `version` va `reviewedAt`; audio qayta generatsiya faqat matn o‘zgarganda |

Qayta audio generatsiya — pullik TTS; faqat egasi ishga tushiradi.

---

## 5. Imtihon tayyorlovi

### 5.1. Foundation mock

- Hozirgi: 285 savol, rasmiy taqsimot, 50/40 daq (+10), server vaqti, grace 3 daq, ko‘rilmagan savollar ustun.
- Maqsad: bank **285 → 450** (2026-11-15 gacha), har Guide bo‘limi bo‘yicha ≥ 8 savol; savol uslublari rasmiy nisbatda (standart, NOT, missing word, two-statement).
- Mock holatini `localStorage`dan tashqari serverga ham yozish (har 10 javobda) — qurilma almashsa davom etadi.

### 5.2. Ssenariy paperlari: 3 → 8–10

| Level | Hozir | 2026-11-15 | 2026-12-20 | Talab |
|---|---|---|---|---|
| Preparation | 3 | 6 | 9 | Har paper boshqa sektor (yo‘l, kasalxona, suv, energiya, maktab, avia, port, IT, chiqindi); 4 savol × 20 satr; 5 uslub (classic, multiple response, matching, sequencing, assertion–reason) rasmiy nisbatda |
| Execution | 3 | 6 | 9 | Xuddi shu; syllabus bo‘limlari SC, TA, CM, CC, OM teng |

Har yangi paper uchun qabul mezoni: `check-scenario-papers.mjs` o‘tadi; har satrda Guide havolasi; ekspert ko‘rigi; «Additional information» bloki bilan 2 bosqichli ssenariy (rasmiy formatga mos).

### 5.3. Adaptiv mashq

- Mavjud `/exam/[level]/practice` kengaytiriladi (yangi sahifa yo‘q): **«Smart practice · 20 questions»** — savollarni tanlash vazni:
  - 50% — eng zaif 2 bo‘lim (oxirgi 60 javob aniqligi eng past);
  - 30% — muddati kelgan xato savollar (SRS);
  - 20% — ko‘rilmagan savollar.
- Qiyinlik: savolda `level` (Bloom 1/2) bor; to‘g‘ri javoblar ≥ 80% bo‘lsa level 2 ulushi oshadi.

### 5.4. Readiness va «ready to book» darvozasi

Formula (hozirgi `readiness` asosida, kengaytirilgan):

```
area_acc   = oxirgi 30 javob aniqligi (har bo‘lim), kamida 8 javob
predicted  = Σ(area_acc × area.mockCount) / 50
mock_best  = oxirgi 14 kundagi eng yaxshi vaqtida topshirilgan mock foizi
Ready      ⇔ predicted ≥ 0.70  VA  har bo‘lim ≥ 0.60  VA  kamida 2 ta mock ≥ 70% oxirgi 14 kunda
Almost     ⇔ predicted ≥ 0.55
```

Preparation/Execution: **Ready ⇔ oxirgi 2 ta turli paper ≥ 56/80 (70%) va har syllabus bo‘limi ≥ 60%**.

- Rasmiy o‘tish 50%, «Ready» esa 70% — xavfsizlik zaxirasi (stress, vaqt, ingliz tili).
- «Ready to book» holatida dars/imtihon sahifasida bitta karta: «You are ready. Book your APMG exam →» (rasmiy `ppp-certification.com/book-your-exam` havolasi) + «Tell us your result» (keyinroq `exam_outcome` so‘rovi — pass-rate KPI manbai).
- B2B menejer panelida «Ready to book» ro‘yxati — imtihon vaucherini kimga sotib olishni hal qilish uchun.

### 5.5. Spaced repetition

- Flashcard holati **serverga** ko‘chiriladi (`srs_cards`), birinchi kirishda `localStorage`dagi holat bir marta import qilinadi.
- Leitner qutilari (mavjud `BOX_DAYS = [0, 1, 3, 7, 21]`) → 6-quti qo‘shiladi: 45 kun.
- Dars savollari ham SRS’ga: xato javob → 1-quti; review’da to‘g‘ri → keyingi quti. Kunlik takrorlash (2.4) shu navbatdan oladi.
- Exam date berilsa: oxirgi 14 kunda yangi dars kamroq, takrorlash va mock ko‘proq tavsiya qilinadi.

---

## 6. AI ustoz

### 6.1. Rollar

| Rol | Qachon ochiladi | Kirish ma’lumoti (server oladi) | Taqiq |
|---|---|---|---|
| **Explain** (dars ichida) | Dars sahifasidagi yig‘iladigan blok | `lessonId` → dars matni (sections, summary, keyTerms) + Guide bo‘laklari | Test/mock javobini aytmaydi |
| **Why was I wrong?** | Test **tugagach**, xato savol yonida | Savol, variantlar, to‘g‘ri javob, `explanation`, Guide bo‘lagi | Test davomida ishlamaydi |
| **Scenario coach** | Paper topshirilgandan keyin | Ssenariy matni, satr, to‘g‘ri javob, rationale | Imtihon vaqtida yo‘q |
| **Study planner** | Dashboard | — | **AI emas**: deterministik formula (3.4, 5.5) — xarajatsiz |

### 6.2. Grounding (Guide asosida)

1. PPP Guide 2026 (CC BY 3.0 IGO, atributsiya bilan) matni bo‘laklarga bo‘linadi: ~800 token, bo‘lim raqami bilan (`guide_chunks`: `id, chapter, section, page_from, page_to, text, tsv`).
2. Qidiruv — **Postgres full-text search** (`tsvector`, `websearch_to_tsquery`), embeddinglarsiz (xarajatsiz). Kerak bo‘lsa keyinroq pgvector.
3. Har so‘rovda: dars matni + top-4 bo‘lak (≤ 3 000 token). Model javob oxirida manba: «PPP Guide 2026, §3.4».
4. Brauzerdan kelgan `context` matni **olib tashlanadi**; faqat `lessonId`/`questionKey` qabul qilinadi (audit AI-01 yopiladi).
5. Topilmasa: «The Guide does not cover this directly» — uydirma yo‘q.

### 6.3. Limitlar va xarajat nazorati

| Nazorat | Qiymat |
|---|---|
| Model tanlash | Explain / Why-wrong — tezkor arzon model (Sonnet/Haiku sinfi); Scenario coach — kuchli model. Hozirgi `claude-opus-5` har savolga ishlatilishi o‘zgartiriladi. Aniq model ID’lari qaror kuni rasmiy hujjatdan tekshiriladi |
| Output | Explain ≤ 700 token, Why-wrong ≤ 400, Coach ≤ 1 200 |
| Foydalanuvchi limiti | B2C: 20/kun; B2B: 40/kun; hammaga 10/soat |
| Global kill-switch | `TUTOR_DAILY_USD_CAP` (env): oshsa AI o‘chadi, tayyor `explanation` ko‘rsatiladi |
| **Javob keshi** | «Why wrong» javobi har savol uchun **bir marta** generatsiya qilinib `ai_explanations(question_key, text, model, created_at)`ga yoziladi; keyingi foydalanuvchilarga bepul. Ekspert ko‘rib chiqadi |
| Prompt caching | System prompt + dars matni keshlanadigan prefiks sifatida |
| Hisob | `tutor_usage(user_id, day, requests, input_tokens, output_tokens, cost_micro_usd)` — har javobdan keyin |
| Xavfsizlik | Foydalanuvchi matni ma’lumot sifatida; «ignore previous instructions» sinovlari eval’da |

Eval: 60 holat (20 explain, 20 why-wrong, 10 grounding/uydirma, 10 injection). **Pullik eval’ni faqat egasi ishga tushiradi**; kod `scripts/eval-tutor.mjs` sifatida tayyorlanadi, o‘zi chaqirilmaydi.

---

## 7. B2B va monetizatsiya

### 7.1. Mahsulotlar va narx gipotezalari

| Paket | Narx gipotezasi | Nima kiradi | Taqqoslash |
|---|---|---|---|
| Free | $0 | Foundation 1–3 darslar, glossary flashcards, 1 ta mini-mock (10 savol) | — |
| Foundation | $49 / 6 oy | Foundation darslari, mock cheksiz, AI 20/kun | Training ByteSize £185 (faqat o‘qish) |
| Full CP3P | $249 / 12 oy | Uchala kurs, barcha paperlar, sertifikat | Kohortalar $1 200–1 940 **har level** |
| Team (B2B) | $180 / o‘rin / yil, min. 5 o‘rin | Full CP3P + menejer paneli + team board + hisobotlar | — |
| Accreditation pack (KZ) | $1 500 / yil (10 o‘rin) | Team + «ready to book» hisobot PDF + onboarding qo‘ng‘irog‘i | Firma uchun 10 × kohorta ≈ $15 000+ |

Gipotezalar 5 ta firma suhbati va birinchi 2 ta pilotda tekshiriladi. **Kurslar orasida qulf qo‘yilmaydi**: to‘lov chegarasi faqat bitta ekran («Unlock Full CP3P»), yo‘l sodda qoladi. To‘lov chegarasini qachon yoqish — egasi qarori.

### 7.2. Menejer paneli

Joy: mavjud `/admin` tuzilmasidan alohida, lekin yangi bo‘lim emas — menejer uchun dashboard’da «Team» tab (faqat `org_members.role = 'manager'` ko‘radi).

| Ko‘rinadi | Ko‘rinmaydi |
|---|---|
| O‘quvchi ismi, email, oxirgi faollik, kurs bo‘yicha dars %, eng yaxshi mock/paper, readiness holati, streak | AI chat matni, alohida savol javoblari |
| «Ready to book» ro‘yxati, CSV eksport | Boshqa tashkilot ma’lumotlari |
| O‘rinlar: ishlatilgan / jami; taklif havolasi | — |

Taklif: menejer email ro‘yxatini kiritadi → `org_invites` (token, 14 kun) → o‘quvchi havola orqali ro‘yxatdan o‘tadi → o‘ringa biriktiriladi. Email yuborish SMTP sozlangach; ungacha menejer havolani o‘zi yuboradi.

### 7.3. To‘lovlar

| Bozor | Kanal | Holat / talab |
|---|---|---|
| B2B (KZ, UZ) | **Hisob-faktura (invoice) + bank o‘tkazmasi**, shartnoma | Eng tez va real; admin qo‘lda `entitlements` yoqadi |
| O‘zbekiston B2C | Payme / Click (UZS) | Yuridik shaxs + merchant shartnomasi (egasi) |
| Qozog‘iston B2C | Kaspi Pay | KZ yuridik shaxsi yoki hamkor talab qilinishi mumkin — tekshiriladi |
| Xalqaro | Merchant-of-record (Paddle / Lemon Squeezy) | O‘zbekistondagi egaga to‘lov chiqarish shartlari tekshiriladi |

Texnik: barcha provayderlar bitta `payments` jadvali va webhook → `entitlements` (idempotent, `unique(provider, external_id)`). Webhook imzosi tekshiriladi; summa serverdagi narx jadvali bilan solishtiriladi.

### 7.4. Sotuv kanali (Qozog‘iston)

1. MNE akkreditatsiyasi olgan / olmoqchi firmalar ro‘yxati (ochiq manbalar).
2. Taklif: «2 hafta bepul pilot, 5 o‘rin» → menejer paneli ko‘rsatiladi.
3. PPP Expertise kohortasidan oldin va keyin tayyorlov sifatida (Foundation 20–23 okt oldidan ingliz tilidagi mashq).

---

## 8. Texnik TZ

### 8.1. Arxitektura

```
Brauzer (Next.js 16 RSC + kichik client orollar)
  ├─ Server Components: sahifalar, kontent (src/content/* faqat serverda)
  ├─ Server Actions: test, mock, paper, media progress, SRS, org, to‘lov
  ├─ Route Handlers: /api/tutor (stream), /api/pay/webhook/[provider], /api/cron/*
  └─ Service Worker (PWA): statik + audio kesh
Supabase: Postgres (RLS), Auth, Storage (audio MP3)
Vercel: hosting (bom1), Cron, Speed Insights
Anthropic: faqat /api/tutor orqali
```

Qoidalar: kontent JSON (`src/content/cp3p`, 2.7 MB; `src/content/exam`, 1.1 MB) **hech qachon** `"use client"` komponentga import qilinmaydi (javob kalitlari va bundle). Hozir shunday — CI tekshiruvi qo‘shiladi (`scripts/check-client-imports.mjs`).

### 8.2. Ma’lumotlar modeli (yangi migratsiyalar)

Barcha jadvallarda RLS yoqilgan; **yozish faqat service role** (00003 tamoyili), o‘qish — o‘zinikini.

**`00004_profile_game.sql`**

| Jadval / ustun | Maydonlar | RLS |
|---|---|---|
| `users` + ustunlar | `timezone text not null default 'Asia/Tashkent'`, `daily_goal_xp smallint not null default 60 check (daily_goal_xp in (30,60,120,200))`, `exam_level text`, `exam_date date`, `playback_rate numeric(3,2) default 1`, `team_board_hidden boolean default false` | Mavjud `users_update_own`; `role` trigger himoyasi saqlanadi |
| `xp_events` | `id bigint identity pk, user_id uuid fk, source text, source_key text, xp int check (xp between 0 and 500), created_at timestamptz default now()`, **`unique(user_id, source_key)`**, index `(user_id, created_at desc)` | select own; insert faqat service |
| `daily_activity` | `user_id, day date, xp int default 0, lessons int, questions int, goal_met bool, freeze_used bool, pk(user_id, day)` | select own |
| `streaks` | `user_id pk, current int, longest int, freezes smallint check (freezes between 0 and 2), last_day date, updated_at` | select own |

**`00005_media_srs.sql`**

| Jadval | Maydonlar | RLS |
|---|---|---|
| `media_progress` | `user_id, lesson_id text, kind text check (kind in ('video','audio')), position_ms int, duration_ms int, completed bool default false, updated_at, pk(user_id, lesson_id, kind)` | select own; yozish server action orqali (service) |
| `srs_cards` | `user_id, card_id text` (`g:<term>` yoki `q:<lessonId>#<i>`), `box smallint check (box between 1 and 6), due_at timestamptz, lapses int default 0, updated_at, pk(user_id, card_id)`, index `(user_id, due_at)` | select own |
| `content_reports` | `id, user_id, target text, message text check (char_length(message) <= 1000), status text default 'open', created_at` | insert — server; select — admin |

**`00006_ai.sql`**

| Jadval | Maydonlar | RLS |
|---|---|---|
| `guide_chunks` | `id text pk, chapter smallint, section text, page_from int, page_to int, text text, tsv tsvector generated always as (to_tsvector('english', text)) stored`, GIN index | select — authenticated (ochiq litsenziya) |
| `ai_explanations` | `question_key text pk, text text, model text, reviewed bool default false, created_at` | select — authenticated |
| `tutor_usage` | `user_id, day date, requests int, input_tokens int, output_tokens int, cost_micro_usd bigint, pk(user_id, day)` | select own; admin all |

**`00007_orgs_billing.sql`**

| Jadval | Maydonlar | RLS |
|---|---|---|
| `organizations` | `id uuid pk, name text, country text check (country in ('KZ','UZ','OTHER')), seats int, plan text, valid_until date, team_board bool default false, created_at` | select — a’zolar |
| `org_members` | `org_id, user_id, role text check (role in ('manager','learner')), joined_at, pk(org_id, user_id)` | select — o‘zi yoki shu org menejeri |
| `org_invites` | `token text pk (32 bayt random), org_id, email text, expires_at, used_by uuid` | faqat service |
| `entitlements` | `id, user_id, product text, source text check (source in ('b2c','org','manual')), valid_until timestamptz, unique(user_id, product, source)` | select own |
| `payments` | `id, user_id, org_id, provider text, external_id text, amount_minor bigint, currency text, status text, raw jsonb, created_at, unique(provider, external_id)` | admin only |
| `events` (analitika) | `id bigint identity, user_id uuid null, name text, props jsonb check (pg_column_size(props) < 2048), created_at`, index `(name, created_at)` | insert — service; select — admin |

Yordamchi funksiya: `private.is_org_manager(org uuid) returns boolean security definer set search_path = ''`. Menejer uchun agregatlar `private.org_learner_summary(org uuid)` funksiyasi orqali (jadvallarni to‘g‘ridan ochmasdan).

**Tartib:** 00003 → 00004 → … Har migratsiya idempotent, `notify pgrst, 'reload schema'` bilan. **Barchasini egasi qo‘llaydi.**

### 8.3. Server actions / API

| Nomi | Kirish (zod) | Chiqish | Eslatma |
|---|---|---|---|
| `startTest` / `checkAnswer` / `finishTest` (mavjud) | — | + `xpAwarded`, `combo`, `stars`, `streak` | `finishTest` ichida `awardXp()` va `touchDay()` |
| `saveMediaPosition` | `lessonId, kind, positionMs, durationMs` | `{ok}` | 10 s debounce; `positionMs ≤ durationMs` |
| `reviewCard` | `cardId, knew: boolean` | yangi `box, due_at` | `srs.review()` serverda |
| `importLocalCards` | `Record<cardId, {box,due}>` ≤ 600 | `{imported}` | Bir marta |
| `setDailyGoal` / `setExamDate` / `setTimezone` | enum / date / IANA | `{ok}` | Timezone 24 soatda 1 marta |
| `reportContent` | `target, message ≤ 1000` | `{ok}` | 10/kun limit |
| `createInvite` / `acceptInvite` | emails ≤ 100 / token | — | Menejer / o‘quvchi |
| `POST /api/tutor` | `{mode, lessonId?, questionKey?, messages}` | stream | `context` maydoni olib tashlanadi |
| `POST /api/pay/webhook/[provider]` | provider formati | 200 | Imzo, idempotency |
| `GET /api/cron/close-stale-attempts` | `CRON_SECRET` | — | Kuniga 1 marta (Vercel Hobby cheklovi) |
| `GET /api/cron/streaks` | `CRON_SECRET` | — | Freeze qo‘llash, kunlik yig‘ish |

Ichki funksiyalar (sof, testlanadi): `awardXp(events)`, `comboBonus(sequence)`, `dayKey(date, tz)`, `nextStreak(state, day, active)`, `readiness(...)`, `pickSmartPractice(...)`, `mediaTimeline(durations)`, `seek(timeline, ms) → {slide, offsetMs}`.

### 8.4. Tezlik byudjeti

| Ko‘rsatkich | Byudjet | Qanday tekshiriladi |
|---|---|---|
| LCP p75 (dars, dashboard) | ≤ 2.5 s (mobil 4G) | Vercel Speed Insights, haftalik |
| INP p75 | ≤ 200 ms | Speed Insights |
| CLS | ≤ 0.1 | Speed Insights |
| First-load JS (dars sahifasi) | ≤ 180 KB gz | `next build` hisoboti; CI’da `scripts/check-bundle.mjs` (limit oshsa yiqiladi) |
| First-load JS (boshqa sahifalar) | ≤ 150 KB gz | Xuddi shu |
| Dars HTML (RSC payload) | ≤ 120 KB | Test savollari HTML’ga kirmaydi (faqat `startTest`da) |
| Birinchi audio bo‘lak | ≤ 1 s boshlanish (4G) | `preload="metadata"`, keyingi bo‘lak oldindan |
| Server action javobi (`checkAnswer`) | p95 ≤ 400 ms | Loglar (`console.time` → Vercel) |
| Animatsiya | Faqat CSS `opacity/transform`, ≤ 300 ms; `prefers-reduced-motion`da o‘chadi | Kod ko‘rigi |

### 8.5. Xavfsizlik

- [ ] 00003 qo‘llangan va `SUPABASE_SERVICE_ROLE_KEY` Vercel’da bor (aks holda server yozuvi ham ishlamaydi — **avval kalit, keyin migratsiya**).
- [ ] Service key faqat `server-only` modulda (`src/lib/supabase-admin.ts`) — CI grep tekshiruvi.
- [ ] Test/mock javob kalitlari topshirishdan oldin brauzerga chiqmaydi (mavjud; e2e test bilan himoyalanadi).
- [ ] RLS testlari: ikki foydalanuvchi — begona `media_progress`, `srs_cards`, `xp_events`, `org_members` o‘qib bo‘lmaydi; menejer boshqa org’ni ko‘rmaydi.
- [ ] Rate limit: `checkAnswer` ≤ 120/daq, `saveMediaPosition` ≤ 12/daq, `reportContent` ≤ 10/kun.
- [ ] Webhook: imzo, summa, valyuta, idempotency.
- [ ] Sertifikat: `/certificate/verify/[id]` (ommaviy, faqat ism + kurs + sana) — qalbakilikka qarshi.
- [ ] Reset-password redirect allowlist (audit SEC-02).
- [ ] Shaxsiy ma’lumotlar: hisob o‘chirish so‘rovi (profil → «Delete my account» → admin 7 kun ichida).

### 8.6. Analitika hodisalari

Birinchi tomon `events` jadvali (tashqi servisga shaxsiy ma’lumot yuborilmaydi) + Vercel Speed Insights (faqat tezlik).

| Hodisa | Xossalar |
|---|---|
| `signup_completed` | `source` (utm), `country` (header), `org` bor/yo‘q |
| `onboarding_completed` | `goal_xp`, `exam_level`, `exam_date` bor/yo‘q |
| `lesson_opened` | `lessonId`, `course` |
| `media_played` / `media_completed` | `lessonId`, `kind`, `rate`, `position_s` |
| `media_seek` | `lessonId`, `from_s`, `to_s` |
| `test_started` / `test_finished` | `lessonId`, `score`, `passed`, `stars`, `duration_s`, `attempt_no` |
| `lesson_unlocked` | `lessonId` |
| `daily_goal_met` | `goal_xp` |
| `streak_extended` / `streak_frozen` / `streak_lost` | `length` |
| `review_started` / `review_finished` | `count`, `correct` |
| `flashcards_session` | `cards`, `known` |
| `mock_started` / `mock_submitted` | `exam`, `score`, `passed`, `late` |
| `paper_submitted` | `paperId`, `score`, `areas` |
| `readiness_changed` | `level`, `from`, `to` |
| `ready_to_book_clicked` | `level` |
| `exam_outcome_reported` | `level`, `passed`, `score` |
| `tutor_asked` / `tutor_failed` / `tutor_limited` | `mode`, `lessonId` (matn yo‘q) |
| `paywall_viewed` / `checkout_started` / `purchase_completed` | `product`, `provider` |
| `invite_sent` / `invite_accepted` | `orgId` |
| `nps_submitted` | `score`, `trigger` |
| `content_reported` | `target` |

KPI so‘rovlari (retention, completion, funnel) `docs/strategy/kpi.sql` sifatida saqlanadi; admin sahifasida bitta «Metrics» kartasi.

### 8.7. Testlash

| Qatlam | Vosita | Qamrov / qabul |
|---|---|---|
| Unit (sof funksiyalar) | Mavjud `node --test` | `gamification` (XP, combo, farm qoidalari), `dayKey`/`nextStreak` (Toshkent yarim tuni, DST’li zona, freeze), `mediaTimeline`/`seek`, `srs` (6-quti), `readiness`, `pickSmartPractice`. Maqsad: ≥ 90% shox (branch) qamrovi shu modullarda |
| Kontent | `check:content`, `check:exam` | + javob pozitsiya balansi, dublikat savollar, har savolda explanation, `audio.json` durations to‘liq |
| Integratsiya | Lokal Supabase (`supabase start`) + skript | Server actions: test oqimi, XP idempotency (bir urinishni 2 marta finish → XP 1 marta), RLS 2 foydalanuvchi |
| E2E | Playwright (lokal, headed Chrome) | 1) sign-up → 1-dars → video play/seek → test 46/50 → 2-dars ochildi; 2) test o‘rtasida reload → davom; 3) mock boshlash → reload → topshirish; 4) klaviatura bilan pleyer; 5) 390 px mobil |
| Accessibility | axe (Playwright) | Dars, test, pleyer: kritik xato 0 |
| AI | `scripts/eval-tutor.mjs` | **Faqat egasi ishga tushiradi** (pullik) |

### 8.8. CI/CD

Hozirgi `deploy.yml` (tsc → eslint → test → check:content → check:exam → Vercel prod → health) saqlanadi va kengaytiriladi:

1. `pull_request` uchun alohida job: xuddi shu tekshiruvlar + `check-bundle` + `check-client-imports` + Playwright (lokal build, Supabase’siz mock rejimi yoki test loyihasi).
2. `main` push → prod deploy (hozirgidek). Health check: `/` + `/courses` + `/api/health` (DB ping, audio bucket HEAD).
3. Migratsiyalar CI’da **qo‘llanmaydi**; faqat SQL sintaksis tekshiruvi (`pg_query`/`psql --dry-run` lokal konteyner).
4. Rollback: Vercel’da oldingi deploy’ni «Promote» — hujjatlashtiriladi.
5. Commit email — ish akkaunti (Vercel bloklamasligi uchun).

---

## 9. Yo‘l xaritasi

Tinch, real sur’at: bir dasturchi + egasi; har bosqich oxirida prod’ga chiqadi va egasi sinaydi.

### 0-bosqich · Barqaror poydevor — 2026-09-26 → 2026-10-04

| Natija | Qabul mezonlari |
|---|---|
| Egasi 00003 ni qo‘llaydi (oldin service key tekshiriladi) | [ ] REST orqali `lesson_progress`ga yozish 401/403; dars testi prod’da o‘tadi va progress yoziladi |
| Streak vaqt zonasi (TIME-01) | [ ] `users.timezone`; Toshkent 23:30 va 00:30 testlari o‘tadi |
| Achievement va dashboard matnlari inglizcha | [ ] UI’da o‘zbekcha qator yo‘q (grep `[ʻ‘']` + o‘zbek so‘zlari ro‘yxati) |
| `courses.ts` izohidagi «≥80%» → 92% | [ ] Kod va matn bir xil |
| `events` jadvali + 8 ta asosiy hodisa | [ ] `signup_completed`, `lesson_opened`, `test_finished`, `media_played` bazada ko‘rinadi |
| Eskirgan ochiq urinishlarni yopish (cron) | [ ] 24 soatdan eski `passed is null` qolmaydi |

### 1-bosqich · Pleyer 2.0 — 2026-10-05 → 2026-10-18

| Natija | Qabul mezonlari |
|---|---|
| MP-01…MP-08, MP-12, MP-13 | [x] Seek-bar, ±10 s, klaviatura, qulf ekrani — 2026-09-25 da qilindi; [ ] iOS Safari’da qo‘lda sinov, CC tugmasi, avtomatik qayta urinish |
| Pozitsiyani saqlash (`media_progress`) | [ ] Boshqa qurilmada «Continue from» to‘g‘ri (±10 s) |
| `audio.json` durations | [ ] 44 dars to‘liq; skript mavjud MP3’lardan o‘lchaydi (**TTS chaqirmasdan**) |
| Tezlik byudjeti | [ ] Dars sahifasi JS o‘sishi ≤ 8 KB gz |

### 2-bosqich · O‘yin 2.0 — 2026-10-19 → 2026-11-01

| Natija | Qabul mezonlari |
|---|---|
| `xp_events`, `daily_activity`, `streaks` (00004) | [ ] Bir urinishni ikki marta tugatish XP’ni ikki marta bermaydi (integratsiya testi) |
| Kunlik maqsad, combo, freeze, yulduz bonusi | [ ] 3-bo‘lim qoidalari unit testda; UI’da faqat mavjud ekranlarda |
| 14 ta achievement (inglizcha) | [ ] Mavjud foydalanuvchilarga orqaga qarab hisoblangan |
| Mavjud XP migratsiyasi | [ ] Eski `xpTotal` bilan yangi daftar yig‘indisi ±0 (backfill skripti) |

### 3-bosqich · Imtihon kuchi — 2026-11-02 → 2026-11-22

| Natija | Qabul mezonlari |
|---|---|
| Ssenariy paperlari 3 → 6 (har level) | [ ] `check:exam` o‘tadi; ekspert ko‘rigi belgisi |
| Foundation bank 285 → 450 | [ ] Har bo‘limda ≥ 8 savol; uslublar nisbati |
| Server SRS (00005) + flashcards import | [ ] `localStorage`dan bir marta ko‘chdi; ikki qurilmada bir xil holat |
| Smart practice + readiness 2.0 + «Ready to book» | [ ] Formula unit testda; kartada rasmiy havola |
| `exam_outcome` so‘rovi | [ ] Pass-rate KPI hisoblanadi |

### 4-bosqich · B2B pilot — 2026-11-23 → 2026-12-13

| Natija | Qabul mezonlari |
|---|---|
| Tashkilot, taklif, menejer «Team» tab (00007) | [ ] Menejer faqat o‘z org’ini ko‘radi (RLS testi); CSV eksport |
| Team board (ixtiyoriy) | [ ] Standart o‘chiq; o‘quvchi yashirina oladi |
| Invoice → qo‘lda `entitlements` | [ ] Admin 1 daqiqada o‘rin ochadi |
| 2 ta pilot firma (KZ/UZ) | [ ] Kamida 10 real o‘quvchi faol |
| v2 o‘tishi kommunikatsiyasi (2026-12-01) | [ ] Landing va kurs sahifasida «Built on the PPP Guide 2026 (v2)» |

### 5-bosqich · AI ustoz 2.0 — 2026-12-14 → 2027-01-10

| Natija | Qabul mezonlari |
|---|---|
| `guide_chunks` + FTS grounding (00006) | [ ] Javoblarda § havola; brauzer `context`i qabul qilinmaydi |
| Why-wrong + javob keshi | [ ] Bir savolga ikkinchi so‘rov model chaqirmaydi |
| Model tiering, `tutor_usage`, kill-switch | [ ] Kunlik $ chegarasi oshganda tayyor izohga o‘tadi (mock provider bilan lokal sinov) |
| Eval skripti | [ ] Tayyor; **ishga tushirish — egasi** |

### 6-bosqich · Offline va to‘lovlar — 2027-01-11 → 2027-02-07

| Natija | Qabul mezonlari |
|---|---|
| PWA + audio offline (MP-09…MP-11) | [ ] Samolyot rejimida yuklangan dars o‘ynaydi |
| Payme/Click yoki MoR webhook | [ ] Egasi shartnoma bergach; sandbox’da idempotent sinov |
| Paperlar 6 → 9 (har level) | [ ] `check:exam` o‘tadi |
| NPS so‘rovi | [ ] 10-dars va mockdan keyin bir marta |

### 7-bosqich · Barqarorlashtirish — 2027-02-08 → 2027-03-31

KPI ko‘rib chiqish, zaif darslarni qayta yozish (yakunlash < 60% bo‘lganlar), ssenariy paper 10-si, narxlarni tasdiqlash, 5 ta B2B mijoz.

---

## 10. Xavflar va yechimlar

| Xavf | Ehtimol | Ta’sir | Yechim |
|---|---|---|---|
| 00003 service key’siz qo‘llansa, test natijalari yozilmay qoladi | O‘rta | Yuqori | Tartib: kalitni tekshirish → migratsiya → prod’da bitta test (egasi) |
| Kontent xatosi (noto‘g‘ri javob kaliti) ishonchni yo‘qotadi | O‘rta | Yuqori | «Report a problem», ekspert ko‘rigi, `check-lessons` qoidalari, haftalik triage |
| Rasmiy APMG savollarini ko‘chirish ayblovi | Past | Yuqori | Faqat original savollar; Guide CC BY 3.0 IGO atributsiyasi; sample PDF’lar ommaviy tarqatilmaydi |
| AI xarajati o‘sishi | O‘rta | O‘rta | Tiering, kesh, limit, kill-switch, `tutor_usage` |
| AI uydirma javobi | O‘rta | Yuqori | Grounding + «Guide does not cover», imtihon paytida AI o‘chiq |
| Ilova yana sekinlashishi | O‘rta | O‘rta | Bundle byudjeti CI’da, animatsiya faqat CSS, kontent faqat serverda |
| Interfeys murakkablashishi | O‘rta | Yuqori | Qoida: yangi sahifa yo‘q; har PR’da «qaysi mavjud ekranga joylandi» savoli |
| B2B xaridi sekin (byudjet sikli) | Yuqori | O‘rta | Bepul 2 haftalik pilot, invoice, akkreditatsiya paketi |
| KZ/UZ to‘lov integratsiyasi yuridik to‘siqlari | Yuqori | O‘rta | Avval invoice; MoR sinovi; provayder shartnomasi egasida |
| Streak/XP bosimi stress keltirishi | Past | Past | Freeze, ayblovsiz matn, ommaviy liga yo‘q |
| Vercel Hobby cron cheklovi (kuniga 1) | Yuqori | Past | Kunlik bitta cron yetarli; qolgani so‘rov paytida hisoblanadi |
| v2 bo‘yicha rasmiy namunaviy savollar yo‘qligi | Yuqori | O‘rta | Guide v2 matniga tayanish; APMG yangi namunasi chiqsa uslub tekshiriladi |
| Bir kishilik jamoa — muddat siljishi | O‘rta | O‘rta | Bosqichlar mustaqil; 3-bosqich (imtihon) ustuvor, 6-bosqich surilishi mumkin |

---

## 11. Egasining vazifalari (faqat egasi bajaradi)

### Darhol (0-bosqich)
- [ ] Vercel env’da `SUPABASE_SERVICE_ROLE_KEY` borligini tasdiqlash.
- [ ] Supabase SQL Editor’da **`supabase/migrations/00003_lock_results.sql`** ni ishga tushirish, so‘ng prod’da bitta dars testini o‘tib ko‘rish.
- [ ] Keyingi migratsiyalarni navbati bilan qo‘llash: `00004_profile_game.sql`, `00005_media_srs.sql`, `00006_ai.sql`, `00007_orgs_billing.sql` (har biri tayyor bo‘lganda xabar beriladi).

### Kalitlar va sozlamalar
- [ ] `ANTHROPIC_API_KEY` balansi va oylik chegara (Anthropic konsolida spend limit).
- [ ] `TUTOR_DAILY_USD_CAP` qiymatini tanlash (taklif: $5/kun pilot davrida).
- [ ] `CRON_SECRET` (Vercel env).
- [ ] Vercel Speed Insights’ni loyiha sozlamalarida yoqish.
- [ ] SMTP (Supabase Auth → custom SMTP: domen, SPF/DKIM) — parol tiklash, takliflar, eslatmalar uchun.

### Pullik sinovlar (faqat egasi)
- [ ] AI ustoz eval (`scripts/eval-tutor.mjs`) va prod’da AI javoblarini sinash.
- [ ] Yangi yoki o‘zgargan darslar uchun TTS audio generatsiyasi (`scripts/generate-lesson-audio.mjs`) va Storage’ga nashr.

### Biznes va huquq
- [ ] Narx gipotezalarini tasdiqlash va to‘lov chegarasini qachon yoqish qarori.
- [ ] To‘lov shartnomalari: Payme / Click (UZ yuridik shaxs), Kaspi Pay imkoniyati (KZ), yoki merchant-of-record (Paddle / Lemon Squeezy) — hisob ochish.
- [ ] B2B shartnoma va invoice shabloni; 2 ta pilot firma bilan kelishuv.
- [ ] Kontent ekspertini topish (haftasiga ~1 kun): paperlar va dars savollari ko‘rigi.
- [ ] Maxfiylik siyosati va foydalanish shartlari (UZ/KZ shaxsiy ma’lumotlar qonunlari bo‘yicha huquqshunos ko‘rigi).
- [ ] APMG akkreditatsiyasi (Accredited Training Organisation) bo‘yicha qaror — ixtiyoriy, uzoq muddatli.
- [ ] Qozog‘istondagi MNE akkreditatsiyasi talabidagi aniq son/level (hozir UNCONFIRMED) — rasmiy manbadan aniqlash.

### Muntazam
- [ ] Haftalik: `content_reports` ko‘rib chiqish, KPI kartasi, AI xarajati.
- [ ] Har bosqich oxirida prod’da asosiy oqimni o‘zi sinash va «qabul qilindi» deyish.
