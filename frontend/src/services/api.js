const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

async function request(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
  return res.json();
}

export const ListingAPI = {
  getById: (id) => request(`/listings/${id}`),
  getAll: (filtres = {}) => {
    const query = new URLSearchParams(filtres).toString();
    return request(`/listings${query ? `?${query}` : ""}`);
  },
  patch: (id, data) =>
    request(`/listings/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
};

export const UserAPI = {
  getById: (id) => request(`/users/${id}`),
  getAverageRating: (id) => request(`/vendeurs/${id}/note-moyenne`),
};

export const ReviewAPI = {
  getBySeller: (sellerId) => request(`/reviews?sellerId=${sellerId}`),
};

export const CategoryAPI = {
  getAll: () => request("/categories"),
};

export const NeighborhoodAPI = {
  getAll: () => request("/neighborhoods"),
};

export const ReportAPI = {
  create: (data) =>
    request("/reports", {
      method: "POST",
      body: JSON.stringify({
        ...data,
        status: "pending",
        createdAt: new Date().toISOString(),
      }),
    }),
};
