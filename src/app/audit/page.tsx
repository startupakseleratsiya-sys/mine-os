import { SectionShell } from "@/components/layouts/section-shell";
import { BaimTest } from "@/features/baim/baim-test";

export const metadata = { title: "Audit testi" };

export default function AuditPage() {
  return (
    <SectionShell
      eyebrow="BAIM audit"
      title="Auditorlik imtihoni trenajyori"
      description="Tashqi audit malaka imtihoniga tayyorgarlik: ruscha va o‘zbekcha savollar bazasi. O‘rganish rejimida to‘g‘ri javob darhol ko‘rinadi — o‘qib yodlaysiz; Mashq rejimida o‘zingizni sinaysiz; Imtihon rejimida 60 ta tasodifiy savol, 75% o‘tish chegarasi."
    >
      <BaimTest />
    </SectionShell>
  );
}
