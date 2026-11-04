"use client";
import { useState } from "react";
import ContactDialog from "./ContactDialog";
import { Arrow } from "./Icons";
export default function CaseStudyContact({
  service,
  project,
}: {
  service: string;
  project: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="glass-button glass-primary"
        onClick={() => setOpen(true)}
      >
        Discuss a similar project <Arrow />
      </button>
      {open && (
        <ContactDialog
          onClose={() => setOpen(false)}
          initialService={service}
          project={project}
        />
      )}
    </>
  );
}
