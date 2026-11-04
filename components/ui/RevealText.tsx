import type { ReactNode } from "react";
export default function RevealText({
  lines,
  className = "",
}: {
  lines: ReactNode[];
  className?: string;
}) {
  return (
    <span className={`reveal-text ${className}`}>
      {lines.map((line, i) => (
        <span className="reveal-line" key={i}>
          <span style={{ animationDelay: `${0.18 + i * 0.22}s` }}>{line}</span>
        </span>
      ))}
    </span>
  );
}
