export function formaterDate(dateIso) {
  if (!dateIso) return "";
  return new Date(dateIso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formaterMembreDepuis(dateIso) {
  if (!dateIso) return "";
  return new Date(dateIso).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });
}

export function formaterPrix(montant) {
  if (montant == null) return "";
  return `${montant.toLocaleString("fr-FR")} FCFA`;
}