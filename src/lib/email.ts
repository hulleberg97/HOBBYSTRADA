import nodemailer, { type Transporter } from "nodemailer";

export type Attachment = { filename: string; content: Buffer; contentType: string };
type Mail = { to: string; subject: string; text: string; html?: string; replyTo?: string; attachments?: Attachment[] };

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

/** Sender e-post via SMTP (Domene AS). Returnerer false hvis e-post ikke er satt opp eller sendingen feilet. */
export async function sendEmail({ to, subject, text, html, replyTo, attachments }: Mail) {
  if (isPlaceholderEmail(to)) return false;
  const mailer = smtp();
  if (mailer) {
    try {
      await mailer.sendMail({ from: from(), to, subject, text, html, replyTo, attachments });
      return true;
    } catch (e) {
      console.error("E-post feilet", e);
      return false;
    }
  }
  // Ingen reserveløsning via andre leverandører: personvernerklæringen nevner bare Domene AS
  return false;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Kroner uten øre når beløpet er helt, f.eks. «10 000 kr». */
export const kr = (price: number) => `${new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 2 }).format(price)} kr`;

type Item = { title: string; image?: string | null; price?: number | null; url: string };

/**
 * E-post i HOBBYSTRADA-design. Toppen er ett bilde, så den ser lik ut også når e-postappen bruker mørk modus.
 * Bygget med tabeller, så den holder formen i Gmail, Outlook og Apple Mail. All tekst escapes.
 */
export function brandedEmail({
  title,
  intro,
  quote,
  item,
  code,
  button,
  url,
  outro,
  reason = "Du får denne e-posten fordi du har en konto på HOBBYSTRADA.",
}: {
  title: string;
  intro: string;
  quote?: string;
  item?: Item;
  code?: string;
  button?: string;
  url?: string;
  outro: string;
  reason?: string;
}) {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.hobbystrada.no";
  const font = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
  const image = item?.image?.startsWith("/") ? site + item.image : item?.image;
  const card = item
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;border:1px solid #e5e7eb;border-radius:14px;border-collapse:separate">
        <tr>
          ${image ? `<td width="76" style="padding:12px 0 12px 12px;vertical-align:middle"><a href="${esc(item.url)}"><img src="${esc(image!)}" width="64" height="88" alt="" style="display:block;width:64px;height:88px;object-fit:cover;border-radius:8px;border:0;background:#f1f5f9"></a></td>` : ""}
          <td style="padding:14px 16px;vertical-align:middle;font-family:${font}">
            <a href="${esc(item.url)}" style="color:#0f1d2b;text-decoration:none;font-size:15px;font-weight:600;line-height:1.4">${esc(item.title)}</a>
            ${item.price ? `<div style="margin-top:4px;font-size:15px;font-weight:700;color:#9a7a2c">${esc(kr(item.price))}</div>` : ""}
          </td>
        </tr>
      </table>`
    : "";
  return `<!doctype html>
<html lang="no"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light only"><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:#f3f1ec">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(intro)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f1ec">
  <tr><td align="center" style="padding:28px 12px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px">
      <tr><td><a href="${site}" style="text-decoration:none"><img src="${site}/email/header.png" width="600" alt="HOBBYSTRADA" style="display:block;width:100%;max-width:600px;height:auto;border:0;border-radius:16px 16px 0 0;background:#0f1f39;color:#ffffff;font-family:${font};font-size:22px;font-weight:bold"></a></td></tr>
      <tr><td style="background:#ffffff;border-radius:0 0 16px 16px;padding:32px 32px 36px;font-family:${font};color:#0f1d2b">
        <h1 style="margin:0 0 10px;font-size:24px;line-height:1.25;font-weight:700;color:#0f1d2b">${esc(title)}</h1>
        <p style="margin:0 0 24px;font-size:16px;line-height:1.55;color:#475569">${esc(intro)}</p>
        ${card}
        ${quote ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px"><tr><td style="border-left:3px solid #cfa653;background:#f8f7f4;border-radius:0 12px 12px 0;padding:14px 18px;font-size:15px;line-height:1.55;color:#0f1d2b;white-space:pre-line">${esc(quote)}</td></tr></table>` : ""}
        ${code ? `<p style="margin:0 0 28px;padding:16px;background:#f8f7f4;border:1px solid #ece6d6;border-radius:12px;text-align:center;font-size:30px;font-weight:700;letter-spacing:8px;color:#0f1d2b">${esc(code)}</p>` : ""}
        ${
          button && url
            ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 28px"><tr><td style="border-radius:999px;background:#cfa653">
          <a href="${esc(url)}" style="display:inline-block;padding:15px 30px;font-family:${font};font-size:16px;font-weight:700;color:#0b1426;text-decoration:none;border-radius:999px">${esc(button)}&nbsp;&rarr;</a>
        </td></tr></table>`
            : ""
        }
        <p style="margin:0;font-size:14px;line-height:1.55;color:#64748b;white-space:pre-line">${esc(outro)}</p>
      </td></tr>
      <tr><td align="center" style="padding:22px 16px 0;font-family:${font};font-size:12px;line-height:1.6;color:#7c8594">
        <a href="${site}" style="color:#0f1d2b;font-weight:700;text-decoration:none;letter-spacing:.06em">HOBBYSTRADA</a><br>
        Fotballkort fra samlere<br>
        ${esc(reason)}
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

/** Kontoer fra Vipps uten bekreftet e-post får en erstatningsadresse som ikke kan motta e-post. */
export const isPlaceholderEmail = (email: string | null | undefined) => Boolean(email?.endsWith("@brukere.hobbystrada.no"));
