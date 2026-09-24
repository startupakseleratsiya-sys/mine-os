"use client";

import dynamic from "next/dynamic";

/** Mock faqat brauzerda render qilinadi: holat (javoblar, taymer) localStorage'dan tiklanadi. */
export const MockExamClient = dynamic(() => import("./mock-exam").then((m) => m.MockExam), {
  ssr: false,
  loading: () => <div className="h-96 animate-pulse rounded-3xl bg-white" />,
});
