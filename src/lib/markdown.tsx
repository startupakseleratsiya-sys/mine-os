import React from "react";

/**
 * Markdown-lite renderer — tashqi kutubxonasiz.
 * Qo'llab-quvvatlaydi: #, ##, ###, >, -, •, 1., ---, **bold**, `code`.
 * Tutor javoblari va dars matni uchun bitta manba.
 */

function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
          return (
            <strong key={i} className="font-semibold text-[#13251f]">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
          return (
            <code key={i} className="rounded bg-[#eef1ec] px-1.5 py-0.5 text-[0.9em] text-[#163e32]">
              {part.slice(1, -1)}
            </code>
          );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
}

export function Markdown({
  text,
  size = "sm",
}: {
  text: string;
  size?: "sm" | "lg";
}) {
  const lg = size === "lg";
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const nodes: React.ReactNode[] = [];
  let list: { type: "ul" | "ol"; items: string[] } | null = null;

  const flushList = () => {
    if (!list) return;
    const key = `list-${nodes.length}`;
    if (list.type === "ul") {
      nodes.push(
        <ul key={key} className={`space-y-1.5 ${lg ? "my-4 pl-1" : "my-1"}`}>
          {list.items.map((item, i) => (
            <li key={i} className="flex gap-2.5">
              <span className={`mt-[0.6em] size-1.5 shrink-0 rounded-full bg-current opacity-70`} />
              <span className="flex-1">
                <Inline text={item} />
              </span>
            </li>
          ))}
        </ul>
      );
    } else {
      nodes.push(
        <ol key={key} className={`space-y-1.5 ${lg ? "my-4 pl-1" : "my-1"}`}>
          {list.items.map((item, i) => (
            <li key={i} className="flex gap-2.5">
              <span className="w-5 shrink-0 text-right font-semibold text-[#2a5e47]">{i + 1}.</span>
              <span className="flex-1">
                <Inline text={item} />
              </span>
            </li>
          ))}
        </ol>
      );
    }
    list = null;
  };

  lines.forEach((raw, i) => {
    const line = raw.trimEnd();
    const trimmed = line.trim();

    const ul = /^[-•*]\s+(.*)$/.exec(trimmed);
    const ol = /^\d+[.)]\s+(.*)$/.exec(trimmed);
    if (ul) {
      if (!list || list.type !== "ul") {
        flushList();
        list = { type: "ul", items: [] };
      }
      list.items.push(ul[1]);
      return;
    }
    if (ol) {
      if (!list || list.type !== "ol") {
        flushList();
        list = { type: "ol", items: [] };
      }
      list.items.push(ol[1]);
      return;
    }

    flushList();

    if (trimmed === "") {
      return;
    }
    if (trimmed === "---") {
      nodes.push(<hr key={i} className="my-6 border-[#13251f]/10" />);
      return;
    }
    if (trimmed.startsWith("### ")) {
      nodes.push(
        <h3 key={i} className={lg ? "mt-6 mb-2 text-lg font-bold text-[#0f2017]" : "mt-2 text-[15px] font-bold"}>
          <Inline text={trimmed.slice(4)} />
        </h3>
      );
      return;
    }
    if (trimmed.startsWith("## ")) {
      nodes.push(
        <h2 key={i} className={lg ? "mt-10 mb-3 text-2xl font-bold tracking-tight text-[#0f2017]" : "mt-3 text-base font-bold"}>
          <Inline text={trimmed.slice(3)} />
        </h2>
      );
      return;
    }
    if (trimmed.startsWith("# ")) {
      nodes.push(
        <h1 key={i} className={lg ? "mb-6 text-3xl font-extrabold tracking-tight text-[#0f2017] sm:text-4xl" : "mt-3 text-lg font-bold"}>
          <Inline text={trimmed.slice(2)} />
        </h1>
      );
      return;
    }
    if (trimmed.startsWith("> ")) {
      nodes.push(
        <blockquote
          key={i}
          className={`border-l-4 border-[#163e32] bg-[#dce7dd]/40 italic text-[#2a4a3d] ${
            lg ? "my-6 rounded-r-xl px-5 py-3" : "my-2 rounded-r-lg px-3 py-2 text-[13px]"
          }`}
        >
          <Inline text={trimmed.slice(2)} />
        </blockquote>
      );
      return;
    }
    nodes.push(
      <p key={i} className={lg ? "my-3 leading-7 text-[#3f4d47]" : ""}>
        <Inline text={trimmed} />
      </p>
    );
  });
  flushList();

  return (
    <div className={lg ? "text-[17px]" : "space-y-1.5 text-sm leading-6"}>{nodes}</div>
  );
}
