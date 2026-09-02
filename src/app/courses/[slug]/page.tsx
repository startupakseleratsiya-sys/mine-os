import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Award,
  ListChecks,
} from "lucide-react";

const COURSES_DATA: Record<string, any> = {
  "shaxsiy-budjet": {
    title: "Shaxsiy budjet: Moliyaviy barqarorlik asoslari",
    description:
      "Daromad va xarajatlarni to'g'ri rejalashtirish, qarz va kreditlardan qutulish, 50/30/20 qoidasi kabi xalqaro standartlarni kundalik hayotga tadbiq etish.",
    level: "Boshlang'ich",
    lessons: 8,
    time: "1 soat 40 daqiqa",
    outcomes: [
      "Budjet tuzish va uni qat'iy nazorat qilish usullari",
      "50/30/20 qoidasini amalda qo'llash",
      "Kutilmagan xarajatlar uchun moliyaviy yostiqcha yaratish",
      "Kredit va qarzlardan samarali qutulish strategiyalari",
    ],
    modules: [
      { id: "mod-1", title: "1-Bob: Moliyaviy rejalashtirishga kirish", duration: "15 daq" },
      { id: "mod-2", title: "2-Bob: 50/30/20 qoidasi nima?", duration: "20 daq" },
      { id: "mod-3", title: "3-Bob: Xarajatlarni audit qilish", duration: "15 daq" },
      { id: "mod-4", title: "4-Bob: Favqulodda vaziyatlar fondi (Emergency fund)", duration: "25 daq" },
    ],
  },
  "jamgarma-tizimi": {
    title: "Jamg'arma tizimi: Pullarni ko'paytirish",
    description:
      "Maqsadga muvofiq jamg'arma strategiyasi, inflyatsiyadan himoyalanish va pullarni avtomatik tarzda to'plash tizimlarini o'rganing.",
    level: "Boshlang'ich",
    lessons: 6,
    time: "1 soat 15 daqiqa",
    outcomes: [
      "O'ziga xos jamg'arma maqsadlarini belgilash (SMART)",
      "Inflyatsiya ta'sirini tushunish",
      "Pullarni avtomatlashtirilgan tarzda yig'ish",
    ],
    modules: [
      { id: "mod-1", title: "1-Bob: Nega jamg'arish kerak?", duration: "10 daq" },
      { id: "mod-2", title: "2-Bob: Inflyatsiya va pulning qadri", duration: "15 daq" },
      { id: "mod-3", title: "3-Bob: SMART maqsadlar", duration: "20 daq" },
    ],
  },
  "investitsiya-asoslari": {
    title: "Investitsiya asoslari: Kelajak poydevori",
    description:
      "Aksiyalar, obligatsiyalar, indeks fondlari va portfel diversifikatsiyasi haqida amaliy hamda nazariy tushunchalar (Sertifikatli dastur).",
    level: "O'rta",
    lessons: 10,
    time: "2 soat 20 daqiqa",
    outcomes: [
      "Fond bozori qanday ishlashini tushunish",
      "Aksiya, obligatsiya va ETF'lar farqi",
      "Tavakkalchilikni boshqarish va diversifikatsiya",
      "Uzoq muddatli portfel yaratish",
    ],
    modules: [
      { id: "mod-1", title: "1-Bob: Sakkizinchi mo'jiza - Murakkab foiz", duration: "20 daq" },
      { id: "mod-2", title: "2-Bob: Aksiyalar bozori nima?", duration: "25 daq" },
      { id: "mod-3", title: "3-Bob: Obligatsiyalar va davlat qimmatli qog'ozlari", duration: "20 daq" },
      { id: "mod-4", title: "4-Bob: Diversifikatsiya va risklarni kamaytirish", duration: "30 daq" },
    ],
  },
};

export default function CourseDetailsPage({ params }: { params: { slug: string } }) {
  const course = COURSES_DATA[params.slug];

  if (!course) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#F5F4EE] text-[#13251F]">
      {/* Header */}
      <div className="bg-white border-b border-[#E2E4DF] pb-10 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#6B7A74] hover:text-[#163e32] transition-colors mb-6"
          >
            <ArrowLeft className="size-4" /> Barcha kurslar
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700">
              {course.level}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-[#6B7A74] font-medium">
              <BookOpen className="size-4" /> {course.lessons} dars
            </span>
            <span className="flex items-center gap-1.5 text-sm text-[#6B7A74] font-medium">
              <Clock3 className="size-4" /> {course.time}
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0f2017] mb-4">
            {course.title}
          </h1>
          <p className="text-[#65736d] text-lg leading-relaxed max-w-2xl mb-8">
            {course.description}
          </p>

          <Link
            href={`/study/${params.slug}/${course.modules[0].id}`}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#163e32] text-white font-bold rounded-2xl shadow-lg shadow-[#163e32]/15 hover:bg-[#0e3026] transition-all hover:-translate-y-0.5"
          >
            Kursni boshlash
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 grid md:grid-cols-3 gap-10">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-12">
          {/* Syllabus */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <ListChecks className="size-6 text-[#163e32]" />
              <h2 className="text-2xl font-bold text-[#0f2017]">O'quv dasturi (Syllabus)</h2>
            </div>
            <div className="bg-white rounded-3xl border border-[#E2E4DF] overflow-hidden">
              {course.modules.map((mod: any, index: number) => (
                <div
                  key={mod.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 hover:bg-[#F5F4EE] transition-colors ${
                    index !== course.modules.length - 1 ? "border-b border-[#E2E4DF]" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#dce7dd] text-sm font-bold text-[#285744]">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-[#0f2017]">{mod.title}</h3>
                      <p className="text-xs text-[#6B7A74] mt-1">{mod.duration}</p>
                    </div>
                  </div>
                  <Link
                    href={`/study/${params.slug}/${mod.id}`}
                    className="text-sm font-bold text-[#163e32] hover:underline"
                  >
                    O'qish →
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-white rounded-3xl border border-[#E2E4DF] p-6 shadow-sm">
            <h3 className="font-bold text-[#0f2017] mb-4 flex items-center gap-2">
              <Award className="size-5 text-amber-500" /> Nimalarni o'rganasiz?
            </h3>
            <ul className="space-y-3">
              {course.outcomes.map((outcome: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-[#65736d] leading-relaxed">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
