"use client";
import { useCallback, useEffect, useMemo, useState } from "react";

type Q = { t: string; o: Record<string, string>; c: string };
type Lang = "ru" | "uz";
type Mode = "study" | "practice" | "exam";

const EXAM_COUNT = 60;
const EXAM_MIN = 180;
const PASS_PCT = 75;

/** Imtihon holati: savollar to'plami, javoblar va tugash vaqti (sahifa yangilansa ham davom etadi). */
type ExamState = { set: number[]; chosen: Record<number, string>; endsAt: number; done: boolean };

const storeKey = (lang: Lang, what: "practice" | "exam" | "pos") => `finora:baim:${lang}:${what}`;

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage to'la yoki yopiq — mashq baribir ishlaydi, faqat saqlanmaydi.
  }
}

function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

const tab = (on: boolean, accent = "bg-[#163e32]") =>
  `min-h-10 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${on ? `${accent} text-white` : "text-[#65736d] hover:text-[#13251f]"}`;

export function BaimTest() {
  const [lang, setLang] = useState<Lang>("ru");
  const [all, setAll] = useState<Q[]>([]);
  const [loadedLang, setLoadedLang] = useState<Lang | null>(null);
  const [failed, setFailed] = useState(false);
  const [reload, setReload] = useState(0);
  const [mode, setMode] = useState<Mode>("study");
  const [search, setSearch] = useState("");
  const [onlyWrong, setOnlyWrong] = useState(false);
  const [idx, setIdx] = useState(0);
  const [practice, setPractice] = useState<Record<number, string>>({});
  const [exam, setExam] = useState<ExamState | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const loading = loadedLang !== lang;

  useEffect(() => {
    let cancelled = false;
    fetch(`/baim/${lang}.json`)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then((d: Q[]) => {
        if (cancelled) return;
        setAll(d);
        setLoadedLang(lang);
        setFailed(false);
        // Saqlangan mashq javoblari va tugallanmagan imtihon tiklanadi.
        setPractice(load(storeKey(lang, "practice"), {}));
        const ex = load<ExamState | null>(storeKey(lang, "exam"), null);
        const valid = ex && Array.isArray(ex.set) && ex.set.every((i) => i < d.length) ? ex : null;
        setExam(valid);
        setReviewing(false);
        setMode(valid && !valid.done ? "exam" : "study");
        setIdx(valid && !valid.done ? 0 : Math.min(load(storeKey(lang, "pos"), 0), d.length - 1));
        setSearch("");
        setOnlyWrong(false);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [lang, reload]);

  const examActive = mode === "exam" && exam !== null && !exam.done;
  const left = examActive ? Math.max(0, Math.round((exam.endsAt - now) / 1000)) : 0;

  // Vaqt Date.now() bo'yicha — fon tabda taymer sekinlashsa ham to'g'ri qoladi.

  const updateExam = useCallback(
    (next: ExamState | null) => {
      setExam(next);
      save(storeKey(lang, "exam"), next);
    },
    [lang],
  );

  // Vaqt tugasa imtihon avtomatik yakunlanadi.
  useEffect(() => {
    if (!examActive) return;
    const t = setInterval(() => {
      const ts = Date.now();
      setNow(ts);
      if (ts >= exam.endsAt) {
        const done = { ...exam, done: true };
        setExam(done);
        save(storeKey(lang, "exam"), done);
      }
    }, 1000);
    return () => clearInterval(t);
  }, [examActive, exam, lang]);

  const list = useMemo(() => {
    if (mode === "exam") return exam?.set ?? [];
    let base = all.map((_, i) => i);
    if (mode === "practice" && onlyWrong) base = base.filter((i) => practice[i] !== undefined && practice[i] !== all[i].c);
    const f = search.trim().toLowerCase();
    if (!f) return base;
    return base.filter((i) => all[i].t.toLowerCase().includes(f) || Object.values(all[i].o).some((v) => v.toLowerCase().includes(f)));
  }, [mode, exam, search, all, onlyWrong, practice]);

  const pos = Math.min(idx, Math.max(0, list.length - 1));

  const go = useCallback(
    (i: number) => {
      const n = Math.max(0, Math.min(list.length - 1, i));
      setIdx(n);
      if (mode !== "exam" && !search && !onlyWrong) save(storeKey(lang, "pos"), n);
    },
    [list.length, mode, search, onlyWrong, lang],
  );

  function startExam() {
    if (exam && !exam.done && !confirm("Tugallanmagan imtihon bor. Yangisini boshlaysizmi?")) return;
    updateExam({ set: shuffle(all.map((_, i) => i)).slice(0, Math.min(EXAM_COUNT, all.length)), chosen: {}, endsAt: Date.now() + EXAM_MIN * 60_000, done: false });
    setNow(Date.now());
    setReviewing(false);
    setIdx(0);
    setMode("exam");
  }

  function toMode(m: Mode) {
    if (m === "exam") {
      if (exam && !exam.done) {
        setMode("exam");
        setIdx(0);
      } else startExam();
      return;
    }
    setMode(m);
    setReviewing(false);
    setIdx(m === "study" ? Math.min(load(storeKey(lang, "pos"), 0), Math.max(0, all.length - 1)) : 0);
  }

  function finishExam() {
    if (!exam) return;
    const unanswered = exam.set.length - Object.keys(exam.chosen).length;
    if (unanswered > 0 && !confirm(`${unanswered} ta savolga javob berilmagan. Imtihonni yakunlaysizmi?`)) return;
    updateExam({ ...exam, done: true });
  }

  function choose(qi: number, letter: string) {
    if (mode === "exam") {
      if (!exam || exam.done) return;
      updateExam({ ...exam, chosen: { ...exam.chosen, [qi]: letter } });
    } else if (mode === "practice") {
      const next = { ...practice, [qi]: letter };
      setPractice(next);
      save(storeKey(lang, "practice"), next);
    }
  }

  function resetPractice() {
    if (!confirm("Mashq natijalari tozalansinmi?")) return;
    setPractice({});
    save(storeKey(lang, "practice"), null);
    setOnlyWrong(false);
    setIdx(0);
  }

  const qi = list[pos];
  const q = qi === undefined ? undefined : all[qi];

  // Klaviatura: ← → savollar, 1–4 javob variantlari.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) return;
      if (e.key === "ArrowRight") go(pos + 1);
      else if (e.key === "ArrowLeft") go(pos - 1);
      else if (q && qi !== undefined && /^[1-4]$/.test(e.key)) {
        const letter = Object.keys(q.o)[Number(e.key) - 1];
        const locked = mode === "study" || (mode === "practice" && practice[qi] !== undefined) || (mode === "exam" && (!exam || exam.done));
        if (letter && !locked) choose(qi, letter);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (failed)
    return (
      <div className="rounded-3xl border border-[#13251f]/10 bg-white p-8 text-center">
        <p className="text-[#65736d]">Savollar bazasini yuklab bo&rsquo;lmadi. Internet aloqasini tekshiring.</p>
        <button onClick={() => setReload((n) => n + 1)} className="mt-4 rounded-xl bg-[#163e32] px-4 py-2 text-sm font-medium text-white">
          Qayta urinish
        </button>
      </div>
    );

  if (loading) return <p className="py-16 text-center text-[#65736d]">Yuklanmoqda…</p>;

  const header = (
    <div className="flex flex-wrap items-center gap-2">
      <div className="inline-flex rounded-xl border border-[#13251f]/10 bg-white p-1" role="group" aria-label="Til">
        {(["ru", "uz"] as Lang[]).map((l) => (
          <button key={l} onClick={() => setLang(l)} disabled={examActive && lang !== l} title={examActive ? "Imtihon vaqtida tilni almashtirib bo‘lmaydi" : undefined} className={`${tab(lang === l)} disabled:opacity-40`} aria-pressed={lang === l}>
            {l === "ru" ? "Ruscha" : "O‘zbekcha"}
          </button>
        ))}
      </div>
      <div className="inline-flex rounded-xl border border-[#13251f]/10 bg-white p-1" role="group" aria-label="Rejim">
        <button onClick={() => toMode("study")} className={tab(mode === "study")} aria-pressed={mode === "study"}>
          O&rsquo;rganish
        </button>
        <button onClick={() => toMode("practice")} className={tab(mode === "practice")} aria-pressed={mode === "practice"}>
          Mashq
        </button>
        <button onClick={() => toMode("exam")} className={tab(mode === "exam", "bg-[#ef6c00]")} aria-pressed={mode === "exam"}>
          Imtihon
        </button>
      </div>
      {mode !== "exam" && (
        <input
          type="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIdx(0);
          }}
          placeholder="Savol yoki javob bo‘yicha qidirish…"
          aria-label="Qidirish"
          className="min-h-11 min-w-[160px] flex-1 rounded-xl border border-[#13251f]/10 bg-white px-3 py-2 text-base sm:text-sm"
        />
      )}
      {examActive && (
        <span className={`ml-auto rounded-xl px-3 py-2 text-sm font-semibold tabular-nums ${left < 600 ? "bg-red-50 text-red-700" : "bg-[#fff3e0] text-[#ef6c00]"}`} aria-live="off">
          ⏱ {String(Math.floor(left / 3600))}:{String(Math.floor((left % 3600) / 60)).padStart(2, "0")}:{String(left % 60).padStart(2, "0")}
        </span>
      )}
    </div>
  );

  if (mode === "exam" && exam?.done && !reviewing) {
    const ok = exam.set.filter((i) => exam.chosen[i] === all[i].c).length;
    const answered = Object.keys(exam.chosen).length;
    const pct = exam.set.length ? Math.round((ok / exam.set.length) * 100) : 0;
    const pass = pct >= PASS_PCT;
    return (
      <div className="space-y-4">
        {header}
        <div className="rounded-3xl border border-[#13251f]/10 bg-white p-6 text-center sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#527264]">Imtihon yakunlandi</p>
          <p className={`mt-4 text-5xl font-bold ${pass ? "text-[#2e7d32]" : "text-[#c62828]"}`}>{pct}%</p>
          <p className="mt-2 text-lg">
            {ok} / {exam.set.length} to&rsquo;g&rsquo;ri · {answered} ta javob berilgan
          </p>
          <p className={`mt-1 font-medium ${pass ? "text-[#2e7d32]" : "text-[#c62828]"}`}>
            {pass ? `O‘tdingiz (${PASS_PCT}%+)` : `O‘tmadingiz (${PASS_PCT}% kerak)`}
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
            <button
              onClick={() => {
                setReviewing(true);
                setIdx(0);
              }}
              className="min-h-11 rounded-xl border border-[#163e32] px-4 py-2 text-sm font-medium text-[#163e32]"
            >
              Javoblarni ko&rsquo;rish
            </button>
            <button onClick={startExam} className="min-h-11 rounded-xl bg-[#163e32] px-4 py-2 text-sm font-medium text-white">
              Yangi imtihon
            </button>
            <button onClick={() => toMode("study")} className="min-h-11 rounded-xl border border-[#163e32]/30 px-4 py-2 text-sm font-medium text-[#163e32]">
              O&rsquo;rganishga qaytish
            </button>
          </div>
        </div>
      </div>
    );
  }

  const practiceDone = Object.keys(practice).length;
  const practiceOk = Object.keys(practice).filter((k) => practice[+k] === all[+k]?.c).length;
  const examChosen = exam?.chosen ?? {};
  const picked = qi === undefined ? undefined : mode === "exam" ? examChosen[qi] : practice[qi];
  // Imtihonda to'g'ri javob faqat yakunlangandan keyin (ko'rib chiqish) ochiladi.
  const reveal = mode === "study" || (mode === "practice" && picked !== undefined) || (mode === "exam" && reviewing);
  const locked = mode === "study" || (mode === "practice" && picked !== undefined) || (mode === "exam" && (!exam || exam.done));

  return (
    <div className="space-y-4">
      {header}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#65736d]">
        {mode === "study" && <span className="text-[#2e7d32]">To&rsquo;g&rsquo;ri javob yashil rangda &mdash; o&rsquo;qib yodlang</span>}
        {mode === "practice" && (
          <>
            <span>
              Belgilangan: <b className="text-[#13251f]">{practiceDone}</b> / {all.length}
            </span>
            <span>
              To&rsquo;g&rsquo;ri: <b className="text-[#2e7d32]">{practiceOk}</b>
              {practiceDone > 0 && ` (${Math.round((practiceOk / practiceDone) * 100)}%)`}
            </span>
            <label className="inline-flex min-h-10 cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={onlyWrong}
                onChange={(e) => {
                  setOnlyWrong(e.target.checked);
                  setIdx(0);
                }}
                className="size-4 accent-[#163e32]"
              />
              Faqat xatolar ({practiceDone - practiceOk})
            </label>
            {practiceDone > 0 && (
              <button onClick={resetPractice} className="min-h-10 text-[#c62828] underline-offset-2 hover:underline">
                Tozalash
              </button>
            )}
          </>
        )}
        {mode === "exam" && exam && (
          <span>
            {reviewing ? "Ko‘rib chiqish: yashil — to‘g‘ri javob, qizil — sizning xato javobingiz" : `Javob berilgan: ${Object.keys(examChosen).length} / ${exam.set.length} · o‘tish chegarasi ${PASS_PCT}%`}
          </span>
        )}
      </div>

      {mode === "exam" && exam && (
        <nav aria-label="Savollar" className="flex flex-wrap gap-1.5">
          {exam.set.map((i, n) => {
            const ans = examChosen[i];
            const tone = reviewing
              ? ans === all[i].c
                ? "border-[#2e7d32] bg-[#e8f5e9] text-[#1b5e20]"
                : "border-[#c62828] bg-[#ffebee] text-[#b71c1c]"
              : ans !== undefined
                ? "border-[#163e32] bg-[#163e32] text-white"
                : "border-[#13251f]/15 bg-white text-[#65736d]";
            return (
              <button key={i} onClick={() => go(n)} aria-current={n === pos ? "true" : undefined} className={`grid size-9 place-items-center rounded-lg border text-xs font-semibold ${tone} ${n === pos ? "ring-2 ring-[#ef6c00] ring-offset-1" : ""}`}>
                {n + 1}
              </button>
            );
          })}
        </nav>
      )}

      {q === undefined || qi === undefined ? (
        <div className="rounded-3xl border border-[#13251f]/10 bg-white p-8 text-center text-[#65736d]">{onlyWrong ? "Xato javoblar yo‘q — zo‘r!" : "Savol topilmadi."}</div>
      ) : (
        <div className="rounded-3xl border border-[#13251f]/10 bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.2em]">
            <span className="text-[#ef6c00]">{mode === "exam" ? `Savol ${pos + 1} / ${list.length}` : `Savol №${qi + 1}`}</span>
            {mode !== "exam" && (
              <span className="text-[#65736d]">
                {pos + 1} / {list.length}
              </span>
            )}
          </div>
          <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed sm:text-base">{q.t}</p>
          <div className="mt-4 space-y-2">
            {Object.entries(q.o).map(([L, txt]) => {
              let cls = "border-[#13251f]/10 bg-white hover:border-[#163e32]";
              if (reveal) {
                if (L === q.c) cls = "border-[#2e7d32] bg-[#e8f5e9]";
                else if (picked === L) cls = "border-[#c62828] bg-[#ffebee]";
                else cls = "border-[#13251f]/10 bg-white opacity-70";
              } else if (picked === L) cls = "border-[#163e32] bg-[#e7ece6]";
              return (
                <button
                  key={L}
                  disabled={locked}
                  onClick={() => choose(qi, L)}
                  aria-pressed={picked === L}
                  className={`flex w-full items-start gap-3 rounded-xl border-[1.5px] px-4 py-3 text-left text-[15px] leading-snug transition disabled:cursor-default ${cls}`}
                >
                  <span className="min-w-6 font-bold text-[#163e32]">{L})</span>
                  <span>{txt}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="sticky bottom-0 -mx-4 flex gap-2 border-t border-[#13251f]/10 bg-[#f3f1eb]/95 px-4 py-3 sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
        <button disabled={pos === 0} onClick={() => go(pos - 1)} className="min-h-12 flex-1 rounded-xl bg-[#163e32] py-3 text-white disabled:opacity-40">
          &larr; Oldingi
        </button>
        {examActive && (
          <button onClick={finishExam} className="min-h-12 rounded-xl bg-[#ef6c00] px-4 py-3 font-medium text-white">
            Yakunlash
          </button>
        )}
        {mode === "exam" && reviewing && (
          <button onClick={() => setReviewing(false)} className="min-h-12 rounded-xl border border-[#163e32] px-4 py-3 font-medium text-[#163e32]">
            Natija
          </button>
        )}
        <button disabled={pos >= list.length - 1} onClick={() => go(pos + 1)} className="min-h-12 flex-1 rounded-xl bg-[#163e32] py-3 text-white disabled:opacity-40">
          Keyingi &rarr;
        </button>
      </div>
    </div>
  );
}
