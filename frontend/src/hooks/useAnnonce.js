import { useEffect, useState } from "react";
import { AnnonceAPI, UtilisateurAPI, AvisAPI, CategoryAPI, QuartierAPI } from "../services/api";

export default function useAnnonce(id) {
  const [listing, setListing] = useState(null);
  const [seller, setSeller] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [categories, setCategories] = useState([]);
  const [quartiers, setQuartiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [annonceData, categoriesData, quartiersData] = await Promise.all([
          AnnonceAPI.getById(id),
          CategoryAPI.getAll(),
          QuartierAPI.getAll(),
        ]);

        if (cancelled) return;
        setListing(annonceData);
        setCategories(categoriesData);
        setQuartiers(quartiersData);

        const [sellerData, reviewsData, ratingData] = await Promise.all([
          UtilisateurAPI.getById(annonceData.vendeurId),
          AvisAPI.getBySeller(annonceData.vendeurId),
          UtilisateurAPI.getAverageRating(annonceData.vendeurId),
        ]);

        if (cancelled) return;
        setSeller(sellerData);
        setAverageRating(ratingData.note ?? 0);

        if (reviewsData.length > 0) {
          const authorIds = [...new Set(reviewsData.map((r) => r.auteurId))];
          const usersData = await UtilisateurAPI.getByIds(authorIds).catch(() => []);

          const usersMap = Object.fromEntries(usersData.map((u) => [u.id, u]));
          const enrichedReviews = reviewsData.map((r) => ({
            ...r,
            authorName: usersMap[r.auteurId]
              ? `${usersMap[r.auteurId].prenom} ${usersMap[r.auteurId].nom}`
              : r.auteurId,
          }));

          setReviews(enrichedReviews);
        } else {
          setReviews([]);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [id]);

  return { listing, seller, reviews, averageRating, categories, quartiers, loading, error };
}
