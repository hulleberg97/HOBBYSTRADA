/**
 * Merket «Eksempelannonse». Samme tekst og forklaring overalt; størrelsen følger stedet det står:
 * «kort» på annonsekort, «plate» på kortene i forsideraden, «side» på annonsesiden. Utseendet ligger i globals.css (.eks-merke).
 */
export function ExampleBadge({ size = "kort" }: { size?: "kort" | "plate" | "side" }) {
  return (
    <span title="Lagt ut av HOBBYSTRADA for å vise hvordan siden fungerer. Ikke til salgs." data-size={size} className="eks-merke">
      <span className="eks-ikon" aria-hidden="true">
        <svg viewBox="12 6 76 88">
          <g transform="rotate(-7 31 50)">
            <rect x="17" y="12" width="28" height="76" rx="7" fill="#f7f3ea" />
          </g>
          <g transform="rotate(7 69 50)">
            <rect x="55" y="12" width="28" height="76" rx="7" fill="#f7f3ea" />
          </g>
          <rect x="33" y="43" width="34" height="14" rx="3" fill="#cfa653" />
        </svg>
      </span>
      <span>Eksempelannonse</span>
    </span>
  );
}
