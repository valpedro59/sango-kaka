import { useParams } from "react-router-dom";
import useAnnonce from "../hooks/useAnnonce";
import FicheAnnonce from "../components/FicheAnnonce";

function FicheAnnoncePage() {
  const { id } = useParams();
  const { listing, seller, reviews, averageRating, categories, neighborhoods, loading, error } = useAnnonce(id);

  return (
    <FicheAnnonce
      listing={listing}
      seller={seller}
      reviews={reviews}
      averageRating={averageRating}
      categories={categories}
      neighborhoods={neighborhoods}
      loading={loading}
      error={error}
    />
  );
}

export default FicheAnnoncePage;
