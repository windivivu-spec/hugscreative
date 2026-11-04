import { createHash } from "node:crypto";
import { validateBrief, formatBrief } from "@/lib/brief";
export const runtime = "nodejs";
function configured() {
  return !!(
    process.env.RESEND_API_KEY &&
    process.env.CONTACT_TO &&
    process.env.CONTACT_FROM
  );
}
export async function GET() {
  return Response.json(
    { available: configured() },
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
  if (!configured())
    return Response.json(
      {
        error:
          "Online sending is not available yet. Download your brief to keep a copy.",
      },
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
  const idempotency = createHash("sha256")
    .update(JSON.stringify(value))
    .digest("hex");
  try {
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
    if (!response.ok)
      return Response.json(
        {
          error:
            "We couldn’t send your brief. Please try again or download a copy.",
        },
        { status: 502 },
      );
    const result = await response.json();
    if (typeof result.id !== "string")
      throw new Error("Invalid provider response");
    return Response.json({ sent: true });
  } catch {
    return Response.json(
      {
        error:
          "We couldn’t confirm sending. Please try again; duplicate protection is enabled.",
      },
      { status: 502 },
    );
  }
}
