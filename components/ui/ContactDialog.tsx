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
    confirmation = useRef<HTMLHeadingElement>(null),
    busy = useRef(false);
  const [errors, setErrors] = useState<BriefErrors>({}),
    [status, setStatus] = useState(""),
    [sending, setSending] = useState(false),
    [sent, setSent] = useState(false),
    [available, setAvailable] = useState<boolean | null>(null),
    [photography, setPhotography] = useState(
      initialService === "Event Photography",
    );
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
      .catch(() => {
        if (!controller.signal.aborted) setAvailable(false);
      });
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
  useEffect(() => {
    if (sent) confirmation.current?.focus();
  }, [sent]);
  function read() {
    const d = new FormData(form.current!);
    return validateBrief({
      name: d.get("name"),
      email: d.get("email"),
      company: d.get("company"),
      jobTitle: d.get("jobTitle"),
      market: d.get("market"),
      services: d.getAll("service"),
      keywords: d.get("keywords"),
      message: d.get("message"),
      budget: d.get("budget"),
      privacy: d.get("privacy") === "on",
      website: d.get("website"),
    });
  }
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (busy.current || available === null) return;
    const { value, errors: found } = read();
    setErrors(found);
    setStatus("");
    if (Object.keys(found).length) return;
    if (!available) {
      const subject = encodeURIComponent("Project inquiry for HUGs Creative");
      const body = encodeURIComponent(
        formatBrief(value).replace(/\r?\n/g, "\r\n").toWellFormed(),
      );
      window.location.href = `mailto:${site.contactEmail}?subject=${subject}&body=${body}`;
      setStatus("Send the draft from your email app to share your brief.");
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
        if (r.status === 503) setAvailable(false);
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
        "We couldn’t confirm sending. Please try again or contact us by email.",
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
  const attrs = (key: keyof BriefErrors, hint?: string) => ({
    "aria-invalid": !!errors[key],
    "aria-describedby":
      [hint, errors[key] && `error-${key}`].filter(Boolean).join(" ") ||
      undefined,
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
      <p className="contact-intro">A rough idea is a great place to start.</p>
      {sent ? (
        <div className="brief-success" role="status">
          <h3 ref={confirmation} tabIndex={-1}>
            Brief sent
          </h3>
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
            <div className="form-pair">
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
              <label>
                Job title (optional)
                <input
                  id="brief-jobTitle"
                  name="jobTitle"
                  autoComplete="organization-title"
                  maxLength={120}
                  placeholder="e.g. Brand Manager"
                  {...attrs("jobTitle")}
                />
                {error("jobTitle")}
              </label>
            </div>
            <label>
              <span id="brief-market-label">Target market (optional)</span>
              <span id="brief-market-hint" className="brief-hint">
                Where do you want to reach people?
              </span>
              <input
                id="brief-market"
                name="market"
                aria-labelledby="brief-market-label"
                maxLength={160}
                placeholder="e.g. UK, US, or worldwide"
                {...attrs("market", "brief-market-hint")}
              />
              {error("market")}
            </label>
            <fieldset
              id="brief-services"
              tabIndex={-1}
              className="service-choices"
              {...attrs("services")}
            >
              <legend>What can we help with? Select all that apply.</legend>
              {serviceOptions.map((s) => (
                <label key={s}>
                  <input
                    type="checkbox"
                    name="service"
                    value={s}
                    defaultChecked={s === initialService}
                    onChange={
                      s === "Event Photography"
                        ? (e) => setPhotography(e.target.checked)
                        : undefined
                    }
                  />
                  <span>{s}</span>
                </label>
              ))}
            </fieldset>
            {error("services")}
            <label>
              <span id="brief-keywords-label">
                What’s on your mind? (optional)
              </span>
              <span className="brief-hint" id="brief-keywords-hint">
                Give us up to five words or phrases about the idea, the feel, or
                what you hope it does.
              </span>
              <input
                id="brief-keywords"
                name="keywords"
                aria-labelledby="brief-keywords-label"
                placeholder="e.g. Coffee, playful, local regulars, launch buzz"
                maxLength={240}
                {...attrs("keywords", "brief-keywords-hint")}
              />
              {error("keywords")}
            </label>
            <label>
              <span id="brief-message-label">
                What would you like us to make? (optional)
              </span>
              <span className="brief-hint" id="brief-message-hint">
                Tell us what you’d like help with, what it’s for, and what you
                already have. Share a link if it helps.
                {photography &&
                  " Planning an event? Drop in the city or date if you know it."}
              </span>
              <textarea
                id="brief-message"
                name="message"
                aria-labelledby="brief-message-label"
                rows={3}
                placeholder="e.g. We’re opening a coffee shop and need a menu and Instagram graphics. We already have a logo."
                maxLength={6000}
                defaultValue={project ? `Inspired by ${project}. ` : ""}
                {...attrs("message", "brief-message-hint")}
              />
              {error("message")}
            </label>
            <label>
              Estimated budget in USD (optional)
              <input
                id="brief-budget"
                name="budget"
                maxLength={120}
                placeholder="e.g. $3,000 or $3,000–$5,000"
                {...attrs("budget")}
              />
              {error("budget")}
            </label>
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
              <button
                className="glass-button glass-primary"
                type="submit"
                disabled={sending || available === null}
              >
                {sending
                  ? "Sending…"
                  : available === false
                    ? "Open email draft"
                    : "Send project brief"}
              </button>
            </div>
            <p className="contact-data-note">
              {available === false
                ? "Your email app opens with your brief filled in. Send it there to get in touch."
                : "We’ll use these details to review your project and reply by email."}
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
