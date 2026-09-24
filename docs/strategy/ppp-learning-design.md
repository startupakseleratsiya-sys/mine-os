# PPP darsliklarini kengaytirish — 2026-09-14

Foydalanuvchining ustuvorligi: yuklangan PPP materiallaridan mazmunli o‘zbekcha darsliklar va interaktiv o‘quv tajribasi. Avvalgi shaxsiy moliya pilotiga ustuvorlik berish qarori ushbu ishning yo‘nalishini belgilamaydi.

Manba: loyihadagi 8 bob, glossary, acronym list va sample questions — 11 PDF, jami 984 bet. Matnlar pypdf orqali lokal ajratilib, tegishli bo‘limlar o‘qildi. Yangi darslar mustaqil moslashtirish; yangi vaziyat va savollar Finora tomonidan tuziladi, asl imtihon savollari ko‘chirilmaydi. Eski dars IDlari saqlanadi.

O‘quv tuzilishi: 8 modulning har birida kirish va ikki chuqurlashtiruvchi dars; so‘ng lug‘at, qisqartmalar va yakuniy mashq. O‘quv maqsadi → tushuntirish → vizual ketma-ketlik → tanlov va izoh → tekshiruv → manba.

Ko‘rinish: oq o‘qish varag‘i #FFFFFF, fon #F3F6F5, asosiy matn #183C34, ikkilamchi matn #52665E, manba aksenti #D9E8E2, mashq aksenti #F2CB78. Geist navigatsiya va sarlavhada, Georgia uzun dars matnida. Chapga tekislangan 65–75 belgili o‘qish ustuni.

```text
Kurs: loyiha hayot davri → 8 bob → mavzuli darslar
O‘qish: [mundarija] [maqsad · dars · keys · test] [PDF yoki AI]
Telefon: [mundarijani ochish] [dars] [manbani ochish]
```

Dizayn tekshiruvi: oddiy bir xil kurs kartalari o‘rniga mavzu va darslar iyerarxiyasi; bezakli statistika o‘rniga haqiqiy bob/dars/manba sonlari. Muhim vizual — PPP loyiha hayot davri. Manbalar kursda takrorlanmasdan bitta kutubxonada ko‘rinadi.

Metodik namunalar: [Brilliant](https://brilliant.org/) — bosqichli interaktiv masalalar; [Khanmigo](https://www.khanmigo.ai/) — yo‘naltiruvchi yordam. Shu tamoyillar Finora keyslari va ochiladigan maslahatga moslashtiriladi. Adaptiv AI yoki rasmiy CP3P akkreditatsiyasi amalga oshirilgan deb ko‘rsatilmaydi.

## 2026-09-15: o‘qish oqimi yakunlandi

27 PPP darsi, 16 amaliy keys va 45 test savoli o‘qish sahifasiga ulandi. Jami katalog: 4 kurs, 38 dars. Sakkiz asosiy modulda uchtadan dars; oxirgi modulda lug‘at, qisqartmalar va yakuniy mashq bor. Avvalgi dars manzillari saqlandi.

- Kompyuterda yon mundarija, telefonda ochiladigan mundarija; faol dars va tugatilgan dars belgisi.
- Yangi darslarda maqsadlar, atamalar, mavjud bosqich sxemalari, maslahat va tanlangan qarorga izoh.
- Asl PDF darsga tegishli betdan panelda yoki yangi oynada ochiladi.
- AI chat talab qilinganda yuklanadi; bir dars ichida panelni yopish yoki PDFga o‘tishda chat komponenti saqlanadi.
- Mehmon dars va mashqlarni ishlatadi; natijani saqlash yoki AI uchun kirish havolasi ayni darsga qaytish manzilini olib boradi.
- Kontent tekshiruvi modul tartibi, dars IDlari, manba fayllari/betlari, keys va quiz javoblarini tekshiradi; CIga ulandi.

Tekshiruvlar: `npm run build`, `npx tsc --noEmit`, `npx eslint src scripts/check-course-content.mjs`, `npm test` (10/10), `npm run check:content`. Chromiumda 1440px va 390px ko‘rinishlar: qidirish/tozalash, noto‘g‘ri va to‘g‘ri keys javobi, maslahat, qayta urinish, quiz natijasi, PDF beti, Escape/fokus qaytishi, mehmon kirish havolasi, keyingi darsda mashq holatini yangilash, mobil mundarija, eski shaxsiy budjet darsi va 404 tekshirildi. Lokal brauzer skripti va rasmlar `.tmp/check-ppp-ui.cjs`, `.tmp/ppp-*.png` ichida.

Chegaralar: tizimga kirgan foydalanuvchining live progress saqlashi va haqiqiy AI javobi bu tekshiruvda bajarilmadi. Keys va quiz urinishlari hozircha faqat sahifa ichida; serverga saqlanmaydi. PDF nashri/tarqatish huquqi bo‘yicha oldingi audit bandlari ochiq. Productionga deploy bajarilmadi.
