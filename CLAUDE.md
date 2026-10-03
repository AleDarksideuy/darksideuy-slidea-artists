@AGENTS.md

# Reglas del proyecto

El sitio se despliega en Vercel (plan Hobby, 10 GB de Deployment Storage). Cada
push crea un deployment (las ramas crean previews) y cada deployment vuelve a
guardar todos los archivos de /public, así que el peso del repo importa.

- **Git push solo si el usuario lo pide de forma explícita.** Los commits locales
  se pueden hacer siempre que hagan falta.
- **Antes de agregar un asset nuevo, avisar cuánto pesa.** No agregar videos ni
  PDFs pesados al repo.
- **3D (rediseño):** modelos en GLB comprimido (Draco o Meshopt), texturas
  livianas, carga diferida y versión liviana en celular. Nada de HDRIs ni
  texturas enormes.
- **Imágenes con next/image.** No empeorar el rendimiento actual.
- No reescribir el historial de git ni borrar ramas.
