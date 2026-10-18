import nodemailer, { type Transporter } from "nodemailer";

type Mail = { to: string; subject: string; text: string; html?: string; replyTo?: string };

const from = () => process.env.EMAIL_FROM ?? "HOBBYSTRADA <post@hobbystrada.no>";

let transport: Transporter | undefined;

/** E-postserveren hos domene.no (SMTP_HOST, SMTP_USER, SMTP_PASS). */
function smtp() {
  const { SMTP_HOST: host, SMTP_USER: user, SMTP_PASS: pass } = process.env;
  if (!host || !user || !pass) return undefined;
  const port = Number(process.env.SMTP_PORT ?? 465);
  transport ??= nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
  return transport;
}

/** Sender e-post via SMTP, eller via Resend når RESEND_API_KEY er satt. Returnerer false hvis e-post ikke er satt opp. */
export async function sendEmail({ to, subject, text, html, replyTo }: Mail) {
  const mailer = smtp();
  if (mailer) {
    try {
      await mailer.sendMail({ from: from(), to, subject, text, html, replyTo });
      return true;
    } catch (e) {
      console.error("E-post feilet", e);
      return false;
    }
  }
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({ from: from(), to, subject, text, html, reply_to: replyTo }),
  });
  if (!res.ok) console.error("E-post feilet", res.status, await res.text());
  return res.ok;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** E-post i HOBBYSTRADA-design, likt e-postene fra Supabase. Teksten escapes. */
export function brandedEmail({
  title,
  intro,
  quote,
  button,
  url,
  outro,
}: {
  title: string;
  intro: string;
  quote?: string;
  button: string;
  url: string;
  outro: string;
}) {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.hobbystrada.no";
  return `<div style="background:#efefeb;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#0f1d2b">
  <div style="max-width:480px;margin:0 auto;background:#0f1f39;border-radius:16px 16px 0 0;padding:22px 32px">
    <a href="${site}" style="text-decoration:none"><img src="${site}/email/logo.png" width="245" height="40" alt="HOBBYSTRADA" style="display:block;border:0;width:245px;height:40px;color:#ffffff;font-size:20px;font-weight:bold"></a>
  </div>
  <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:0 0 16px 16px;padding:32px">
    <h1 style="margin:0 0 12px;font-size:22px">${esc(title)}</h1>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.5;color:#475569">${esc(intro)}</p>
    ${quote ? `<p style="margin:0 0 24px;padding:14px 16px;background:#f1f5f9;border-radius:12px;font-size:15px;line-height:1.5;color:#0f1d2b;white-space:pre-line">${esc(quote)}</p>` : ""}
    <p style="margin:0 0 24px"><a href="${esc(url)}" style="display:inline-block;background:#0f1d2b;color:#ffffff;text-decoration:none;font-weight:bold;font-size:15px;padding:14px 24px;border-radius:999px">${esc(button)}</a></p>
    <p style="margin:0;font-size:13px;line-height:1.5;color:#64748b">${esc(outro)}</p>
  </div>
  <p style="max-width:480px;margin:16px auto 0;font-size:12px;color:#64748b;text-align:center">HOBBYSTRADA · Fotballkort fra samlere i hele Norge · www.hobbystrada.no</p>
</div>`;
}
