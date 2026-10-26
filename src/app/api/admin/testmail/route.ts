import { NextResponse } from "next/server";
import { getUser, isAdmin } from "@/lib/auth";
import { boostConfirmation } from "@/lib/boost-mail";
import { sendEmail } from "@/lib/email";
import { adminClient } from "@/lib/supabase-admin";

/** Admin: send en test av bekreftelsen for annonseløft til din egen e-post. */
export async function POST() {
  const user = await getUser();
  if (!adminClient() || !isAdmin(user)) return NextResponse.json({ error: "Ingen tilgang" }, { status: 403 });
  const mail = boostConfirmation({ plan: "featured", title: "Erling Haaland – Topps Chrome UCC Autograf (TEST)", amount: 79, orderId: "test", until: new Date(Date.now() + 7 * 864e5).toISOString() });
  const ok = await sendEmail({ to: user!.email, subject: `[TEST] ${mail.subject}`, text: mail.text, html: mail.html });
  return NextResponse.json({ ok, to: user!.email });
}
