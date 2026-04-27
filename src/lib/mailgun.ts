/**
 * Mailgun client — server-only.
 *
 * Reads MAILGUN_* env vars at call time so missing config is reported
 * with a clear error rather than a misleading "TypeError: undefined is
 * not iterable" downstream. We use the messages.mime endpoint via
 * multipart/form-data so we don't need the official SDK.
 *
 * Region is selectable via MAILGUN_REGION ("us" | "eu") — the EU
 * endpoint must be used for accounts created in the EU region.
 */

interface MailParams {
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}

export async function sendMailgun(params: MailParams): Promise<void> {
  const apiKey = import.meta.env.MAILGUN_API_KEY;
  const domain = import.meta.env.MAILGUN_DOMAIN;
  const from = import.meta.env.MAILGUN_FROM;
  const to = import.meta.env.MAILGUN_TO;
  const region = (import.meta.env.MAILGUN_REGION ?? "us") as "us" | "eu";

  if (!apiKey || !domain || !from || !to) {
    throw new Error(
      "Mailgun not configured — set MAILGUN_API_KEY / MAILGUN_DOMAIN / MAILGUN_FROM / MAILGUN_TO.",
    );
  }

  const baseUrl =
    region === "eu" ? "https://api.eu.mailgun.net" : "https://api.mailgun.net";

  const form = new FormData();
  form.append("from", from);
  form.append("to", to);
  form.append("subject", params.subject);
  form.append("text", params.text);
  form.append("html", params.html);
  if (params.replyTo) form.append("h:Reply-To", params.replyTo);

  const auth = btoa(`api:${apiKey}`);

  const res = await fetch(`${baseUrl}/v3/${domain}/messages`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}` },
    body: form,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Mailgun ${res.status}: ${text || res.statusText}`);
  }
}
