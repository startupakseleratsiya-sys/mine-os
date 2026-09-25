/** CP3P darsi — PPP Guide 2026 asosida (kontent JSON'da, src/content/cp3p/<level>/). */
export type QuizQuestion = { question: string; options: string[]; answer: number; explanation: string };

export type Lesson = {
  id: string;
  level: "foundation" | "preparation" | "execution";
  order: number;
  title: string;
  minutes: number;
  guideRef: string;
  objectives: string[];
  sections: { heading: string; body: string }[];
  example: { title: string; body: string };
  examTraps: { trap: string; fix: string }[];
  keyTerms: { term: string; meaning: string }[];
  summary: string[];
  slides: { title: string; points: string[]; narration: string }[];
  quiz: QuizQuestion[];
};
