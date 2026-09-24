"use client";
import { useI18n } from "@/i18n/provider";

import { useId, useState } from "react";
import type { QuizQuestion } from "@/content/courses";
export function LessonQuiz({ questions }: {
    questions: QuizQuestion[];
}) {
    const { t } = useI18n();
    const id = useId();
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [checked, setChecked] = useState(false);
    const answered = questions.every((_, index) => answers[index] !== undefined);
    const score = questions.filter((question, index) => answers[index] === question.answer).length;
    return (<section aria-labelledby={`${id}-title`} className="mt-10 rounded-2xl border border-[#dce2d9] bg-white p-5 sm:p-7">
      <h2 id={`${id}-title`} className="text-xl font-bold"><>{t("Bilimingizni tekshiring")}</></h2>
      <p className="mt-2 text-sm leading-6 text-[#65736d]"><>{t("Har savolda bitta javobni tanlang. Natija va izoh shu yerda ko\u2018rsatiladi; javoblar saqlanmaydi.")}</></p>
      <form onSubmit={(event) => { event.preventDefault(); if (answered)
        setChecked(true); }}>
        <div className="mt-6 space-y-7">
          {questions.map((question, index) => (<fieldset key={question.question} disabled={checked} className="min-w-0">
              <legend className="mb-3 font-semibold leading-6">{index + 1}. {t(question.question)}</legend>
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (<label key={option} className={`flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm leading-6 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#163e32] ${answers[index] === optionIndex ? "border-[#163e32] bg-[#edf3e9]" : "border-[#e2e4df]"}`}>
                    <input type="radio" name={`${id}-${index}`} value={optionIndex} checked={answers[index] === optionIndex} onChange={() => setAnswers((previous) => ({ ...previous, [index]: optionIndex }))} className="mt-1 size-4 shrink-0 accent-[#163e32]"/>
                    <span>{t(option)}</span>
                  </label>))}
              </div>
              {checked && (<div className={`mt-3 rounded-xl p-4 text-sm leading-6 ${answers[index] === question.answer ? "bg-emerald-50 text-emerald-900" : "bg-amber-50 text-amber-900"}`}>
                  <p className="font-bold">{answers[index] === question.answer ? t("To\u2018g\u2018ri javob.") : t("Bu javob mos emas.")}</p>
                  <p><>{t("To\u2018g\u2018ri javob:")}{" "}</>{t(question.options[question.answer])}</p>
                  <p className="mt-1">{t(question.explanation)}</p>
                </div>)}
            </fieldset>))}
        </div>
        <p role="status" aria-live="polite" className="mt-5 text-sm font-medium text-[#36584b]">
          {checked ? t("Natija: {0} ta savoldan {1} tasi to\u2018g\u2018ri.", { "0": questions.length, "1": score }) : t("{0}/{1} ta savolga javob tanlandi.", { "0": Object.keys(answers).length, "1": questions.length })}
        </p>
        <div className="mt-4">
          {checked ? (<button type="button" onClick={() => { setAnswers({}); setChecked(false); }} className="min-h-11 rounded-xl border border-[#163e32] px-5 py-3 text-sm font-semibold text-[#163e32]"><>{t("Qayta mashq qilish")}</></button>) : (<button type="submit" disabled={!answered} className="min-h-11 rounded-xl bg-[#163e32] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45"><>{t("Javoblarni tekshirish")}</></button>)}
        </div>
      </form>
    </section>);
}
