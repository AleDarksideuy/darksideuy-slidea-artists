import { redirect } from "next/navigation";

import { TU_SEMANA } from "../(site)/data/home";
import SalesPage from "./SalesPage";

/* Mientras el producto no se lanza (TU_SEMANA.launched = false), esta
   dirección lleva al adelanto "Próximamente" de la home. La página de
   venta queda guardada en SalesPage.tsx, lista para el lanzamiento. */
export default function TuSemanaComoArtistaPage() {
  if (!TU_SEMANA.launched) redirect("/#tu-semana");
  return <SalesPage />;
}
