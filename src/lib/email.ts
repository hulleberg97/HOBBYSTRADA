import nodemailer, { type Transporter } from "nodemailer";

type Mail = { to: string; subject: string; text: string; replyTo?: string };

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
export async function sendEmail({ to, subject, text, replyTo }: Mail) {
  const mailer = smtp();
  if (mailer) {
    try {
      await mailer.sendMail({ from: from(), to, subject, text, replyTo });
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
    body: JSON.stringify({ from: from(), to, subject, text, reply_to: replyTo }),
  });
  if (!res.ok) console.error("E-post feilet", res.status, await res.text());
  return res.ok;
}
