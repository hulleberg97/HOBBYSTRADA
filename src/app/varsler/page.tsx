import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/ui";
import { getUser } from "@/lib/auth";
import { listNotifications, markNotificationsRead } from "@/lib/notifications";
import { NotificationList } from "@/components/NotificationList";

export const metadata: Metadata = { title: "Varsler", robots: { index: false } };
export const dynamic = "force-dynamic";

/** Varslene til brukeren: det som har skjedd med annonsene, løftene og de lagrede søkene. Åpnes de, regnes de som lest. */
export default async function NotificationsPage() {
  const user = await getUser();
  if (!user) redirect("/auth/login?next=/varsler");
  const items = await listNotifications(user.id);
  if (items.some((n) => !n.read)) await markNotificationsRead(user.id);

  return (
    <div>
      <PageHeader eyebrow="Min side" title="Varsler" lead="Det som har skjedd med annonsene dine, løftene og søkene du følger." />
      <div className="mx-auto max-w-[880px] px-4 pb-24 pt-8 sm:px-6">
        <NotificationList items={items} />
        <p className="mt-6 text-center text-xs text-slate-500">Varsler slettes etter 90 dager. Nye meldinger finner du under Meldinger.</p>
      </div>
    </div>
  );
}
