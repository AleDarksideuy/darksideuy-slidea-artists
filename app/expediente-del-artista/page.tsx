import SalesPage from "./SalesPage";

/* La página de venta responde siempre. Mientras el producto no se lanza
   (PRODUCT_LAUNCHED = false) no se enlaza desde el sitio ni está en el
   sitemap, y layout.tsx le pide a Google que no la indexe: solo llega
   quien tiene el link. */
export default function ExpedienteDelArtistaPage() {
  return <SalesPage />;
}
