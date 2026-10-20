import { redirect } from "next/navigation";

/** Handlekurven finnes ikke lenger (kort kjøpes direkte fra selgeren). Gamle lenker sendes til markedet. */
export default function CartPage() {
  redirect("/products");
}
