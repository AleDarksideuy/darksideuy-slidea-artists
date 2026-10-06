import { redirect } from "next/navigation";

import { PRODUCT_LAUNCHED, TEASER } from "../(site)/data/proximamente";
import SalesPage from "./SalesPage";

/* Mientras el producto no se lanza (PRODUCT_LAUNCHED = false), esta
   dirección lleva al adelanto "Próximamente" de la home. La página de
   venta queda guardada en SalesPage.tsx, lista para el lanzamiento. */
export default function TuSemanaComoArtistaPage() {
  if (!PRODUCT_LAUNCHED) redirect(`/#${TEASER.id}`);
  return <SalesPage />;
}
