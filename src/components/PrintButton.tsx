"use client";

export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-black">
      Skriv ut eller lagre som PDF
    </button>
  );
}
