import { Fragment, type ReactNode } from "react";

/**
 * Dars va ssenariy matni uchun kichik, xavfsiz markdown: sarlavha, paragraf, ro'yxat, jadval, **qalin**, *kursiv*. HTML yo'q.
 * Blok ichida ketma-ket ro'yxat/jadval qatorlari alohida guruhlanadi («Kirish:\n- a\n- b» ham to'g'ri chiqadi).
 */
function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    out.push(tok.startsWith("**") ? <strong key={m.index}>{tok.slice(2, -2)}</strong> : <em key={m.index}>{tok.slice(1, -1)}</em>);
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const cells = (row: string) => row.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
const BULLET = /^\s*[-*•]\s+/;
const NUMBER = /^\s*\d+[.)]\s+/;
const TABLE = /^\s*\|/;
const HEADING = /^(#{1,4})\s+(.*)$/;

type Run = { kind: "ul" | "ol" | "table" | "text"; lines: string[] };

function runs(block: string): Run[] {
  const out: Run[] = [];
  for (const line of block.split("\n")) {
    if (!line.trim()) continue;
    const kind: Run["kind"] = TABLE.test(line) ? "table" : BULLET.test(line) ? "ul" : NUMBER.test(line) ? "ol" : "text";
    const prev = out[out.length - 1];
    if (prev && prev.kind === kind) prev.lines.push(line);
    else out.push({ kind, lines: [line] });
  }
  return out;
}

function renderRun(run: Run, key: string) {
  if (run.kind === "table") {
    const rows = run.lines.filter((l) => !/^\s*\|?\s*:?-{2,}/.test(l)).map(cells);
    const [head, ...body] = rows;
    return (
      <div key={key} className="overflow-x-auto rounded-xl border border-[#13251f]/10">
        <table className="w-full min-w-[420px] text-left text-sm leading-6">
          <thead className="bg-[#f3f1eb]"><tr>{head.map((c, i) => <th key={i} className="px-3 py-2 font-semibold">{inline(c)}</th>)}</tr></thead>
          <tbody>{body.map((r, ri) => <tr key={ri} className="border-t border-[#13251f]/5">{r.map((c, i) => <td key={i} className="px-3 py-2 align-top">{inline(c)}</td>)}</tr>)}</tbody>
        </table>
      </div>
    );
  }
  if (run.kind === "ul" || run.kind === "ol") {
    const items = run.lines.map((l, i) => <li key={i}>{inline(l.replace(run.kind === "ul" ? BULLET : NUMBER, ""))}</li>);
    return run.kind === "ol" ? <ol key={key} className="list-decimal space-y-1.5 pl-6">{items}</ol> : <ul key={key} className="list-disc space-y-1.5 pl-6">{items}</ul>;
  }
  if (run.lines.length === 1) {
    const h = HEADING.exec(run.lines[0]);
    if (h) return <p key={key} className="pt-2 font-semibold text-[#13251f]">{inline(h[2])}</p>;
  }
  return (
    <p key={key}>
      {run.lines.map((l, i) => {
        const h = HEADING.exec(l);
        return <Fragment key={i}>{i > 0 && <br />}{h ? <strong>{inline(h[2])}</strong> : inline(l)}</Fragment>;
      })}
    </p>
  );
}

export function Markdown({ text, className = "" }: { text: string; className?: string }) {
  const blocks = text.replace(/\r/g, "").split(/\n{2,}/);
  return (
    <div className={`space-y-3 text-[15px] leading-7 [overflow-wrap:anywhere] ${className}`}>
      {blocks.flatMap((block, bi) => runs(block).map((run, ri) => renderRun(run, `${bi}-${ri}`)))}
    </div>
  );
}
