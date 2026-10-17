import { NextResponse } from "next/server";
import { serverClient } from "@/lib/supabase";

export async function POST(req: Request) {
  const db = await serverClient();
  await db?.auth.signOut();
  return NextResponse.redirect(new URL("/", req.url), { status: 303 });
}
