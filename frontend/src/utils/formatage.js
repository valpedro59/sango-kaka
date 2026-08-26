export function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatMemberSince(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });
}

export function formatPrix(montant) {
  if (montant == null) return "";
  return `${montant.toLocaleString("fr-FR")} FCFA`;
}
