import { SectionShell } from "@/components/layouts/section-shell";
import { BaimTest } from "@/features/baim/baim-test";

export const metadata = { title: "Audit testi" };

export default function AuditPage() {
  return (
    <SectionShell
      eyebrow="BAIM audit"
      title="Auditorlik imtihoni trenajyori"
      description="Tashqi audit malaka imtihoniga tayyorgarlik (ruscha va o‘zbekcha). O‘rganish — to‘g‘ri javob darhol ko‘rinadi; Mashq — o‘zingizni sinaysiz, natija saqlanadi; Imtihon — 60 ta tasodifiy savol, 3 soat, o‘tish 75%."
    >
      <BaimTest />
    </SectionShell>
  );
}
