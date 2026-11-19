import { createHash } from "node:crypto";
import { validateBrief, formatBrief } from "@/lib/brief";
export const runtime = "nodejs";
function resendConfigured() {
  return !!(process.env.RESEND_API_KEY && process.env.CONTACT_TO && process.env.CONTACT_FROM);
}
function googleConfigured() {
  return process.env.GOOGLE_FORM_ENABLED === "true" && !!process.env.BREVO_API_KEY;
}
export async function GET() {
  return Response.json(
    { available: googleConfigured() || resendConfigured() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
const attempts = new Map<string, { count: number; expires: number }>();
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const allowed = new Set([
    new URL(request.url).origin,
    ...(process.env.SITE_URL ? [new URL(process.env.SITE_URL).origin] : []),
  ]);
  const host = request.headers.get("host");
  if (host) allowed.add(`${new URL(request.url).protocol}//${host}`);
  if (!origin || !allowed.has(origin))
    return Response.json(
      { error: "Please submit the form from this website." },
      { status: 403 },
    );
  if (!request.headers.get("content-type")?.includes("application/json"))
    return Response.json(
      { error: "Use the project brief form." },
      { status: 415 },
    );
  const reader = request.body?.getReader();
  if (!reader)
    return Response.json({ error: "Your brief is empty." }, { status: 400 });
  let bytes = 0;
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 20000) {
        await reader.cancel();
        return Response.json(
          { error: "Your brief is too large." },
          { status: 413 },
        );
      }
      chunks.push(value);
    }
  } catch {
    return Response.json(
      { error: "We couldn’t read the brief. Please retry." },
      { status: 400 },
    );
  }
  let input: unknown;
  try {
    input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return Response.json(
      { error: "Your brief could not be read." },
      { status: 400 },
    );
  }
  const { value, errors } = validateBrief(input);
  if (value.website)
    return Response.json(
      { error: "Your brief could not be submitted." },
      { status: 400 },
    );
  if (Object.keys(errors).length)
    return Response.json(
      { error: "Please check the highlighted fields.", errors },
      { status: 422 },
    );
  if (!googleConfigured() && !resendConfigured())
    return Response.json(
      { error: "Online sending is unavailable. Please contact us by email." },
      { status: 503 },
    );
  const now = Date.now();
  for (const [key, item] of attempts)
    if (item.expires < now) attempts.delete(key);
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const key = createHash("sha256").update(ip).digest("hex");
  const entry = attempts.get(key) || { count: 0, expires: now + 900000 };
  if (entry.count >= 5)
    return Response.json(
      { error: "Too many attempts. Please try again in 15 minutes." },
      { status: 429, headers: { "Retry-After": "900" } },
    );
  entry.count++;
  attempts.set(key, entry);
  if (!googleConfigured()) {
    try {
      const idempotency = createHash("sha256").update(JSON.stringify(value)).digest("hex");
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
          "Idempotency-Key": `hugs-${idempotency}`,
        },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM,
          to: [process.env.CONTACT_TO],
          reply_to: value.email,
          subject: `HUGs Creative — Project inquiry from ${value.name.replace(/[\r\n]/g, " ")}`,
          text: formatBrief(value),
        }),
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok || typeof (await response.json()).id !== "string")
        throw new Error("Unconfirmed provider response");
      return Response.json({ sent: true });
    } catch {
      return Response.json(
        { error: "We couldn’t confirm sending. Please try again or contact us by email." },
        { status: 502 },
      );
    }
  }
  const fields = new URLSearchParams({
    "entry.1586598306": value.name,
    "entry.761418165": value.email,
    "entry.1254574661": value.jobTitle,
    "entry.259864300": value.market,
    "entry.998473899": value.company,
    "entry.1901273191": value.keywords,
    "entry.884494476": value.message,
    "entry.477626052": value.budget,
  });
  const serviceLabels: Record<string, string> = {
    "Graphic Design": "Graphic Design",
    "Illustration Design": "Illustration Design",
    "Website Design": "Web Design",
    "Video Editing & Motion Graphics": "Video Motion",
    "Event Photography": "Event Photographic",
    "Social Media Management": "Social Media Management",
    "Not sure yet": "Khác",
  };
  for (const service of value.services)
    fields.append("entry.563305243", serviceLabels[service]);
  try {
    const response = await fetch("https://docs.google.com/forms/d/e/1FAIpQLSeqba_P8qYsmaWY0p9XIluwdzGWbXWXbvtiK5j3f0PRJUdwNA/formResponse?hl=en", {
      method: "POST",
      body: fields,
      signal: AbortSignal.timeout(15000),
    });
    const confirmation = await response.text();
    if (!response.ok || !response.url.includes("/formResponse") ||
      !confirmation.includes("Your response has been recorded"))
      return Response.json(
        {
          error:
            "We couldn’t send your brief. Please try again or contact us by email.",
        },
        { status: 502 },
      );
    const brevoKey = process.env.BREVO_API_KEY;
    if (brevoKey) {
      try {
        const sent = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: { "api-key": brevoKey, "Content-Type": "application/json" },
          body: JSON.stringify({
            sender: { name: "HUGs Creative", email: "contact@hugscreative.com" },
            to: [{ email: value.email, name: value.name }],
            subject: "Thanks for reaching out to HUGs Creative",
            textContent: `Hi ${value.name},\n\nThanks for sharing your project with us. We've received your brief and will review the details. A member of our team will be in touch at this email address.\n\nBest,\nHUGs Creative\ncontact@hugscreative.com`,
          }),
          signal: AbortSignal.timeout(15000),
        });
        if (!sent.ok) throw new Error(`Brevo rejected email: ${sent.status}`);
      } catch (error) {
        console.error("Contact email delivery failed", error);
      }
    }
    return Response.json({ sent: true });
  } catch {
    return Response.json(
      {
        error:
          "We couldn’t confirm sending. Please try again or contact us by email.",
      },
      { status: 502 },
    );
  }
}
