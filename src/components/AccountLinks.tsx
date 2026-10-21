"use client";

import Link from "next/link";
import { useUser } from "./useUser";

/** Konto-lenkene i bunnen: «Min side» og «Meldinger» når man er logget inn. Innlogging finnes i menyen. */
export function AccountLinks({ className }: { className: string }) {
  const user = useUser();
  const links = user
    ? [
        ["/account", "Min side"],
        ["/meldinger", "Meldinger"],
      ]
    : [];
  return links.map(([href, label]) => (
    <li key={href}>
      <Link className={className} href={href}>
        {label}
      </Link>
    </li>
  ));
}
