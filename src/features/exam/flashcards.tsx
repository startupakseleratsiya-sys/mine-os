"use client";

import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { buildSession, isDue, masteryStats, review, type CardState } from "@/lib/srs";

export type Flashcard = { id: string; kind: "term" | "acronym"; term: string; definition: string; ref: string };

const KEY = "finora-flashcards-v1";

function load(): Record<string, CardState> {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}") as Record<string, CardState>;
  } catch {
    return {};
  }
}

/**
 * Glossary kartalari: faol eslash (avval o'zingiz eslang, keyin oching) + Leitner oraliqli takrorlash.
 * Holat shu brauzerda saqlanadi.
 */
export function Flashcards({ cards }: { cards: Flashcard[] }) {
  const [states, setStates] = useState<Record<string, CardState>>(load);
  const [deck, setDeck] = useState<"term" | "acronym" | "all">("term");
  const [reverse, setReverse] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);
  const pool = useMemo(() => cards.filter((c) => deck === "all" || c.kind === deck), [cards, deck]);
  // Sessiya boshlanganda qotiriladi (javob berilganda ro'yxat qayta tuzilmasin).
  const [session, setSession] = useState(() => buildSession(pool, states, Date.now()));
  const [i, setI] = useState(0);
  const [open, setOpen] = useState(false);
  const [tally, setTally] = useState({ knew: 0, again: 0 });
  const stats = masteryStats(pool, states);
  const [now] = useState(() => Date.now());
  const dueCount = pool.filter((c) => states[c.id] && isDue(states[c.id], now)).length;

  const restart = (nextDeck = deck) => {
    const nextPool = cards.filter((c) => nextDeck === "all" || c.kind === nextDeck);
    setSession(buildSession(nextPool, states, Date.now()));
    setI(0);
    setOpen(false);
    setTally({ knew: 0, again: 0 });
    setSessionKey((k) => k + 1);
  };

  const answer = (knew: boolean) => {
    const card = session[i];
    const next = { ...states, [card.id]: review(states[card.id], knew, Date.now()) };
    setStates(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* e'tiborsiz */
    }
    setTally((t) => ({ knew: t.knew + (knew ? 1 : 0), again: t.again + (knew ? 0 : 1) }));
    // Bilmagan karta sessiya oxiriga qayta qo'shiladi.
    if (!knew) setSession((s) => [...s, card]);
    setOpen(false);
    setI((x) => x + 1);
  };

  const card = session[i];
  return (
    <div key={sessionKey} className="mx-auto max-w-2xl space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        {(["term", "acronym", "all"] as const).map((d) => (
          <button key={d} type="button" onClick={() => { setDeck(d); restart(d); }} className={`min-h-10 rounded-xl px-4 text-sm font-semibold ${deck === d ? "bg-[#163e32] text-white" : "border border-[#13251f]/15 bg-white"}`}>
            {d === "term" ? "Glossary terms" : d === "acronym" ? "Acronyms" : "All"}
          </button>
        ))}
        <label className="ml-auto inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={reverse} onChange={(e) => setReverse(e.target.checked)} className="size-4 accent-[#163e32]" />
          Show definition first
        </label>
      </div>
      <div className="grid grid-cols-3 gap-3 text-sm">
        <div className="rounded-2xl bg-white p-3"><span className="block text-xl font-semibold">{stats.learned}/{stats.total}</span>seen</div>
        <div className="rounded-2xl bg-white p-3"><span className="block text-xl font-semibold">{stats.mastered}</span>mastered (box 4–5)</div>
        <div className="rounded-2xl bg-white p-3"><span className="block text-xl font-semibold">{dueCount}</span>due for review</div>
      </div>

      {card ? (
        <div className="rounded-3xl border border-[#13251f]/10 bg-white p-6 sm:p-10">
          <div className="flex justify-between text-xs font-semibold uppercase tracking-[0.18em] text-[#527264]">
            <span>{card.kind === "acronym" ? "Acronym" : "Glossary term"}</span>
            <span>{Math.min(i + 1, session.length)}/{session.length}</span>
          </div>
          <p className={`mt-6 ${reverse ? "text-lg leading-8" : "text-3xl font-semibold tracking-tight"}`}>{reverse ? card.definition : card.term}</p>
          {open ? (
            <>
              <div className="mt-6 border-t border-[#13251f]/10 pt-6">
                <p className={reverse ? "text-2xl font-semibold" : "text-lg leading-8"}>{reverse ? card.term : card.definition}</p>
                <p className="mt-3 text-xs text-[#65736d]">{card.ref} · PPP Guide 2026</p>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-3">
                <button type="button" onClick={() => answer(false)} className="min-h-12 rounded-xl border border-red-200 bg-red-50 font-semibold text-red-800">Didn&apos;t know</button>
                <button type="button" onClick={() => answer(true)} className="min-h-12 rounded-xl bg-[#163e32] font-semibold text-white">Knew it</button>
              </div>
            </>
          ) : (
            <button type="button" onClick={() => setOpen(true)} className="mt-10 min-h-12 w-full rounded-xl border border-[#13251f]/15 font-semibold hover:bg-[#f7f6f1]">Recall it, then show the answer</button>
          )}
        </div>
      ) : (
        <div className="rounded-3xl border border-[#13251f]/10 bg-white p-8 text-center">
          <p className="text-2xl font-semibold">{session.length ? "Session complete" : "Nothing due right now"}</p>
          <p className="mt-2 text-sm text-[#65736d]">{session.length ? `${tally.knew} known · ${tally.again} missed. Missed cards come back sooner.` : "Come back tomorrow — spacing reviews out is what makes terms stick."}</p>
          <button type="button" onClick={() => restart()} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#163e32] px-5 font-semibold text-white"><RotateCcw className="size-4" />New session</button>
        </div>
      )}
    </div>
  );
}
