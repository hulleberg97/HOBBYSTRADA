import { permanentRedirect } from "next/navigation";

/** Refusjonssiden er slått sammen med salgsvilkårene. Gamle lenker sendes til avsnittet «Angrerett». */
export default function RefundPage() {
  permanentRedirect("/salgsvilkar#angrerett");
}
