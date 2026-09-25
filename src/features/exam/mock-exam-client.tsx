"use client";

import dynamic from "next/dynamic";

/** Mock faqat brauzerda render qilinadi: holat (javoblar, taymer) localStorage'dan tiklanadi. */
export const MockExamClient = dynamic(() => import("./mock-exam").then((m) => m.MockExam), {
  ssr: false,
  loading: () => <div className="h-96 animate-pulse rounded-3xl bg-white" />,
});

/** Ssenariy imtihoni ham faqat brauzerda (holat localStorage'dan tiklanadi). */
export const ScenarioExamClient = dynamic(() => import("./scenario-exam").then((m) => m.ScenarioExam), {
  ssr: false,
  loading: () => <div className="h-96 animate-pulse rounded-3xl bg-white" />,
});

/** Kartalar holati localStorage'da — faqat brauzerda. */
export const FlashcardsClient = dynamic(() => import("./flashcards").then((m) => m.Flashcards), {
  ssr: false,
  loading: () => <div className="h-96 animate-pulse rounded-3xl bg-white" />,
});
