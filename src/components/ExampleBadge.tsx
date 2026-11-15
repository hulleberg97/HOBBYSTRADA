/**
 * Merket «Eksempelannonse». Samme tekst og forklaring overalt; størrelsen følger stedet det står:
 * «kort» på annonsekort, «plate» på kortene i forsideraden, «side» på annonsesiden.
 */
export function ExampleBadge({ size = "kort" }: { size?: "kort" | "plate" | "side" }) {
  return (
    <span title="Lagt ut av HOBBYSTRADA for å vise hvordan siden fungerer. Ikke til salgs." data-size={size} className="eks-merke">
      <span className="eks-ikon" aria-hidden="true">
        <i className="eks-prikk" />
        <svg className="eks-gnist" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
          <path d="M19 15v4M21 17h-4M5 3v3M6.5 4.5h-3" />
        </svg>
        <svg className="eks-h" viewBox="12 6 76 88">
          <g transform="rotate(-7 31 50)"><rect x="17" y="12" width="28" height="76" rx="7" fill="#f7f3ea" /></g>
          <g transform="rotate(7 69 50)"><rect x="55" y="12" width="28" height="76" rx="7" fill="#f7f3ea" /></g>
          <rect x="33" y="43" width="34" height="14" rx="3" fill="#cfa653" />
        </svg>
      </span>
      <span>Eksempelannonse</span>
    </span>
  );
}
