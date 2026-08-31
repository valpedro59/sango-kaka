const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

async function request(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
  return res.json();
}

export const AnnonceAPI = {
  getById: (id) => request(`/annonces/${id}`),
  getAll: (filtres = {}) => {
    const query = new URLSearchParams(filtres).toString();
    return request(`/annonces${query ? `?${query}` : ""}`);
  },
  patch: (id, data) =>
    request(`/annonces/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
};

export const UtilisateurAPI = {
  getById: (id) => request(`/utilisateurs/${id}`),
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
