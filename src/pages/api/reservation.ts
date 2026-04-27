export const prerender = false;

import type { APIRoute } from "astro";
import {
  reservationSchema,
  MEAL_LABELS,
  type ReservationInput,
} from "~/lib/reservation-schema";
import { isClosed } from "~/config/closures";
import { sendMailgun } from "~/lib/mailgun";

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const formatDateFR = (iso: string) => {
  // "2026-04-30" -> "jeudi 30 avril 2026"
  const d = new Date(`${iso}T12:00:00`);
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

function buildEmailBody(d: ReservationInput): {
  subject: string;
  text: string;
  html: string;
} {
  const dateFR = formatDateFR(d.date);
  const meal = MEAL_LABELS[d.mealType];
  const guests = `${d.adultes} adulte${d.adultes > 1 ? "s" : ""}${
    d.enfants > 0
      ? ` + ${d.enfants} enfant${d.enfants > 1 ? "s" : ""}`
      : ""
  }`;

  const subject = `Réservation — ${d.prenom} ${d.nom} — ${dateFR} ${d.time}`;

  const text = [
    `Nouvelle demande de réservation`,
    ``,
    `Nom        : ${d.prenom} ${d.nom}`,
    `Téléphone  : ${d.telephone}`,
    `E-mail     : ${d.email ?? "(non fourni)"}`,
    `Date       : ${dateFR}`,
    `Heure      : ${d.time}`,
    `Formule    : ${meal}`,
    `Convives   : ${guests}`,
    `Note       : ${d.note ?? "(aucune)"}`,
  ].join("\n");

  const html = `
    <div style="font-family: -apple-system, system-ui, sans-serif; color: #1F2A1A; max-width: 560px;">
      <h2 style="font-family: Georgia, serif; color: #3E5A2C; margin: 0 0 16px;">Nouvelle réservation</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 6px 0; color: #6B8E4E; width: 110px;">Nom</td><td style="padding: 6px 0;"><strong>${escapeHtml(d.prenom)} ${escapeHtml(d.nom)}</strong></td></tr>
        <tr><td style="padding: 6px 0; color: #6B8E4E;">Téléphone</td><td style="padding: 6px 0;">${escapeHtml(d.telephone)}</td></tr>
        <tr><td style="padding: 6px 0; color: #6B8E4E;">E-mail</td><td style="padding: 6px 0;">${d.email ? escapeHtml(d.email) : "<em>non fourni</em>"}</td></tr>
        <tr><td style="padding: 6px 0; color: #6B8E4E;">Date</td><td style="padding: 6px 0;">${escapeHtml(dateFR)}</td></tr>
        <tr><td style="padding: 6px 0; color: #6B8E4E;">Heure</td><td style="padding: 6px 0;">${escapeHtml(d.time)}</td></tr>
        <tr><td style="padding: 6px 0; color: #6B8E4E;">Formule</td><td style="padding: 6px 0;">${escapeHtml(meal)}</td></tr>
        <tr><td style="padding: 6px 0; color: #6B8E4E;">Convives</td><td style="padding: 6px 0;">${escapeHtml(guests)}</td></tr>
        ${d.note ? `<tr><td style="padding: 6px 0; color: #6B8E4E; vertical-align: top;">Note</td><td style="padding: 6px 0;">${escapeHtml(d.note)}</td></tr>` : ""}
      </table>
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

  const parsed = reservationSchema.safeParse(body);
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

  // Server-side closure re-check (don't trust the client).
  const closure = isClosed(data.date);
  if (closure.closed) {
    return json(400, {
      ok: false,
      error: "closed",
      reason: closure.reason,
    });
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
    console.error("[reservation] mailgun send failed:", err);
    return json(502, { ok: false, error: "send_failed" });
  }

  return json(200, { ok: true });
};
