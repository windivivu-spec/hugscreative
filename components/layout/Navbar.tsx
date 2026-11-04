"use client";
import { useEffect, useState, useRef } from "react";
import { Arrow, CloseIcon } from "@/components/ui/Icons";
const links = [
  ["Work", "work"],
  ["Services", "services"],
  ["About", "about"],
  ["Contact", "contact"],
];
export default function Navbar({ onContact }: { onContact: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  useEffect(() => {
    if (!menu) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menu]);
  return (
    <header
      className={`navbar ${scrolled ? "is-scrolled" : ""} ${menu ? "menu-open" : ""}`}
    >
      <a href="#home" aria-label="HUGs Creative home" className="wordmark">
        HUGs<small className="wordmark-sub">Creative</small>
      </a>
      <nav className="desktop-nav" aria-label="Main navigation">
        {links.map(([name, id]) => (
          <a href={`#${id}`} key={id}>
            {name}
          </a>
        ))}
      </nav>
      <button className="nav-cta" onClick={onContact}>
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
            <a
              key={id}
              href={`#${id}`}
              onClick={() => {
                setMenu(false);
                menuButton.current?.focus();
              }}
            >
              <span>0{i + 1}</span>
              {name}
              <Arrow />
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
