import { LESSONS } from "./cp3p";
import type { Lesson, QuizQuestion } from "./cp3p/types";

/**
 * Kurslar — faqat CP3P'ning 3 bosqichi (user qarori 2026-09-25). Darslar src/content/cp3p/<level>/*.json da.
 * O'quv yo'li ketma-ket: dars → test (46/50, 92%) → keyingi dars ochiladi. Bazada faqat progress saqlanadi.
 */
export type Chapter = Lesson;
export type { Lesson, QuizQuestion };

export type CourseIcon = "wallet" | "piggy" | "trending";
export type CourseSlug = "cp3p-foundation" | "cp3p-preparation" | "cp3p-execution";

export type Course = {
  slug: CourseSlug;
  level: Lesson["level"];
  title: string;
  /** Kartalar va nav uchun qisqa nom */
  shortTitle: string;
  description: string;
  exam: string;
  tag: "top" | "new" | null;
  icon: CourseIcon;
  emoji: string;
  outcomes: string[];
  chapters: Lesson[];
  /** Kurs ochilishi uchun avval tugatilishi kerak bo'lgan kurs. 2026-09-25 dan uchala kurs ham ochiq (null) — mijoz talabi. */
  requires: CourseSlug | null;
  /** Yakuniy bosqich — rasmiy formatdagi imtihon simulyatsiyasi. */
  finalExamHref: string;
};

export const COURSES: Course[] = [
  {
    slug: "cp3p-foundation",
    level: "foundation",
    title: "CP3P Foundation",
    shortTitle: "CP3P Foundation",
    description: "What a PPP is, how it is structured and financed, when to use it, and the language of PPPs (PPP Guide 2026, chapter 1 and the Glossary).",
    exam: "Exam: 50 multiple-choice questions · 40 minutes · closed book · pass 25/50",
    tag: "top",
    icon: "wallet",
    emoji: "🧭",
    outcomes: ["Tell a PPP apart from other procurement options", "Explain PPP structures, payment mechanisms and finance", "Know when PPPs add value and why projects fail", "Use the Glossary terms with confidence"],
    chapters: LESSONS.foundation,
    requires: null,
    finalExamHref: "/exam/foundation/mock",
  },
  {
    slug: "cp3p-preparation",
    level: "preparation",
    title: "CP3P Preparation",
    shortTitle: "CP3P Preparation",
    description: "Setting up the PPP framework, identifying and screening projects, appraising them, and structuring finance and risk (PPP Guide 2026, chapters 2–4 and chapter 5 §1–§5).",
    exam: "Exam: scenario-based · 80 marks · 150 minutes · open book · pass 40/80",
    tag: null,
    icon: "piggy",
    emoji: "📐",
    outcomes: ["Design a PPP framework and its institutions", "Screen and appraise projects: CBA, VfM, affordability", "Structure financial support and payment mechanisms", "Identify, assess and allocate risks"],
    chapters: LESSONS.preparation,
    requires: null,
    finalExamHref: "/exam/preparation",
  },
  {
    slug: "cp3p-execution",
    level: "execution",
    title: "CP3P Execution",
    shortTitle: "CP3P Execution",
    description: "Drafting the tender and contract, running the tender to financial close, and managing the contract through construction, operations and handback (PPP Guide 2026, chapter 5 §6–§10, chapters 6–7).",
    exam: "Exam: scenario-based · 80 marks · 150 minutes · open book · pass 40/80",
    tag: null,
    icon: "trending",
    emoji: "🏗️",
    outcomes: ["Draft qualification and evaluation criteria", "Run a fair tender through to financial close", "Manage change, claims and disputes in construction", "Manage performance, termination and handback"],
    chapters: LESSONS.execution,
    requires: null,
    finalExamHref: "/exam/execution",
  },
];

export function getCourse(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug);
}

export function getChapter(slug: string, chapterId: string) {
  const course = getCourse(slug);
  if (!course) return undefined;
  const index = course.chapters.findIndex((ch) => ch.id === chapterId);
  if (index === -1) return undefined;
  return {
    course,
    chapter: course.chapters[index],
    index,
    prev: index > 0 ? course.chapters[index - 1] : null,
    next: index < course.chapters.length - 1 ? course.chapters[index + 1] : null,
  };
}

export function courseMinutes(course: Course) {
  return course.chapters.reduce((sum, ch) => sum + ch.minutes, 0);
}

export function formatMinutes(total: number) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${m} min`;
}

export const TOTAL_CHAPTERS = COURSES.reduce((s, c) => s + c.chapters.length, 0);

/** Eski manzillar (v1 kurslari) — yangi kursga yo'naltiriladi. */
export const LEGACY_COURSE_REDIRECTS: Record<string, CourseSlug> = {
  "davlat-xususiy-sheriklik": "cp3p-foundation",
  "cp3p-implementation": "cp3p-execution",
};

export { PASS_RATIO, lessonTest, passMarkFor, type TestItem } from "../lib/learning-path";
