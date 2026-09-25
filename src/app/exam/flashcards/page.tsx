import { redirect } from "next/navigation";
import { SectionShell } from "@/components/layouts/section-shell";
import { getCurrentUser } from "@/services/user-service";
import { FlashcardsClient } from "@/features/exam/mock-exam-client";
import type { Flashcard } from "@/features/exam/flashcards";
import deck from "@/content/exam/flashcards/glossary.json";

export const metadata = { title: "Glossary flashcards" };

export default async function FlashcardsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?next=/exam/flashcards");
  return (
    <SectionShell eyebrow="CP3P · PPP Guide 2026 Glossary" title="Glossary and acronym flashcards." description="The Foundation exam tests the Glossary directly, and the Practitioner exams assume you know it. Recall each term before you flip it; cards you miss come back sooner (spaced repetition). Ten minutes a day is enough.">
      <FlashcardsClient cards={deck as Flashcard[]} />
    </SectionShell>
  );
}
