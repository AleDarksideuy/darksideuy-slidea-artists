---
name: actualizar-cartelera
description: Actualiza la Cartelera de la home de Darkside UY (las fechas de los eventos de la productora, se renueva cada mes) en app/(site)/data/cartelera.ts. Usar cuando el usuario pase fechas o afiches nuevos, pida sumar, cambiar, postergar, cancelar o sacar un evento, o diga "actualizá la cartelera".
---

# Actualizar la cartelera

La sección vive en `app/(site)/home/Cartelera.tsx` y **solo se edita el archivo de datos** `app/(site)/data/cartelera.ts`. Su comentario de cabecera explica cada campo. La sección ordena las fechas, las agrupa por mes, pone el mes en la marquesina, marca "Hoy" y "Próxima fecha" y oculta sola lo que ya pasó.

## 1. Juntar los datos (sin inventar nada)
- Para cada evento hacen falta título, tipo, ciudad ("Ciudad, Departamento") y fecha "AAAA-MM-DD". Si todavía no hay día, va `date: null` y `month: "AAAA-MM"`.
- Hora, lugar, texto, artistas, entrada, link e info son opcionales: si el usuario no los da, no van.
- Lo que falte, preguntalo todo junto en una sola pregunta. Nunca completes con datos supuestos: ni lugar, ni hora, ni precio.
- Los artistas que estén en `app/(site)/data/artists.ts` van por su slug (así enlazan a su ficha); los demás, por su nombre.
- Precio en pesos uruguayos, como número (`price: 350`).
- Eventos de Skaters del Interior: respetar las reglas de la liga (comentario de `LIGA_SKATERS` en `app/(site)/data/home.ts`).
- Textos en voseo, cortos.

## 2. Afiches (si hay)
- Convertí cada afiche a webp con `sharp`, que ya está en el proyecto, y guardalo en `public/cartelera/<id>.webp`:
  `node -e "require('sharp')('ENTRADA').resize({ width: 1080, withoutEnlargement: true }).webp({ quality: 78 }).toFile('public/cartelera/ID.webp').then(i => console.log(i.width, i.height, Math.round(i.size / 1024) + ' KB'))"`
- Si pasa de 150 KB, bajá la calidad (70, 65…).
- **Avisá cuánto pesa cada afiche antes de dejarlo** (regla de CLAUDE.md: Vercel Hobby).
- En `poster` van el ancho y el alto reales que imprime el comando, y un `alt` que describa el afiche.

## 3. Limpiar lo vencido
- Sacá los eventos que ya pasaron, según el día de hoy en Uruguay (`America/Montevideo`), y los "a confirmar" de meses que ya terminaron.
- Borrá sus afiches de `public/cartelera/`: cada deployment guarda todo `/public` de nuevo.

## 4. Verificar
- Corré `npx eslint "app/(site)/data/cartelera.ts"` y `npx tsc --noEmit`.
- Corré `npm run build`. Si falla porque no puede bajar las fuentes de Google, es el sandbox sin red: correlo fuera del sandbox.
- Para mirarla, usá la vista previa `sitio-compilado` de `.claude/launch.json` (es `next start` sobre el build, más liviano que `next dev`) y entrá por `/#cartelera` a 375 px y en escritorio. La PC tiene poca RAM: si el servidor se cae, no insistas y pasale los comandos al usuario.

## 5. Commit local, sin push
- Commit con un mensaje como `Cartelera: fechas de diciembre`.
- La PC no tiene identidad de git configurada: commiteá con
  `git -c user.name="$(git log -1 --format=%an)" -c user.email="$(git log -1 --format=%ae)" commit …`
- **Push solo si el usuario lo pide.** Antes de un push, mostrale `git log origin/main..main`: todo lo que esté ahí se publica junto con la cartelera.
