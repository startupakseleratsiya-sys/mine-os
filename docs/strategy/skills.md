# Finora uchun skilllar registri

8 ta qo‘shimcha skill o‘rnatilgan. Ular loyiha paketining runtime qismi emas, Codex ish jarayoniga yordam beruvchi ko‘rsatmalardir. Joylashuvi `C:/Users/user/.codex/skills/`; yangi sessiyada skilllar ro‘yxatida paydo bo‘lishi uchun Codexni qayta ochish kerak bo‘lishi mumkin.

| O‘rnatilgan papka | Manba | Qachon foydali |
|---|---|---|
| `security-best-practices` | OpenAI / skills | API, auth, maxfiy ma’lumot va kod xavfsizlik ko‘rigi |
| `security-threat-model` | OpenAI / skills | Ishonch chegaralari, AI/PDF injection, chat egaligi va xavf modeli |
| `react-best-practices` | Vercel Labs / agent-skills | React/Next render, ma’lumot yuklash va bundle samaradorligi; ichki nomi `vercel-react-best-practices` |
| `web-design-guidelines` | Vercel Labs / agent-skills | Web interfeys va accessibility ko‘rigi |
| `frontend-design` | Anthropic / skills | Aniq, o‘ziga xos va ishlaydigan mashq interfeysini ishlab chiqish |
| `cro` | Corey Haines / marketingskills | Demo→aktivatsiya oqimini dalil asosida yaxshilash |
| `pricing` | Corey Haines / marketingskills | Narx taxminlari va paketlarni sinash |
| `product-marketing` | Corey Haines / marketingskills | Auditoriya, pozitsiyalash va bozorga chiqish konteksti |

Har birining repository, aniq commit, manba papkasi, lokal joylashuvi, fayl soni va SKILL.md SHA256 qiymati [skills-lock.json](evidence/skills-lock.json)da qayd etilgan. Manba nusxalari o‘rnatish oldidan ko‘rib chiqilgan; marketing repozitoriysi uchinchi tomon manbasi, rasmiy xavfsizlik kafolati emas. Tanlangan paketlar ichidagi ko‘rsatma va misollar avtomatik bajarilmagan. Yangilash `latest`ga ko‘r-ko‘rona almashtirish bilan emas, diff ko‘rigi va yangi commit qaydi bilan bajariladi.

Mavjud imkoniyatlar ham yetarli: `deep-research` dalilli tadqiqot uchun, `pdf` materialni o‘qish uchun, browser skill interaktiv tekshiruv uchun, `openai-docs` tegishli API hujjati uchun. Loyihadagi `supabase` va `supabase-postgres-best-practices` bazaga tegadigan ishda ishlatiladi. Har bir vazifada barcha skillni yuklash kerak emas; Next.js bo‘yicha mahalliy AGENTS va o‘rnatilgan versiya hujjatlari umumiy tavsiyadan ustun.

Bu o‘rnatish hisob, dizayn yoki xavfsizlik muammolari avtomatik tuzalganini bildirmaydi. Skill ishlatilgan PRda aynan qanday natija o‘zgargani va qanday tekshiruv o‘tgani ko‘rsatiladi. Plugin ulash, tashqi xizmatga ma’lumot yuborish yoki jamoaga xabar jo‘natish bu o‘rnatish tarkibiga kirmagan.

Yangi pedagogika skillini hozir yozish o‘rniga [TZ](technical-spec.md)dagi ssenariy shabloni bir necha haqiqiy darsda sinaladi. So‘ng tasdiqlangan jarayon qayta ishlatiladigan skillga aylantiriladi. Bu tajribadan o‘tmagan o‘qitish qoidalarini erta qotirib qo‘ymaslikka yordam beradi.
