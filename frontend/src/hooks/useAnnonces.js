import { useEffect, useState } from "react";
import { AnnonceAPI, CategoryAPI, QuartierAPI } from "../services/api";

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
        const [annoncesData, categories, quartiers] = await Promise.all([
          AnnonceAPI.getAll(filtres),
          CategoryAPI.getAll(),
          QuartierAPI.getAll(),
        ]);

        if (cancelled) return;

        const catMap = Object.fromEntries(categories.map((c) => [c.id, c.nom]));
        const hoodMap = Object.fromEntries(quartiers.map((q) => [q.id, q.nom]));

        const enriched = annoncesData.map((a) => ({
          ...a,
          categoryName: catMap[a.categorieId] || a.categorieId,
          neighborhoodName: hoodMap[a.quartierId] || a.quartierId,
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
