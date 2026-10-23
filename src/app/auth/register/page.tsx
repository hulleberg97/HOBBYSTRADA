import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";
import { hasVippsLogin } from "@/lib/vipps-login";

export const metadata: Metadata = { title: "Opprett konto" };

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  // Adressen leses på serveren, så skjemaet står der fra første bilde i stedet for at siden hopper
  await searchParams;
  return (
    <Suspense>
      <AuthForm mode="register" vipps={hasVippsLogin()} />
    </Suspense>
  );
}
