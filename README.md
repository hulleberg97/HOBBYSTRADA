# HOBBYSTRADA

Markedsplass for fotballkort i Norge. Kjøper og selger avtaler handelen direkte.

## Teknologi

- [Next.js](https://nextjs.org) (App Router) og Tailwind CSS
- [Supabase](https://supabase.com) for brukere, annonser og bilder (valgfritt under utvikling)
- Publiseres på [Vercel](https://vercel.com)

Uten Supabase-nøkler viser siden annonsene i `src/data/listings.json`, så den kan publiseres og testes før databasen er satt opp.

## Kom i gang lokalt

```bash
npm install
npm run dev
```

## Miljøvariabler

Se `.env.example`.
