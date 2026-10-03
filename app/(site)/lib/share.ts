/* Compartir un link: menú nativo del celular si existe; si no (por
   ejemplo dentro de algunos navegadores de apps), copia el link. */
export async function shareLink({ title, text, path }: { title: string; text?: string; path: string }) {
  const url = new URL(path, window.location.origin).toString();

  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return "shared" as const;
    } catch (error) {
      if ((error as DOMException).name === "AbortError") return "cancelled" as const;
    }
  }

  try {
    await navigator.clipboard.writeText(url);
    return "copied" as const;
  } catch {
    window.prompt("Copiá el link:", url);
    return "copied" as const;
  }
}
