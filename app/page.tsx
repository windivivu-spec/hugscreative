"use client";
import { useState, useCallback } from "react";
import Navbar from "@/components/layout/Navbar";
import ReelSection from "@/components/sections/ReelSection";
import Partnership from "@/components/sections/Partnership";
import Hero from "@/components/sections/Hero";
import ServicesShowcase from "@/components/sections/ServicesShowcase";
import MarqueeSection from "@/components/sections/MarqueeSection";
import RotundaPortfolio from "@/components/sections/RotundaPortfolio";
import WorkArchive from "@/components/sections/WorkArchive";
import Process from "@/components/sections/Process";
import AboutProcess from "@/components/sections/AboutProcess";
import ServiceScope from "@/components/sections/ServiceScope";
import FAQ from "@/components/sections/FAQ";
import ContactFooter from "@/components/sections/ContactFooter";
import ProjectDetail from "@/components/ui/ProjectDetail";
import ContactDialog from "@/components/ui/ContactDialog";
import DebugPanel from "@/components/DebugPanel";
import { projects, type Project } from "@/data/projects";
export default function Home() {
  const [selected, setSelected] = useState<{
    project: Project;
    origin?: DOMRect;
  } | null>(null);
  const [contact, setContact] = useState<{
    service?: string;
    project?: string;
  } | null>(null);
  const openContact = useCallback(
    (service?: string, project?: string) => setContact({ service, project }),
    [],
  );
  const openProject = useCallback(
    (project: Project, origin?: DOMRect) => setSelected({ project, origin }),
    [],
  );
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navbar onContact={() => openContact()} />
      <main id="main">
        <Hero onContact={() => openContact()} />
        <ReelSection />
        <RotundaPortfolio
          onOpen={openProject}
          paused={!!selected || !!contact}
        />
        <ServicesShowcase />
        <ServiceScope onContact={openContact} />
        <MarqueeSection />
        <WorkArchive onOpen={openProject} />
        <AboutProcess />
        <Process />
        <Partnership onContact={() => openContact()} />
        <FAQ />
        <ContactFooter onContact={() => openContact()} />
      </main>
      {selected && (
        <ProjectDetail
          project={selected.project}
          origin={selected.origin}
          onDiscuss={() => {
            const p = selected.project;
            setSelected(null);
            openContact(p.category, p.name);
          }}
          onClose={() => setSelected(null)}
          onNavigate={(delta) =>
            setSelected((v) =>
              v
                ? {
                    ...v,
                    project:
                      projects[
                        (projects.findIndex((p) => p.id === v.project.id) +
                          delta +
                          projects.length) %
                          projects.length
                      ],
                  }
                : null,
            )
          }
        />
      )}
      {contact && (
        <ContactDialog
          onClose={() => setContact(null)}
          initialService={contact.service}
          project={contact.project}
        />
      )}
      <DebugPanel />
    </>
  );
}
