import { useEffect, useState } from "react";
import { ListingAPI, UserAPI, ReviewAPI, CategoryAPI, NeighborhoodAPI } from "../services/api";

export default function useAnnonce(id) {
  const [listing, setListing] = useState(null);
  const [seller, setSeller] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [categories, setCategories] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [listingData, categoriesData, neighborhoodsData] = await Promise.all([
          ListingAPI.getById(id),
          CategoryAPI.getAll(),
          NeighborhoodAPI.getAll(),
        ]);

        if (cancelled) return;
        setListing(listingData);
        setCategories(categoriesData);
        setNeighborhoods(neighborhoodsData);

        const [sellerData, reviewsData, ratingData] = await Promise.all([
          UserAPI.getById(listingData.sellerId),
          ReviewAPI.getBySeller(listingData.sellerId),
          UserAPI.getAverageRating(listingData.sellerId),
        ]);

        if (cancelled) return;
        setSeller(sellerData);
        setAverageRating(ratingData.averageRating ?? 0);

        if (reviewsData.length > 0) {
          const authorIds = [...new Set(reviewsData.map((r) => r.authorId))];
          const authorIdsQuery = authorIds.join(",");
          const usersData = await fetch(
            `${import.meta.env.VITE_API_URL || "http://localhost:3001/api"}/users?id_in=${authorIdsQuery}`
          ).then((res) => (res.ok ? res.json() : []));

          const usersMap = Object.fromEntries(usersData.map((u) => [u.id, u]));
          const enrichedReviews = reviewsData.map((r) => ({
            ...r,
            authorName: usersMap[r.authorId]
              ? `${usersMap[r.authorId].firstName} ${usersMap[r.authorId].lastName}`
              : r.authorId,
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

  return { listing, seller, reviews, averageRating, categories, neighborhoods, loading, error };
}
