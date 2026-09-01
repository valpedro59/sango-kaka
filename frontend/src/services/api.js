const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const IMAGES_BASE = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:3000";

// Mapping des annonces avec les images réelles du backend
const IMAGE_MAPPING = {
  "annonce-001": "iPhone 12 Pro Max 128 Go.jpg", // iPhone 13 Pro
  "annonce-002": "Canapé 3 places en tissu .jpg", // Canapé
  "annonce-003": "iPhone 12 Pro Max 128 Go.jpg", // Samsung Galaxy A54
  "annonce-004": "Moto Yamaha 125.jpg", // Moto Yamaha
  "annonce-005": "Machine à laver LG.jpg", // Réfrigérateur
  "annonce-006": "Ordinateur portable Dell.jpg", // Table à manger
  "annonce-007": "iPhone 12 Pro Max 128 Go.jpg", // iPhone 11
};

async function request(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
  return res.json();
}

// Enrichir les annonces avec les vraies images du backend
function enrichAnnonceWithImage(annonce) {
  if (IMAGE_MAPPING[annonce.id]) {
    return {
      ...annonce,
      image: `${IMAGES_BASE}/images/${IMAGE_MAPPING[annonce.id]}`,
    };
  }
  return annonce;
}

export const AnnonceAPI = {
  getById: (id) => 
    request(`/annonces/${id}`).then(enrichAnnonceWithImage),
  getAll: (filtres = {}) => {
    const query = new URLSearchParams(filtres).toString();
    return request(`/annonces${query ? `?${query}` : ""}`).then(annonces =>
      annonces.map(enrichAnnonceWithImage)
    );
  },
  patch: (id, data) =>
    request(`/annonces/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
};

export const UtilisateurAPI = {
  getById: (id) => request(`/utilisateurs/${id}`),
  getByIds: (ids) => request(`/utilisateurs?id_in=${[...new Set(ids)].join(",")}`),
  getAverageRating: (id) => request(`/utilisateurs/${id}/note-moyenne`),
};

export const AvisAPI = {
  getBySeller: (sellerId) => request(`/avis?vendeurId=${sellerId}`),
};

export const CategoryAPI = {
  getAll: () => request("/categories"),
};

export const QuartierAPI = {
  getAll: () => request("/quartiers"),
};

export const SignalementAPI = {
  create: (data) =>
    request("/signalements", {
      method: "POST",
      body: JSON.stringify({
        ...data,
        statut: "en_attente",
        dateCreation: new Date().toISOString(),
      }),
    }),
};
