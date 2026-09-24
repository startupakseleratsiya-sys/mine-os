# Finora audit va tekshiruv hisoboti

## 2026-09-14: kalkulyator tuzatishlari

CALC-01 va CALC-02 tuzatildi. Uchta hisob `src/lib/calculators.ts` modulidan olinadi: nominal yillik stavka 12ga bo‘linadi, jamg‘arma foizi har oy qo‘shiladi, badal oy oxirida kiritiladi. Maqsad hisobida mavjud kapitalning o‘sishi ham bor; UI oylik badalni butun so‘mgacha yuqoriga yaxlitlaydi. Nol stavka, noto‘g‘ri input va son diapazonidan oshish alohida ishlanadi. Hisoblash shartlari kalkulyator sahifasida ko‘rsatilgan.

`npm test`: 10 test o‘tdi, jumladan mustaqil oyma-oy hisob, 0% stavka, bir oy, uzoq muddat, badalsiz jamg‘arma, allaqachon yetilgan maqsad va noto‘g‘ri input. Deploy workflowiga shu testlar qo‘shildi. `node scripts/audit-project.mjs` endi hisob modulini tekshiradi: CALC-01/02/03 PASS, TIME-01 hali FAIL (exit 1). Joriy [JSON dalil](evidence/calculation-audit.json) yangilandi; quyidagi 11-sentabr natijalari tarixiy boshlang‘ich holatdir.

Stavka va kapitalizatsiya davri alohida parametr ekanini [Investor.gov kalkulyatori](https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator) ham ko‘rsatadi. Ushbu ilovada oyma-oy kapitalizatsiya va oy oxiri badali aniq konvensiya sifatida tanlandi. Bu bank tarifi yoki kelajak daromadi kafolati emas.

## Xulosa

Loyiha build qilinadi va asosiy ochiq resurslar javob beradi. Ammo hisob auditi uchta nosozlik topdi: oylik badal davri noto‘g‘ri qo‘llangan, maqsad jamg‘armasining boshlang‘ich kapital o‘sishi hisobga olinmagan va Toshkentdagi bir kun ikki kunlik streak bo‘lib chiqishi mumkin. Bu hisobotdagi topilmalar tuzatilgan degani emas; joriy ishning natijasi — qayta ishlatiladigan dalil, ustuvor backlog va qabul mezonlari.

Tekshiruv 2026-yil 11-sentabrdagi lokal, commit qilinmagan ishchi daraxtga tegishli. Production, real foydalanuvchi ma’lumotlari va pullik model so‘rovlari bu auditda tekshirilmagan.

## Bajarilgan tekshiruvlar

| Tekshiruv | Natija | Dalil va chegarasi |
|---|---|---|
| `npm.cmd run build` | PASS | Next.js 16.3.3 production build, TypeScript va 19 sahifa generatsiyasi tugadi |
| `npm.cmd run lint` | PASS | Repo lint tekshiruvi; semantik formula xatosini topmaydi |
| `node scripts/check-course-content.mjs` | PASS | 4 kurs, 22 dars, 11 PDF, 13 savol strukturasi va PDF headerlari |
| `node scripts/audit-project.mjs` | FAIL, exit 1 | 4 tekshiruvdan 3 tasi xato; [JSON](evidence/calculation-audit.json) |
| Lokal anonim HTTP, port 3100 | PASS | `/`, `/courses`, PPP kursi va bir PDF 200; `/api/tutor` anonim POST 401; [JSON](evidence/http-smoke.json) |
| Skill fayllari | PASS | 8 o‘rnatilgan SKILL.md, commit va SHA256 [registrda](evidence/skills-lock.json) |
| Interaktiv brauzer / mobil E2E | NOT_RUN | Mavjud browser sessiyalari ro‘yxati bo‘sh; HTTP testi o‘rnini bosa olmaydi |
| Authenticated oqim, RLS, admin rollari | NOT_RUN | Staging test hisoblari bilan amaliy tekshirilmagan |
| Jonli AI sifati, narxi va kechikishi | NOT_RUN | Eval dataset va provider benchmark hali bajarilmagan |
| Haqiqiy o‘quv natijasi / raqobatchi kabinetlari | NOT_RUN | Foydalanuvchi piloti, pullik kabinet va checkout tekshiruvi yo‘q |

## Qayta hosil qilinadigan nosozliklar

**CALC-01 — jamg‘arma, P0.** `src/app/calculators/page.tsx`, `CompoundCalc.finalAmount`: boshlang‘ich 5 000 000 so‘m, oylik 200 000, yillik 15%, 5 yil. Kod 11 405 262.19 so‘m beradi; kiritilgan mablag‘ning o‘zi 17 000 000 so‘m. Nominal yillik stavka, oylik kapitalizatsiya va oy oxiri badal taxminida mustaqil oyma-oy hisob 28 250 808.29 so‘m beradi. Asosiy xato — oylik badalni yillik davrlar formulasi bilan qo‘shish. Stavka konvensiyasini tanlash va UIga yozish ham tuzatishning bir qismi.

**CALC-02 — maqsad, P0.** `GoalCalc.needed`: maqsad 20 000 000, mavjud 2 000 000, muddat 24 oy, nominal stavka 15%. Tavsiya etilgan badalni shu shartlar bilan simulyatsiya qilish 20 694 702.10 so‘mga olib keladi. Mavjud mablag‘ning o‘sishi hisobga olinmagan. `r > 0` uchun badal `max((goal-current*(1+r)^n)*r/((1+r)^n-1), 0)`; nol stavka uchun alohida tarmoq, yaroqsiz muddat uchun validatsiya kerak. Kutilgan natija ortiqcha to‘ldirishsiz maqsadga yetishdir.

**TIME-01 — streak, P1.** `src/lib/progress.ts`, `dayKey/computeStreak`: `2026-09-10T19:30Z` va `2026-09-11T09:30Z` Toshkentda 11-sentabrga to‘g‘ri keladi. Kod 2 kun, kutilgan natija 1 kun. UTC kalendar kuni bilan mahalliy sana aralashgan. Foydalanuvchi vaqt zonasi, kun almashishi va kechagi aktivlik uchun test kerak.

**CALC-03 — kredit, PASS.** 10 000 000 so‘m, 22%, 24 oy, komissiyasiz annuitet shartida oyma-oy qolgan qarz taxminan `-0.000000019` so‘m, ya’ni son aniqligi doirasida nol. Bu barcha kredit turlari, komissiyalar yoki real bank jadvali tekshirildi degani emas.

Audit skripti TypeScript ASTdan ayni koddagi formulalarni olib, mustaqil iterativ hisobga solishtiradi. U regressiya uchun boshlang‘ich dalil; kelajakda sof hisob modulining to‘liq unit testlari o‘rnini bosmaydi. Formulalar ko‘chirilganda skript ham yangi public funksiyalarni tekshiradigan qilib yangilanadi.

## Kod va kontent ko‘rigidan topilmalar

| ID / ustuvorlik | Kuzatuv va dalil joyi | Zarur ish va yopish mezoni |
|---|---|---|
| CONTENT-01 / P0 chiqishdan oldin | Imtihon sample PDFi `public/materials/ppp/`da, huquq qaydi qo‘llanmadan farq qiladi | Tarqatishga asosni hujjatlashtirish yoki rasmiy havolaga almashtirish; original lokal faylni saqlash |
| CONTENT-02 / P1, PPP sotilishidan oldin | `src/content/ppp-course.ts` 2016 manbalari; 2026 dasturi yangilangan | Versiya yorlig‘i, syllabus xaritasi va ekspert tekshiruvi; [manbalar](research.md#ppp-materiallarining-holati) |
| AI-01 / P1 | `src/app/api/tutor/route.ts`: client context system matniga qo‘shiladi; lesson manbasini serverdan olish yo‘q | Attempt/lesson ID orqali trusted retrieval; injection va noto‘g‘ri citation eval |
| AI-02 / P1 | Shu endpointda 50 × 10 000 belgilikkacha xabar; per-user limit va output budget ko‘rinmadi | Body/token/rate/cost limit; 429 va bekor qilish sinovi |
| AI-03 / P1 | Prompt avval to‘g‘ridan-to‘g‘ri javobni so‘raydi | Hint bosqichlari va AI-off transfer; ekspert pedagogik eval |
| LEARN-01 / P1 | `lesson-quiz.tsx`: javoblar clientda, urinishlar saqlanmaydi; completion qo‘lda | Hozir practice deb hisoblash; server urinishlari va alohida mastery |
| DATA-01 / P1 | Tutor saqlash xatosi log qilinib oqim davom etishi mumkin | UI saqlash holati, retry va idempotency; ko‘ringan xabar tarixda yo‘qolmasin |
| SEC-01 / P1 tekshirish | Chat ownership RLS bor, endpointda session egaligi alohida tekshirilmaydi | Ikki user bilan begona session ID test; leak aniqlangan deb da’vo qilinmaydi |
| SEC-02 / P1 tekshirish | Auth action reset URL uchun forwarded-host/hostdan foydalanadi | Tasdiqlangan origin va redirect allowlist; host manipulation testi |
| UX-01 / P1 | Kalkulyator slider labeli inputga aniq bog‘lanmagan | Accessible name, keyboard, son kiritish alternativasi; screen reader tekshiruvi |
| UX-02 / P2 | `src/app/page.tsx`: pricing anchor va footer maxfiylik/shartlar/aloqa manzillari to‘liq emas | Ishlaydigan sahifa yoki aniq holat; foydalanuvchi yo‘ldan adashmasin |
| OPS-01 / P1 | `.github/workflows/deploy.yml`: build/tsc/lint bor, domain test/eval/RLS yo‘q | PR tekshiruvlari va staging release mezoni; rollback sinovi |
| METRIC-01 / P2 | Progressdagi o‘qish daqiqalari dars uzunliklari yig‘indisiga tayangan | “Taxminiy vaqt” yorlig‘i yoki maxfiylikka mos o‘lchov; real o‘qish deb e’lon qilmaslik |

Ijobiy nazoratlar ham bor: tutor endpoint autentifikatsiyasi, chat jadvalidagi ownership RLS, admin tekshiruvi, oqimni bekor qilish, kurs tuzilma tekshiruvi va build pipeline. Ularni saqlash kerak. Statik ko‘rik live baza ayni migratsiyaga mosligini isbotlamaydi. Eski migratsiyadagi `DROP` amallari tiklash rejasiz qayta ishlatilmasin; bu audit bazaga migratsiya bajarmadi.

## Keyingi test matritsasi

| Test oilasi | Muhim holatlar | Bog‘langan talab | Egasi |
|---|---|---|---|
| Hisob unit | 0 stavka, 0 badal, 1 oy, uzoq muddat, goal≤current, manfiy/NaN input, bir xil davr | FR03–04, NFR05 | Dasturchi + moliya eksperti |
| Sana unit | Toshkent yarim tuni, kecha/bugun, bo‘sh tarix, takroriy completion, boshqa timezone | FR08 | Dasturchi |
| Kontent | Broken source, noma’lum litsenziya, eski edition, answer variantlari, noaniq rubrika | FR09–10, FR12 | Ekspert + kontent egasi |
| API integratsiya | 400/401/403/409/429/503, body limit, dublikat request, SSE uzilishi | FR04–07, NFR04 | Dasturchi |
| RLS / xavfsizlik | Ikki user bir-birining chat/progressini o‘qish/yozish, rolni o‘zgartirish, admin, reset redirect | FR07, FR11, NFR05 | Dasturchi + xavfsizlik review |
| E2E | Demo→signup→mashq→reload→davom; xato tarmoq; logout; kurslar tugashi | FR01–08 | QA |
| Accessibility | Chrome/Firefox/Safari asosiy oqim, keyboard, screen reader, zoom, contrast, reduced motion | NFR01–02 | QA + dizayner |
| AI eval | O‘zbekcha hint, uydirma manba, injected PDF, javobni oshkor qilish, hisobni buzib tushuntirish | FR05–06, FR09 | Ekspert + dasturchi |
| Operatsiya | Xarajat chegarasi, loglarda PII, backup restore, rollback, ma’lumot o‘chirish | FR11, NFR06–07 | Dasturchi |

Har test uchun muhit, kirish, kutilgan natija, haqiqiy natija va dalil saqlanadi. NOT_RUN va FAIL hech qachon PASSga birlashtirilmaydi. Raqobatchilarni chuqur amaliy tekshirish ham xuddi shu tamoyilda, qonuniy kirish mumkin bo‘lgan hisoblar bilan alohida protokolga ega bo‘ladi.
