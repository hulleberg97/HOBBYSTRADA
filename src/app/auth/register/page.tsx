import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";
import { hasVippsLogin } from "@/lib/vipps-login";

export const metadata: Metadata = { title: "Opprett konto" };

export default function Page() {
  return (
    <Suspense>
      <AuthForm mode="register" vipps={hasVippsLogin()} />
    </Suspense>
  );
}
