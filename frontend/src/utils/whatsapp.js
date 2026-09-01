export function construireLienWhatsApp(numeroTelephone, message) {
  if (!numeroTelephone) return null;
  const numeroNettoye = String(numeroTelephone).replace(/\D/g, "");
  const lien = `https://wa.me/${numeroNettoye}`;
  if (message) {
    return `${lien}?text=${encodeURIComponent(message)}`;
  }
  return lien;
}