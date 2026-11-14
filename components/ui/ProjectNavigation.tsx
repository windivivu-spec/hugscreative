"use client";
import { useEffect, useState } from "react";
import { services } from "@/data/services";

export default function ProjectNavigation() {
  const [active, setActive] = useState(services[0].slug);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-15% 0px -65% 0px" },
    );
    services.forEach((service) => {
      const element = document.getElementById(service.slug);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);
  return (
    <nav
      className="project-disciplines"
      aria-label="Browse projects by service"
    >
      {services.map((service) => (
        <a
          key={service.slug}
          href={`#${service.slug}`}
          onClick={() => setActive(service.slug)}
          aria-current={active === service.slug ? "location" : undefined}
        >
          {service.shortTitle}
        </a>
      ))}
    </nav>
  );
}
