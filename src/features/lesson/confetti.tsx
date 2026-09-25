"use client";

/** Yengil konfetti (CSS animatsiya, kutubxonasiz). prefers-reduced-motion'da ko'rinmaydi. */
const COLORS = ["#fbbf24", "#9fd3b8", "#ffffff", "#f472b6", "#60a5fa"];

export function Confetti({ pieces = 36 }: { pieces?: number }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden">
      {Array.from({ length: pieces }, (_, i) => (
        <span
          key={i}
          className="absolute top-[-12px] block h-3 w-2 rounded-sm"
          style={{
            left: `${(i * 37) % 100}%`,
            background: COLORS[i % COLORS.length],
            animation: `finora-confetti ${1.6 + (i % 5) * 0.25}s ${(i % 9) * 0.12}s ease-in forwards`,
            transform: `rotate(${i * 29}deg)`,
          }}
        />
      ))}
    </div>
  );
}
