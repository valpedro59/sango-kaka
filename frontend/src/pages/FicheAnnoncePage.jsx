import { useParams } from "react-router-dom";
import useAnnonce from "../hooks/useAnnonce";
import FicheAnnonce from "../components/FicheAnnonce";

function FicheAnnoncePage() {
  const { id } = useParams();
  const {
    annonce,
    seller,
    reviews,
    averageRating,
    categories,
    quartiers,
    loading,
    error,
  } = useAnnonce(id);

  return (
    <FicheAnnonce
      annonce={annonce}
      seller={seller}
      reviews={reviews}
      averageRating={averageRating}
      categories={categories}
      quartiers={quartiers}
      loading={loading}
      error={error}
    />
  );
}

export default FicheAnnoncePage;
