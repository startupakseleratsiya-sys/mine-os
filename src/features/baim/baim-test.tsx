"use client";
import { useEffect, useMemo, useState } from "react";

type Q = { t: string; o: Record<string, string>; c: string };
type Lang = "ru" | "uz";
type Mode = "study" | "practice" | "exam";

const EXAM_COUNT = 60;
const EXAM_MIN = 180;

function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

export function BaimTest() {
  const [lang, setLang] = useState<Lang>("ru");
  const [all, setAll] = useState<Q[]>([]);
  const [loadedLang, setLoadedLang] = useState<Lang | null>(null);
  const [mode, setMode] = useState<Mode>("study");
  const [search, setSearch] = useState("");
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<Record<number, string>>({});
  const [examSet, setExamSet] = useState<number[]>([]);
  const [examDone, setExamDone] = useState(false);
  const [left, setLeft] = useState(EXAM_MIN * 60);

  const loading = loadedLang !== lang;

  useEffect(() => {
    let cancelled = false;
    fetch(`/baim/${lang}.json`)
      .then((r) => r.json())
      .then((d: Q[]) => {
        if (cancelled) return;
        setAll(d);
        setLoadedLang(lang);
        setIdx(0);
        setChosen({});
        setExamDone(false);
        setExamSet([]);
        setSearch("");
      });
    return () => {
      cancelled = true;
    };
  }, [lang]);

  const list = useMemo(() => {
    if (mode === "exam") return examSet;
    const f = search.trim().toLowerCase();
    const base = all.map((_, i) => i);
    if (!f) return base;
    return base.filter(
      (i) =>
        all[i].t.toLowerCase().includes(f) ||
        Object.values(all[i].o).some((v) => v.toLowerCase().includes(f)),
    );
  }, [mode, examSet, search, all]);

  useEffect(() => {
    if (mode !== "exam" || examDone || examSet.length === 0) return;
    const t = setTimeout(() => {
      if (left <= 1) setExamDone(true);
      else setLeft(left - 1);
    }, 1000);
    return () => clearTimeout(t);
  }, [mode, examDone, examSet, left]);

  function startExam() {
    setExamSet(shuffle(all.map((_, i) => i)).slice(0, Math.min(EXAM_COUNT, all.length)));
    setChosen({});
    setIdx(0);
    setExamDone(false);
    setLeft(EXAM_MIN * 60);
    setMode("exam");
  }

  function toMode(m: "study" | "practice") {
    setMode(m);
    setIdx(0);
    setChosen({});
    setExamDone(false);
    setExamSet([]);
  }

  if (loading) return <p className="py-16 text-center text-[#65736d]">Yuklanmoqda…</p>;

  const correctCount = Object.keys(chosen).filter((k) => chosen[+k] === all[+k].c).length;
  const answeredCount = Object.keys(chosen).length;

  if (mode === "exam" && examDone) {
    const ok = examSet.filter((qi) => chosen[qi] === all[qi].c).length;
    const pct = examSet.length ? Math.round((ok / examSet.length) * 100) : 0;
    const pass = pct >= 75;
    return (
      <div className="rounded-3xl border border-[#13251f]/10 bg-white p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#527264]">Imtihon yakunlandi</p>
        <p className={`mt-4 text-5xl font-bold ${pass ? "text-[#2e7d32]" : "text-[#c62828]"}`}>{pct}%</p>
        <p className="mt-2 text-lg">
          {ok} / {examSet.length} to&rsquo;g&rsquo;ri
        </p>
        <p className={`mt-1 font-medium ${pass ? "text-[#2e7d32]" : "text-[#c62828]"}`}>
          {pass ? "O&rsquo;tdingiz (75%+)" : "O&rsquo;tmadingiz (75% kerak)"}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              setExamDone(false);
              setMode("exam");
              setIdx(0);
            }}
            className="rounded-xl border border-[#163e32] px-4 py-2 text-sm font-medium text-[#163e32]"
          >
            Javoblarni ko&rsquo;rish
          </button>
          <button onClick={startExam} className="rounded-xl bg-[#163e32] px-4 py-2 text-sm font-medium text-white">
            Yangi imtihon
          </button>
          <button onClick={() => toMode("study")} className="rounded-xl border border-[#163e32]/30 px-4 py-2 text-sm font-medium text-[#163e32]">
            O&rsquo;rganishga qaytish
          </button>
        </div>
      </div>
    );
  }

  if (list.length === 0)
    return <div className="rounded-3xl border border-[#13251f]/10 bg-white p-8 text-center text-[#65736d]">Savol topilmadi.</div>;

  const qi = list[Math.min(idx, list.length - 1)];
  const q = all[qi];
  const reveal = mode === "study";
  const picked = chosen[qi];
  const locked = reveal || picked !== undefined;
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-xl border border-[#13251f]/10 bg-white p-1">
          {(["ru", "uz"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${lang === l ? "bg-[#163e32] text-white" : "text-[#65736d]"}`}
            >
              {l === "ru" ? "Ruscha" : "O‘zbekcha"}
            </button>
          ))}
        </div>
        <div className="inline-flex rounded-xl border border-[#13251f]/10 bg-white p-1">
          <button
            onClick={() => toMode("study")}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${mode === "study" ? "bg-[#163e32] text-white" : "text-[#65736d]"}`}
          >
            O&rsquo;rganish
          </button>
          <button
            onClick={() => toMode("practice")}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${mode === "practice" ? "bg-[#163e32] text-white" : "text-[#65736d]"}`}
          >
            Mashq
          </button>
          <button
            onClick={startExam}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${mode === "exam" ? "bg-[#ef6c00] text-white" : "text-[#65736d]"}`}
          >
            Imtihon
          </button>
        </div>
        {mode !== "exam" && (
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setIdx(0);
            }}
            placeholder="Qidirish…"
            className="min-w-[140px] flex-1 rounded-xl border border-[#13251f]/10 bg-white px-3 py-2 text-sm"
          />
        )}
        {mode === "exam" && (
          <span className="ml-auto rounded-xl bg-[#fff3e0] px-3 py-2 text-sm font-semibold text-[#ef6c00]">
            {mm}:{ss}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-[#65736d]">
        <span>
          {idx + 1} / {list.length}
        </span>
        {mode === "study" ? (
          <span className="text-[#2e7d32]">To&rsquo;g&rsquo;ri javob yashil rangda &mdash; o&rsquo;qib yodlang</span>
        ) : (
          <>
            <span>
              To&rsquo;g&rsquo;ri: <b className="text-[#2e7d32]">{correctCount}</b>
            </span>
            <span>
              Belgilangan: <b>{answeredCount}</b>
            </span>
            {answeredCount > 0 && <span>{Math.round((correctCount / answeredCount) * 100)}%</span>}
          </>
        )}
      </div>

      <div className="rounded-3xl border border-[#13251f]/10 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ef6c00]">Savol {qi + 1}</p>
        <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed">{q.t}</p>
        <div className="mt-4 space-y-2">
          {Object.entries(q.o).map(([L, txt]) => {
            let cls = "border-[#13251f]/10 bg-white hover:border-[#163e32]";
            if (locked) {
              if (L === q.c) cls = "border-[#2e7d32] bg-[#e8f5e9]";
              else if (picked === L) cls = "border-[#c62828] bg-[#ffebee]";
              else cls = "border-[#13251f]/10 bg-white opacity-70";
            }
            return (
              <button
                key={L}
                disabled={locked}
                onClick={() => setChosen((c) => ({ ...c, [qi]: L }))}
                className={`flex w-full items-start gap-3 rounded-xl border-[1.5px] px-4 py-3 text-left text-[15px] leading-snug transition ${cls}`}
              >
                <span className="min-w-6 font-bold text-[#163e32]">{L})</span>
                <span>{txt}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          disabled={idx === 0}
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
          className="flex-1 rounded-xl bg-[#163e32] py-3 text-white disabled:opacity-40"
        >
          &larr; Oldingi
        </button>
        {mode === "exam" && (
          <button onClick={() => setExamDone(true)} className="rounded-xl bg-[#ef6c00] px-4 py-3 font-medium text-white">
            Yakunlash
          </button>
        )}
        <button
          disabled={idx >= list.length - 1}
          onClick={() => setIdx((i) => Math.min(list.length - 1, i + 1))}
          className="flex-1 rounded-xl bg-[#163e32] py-3 text-white disabled:opacity-40"
        >
          Keyingi &rarr;
        </button>
      </div>
    </div>
  );
}
