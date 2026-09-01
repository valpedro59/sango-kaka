
const URL_API =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const URL_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") ||
  "http://localhost:3000";

/**
 * Fonction générique pour les requêtes JSON
 */
async function requete(endpoint, options = {}) {
  const res = await fetch(`${URL_API}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`Erreur HTTP ${res.status}`);
  }

  return res.json();
}

/**
 * Corrige l'URL d'image renvoyée par le backend.
 *
 * Le backend actuel génère parfois :
 * http://localhost:3001/images/...
 *
 * alors que ton serveur tourne sur :
 * http://localhost:3000
 */
function corrigerUrlImage(url) {
  if (!url) return url;

  return url
    .replace("http://localhost:3001", URL_BASE)
    .replace("http://localhost:3000", URL_BASE);
}

/**
 * Enrichissement des annonces avec les images
 * déjà présentes dans le dossier public/images.
 */
const MAPPING_IMAGES = {
  "annonce-001": "iPhone 12 Pro Max 128 Go.jpg",
  "annonce-002": "Canapé 3 places en tissu .jpg",
  "annonce-003": "iPhone 12 Pro Max 128 Go.jpg",
  "annonce-004": "Moto Yamaha 125.jpg",
  "annonce-005": "Machine à laver LG.jpg",
  "annonce-006": "Ordinateur portable Dell.jpg",
  "annonce-007": "iPhone 12 Pro Max 128 Go.jpg",
};

function enrichirAnnonceAvecImage(annonce) {
  // Si l'annonce possède déjà une image provenant du backend
  if (annonce.image) {
    return {
      ...annonce,
      image: corrigerUrlImage(annonce.image),
    };
  }

  // Images utilisées pour les annonces existantes
  if (MAPPING_IMAGES[annonce.id]) {
    return {
      ...annonce,
      image: `${URL_BASE}/images/${encodeURIComponent(
        MAPPING_IMAGES[annonce.id]
      )}`,
    };
  }

  return annonce;
}

/* =========================================================
   ANNONCES
   ========================================================= */

export const AnnonceAPI = {
  /**
   * Récupérer une annonce
   */
  getById: (id) =>
    requete(`/annonces/${id}`).then(enrichirAnnonceAvecImage),

  /**
   * Récupérer toutes les annonces
   */
  getAll: (filtres = {}) => {
    const query = new URLSearchParams(filtres).toString();

    return requete(`/annonces${query ? `?${query}` : ""}`).then(
      (annonces) => annonces.map(enrichirAnnonceAvecImage)
    );
  },

  /**
   * Modifier une annonce
   */
  patch: (id, donnees) =>
    requete(`/annonces/${id}`, {
      method: "PATCH",
      body: JSON.stringify(donnees),
    }),

  /**
   * Créer une annonce avec UNE image.
   *
   * Le backend utilise :
   * POST /api/annonces/avec-image
   *
   * et multer attend :
   * image
   */
  creer: async (donnees) => {
    const res = await fetch(`${URL_API}/annonces/avec-image`, {
      method: "POST",
      body: donnees,
    });

    if (!res.ok) {
      throw new Error(`Erreur HTTP ${res.status}`);
    }

    const annonce = await res.json();

    return enrichirAnnonceAvecImage(annonce);
  },
};

/* =========================================================
   UTILISATEURS
   ========================================================= */

export const UtilisateurAPI = {
  getById: (id) => requete(`/utilisateurs/${id}`),

  getByIds: (ids) =>
    requete(
      `/utilisateurs?id_in=${[...new Set(ids)].join(",")}`
    ),

  getNoteMoyenne: (id) =>
    requete(`/utilisateurs/${id}/note-moyenne`),
};

/* =========================================================
   AVIS
   ========================================================= */

export const AvisAPI = {
  getParVendeur: (vendeurId) =>
    requete(`/avis?vendeurId=${vendeurId}`),
};

/* =========================================================
   CATÉGORIES
   ========================================================= */

export const CategorieAPI = {
  getAll: () => requete("/categories"),
};

/* =========================================================
   QUARTIERS
   ========================================================= */

export const QuartierAPI = {
  getAll: () => requete("/quartiers"),
};

/* =========================================================
   SIGNALEMENTS
   ========================================================= */

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
