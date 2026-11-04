"use client";
import type { ReactNode, MouseEvent } from "react";
export default function GlowCard({
  children,
  className = "",
  onClick,
  label,
}: {
  children: ReactNode;
  className?: string;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  label: string;
}) {
  return (
    <button
      className={`glow-card ${className}`}
      onClick={onClick}
      aria-label={label}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty(
          "--glow-x",
          `${e.clientX - r.left}px`,
        );
        e.currentTarget.style.setProperty("--glow-y", `${e.clientY - r.top}px`);
      }}
    >
      {children}
    </button>
  );
}
