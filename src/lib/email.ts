/** Sender e-post via Resend når RESEND_API_KEY er satt. Returnerer false hvis e-post ikke er satt opp. */
export async function sendEmail({ to, subject, text, replyTo }: { to: string; subject: string; text: string; replyTo?: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM ?? "HOBBYSTRADA <onboarding@resend.dev>",
      to,
      subject,
      text,
      reply_to: replyTo,
    }),
  });
  if (!res.ok) console.error("E-post feilet", res.status, await res.text());
  return res.ok;
}
