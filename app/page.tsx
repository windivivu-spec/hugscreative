"use client";
import { useState, useCallback } from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import RotundaPortfolio from "@/components/sections/RotundaPortfolio";
import AboutProcess from "@/components/sections/AboutProcess";
import ServiceScope from "@/components/sections/ServiceScope";
import FAQ from "@/components/sections/FAQ";
import ContactFooter from "@/components/sections/ContactFooter";
import ProjectDetail from "@/components/ui/ProjectDetail";
import ContactDialog from "@/components/ui/ContactDialog";
import DebugPanel from "@/components/DebugPanel";
import { selectedProjects, type Project } from "@/data/projects";
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
        <RotundaPortfolio
          onOpen={openProject}
          paused={!!selected || !!contact}
        />
        <ServiceScope onContact={openContact} />
        <AboutProcess />
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
                      selectedProjects[
                        (selectedProjects.findIndex(
                          (p) => p.id === v.project.id,
                        ) +
                          delta +
                          selectedProjects.length) %
                          selectedProjects.length
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
