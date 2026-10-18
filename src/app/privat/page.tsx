import type { Metadata } from "next";

export const metadata: Metadata = { title: "Åpner snart", robots: { index: false, follow: false } };

const field =
  "w-full border-b border-foreground/20 bg-transparent px-0 py-3 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none transition-colors";
const button =
  "flex w-full items-center justify-center gap-2 bg-foreground py-3.5 text-sm font-semibold uppercase tracking-wide text-background transition-opacity hover:opacity-90";

export default async function Page({ searchParams }: { searchParams: Promise<{ neste?: string; feil?: string }> }) {
  const { neste = "/", feil } = await searchParams;
  return (
    <div className="container-custom py-24">
      <div className="mx-auto max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-h2 font-semibold">Åpner snart</h1>
          <p className="mt-2 text-sm text-muted-foreground">HOBBYSTRADA er ikke åpnet for alle ennå. Har du fått passordet, kan du logge inn her.</p>
        </div>
        <form className="space-y-5" method="post" action="/api/privat">
          <input type="hidden" name="neste" value={neste} />
          <div>
            <label htmlFor="passord" className="mb-2 block text-xs font-semibold uppercase tracking-widest">
              Passord
            </label>
            <input id="passord" name="passord" type="password" required autoFocus autoComplete="current-password" className={field} />
          </div>
          {feil && <p className="text-sm text-destructive">Feil passord. Prøv igjen.</p>}
          <button className={button}>Gå inn</button>
        </form>
      </div>
    </div>
  );
}
