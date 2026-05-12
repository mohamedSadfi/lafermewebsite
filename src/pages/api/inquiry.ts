export const prerender = false;

import type { APIRoute } from "astro";
import {
  inquirySchema,
  INQUIRY_LABELS,
  type InquiryInput,
} from "~/lib/inquiry-schema";
import { sendMailgun } from "~/lib/mailgun";

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const formatDateFR = (iso: string) => {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
};

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

function buildEmailBody(d: InquiryInput) {
  const typeLabel = INQUIRY_LABELS[d.inquiryType];
  const subject = `Demande [${typeLabel}] — ${d.prenom} ${d.nom}`;

  const lines: string[] = [
    `Nouvelle demande via le site`,
    ``,
    `Type       : ${typeLabel}`,
    `Nom        : ${d.prenom} ${d.nom}`,
    `Téléphone  : ${d.telephone}`,
    `E-mail     : ${d.email ?? "(non fourni)"}`,
  ];
  if (d.preferredDate)
    lines.push(`Date envisagée : ${formatDateFR(d.preferredDate)}`);
  if (d.guestCount !== undefined)
    lines.push(`Nombre de personnes : ${d.guestCount}`);
  lines.push(``, `Message :`, d.message);

  const text = lines.join("\n");

  const row = (label: string, value: string) =>
    `<tr><td style="padding: 6px 0; color: #6B8E4E; width: 130px; vertical-align: top;">${label}</td><td style="padding: 6px 0;">${value}</td></tr>`;

  const html = `
    <div style="font-family: -apple-system, system-ui, sans-serif; color: #1F2A1A; max-width: 600px;">
      <h2 style="font-family: Georgia, serif; color: #3E5A2C; margin: 0 0 4px;">Nouvelle demande</h2>
      <p style="margin: 0 0 16px; color: #6B8E4E;"><em>${escapeHtml(typeLabel)}</em></p>
      <table style="width: 100%; border-collapse: collapse;">
        ${row("Nom", `<strong>${escapeHtml(d.prenom)} ${escapeHtml(d.nom)}</strong>`)}
        ${row("Téléphone", escapeHtml(d.telephone))}
        ${row("E-mail", d.email ? escapeHtml(d.email) : "<em>non fourni</em>")}
        ${d.preferredDate ? row("Date envisagée", escapeHtml(formatDateFR(d.preferredDate))) : ""}
        ${d.guestCount !== undefined ? row("Nb personnes", String(d.guestCount)) : ""}
      </table>
      <hr style="border: 0; border-top: 1px solid #E5DFD2; margin: 20px 0;" />
      <p style="margin: 0 0 8px; color: #6B8E4E; font-size: 12px; text-transform: uppercase; letter-spacing: 0.16em;">Message</p>
      <p style="white-space: pre-wrap; margin: 0;">${escapeHtml(d.message)}</p>
    </div>
  `.trim();

  return { subject, text, html };
}

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json(400, { ok: false, error: "invalid_json" });
  }

  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    return json(400, {
      ok: false,
      error: "validation",
      issues: parsed.error.flatten().fieldErrors,
    });
  }

  const data = parsed.data;

  // Honeypot — silently accept so bots think they succeeded.
  if (data.website && data.website.length > 0) {
    return json(200, { ok: true });
  }

  try {
    const { subject, text, html } = buildEmailBody(data);
    await sendMailgun({
      subject,
      text,
      html,
      replyTo: data.email,
    });
  } catch (err) {
    console.error("[inquiry] mailgun send failed:", err);
    return json(502, { ok: false, error: "send_failed" });
  }

  return json(200, { ok: true });
};
