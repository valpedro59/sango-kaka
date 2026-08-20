import { useEffect, useState } from "react";
import { ListingAPI, CategoryAPI, NeighborhoodAPI } from "../services/api";

export default function useAnnonces(filtres = {}) {
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [listings, categories, neighborhoods] = await Promise.all([
          ListingAPI.getAll(filtres),
          CategoryAPI.getAll(),
          NeighborhoodAPI.getAll(),
        ]);

        if (cancelled) return;

        const catMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));
        const hoodMap = Object.fromEntries(neighborhoods.map((n) => [n.id, n.name]));

        const enriched = listings.map((l) => ({
          ...l,
          categoryName: catMap[l.categoryId] || l.categoryId,
          neighborhoodName: hoodMap[l.neighborhoodId] || l.neighborhoodId,
        }));

        setAnnonces(enriched);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [JSON.stringify(filtres)]);

  return { annonces, loading, error };
}
