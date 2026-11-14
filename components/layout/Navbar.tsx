"use client";
import { useEffect, useState, useRef } from "react";
import { Arrow, CloseIcon } from "@/components/ui/Icons";
import Link from "next/link";
const links = [
  ["Projects", "/work"],
  ["Services", "#services"],
  ["About", "#about"],
  ["Contact", "#contact"],
];
export default function Navbar({ onContact }: { onContact: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const header = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  useEffect(() => {
    if (!menu) return;
    const oldOverflow = document.body.style.overflow;
    const main = document.getElementById("main");
    const wasInert = main?.inert ?? false;
    if (main) main.inert = true;
    document.body.style.overflow = "hidden";
    const desktop = window.matchMedia("(min-width: 1001px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setMenu(false);
    };
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
        menuButton.current?.focus();
      }
      if (e.key === "Tab") {
        const controls = Array.from(
          header.current?.querySelectorAll<HTMLElement>("a, button") ?? [],
        ).filter((node) => node.getClientRects().length > 0);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    desktop.addEventListener("change", closeOnDesktop);
    window.addEventListener("keydown", close);
    return () => {
      if (main) main.inert = wasInert;
      document.body.style.overflow = oldOverflow;
      desktop.removeEventListener("change", closeOnDesktop);
      window.removeEventListener("keydown", close);
    };
  }, [menu]);
  return (
    <header
      ref={header}
      className={`navbar ${scrolled ? "is-scrolled" : ""} ${menu ? "menu-open" : ""}`}
    >
      <a
        href="#home"
        aria-label="HUGs Creative home"
        className="wordmark"
        onClick={() => setMenu(false)}
      >
        <img
          src="/hugs%20creative%20logo.png?v=3"
          alt="HUGs Creative"
          width="1322"
          height="490"
        />
      </a>
      <nav className="desktop-nav" aria-label="Main navigation">
        {links.map(([name, id]) => (
          <Link href={id} key={id}>
            {name}
          </Link>
        ))}
      </nav>
      <button
        className="nav-cta"
        aria-label="Start a project"
        onClick={() => {
          setMenu(false);
          onContact();
        }}
      >
        <span className="status-dot" /> START A PROJECT <Arrow />
      </button>
      <button
        ref={menuButton}
        className="menu-toggle"
        aria-label={menu ? "Close navigation" : "Open navigation"}
        aria-expanded={menu}
        aria-controls="mobile-navigation"
        onClick={() => setMenu(!menu)}
      >
        {menu ? (
          <CloseIcon />
        ) : (
          <>
            <span />
            <span />
          </>
        )}
      </button>
      {menu && (
        <nav
          id="mobile-navigation"
          className="mobile-nav"
          aria-label="Mobile navigation"
        >
          {links.map(([name, id], i) => (
            <Link
              key={id}
              href={id}
              onClick={() => {
                setMenu(false);
                menuButton.current?.focus();
              }}
            >
              <span>0{i + 1}</span>
              {name}
              <Arrow />
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
