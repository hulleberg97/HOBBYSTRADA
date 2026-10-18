"use client";

import { lazy, Suspense } from "react";
import type { StageCard } from "./CardStage3D";

// 3D-koden (three.js) lastes for seg, så forsiden åpner like raskt som før
const CardStage3D = lazy(() => import("./CardStage3D").then((m) => ({ default: m.CardStage3D })));

/** Kortene i 3D på forsiden. Viser vanlig karusell mens 3D lastes, og der 3D ikke støttes. */
export function HeroStage({ cards, fallback }: { cards: StageCard[]; fallback: React.ReactNode }) {
  return (
    <Suspense fallback={fallback}>
      <CardStage3D cards={cards} fallback={fallback} />
    </Suspense>
  );
}
