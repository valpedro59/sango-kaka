const URL_API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const URL_IMAGES = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:3000";

// Mapping des annonces avec les images réelles du backend
const MAPPING_IMAGES = {
  "annonce-001": "iPhone 12 Pro Max 128 Go.jpg", // iPhone 13 Pro
  "annonce-002": "Canapé 3 places en tissu .jpg", // Canapé
  "annonce-003": "iPhone 12 Pro Max 128 Go.jpg", // Samsung Galaxy A54
  "annonce-004": "Moto Yamaha 125.jpg", // Moto Yamaha
  "annonce-005": "Machine à laver LG.jpg", // Réfrigérateur
  "annonce-006": "Ordinateur portable Dell.jpg", // Table à manger
  "annonce-007": "iPhone 12 Pro Max 128 Go.jpg", // iPhone 11
};

async function requete(endpoint, options = {}) {
  const res = await fetch(`${URL_API}${endpoint}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
  return res.json();
}

// Enrichir les annonces avec les vraies images du backend
function enrichirAnnonceAvecImage(annonce) {
  if (MAPPING_IMAGES[annonce.id]) {
    return {
      ...annonce,
      image: `${URL_IMAGES}/images/${MAPPING_IMAGES[annonce.id]}`,
    };
  }
  return annonce;
}

export const AnnonceAPI = {
  getById: (id) =>
    requete(`/annonces/${id}`).then(enrichirAnnonceAvecImage),
  getAll: (filtres = {}) => {
    const query = new URLSearchParams(filtres).toString();
    return requete(`/annonces${query ? `?${query}` : ""}`).then((annonces) =>
      annonces.map(enrichirAnnonceAvecImage)
    );
  },
  patch: (id, donnees) =>
    requete(`/annonces/${id}`, { method: "PATCH", body: JSON.stringify(donnees) }),
  creer: (donnees) => {
    return fetch(`${URL_API}/annonces`, { method: "POST", body: donnees }).then(
      (res) => {
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
        return res.json();
      }
    );
  },
};

export const UtilisateurAPI = {
  getById: (id) => requete(`/utilisateurs/${id}`),
  getByIds: (ids) => requete(`/utilisateurs?id_in=${[...new Set(ids)].join(",")}`),
  getNoteMoyenne: (id) => requete(`/utilisateurs/${id}/note-moyenne`),
};

export const AvisAPI = {
  getParVendeur: (vendeurId) => requete(`/avis?vendeurId=${vendeurId}`),
};

export const CategorieAPI = {
  getAll: () => requete("/categories"),
};

export const QuartierAPI = {
  getAll: () => requete("/quartiers"),
};

export const SignalementAPI = {
  creer: (donnees) =>
    requete("/signalements", {
      method: "POST",
      body: JSON.stringify({
        ...donnees,
        statut: "en_attente",
        dateCreation: new Date().toISOString(),
      }),
    }),
};