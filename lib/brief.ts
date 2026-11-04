export const serviceOptions = [
  "Graphic Design",
  "Video Editing & Motion Graphics",
  "Website Design",
  "Social Media & Digital Content",
  "Event Photography",
  "Not sure yet",
] as const;
export type Brief = {
  name: string;
  email: string;
  company: string;
  services: string[];
  message: string;
  budget: string;
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
    services: Array.isArray(source.services)
      ? [
          ...new Set(
            source.services.filter((v): v is string => typeof v === "string"),
          ),
        ]
      : [],
    message: str("message"),
    budget: str("budget"),
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
  if (
    !value.services.length ||
    value.services.some(
      (s) => !serviceOptions.includes(s as (typeof serviceOptions)[number]),
    )
  )
    errors.services = "Choose a service, or select “Not sure yet”.";
  if (value.message.length < 20 || value.message.length > 6000)
    errors.message = "Tell us a little more (20–6,000 characters).";
  if (value.budget.length > 120)
    errors.budget = "Keep your budget note under 120 characters.";
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
  return `HUGs Creative — Project brief\n\nName: ${v.name}\nEmail: ${v.email}\nCompany / website: ${v.company || "Not provided"}\nServices: ${v.services.join(", ")}\nBudget: ${v.budget || "Not sure yet"}\nTarget deadline: ${v.deadline || "Not provided"}\n\nProject details\n${v.message}\n`;
}
