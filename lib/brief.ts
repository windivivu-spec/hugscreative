import { serviceNames } from "../data/services.ts";

export const serviceOptions = [...serviceNames, "Not sure yet"] as const;
export type Brief = {
  name: string;
  email: string;
  company: string;
  jobTitle: string;
  market: string;
  services: string[];
  keywords: string;
  message: string;
  budget: string;
  timeline: string;
  deadline: string;
  privacy: boolean;
  website: string;
};
export type BriefErrors = Partial<Record<keyof Brief, string>>;
export function validateBrief(input: unknown): {
  value: Brief;
  errors: BriefErrors;
} {
  const source = (input && typeof input === "object" ? input : {}) as Record<
    string,
    unknown
  >;
  const str = (key: string) =>
    typeof source[key] === "string" ? (source[key] as string).trim() : "";
  const value: Brief = {
    name: str("name"),
    email: str("email"),
    company: str("company"),
    jobTitle: str("jobTitle"),
    market: str("market"),
    services: Array.isArray(source.services)
      ? [
          ...new Set(
            source.services.filter((v): v is string => typeof v === "string"),
          ),
        ]
      : [],
    keywords: str("keywords"),
    message: str("message"),
    budget: str("budget"),
    timeline: str("timeline"),
    deadline: str("deadline"),
    privacy: source.privacy === true,
    website: str("website"),
  };
  const errors: BriefErrors = {};
  if (value.name.length < 2 || value.name.length > 120)
    errors.name = "Enter your name (2–120 characters).";
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email) ||
    value.email.length > 254
  )
    errors.email = "Enter a valid email address.";
  if (value.company.length > 300)
    errors.company = "Keep the company or website under 300 characters.";
  if (value.jobTitle.length > 120)
    errors.jobTitle = "Use 120 characters or fewer for your job title.";
  if (value.market.length > 160)
    errors.market = "Use 160 characters or fewer for your target market.";
  if (
    !value.services.length ||
    value.services.some(
      (s) => !serviceOptions.includes(s as (typeof serviceOptions)[number]),
    )
  )
    errors.services = "Choose a service, or select “Not sure yet”.";
  if (value.keywords.length > 240)
    errors.keywords = "Use 240 characters or fewer for your keywords.";
  if (value.message.length > 6000)
    errors.message = "Use 6,000 characters or fewer.";
  if (value.budget.length > 120)
    errors.budget = "Keep your budget note under 120 characters.";
  if (value.timeline.length > 120)
    errors.timeline = "Keep your timeline under 120 characters.";
  if (
    value.deadline &&
    (!/^\d{4}-\d{2}-\d{2}$/.test(value.deadline) ||
      !Number.isFinite(Date.parse(value.deadline)) ||
      new Date(value.deadline).toISOString().slice(0, 10) !== value.deadline)
  )
    errors.deadline = "Enter a valid target date.";
  if (!value.privacy)
    errors.privacy = "Please read and acknowledge the privacy notice.";
  return { value, errors };
}
export function formatBrief(v: Brief) {
  const lines = [
    `Name: ${v.name}`,
    `Email: ${v.email}`,
    v.company && `Company / website: ${v.company}`,
    v.jobTitle && `Job title: ${v.jobTitle}`,
    v.market && `Target market: ${v.market}`,
    `Services: ${v.services.join(", ")}`,
    v.budget && `Budget (USD): ${v.budget}`,
    (v.timeline || v.deadline) && `Timeline: ${v.timeline || v.deadline}`,
    v.keywords && `\nKeywords: ${v.keywords}`,
    v.message && `\nWhat the client would like us to make\n${v.message}`,
  ];
  return `HUGs Creative — Project brief\n\n${lines.filter(Boolean).join("\n")}\n`;
}
