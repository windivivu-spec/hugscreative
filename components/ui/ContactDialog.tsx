"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { CloseIcon } from "./Icons";
import {
  validateBrief,
  formatBrief,
  serviceOptions,
  type BriefErrors,
} from "@/lib/brief";
import { site } from "@/data/site";
export default function ContactDialog({
  onClose,
  initialService = "",
  project = "",
}: {
  onClose: () => void;
  initialService?: string;
  project?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null),
    form = useRef<HTMLFormElement>(null),
    summary = useRef<HTMLDivElement>(null),
    busy = useRef(false);
  const [errors, setErrors] = useState<BriefErrors>({}),
    [status, setStatus] = useState(""),
    [sending, setSending] = useState(false),
    [sent, setSent] = useState(false),
    [available, setAvailable] = useState(false);
  useEffect(() => {
    const focused = document.activeElement as HTMLElement | null;
    const d = dialog.current,
      old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    d?.showModal();
    const controller = new AbortController();
    fetch("/api/contact", { signal: controller.signal })
      .then((r) => r.json())
      .then((v) => setAvailable(v.available === true))
      .catch(() => {});
    return () => {
      controller.abort();
      d?.close();
      document.body.style.overflow = old;
      focused?.focus({ preventScroll: true });
    };
  }, []);
  useEffect(() => {
    if (Object.keys(errors).length) summary.current?.focus();
  }, [errors]);
  function read() {
    const d = new FormData(form.current!);
    return validateBrief({
      name: d.get("name"),
      email: d.get("email"),
      company: d.get("company"),
      services: d.getAll("service"),
      message: d.get("message"),
      budget: d.get("budget"),
      deadline: d.get("deadline"),
      privacy: d.get("privacy") === "on",
      website: d.get("website"),
    });
  }
  function download() {
    const { value } = read();
    const url = URL.createObjectURL(
      new Blob(
        [
          formatBrief(value) +
            "\nSaved locally. This brief has not been sent.\n",
        ],
        { type: "text/plain;charset=utf-8" },
      ),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "hugs-creative-project-brief.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus("Your brief is ready to save. No message was sent.");
  }
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (busy.current) return;
    const { value, errors: found } = read();
    setErrors(found);
    setStatus("");
    if (Object.keys(found).length) return;
    if (!available) {
      setStatus(
        "Your brief is complete. Online sending will be added when contact details are confirmed. Save a copy below.",
      );
      return;
    }
    busy.current = true;
    setSending(true);
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });
      const result = await r.json();
      if (!r.ok) {
        if (result.errors) setErrors(result.errors);
        setStatus(
          result.error || "We couldn’t send your brief. Please try again.",
        );
        return;
      }
      if (result.sent !== true) throw new Error("Unconfirmed");
      setSent(true);
      setStatus(
        "Thanks—your brief has been sent. We’ll be in touch using the email you provided.",
      );
    } catch {
      setStatus(
        "We couldn’t confirm sending. Please try again or save a copy below.",
      );
    } finally {
      busy.current = false;
      setSending(false);
    }
  }
  const error = (key: keyof BriefErrors) =>
    errors[key] ? (
      <span id={`error-${key}`} className="field-error">
        {errors[key]}
      </span>
    ) : null;
  const attrs = (key: keyof BriefErrors) => ({
    "aria-invalid": !!errors[key],
    "aria-describedby": errors[key] ? `error-${key}` : undefined,
  });
  return (
    <dialog
      ref={dialog}
      className="contact-dialog"
      onCancel={(e) => {
        e.preventDefault();
        if (!busy.current) onClose();
      }}
      aria-labelledby="contact-dialog-title"
    >
      <div className="contact-dialog-top">
        <span className="eyebrow">A CONVERSATION STARTS WITH AN IDEA</span>
        <button
          className="circle-button"
          onClick={onClose}
          aria-label="Close project brief"
          disabled={sending}
        >
          <CloseIcon />
        </button>
      </div>
      <h2 id="contact-dialog-title">
        Tell us about
        <br />
        your <em>project.</em>
      </h2>
      <p className="contact-demo-note">
        Share your goals, your ideas, and the details that matter.
        {!available &&
          " This is a preview: save your brief below while contact details are being finalized."}
      </p>
      {sent ? (
        <div className="brief-success" role="status">
          <h3>A good beginning.</h3>
          <p>{status}</p>
          <button className="glass-button" onClick={onClose}>
            Back to exploring
          </button>
        </div>
      ) : (
        <form ref={form} onSubmit={submit} noValidate aria-busy={sending}>
          <fieldset disabled={sending} className="brief-fields">
            {Object.keys(errors).length > 0 && (
              <div
                ref={summary}
                className="error-summary"
                tabIndex={-1}
                role="alert"
              >
                <strong>A few details need your attention.</strong>
                <ul>
                  {Object.entries(errors).map(([k, v]) => (
                    <li key={k}>
                      <a
                        href={`#brief-${k}`}
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById(`brief-${k}`)?.focus();
                        }}
                      >
                        {v}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="form-pair">
              <label>
                Your name
                <input
                  id="brief-name"
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={120}
                  {...attrs("name")}
                  placeholder="Alex Taylor"
                />
                {error("name")}
              </label>
              <label>
                Email address
                <input
                  id="brief-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  {...attrs("email")}
                  placeholder="alex@yourbrand.com"
                />
                {error("email")}
              </label>
            </div>
            <label>
              Company or website (optional)
              <input
                id="brief-company"
                name="company"
                autoComplete="organization"
                maxLength={300}
                {...attrs("company")}
                placeholder="Your brand or website"
              />
              {error("company")}
            </label>
            <fieldset
              id="brief-services"
              tabIndex={-1}
              className="service-choices"
              {...attrs("services")}
            >
              <legend>Services needed — choose all that apply</legend>
              {serviceOptions.map((s) => (
                <label key={s}>
                  <input
                    type="checkbox"
                    name="service"
                    value={s}
                    defaultChecked={s === initialService}
                  />
                  <span>{s}</span>
                </label>
              ))}
            </fieldset>
            {error("services")}
            <label>
              Project details
              <textarea
                id="brief-message"
                name="message"
                rows={4}
                required
                maxLength={6000}
                defaultValue={
                  project
                    ? `I’d like to discuss a project similar to ${project}. `
                    : ""
                }
                {...attrs("message")}
                placeholder="Your goals, deliverables, and available assets. Photography? Include the city, event date, and coverage hours."
              />
              {error("message")}
            </label>
            <div className="form-pair">
              <label>
                Budget in USD (optional)
                <input
                  id="brief-budget"
                  name="budget"
                  maxLength={120}
                  placeholder="Your estimate, or not sure yet"
                  {...attrs("budget")}
                />
                {error("budget")}
              </label>
              <label>
                Target deadline (optional)
                <input
                  id="brief-deadline"
                  type="date"
                  name="deadline"
                  {...attrs("deadline")}
                />
                {error("deadline")}
              </label>
            </div>
            <label className="honeypot" aria-hidden="true">
              Leave this field empty
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
            <label className="privacy-check">
              <input
                id="brief-privacy"
                name="privacy"
                type="checkbox"
                {...attrs("privacy")}
              />
              <span>
                I’ve read the{" "}
                <Link href="/privacy" target="_blank">
                  privacy notice (opens in a new tab)
                </Link>{" "}
                and understand how my brief is handled.
              </span>
            </label>
            {error("privacy")}
            <div className="brief-actions">
              {
                <button
                  className="glass-button glass-primary"
                  type="submit"
                  disabled={sending}
                >
                  {sending
                    ? "Sending your brief…"
                    : available
                      ? "Send project brief"
                      : "Review project brief"}
                </button>
              }
              <button
                className={`glass-button ${available ? "" : "glass-primary"}`}
                type="button"
                onClick={download}
              >
                Save a copy of my brief
              </button>
            </div>
            {site.contactEmail && (
              <a className="brief-email" href={`mailto:${site.contactEmail}`}>
                {site.contactEmail}
              </a>
            )}
            <p className="contact-data-note">
              {available
                ? "Your details are used only to respond to this inquiry."
                : "Preview mode: saving creates a file on your device. Nothing is sent or stored on our server."}
            </p>
            <p role="status" className="brief-status">
              {status}
            </p>
          </fieldset>
        </form>
      )}
    </dialog>
  );
}
