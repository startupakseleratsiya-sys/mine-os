"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Clock3, FileText, Flag, XCircle } from "lucide-react";
import { saveScenarioAttempt } from "@/app/actions/exam";
import {
  LETTERS,
  TYPE_LABEL,
  TYPE_TIP,
  flattenLines,
  indexesOf,
  isAnswered,
  isLineCorrect,
  maskOf,
  scenarioPassed,
  scorePaper,
  type Response,
  type ScenarioLine,
  type ScenarioPaper,
  type ScenarioPart,
  type ScenarioSpec,
} from "@/lib/scenario";
import { Markdown } from "./markdown";

type Mode = "mock" | "practice";
type Saved = { responses: Record<string, Response>; flags: string[]; endsAt: number; startedAt: string; extra: boolean };

function formatClock(ms: number) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${h ? `${h}:` : ""}${String(m).padStart(h ? 2 : 1, "0")}:${String(s % 60).padStart(2, "0")}`;
}

/**
 * Ssenariy imtihoni (Preparation / Execution). Mock: 4 savol, 150 (+40) daqiqa, vaqt tugasa avtomatik topshiriladi.
 * Mashq: bitta savol (20 ball), tavsiya etilgan 35 daqiqa ko'rsatiladi, «Check answers» dan keyin har qator izohi.
 * Holat localStorage'da — sahifa yangilansa davom etadi.
 */
export function ScenarioExam({ spec, paper, mode, questionNumbers }: { spec: ScenarioSpec; paper: ScenarioPaper; mode: Mode; questionNumbers: number[] }) {
  const questions = useMemo(() => paper.questions.filter((q) => questionNumbers.includes(q.number)), [paper, questionNumbers]);
  const lines = useMemo(() => flattenLines(paper, questionNumbers), [paper, questionNumbers]);
  const storageKey = `finora-scenario-${paper.id}-${mode}-${questionNumbers.join("")}`;
  const [restored] = useState<Saved | null>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? (JSON.parse(raw) as Saved) : null;
    } catch {
      return null;
    }
  });
  const baseMinutes = mode === "mock" ? spec.minutes : spec.minutesPerQuestion * questions.length;
  const extraMinutes = mode === "mock" ? spec.extraMinutes : Math.round((spec.extraMinutes / 4) * questions.length);
  const [phase, setPhase] = useState<"intro" | "exam" | "result">(restored ? "exam" : "intro");
  const [extra, setExtra] = useState(restored?.extra ?? false);
  const [responses, setResponses] = useState<Record<string, Response>>(restored?.responses ?? {});
  const [flags, setFlags] = useState<string[]>(restored?.flags ?? []);
  const [qIndex, setQIndex] = useState(0);
  const [pane, setPane] = useState<"scenario" | "info">("scenario");
  // Telefonda ssenariy yig'ilgan (savolga to'g'ridan-to'g'ri); kompyuterda doim yonida.
  const [showCase, setShowCase] = useState(false);
  const [endsAt, setEndsAt] = useState(restored?.endsAt ?? 0);
  const [startedAt, setStartedAt] = useState(restored?.startedAt ?? "");
  const [now, setNow] = useState(() => Date.now());
  const [confirming, setConfirming] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saved" | "error">("idle");
  const [saveError, setSaveError] = useState("");
  const [finishedAt, setFinishedAt] = useState(0);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (phase !== "exam") return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ responses, flags, endsAt, startedAt, extra } satisfies Saved));
    } catch {
      /* saqlab bo'lmasa ham davom etadi */
    }
  }, [phase, responses, flags, endsAt, startedAt, extra, storageKey]);

  const finish = useCallback(() => {
    setPhase("result");
    setConfirming(false);
    const end = Date.now();
    setFinishedAt(end);
    try {
      localStorage.removeItem(storageKey);
    } catch {
      /* e'tiborsiz */
    }
    window.scrollTo({ top: 0 });
    startTransition(async () => {
      const res = await saveScenarioAttempt({
        level: spec.slug,
        paperId: paper.id,
        mode,
        questions: questionNumbers,
        responses,
        startedAt: startedAt || undefined,
        durationSeconds: startedAt ? Math.round((end - new Date(startedAt).getTime()) / 1000) : undefined,
      });
      if (res.ok) setSaveState("saved");
      else {
        setSaveState("error");
        setSaveError(res.error);
      }
    });
  }, [mode, paper.id, questionNumbers, responses, spec.slug, startedAt, storageKey]);

  const finishRef = useRef(finish);
  useEffect(() => {
    finishRef.current = finish;
  }, [finish]);
  useEffect(() => {
    if (phase !== "exam") return;
    const id = setInterval(() => {
      const t = Date.now();
      setNow(t);
      // Mashqda vaqt faqat yo'l-yo'riq: avtomatik topshirilmaydi.
      if (mode === "mock" && endsAt && t >= endsAt) finishRef.current();
    }, 1000);
    return () => clearInterval(id);
  }, [phase, endsAt, mode]);

  const setResponse = (lineId: string, value: Response) => setResponses((r) => ({ ...r, [lineId]: value }));
  const answeredIn = (qn: number) => lines.filter((l) => l.question.number === qn && isAnswered(l.part.type, responses[l.line.id] ?? null)).length;
  const answeredAll = lines.filter((l) => isAnswered(l.part.type, responses[l.line.id] ?? null)).length;
  const score = useMemo(() => scorePaper(paper, responses, questionNumbers), [paper, responses, questionNumbers]);

  if (phase === "intro") {
    const minutes = baseMinutes + (extra ? extraMinutes : 0);
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-[#13251f]/10 bg-white p-6 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#527264]">{paper.sector}</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">{paper.title}</h2>
        <p className="mt-3 text-sm leading-6 text-[#65736d]">
          {mode === "mock"
            ? `A full ${spec.title} paper in the official format: one scenario, four questions of 20 marks. Work as in the real exam — read the scenario first (about 5 minutes), then about ${spec.minutesPerQuestion} minutes per question.`
            : `One exam question (20 marks) from this paper. Aim to finish in about ${spec.minutesPerQuestion} minutes, then check every line with explanations.`}
        </p>
        <ul className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
          <li className="rounded-2xl bg-[#f3f1eb] p-4"><span className="block text-2xl font-semibold">{lines.length}</span>marks (1 per line)</li>
          <li className="rounded-2xl bg-[#f3f1eb] p-4"><span className="block text-2xl font-semibold">{minutes} min</span>{mode === "mock" ? "time limit" : "target time"}</li>
          <li className="rounded-2xl bg-[#f3f1eb] p-4"><span className="block text-2xl font-semibold">{mode === "mock" ? `${spec.passMark}/${spec.marks}` : "50%"}</span>pass mark</li>
          <li className="rounded-2xl bg-[#f3f1eb] p-4"><span className="block text-2xl font-semibold">Open book</span>your own PPP Guide only</li>
        </ul>
        <div className="mt-6 rounded-2xl border border-[#13251f]/10 p-4 text-sm leading-6">
          <p className="font-semibold">Five question types</p>
          <ul className="mt-2 space-y-1 text-[#52665e]">
            {(Object.keys(TYPE_LABEL) as (keyof typeof TYPE_LABEL)[]).map((t) => (
              <li key={t}><span className="font-medium text-[#13251f]">{TYPE_LABEL[t]}:</span> {TYPE_TIP[t]}</li>
            ))}
          </ul>
          <p className="mt-3 text-[#52665e]">Use the scenario and additional information only when a part tells you to. Check the Guide once or twice at most — time is the real constraint.</p>
        </div>
        <label className="mt-4 flex items-start gap-3 rounded-2xl border border-[#13251f]/10 p-4 text-sm">
          <input type="checkbox" checked={extra} onChange={(e) => setExtra(e.target.checked)} className="mt-1 size-4 accent-[#163e32]" />
          <span>
            <span className="font-semibold">English is not my first language (+{extraMinutes} min)</span>
            <span className="mt-1 block text-[#65736d]">APMG gives non-native English speakers 40 extra minutes in the Practitioner exams.</span>
          </span>
        </label>
        <button
          type="button"
          onClick={() => {
            const start = new Date();
            setStartedAt(start.toISOString());
            setEndsAt(start.getTime() + minutes * 60_000);
            setNow(start.getTime());
            setPhase("exam");
          }}
          className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#163e32] px-6 font-semibold text-white hover:bg-[#0e3026]"
        >
          {mode === "mock" ? "Start the exam" : "Start the question"} <ArrowRight className="size-4" />
        </button>
      </div>
    );
  }

  if (phase === "result") {
    const pass = scenarioPassed(spec, score.correct, score.total);
    const took = startedAt && finishedAt ? formatClock(finishedAt - new Date(startedAt).getTime()) : null;
    const areaTitle = Object.fromEntries(spec.areas.map((a) => [a.id, a.title]));
    return (
      <div className="space-y-8">
        <section className={`rounded-3xl p-6 sm:p-10 ${pass ? "bg-[#163e32] text-white" : "border border-[#13251f]/10 bg-white"}`}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-70">{mode === "mock" ? "Mock result" : "Question result"}</p>
          <p className="mt-3 text-5xl font-semibold tracking-tight">{score.correct}/{score.total}</p>
          <p className="mt-2 text-lg font-medium">{pass ? (mode === "mock" ? "Pass — well done." : "Above the pass line.") : `Below the pass line (${mode === "mock" ? `${spec.passMark}/${spec.marks}` : "50%"}).`}</p>
          <p className="mt-2 text-sm opacity-80">
            {Math.round((score.correct / Math.max(score.total, 1)) * 100)}% correct{took ? ` · time used ${took}` : ""}
            {pending ? " · saving…" : saveState === "saved" ? " · saved to your results" : saveState === "error" ? ` · not saved: ${saveError}` : ""}
          </p>
          <p className="mt-4 max-w-xl text-sm opacity-80">Aim for 60% or more on unseen papers before booking. Read every explanation below — most lost marks come from the same few misreadings.</p>
        </section>

        <div className="grid gap-5 md:grid-cols-2">
          <ScoreBars title="Score by syllabus area" rows={Object.entries(score.areas).map(([k, v]) => ({ label: `${k} · ${areaTitle[k] ?? ""}`, ...v }))} />
          <ScoreBars title="Score by question type" rows={Object.entries(score.types).map(([k, v]) => ({ label: TYPE_LABEL[k as keyof typeof TYPE_LABEL] ?? k, ...v }))} />
        </div>

        <section className="space-y-8">
          <h3 className="text-lg font-semibold">Review every line</h3>
          {questions.map((q) => (
            <div key={q.number} className="space-y-4">
              <h4 className="font-semibold">Question {q.number} · {q.area} — {q.title}</h4>
              {q.additionalInfo && (
                <details className="rounded-2xl border border-[#13251f]/10 bg-white p-4 text-sm">
                  <summary className="cursor-pointer font-semibold">Additional information for Question {q.number}</summary>
                  <Markdown text={q.additionalInfo} className="mt-3" />
                </details>
              )}
              {q.parts.map((part) => (
                <PartView key={part.id} part={part} responses={responses} reveal />
              ))}
            </div>
          ))}
          <details className="rounded-2xl border border-[#13251f]/10 bg-white p-4 text-sm">
            <summary className="cursor-pointer font-semibold">Scenario</summary>
            <Markdown text={paper.scenario} className="mt-3" />
          </details>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link href={`/exam/${spec.slug}`} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#163e32] px-6 font-semibold text-white">Back to {spec.title}</Link>
        </div>
      </div>
    );
  }

  const q = questions[qIndex];
  const remaining = endsAt - now;
  const showInfo = pane === "info" && q.additionalInfo;
  const toQuestion = () => document.getElementById("scenario-question")?.scrollIntoView({ block: "start" });
  return (
    <div className="space-y-4">
      {/* Yuqori panel: savollar navigatori va taymer */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#13251f]/10 bg-white p-2 px-3">
        {questions.map((qq, i) => (
          <button
            key={qq.number}
            type="button"
            onClick={() => {
              setQIndex(i);
              setPane("scenario");
              toQuestion();
            }}
            className={`min-h-10 rounded-xl px-3 text-sm font-semibold ${i === qIndex ? "bg-[#163e32] text-white" : "bg-[#f3f1eb]"}`}
          >
            Q{qq.number} {qq.area} <span className="font-normal opacity-75">{answeredIn(qq.number)}/20</span>
          </button>
        ))}
        <span className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-1.5 rounded-full border border-[#13251f]/10 bg-white px-4 py-2 font-mono text-sm font-semibold shadow-lg" aria-live="off">
          <Clock3 className="size-4" />
          <span className={mode === "mock" && remaining < 10 * 60_000 ? "text-red-700" : remaining < 0 ? "text-amber-700" : ""}>{remaining >= 0 ? formatClock(remaining) : `+${formatClock(-remaining)}`}</span>
        </span>
      </div>

      <button type="button" onClick={() => setShowCase((v) => !v)} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#13251f]/15 bg-white text-sm font-semibold lg:hidden">
        <BookOpen className="size-4" />{showCase ? "Hide the scenario" : q.additionalInfo ? "Show the scenario and additional information" : "Show the scenario"}
      </button>
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Chap: ssenariy / qo'shimcha ma'lumot — alohida aylantiriladi */}
        <aside className={`rounded-3xl border border-[#13251f]/10 bg-[#fbfaf6] lg:sticky lg:top-24 lg:block lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto ${showCase ? "" : "hidden"}`}>
          <div className="sticky top-0 flex gap-1 border-b border-[#13251f]/10 bg-[#fbfaf6] p-2">
            <button type="button" onClick={() => setPane("scenario")} className={`inline-flex min-h-10 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold ${!showInfo ? "bg-white shadow-sm" : ""}`}><BookOpen className="size-4" />Scenario</button>
            {q.additionalInfo && (
              <button type="button" onClick={() => setPane("info")} className={`inline-flex min-h-10 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold ${showInfo ? "bg-white shadow-sm" : ""}`}><FileText className="size-4" />Additional info · Q{q.number}</button>
            )}
          </div>
          <div className="p-5">
            {showInfo ? (
              <>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#527264]">Only for Question {q.number}</p>
                <Markdown text={q.additionalInfo!} />
              </>
            ) : (
              <>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#527264]">{paper.sector}</p>
                <p className="mb-3 text-lg font-semibold">{paper.title}</p>
                <Markdown text={paper.scenario} />
              </>
            )}
          </div>
        </aside>

        {/* O'ng: savol qismlari */}
        <div id="scenario-question" className="scroll-mt-4 space-y-5">
          <div className="rounded-3xl border border-[#13251f]/10 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#527264]">Question {q.number} · syllabus area {q.area}</p>
            <p className="mt-1 text-xl font-semibold">{q.title}</p>
            <p className="mt-1 text-sm text-[#65736d]">20 marks · parts in ascending difficulty</p>
          </div>
          {q.parts.map((part) => (
            <PartView
              key={part.id}
              part={part}
              responses={responses}
              onChange={setResponse}
              flags={flags}
              onFlag={(id) => setFlags((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]))}
              onOpenInfo={q.additionalInfo ? () => { setPane("info"); setShowCase(true); if (window.innerWidth < 1024) window.scrollTo({ top: 0 }); } : undefined}
            />
          ))}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button type="button" disabled={qIndex === 0} onClick={() => { setQIndex((i) => i - 1); setPane("scenario"); toQuestion(); }} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#13251f]/15 bg-white px-4 text-sm font-semibold disabled:opacity-40"><ArrowLeft className="size-4" />Previous question</button>
            {qIndex < questions.length - 1 ? (
              <button type="button" onClick={() => { setQIndex((i) => i + 1); setPane("scenario"); toQuestion(); }} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#163e32] px-4 text-sm font-semibold text-white">Next question<ArrowRight className="size-4" /></button>
            ) : (
              <button type="button" onClick={() => setConfirming(true)} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#163e32] px-4 text-sm font-semibold text-white">{mode === "mock" ? "Finish and submit" : "Check answers"}</button>
            )}
          </div>
          {confirming && (
            <div role="alertdialog" aria-labelledby="confirm-title" className="rounded-3xl border border-amber-300 bg-amber-50 p-5 text-sm">
              <p id="confirm-title" className="font-semibold">{mode === "mock" ? "Submit the paper?" : "Check your answers?"}</p>
              <p className="mt-2 text-[#65736d]">
                {lines.length - answeredAll > 0 ? `${lines.length - answeredAll} of ${lines.length} lines unanswered — there is no penalty for guessing.` : "All lines answered."}
                {flags.length ? ` ${flags.length} flagged.` : ""}
              </p>
              <div className="mt-4 flex gap-2">
                <button type="button" onClick={finish} className="rounded-xl bg-[#163e32] px-4 py-2 font-semibold text-white">{mode === "mock" ? "Submit" : "Check"}</button>
                <button type="button" onClick={() => setConfirming(false)} className="rounded-xl border border-[#13251f]/15 bg-white px-4 py-2 font-semibold">Keep going</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ScoreBars({ title, rows }: { title: string; rows: { label: string; correct: number; total: number }[] }) {
  return (
    <section className="rounded-3xl border border-[#13251f]/10 bg-white p-6">
      <h3 className="font-semibold">{title}</h3>
      <ul className="mt-4 space-y-3">
        {rows.map((r) => {
          const pct = Math.round((r.correct / Math.max(r.total, 1)) * 100);
          return (
            <li key={r.label}>
              <div className="flex justify-between gap-3 text-sm"><span>{r.label}</span><span className="shrink-0 font-semibold">{r.correct}/{r.total}</span></div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#e9ebe7]"><div style={{ width: `${pct}%` }} className={`h-full rounded-full ${pct >= 60 ? "bg-[#28634f]" : pct >= 50 ? "bg-amber-500" : "bg-red-500"}`} /></div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

type PartProps = {
  part: ScenarioPart;
  responses: Record<string, Response>;
  onChange?: (lineId: string, value: Response) => void;
  reveal?: boolean;
  flags?: string[];
  onFlag?: (lineId: string) => void;
  onOpenInfo?: () => void;
};

export function PartView({ part, responses, onChange, reveal = false, flags = [], onFlag, onOpenInfo }: PartProps) {
  const shared = part.type === "matching" || part.type === "sequencing";
  const got = reveal ? part.lines.filter((l) => isLineCorrect(part.type, l, responses[l.id] ?? null)).length : 0;
  return (
    <section className="rounded-3xl border border-[#13251f]/10 bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="rounded-full bg-[#f3f1eb] px-2.5 py-1 font-semibold">Part {part.id} · {TYPE_LABEL[part.type]}</span>
        <span className="text-[#65736d]">{reveal ? <span className="font-semibold text-[#13251f]">{got}/{part.lines.length} marks</span> : `${part.lines.length} mark${part.lines.length > 1 ? "s" : ""}`}</span>
      </div>
      <p className="mt-3 text-[15px] font-medium leading-7">{part.instruction}</p>
      {part.usesAdditionalInfo && onOpenInfo && (
        <button type="button" onClick={onOpenInfo} className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[#163e32] hover:underline"><FileText className="size-4" />Open the additional information</button>
      )}
      {shared && part.columnOptions && (
        <div className="mt-4 rounded-2xl bg-[#f7f6f1] p-4 text-sm">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#65736d]">Column 2</p>
          <ul className="space-y-1.5">
            {part.columnOptions.map((o, i) => (
              <li key={i} className="flex gap-2"><span className="w-5 shrink-0 font-semibold">{LETTERS[i]}</span><span>{o}</span></li>
            ))}
          </ul>
        </div>
      )}
      <ol className="mt-4 space-y-4">
        {part.lines.map((line, li) => (
          <LineView
            key={line.id}
            n={li + 1}
            part={part}
            line={line}
            value={responses[line.id] ?? null}
            onChange={onChange ? (v) => onChange(line.id, v) : undefined}
            reveal={reveal}
            flagged={flags.includes(line.id)}
            onFlag={onFlag ? () => onFlag(line.id) : undefined}
          />
        ))}
      </ol>
    </section>
  );
}

function LineView({ n, part, line, value, onChange, reveal, flagged, onFlag }: { n: number; part: ScenarioPart; line: ScenarioLine; value: Response; onChange?: (v: Response) => void; reveal: boolean; flagged: boolean; onFlag?: () => void }) {
  const shared = part.type === "matching" || part.type === "sequencing";
  const multi = part.type === "multiple-response";
  const correct = isLineCorrect(part.type, line, value);
  const keyIdx = Array.isArray(line.answer) ? line.answer : [line.answer];
  const chosenIdx = value === null ? [] : multi ? indexesOf(value) : [value];

  const toggle = (i: number) => {
    if (!onChange) return;
    if (!multi) return onChange(value === i ? null : i);
    const cur = chosenIdx.includes(i) ? chosenIdx.filter((x) => x !== i) : [...chosenIdx, i];
    if (cur.length > 2) return; // imtihondagidek: aynan 2 ta
    onChange(cur.length ? maskOf(cur) : null);
  };

  return (
    <li className={`rounded-2xl border p-4 ${reveal ? (correct ? "border-[#28634f]/30 bg-[#f3f7f3]" : "border-red-200 bg-red-50/40") : "border-[#13251f]/10"}`}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-[#f3f1eb] text-sm font-semibold">{n}</span>
        <div className="min-w-0 flex-1">
          <p className="whitespace-pre-line leading-7">{line.stem}</p>
          {multi && !reveal && <p className="mt-1 text-xs font-semibold text-[#527264]">Select 2 · {chosenIdx.length}/2 selected</p>}
          {shared ? (
            <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label={`Line ${n} answer`}>
              {(part.columnOptions ?? []).map((_, i) => {
                const sel = value === i;
                const isKey = reveal && i === line.answer;
                return (
                  <button
                    key={i}
                    type="button"
                    role="radio"
                    aria-checked={sel}
                    disabled={!onChange}
                    onClick={() => toggle(i)}
                    className={`grid size-10 place-items-center rounded-full border text-sm font-semibold ${isKey ? "border-[#28634f] bg-[#28634f] text-white" : sel ? (reveal ? "border-red-400 bg-red-100 text-red-800" : "border-[#163e32] bg-[#163e32] text-white") : "border-[#13251f]/15 bg-white"}`}
                  >
                    {LETTERS[i]}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              {(line.options ?? []).map((opt, i) => {
                const sel = chosenIdx.includes(i);
                const isKey = reveal && keyIdx.includes(i);
                return (
                  <button
                    key={i}
                    type="button"
                    role={multi ? "checkbox" : "radio"}
                    aria-checked={sel}
                    disabled={!onChange}
                    onClick={() => toggle(i)}
                    className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left text-[15px] leading-6 ${isKey ? "border-[#28634f]/40 bg-[#e7ece6]" : sel ? (reveal ? "border-red-300 bg-red-50" : "border-[#163e32] bg-[#e7ece6]") : "border-[#13251f]/12 bg-white hover:bg-[#f7f6f1]"}`}
                  >
                    <span className={`grid size-7 shrink-0 place-items-center ${multi ? "rounded-md" : "rounded-full"} text-sm font-semibold ${sel ? "bg-[#163e32] text-white" : "bg-[#f3f1eb]"}`}>{LETTERS[i]}</span>
                    <span className="pt-0.5">{opt}</span>
                  </button>
                );
              })}
            </div>
          )}
          {reveal ? (
            <div className="mt-3 text-sm leading-6">
              <p className="flex items-center gap-1.5 font-semibold">
                {correct ? <CheckCircle2 className="size-4 text-[#28634f]" /> : <XCircle className="size-4 text-red-600" />}
                {correct ? "Correct" : value === null ? "Not answered" : "Incorrect"} · answer {keyIdx.map((i) => LETTERS[i]).join(" and ")}
              </p>
              <p className="mt-1 text-[#52665e]">{line.explanation}</p>
              <p className="mt-1 text-xs text-[#65736d]">Source: {line.ref} · PPP Guide 2026</p>
            </div>
          ) : (
            onFlag && (
              <button type="button" onClick={onFlag} className={`mt-3 inline-flex items-center gap-1.5 text-xs font-semibold ${flagged ? "text-amber-700" : "text-[#65736d]"}`}>
                <Flag className="size-3.5" />{flagged ? "Flagged" : "Flag"}
              </button>
            )
          )}
        </div>
      </div>
    </li>
  );
}
