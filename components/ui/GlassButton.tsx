"use client";
import type { CSSProperties, MouseEvent, ReactNode } from "react";
import { Arrow } from "./Icons";
type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  primary?: boolean;
  arrow?: boolean;
  className?: string;
  type?: "button" | "submit";
};
export default function GlassButton({
  children,
  href,
  onClick,
  primary = false,
  arrow = true,
  className = "",
  type = "button",
}: Props) {
  function reflect(event: MouseEvent<HTMLElement>) {
    const b = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      "--px",
      `${event.clientX - b.left}px`,
    );
    event.currentTarget.style.setProperty("--py", `${event.clientY - b.top}px`);
  }
  const shared = {
    className: `glass-button ${primary ? "glass-primary" : ""} ${className}`,
    onMouseMove: reflect,
    style: { "--px": "20%", "--py": "0%" } as CSSProperties,
  };
  const content = (
    <>
      <span>{children}</span>
      {arrow && <Arrow />}
    </>
  );
  return href ? (
    <a {...shared} href={href}>
      {content}
    </a>
  ) : (
    <button {...shared} type={type} onClick={onClick}>
      {content}
    </button>
  );
}
