"use client";
import { useI18n } from "@/i18n/provider";

import { useId, useState } from "react";
import type { Chapter } from "@/content/courses";
export function LessonExercise({ exercise }: {
    exercise: NonNullable<Chapter["exercise"]>;
}) {
    const { t } = useI18n();
    const id = useId();
    const [selected, setSelected] = useState<number | null>(null);
    const [checked, setChecked] = useState(false);
    const [hint, setHint] = useState(false);
    return (<section aria-labelledby={`${id}-title`} className="mt-10 rounded-2xl border border-[#d6b976] bg-[#fffbef] p-5 sm:p-7">
      <p className="mb-2 text-sm font-medium text-[#70571f]"><>{t("Amaliy keys")}</></p>
      <h2 id={`${id}-title`} className="text-2xl font-semibold">{t(exercise.title)}</h2>
      <p className="mt-4 leading-7 text-[#52665e]">{t(exercise.situation)}</p>
      <form onSubmit={(event) => { event.preventDefault(); if (selected !== null)
        setChecked(true); }}>
        <fieldset disabled={checked} className="mt-5 min-w-0">
          <legend className="mb-3 font-semibold">{t(exercise.question)}</legend>
          <div className="space-y-2">
            {exercise.choices.map((choice, index) => (<label key={choice.label} className={`flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm leading-6 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[#245b47] ${selected === index ? "border-[#245b47] bg-[#e5eee9]" : "border-[#e3dcc9] bg-white"}`}>
                <input className="mt-1 size-4 shrink-0 accent-[#245b47]" type="radio" name={id} checked={selected === index} onChange={() => setSelected(index)}/>
                <span>{t(choice.label)}</span>
              </label>))}
          </div>
        </fieldset>
        <div className="mt-4 flex flex-wrap gap-3">
          {checked ? (<button type="button" onClick={() => { setSelected(null); setChecked(false); setHint(false); }} className="min-h-11 rounded-xl bg-[#245b47] px-4 py-2 text-sm font-semibold text-white"><>{t("Qayta urinib ko\u2018rish")}</></button>) : (<button type="submit" disabled={selected === null} className="min-h-11 rounded-xl bg-[#245b47] px-4 py-2 text-sm font-semibold text-white disabled:opacity-45"><>{t("Qarorni tekshirish")}</></button>)}
          <button type="button" aria-expanded={hint} aria-controls={`${id}-hint`} onClick={() => setHint(!hint)} className="min-h-11 px-3 py-2 text-sm font-semibold underline underline-offset-4">{hint ? t("Maslahatni yopish") : t("Maslahat olish")}</button>
        </div>
        <p id={`${id}-hint`} hidden={!hint} className="mt-4 border-l-2 border-[#b08a34] pl-4 text-sm leading-6">{t(exercise.hint)}</p>
        <div role="status" className="mt-4 text-sm leading-6">
          {checked && selected !== null && <><p className="font-semibold">{selected === exercise.answer ? t("To\u2018g\u2018ri qaror.") : t("Qarorni qayta ko\u2018rib chiqing.")}</p><p>{t(exercise.choices[selected].feedback)}</p></>}
        </div>
      </form>
    </section>);
}
