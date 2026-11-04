import { Fraunces } from "next/font/google";
import "./ny.css";
import { getListings, getSoldListings } from "@/lib/listings";
import { frontpageRow } from "@/lib/frontpage-row";
import { NyForside } from "@/components/ny/NyForside";

export const revalidate = 60;

// Testside for ny forside. Holdes utenfor søkemotorene til den eventuelt erstatter «/».
export const metadata = {
  title: "Ny forside (test)",
  robots: { index: false, follow: false },
};

// Lett Fraunces til de store redaksjonelle overskriftene (rotlayouten laster bare vekt 700)
const display = Fraunces({ variable: "--ny-display", subsets: ["latin"], weight: ["300", "400"], style: ["normal", "italic"] });

export default async function NyForsidePage() {
  const [all, sold] = await Promise.all([getListings(), getSoldListings()]);
  const featured = frontpageRow(all)[0] ?? null;
  return (
    <div className={display.variable}>
      <NyForside listings={all} featured={featured} sold={sold.slice(0, 12)} />
    </div>
  );
}
