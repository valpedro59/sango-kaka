import path from "path";
import { fileURLToPath } from "url";
import jsonServer from "json-server";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// On pointe vers le fichier db.json
const router = jsonServer.router(
  path.join(__dirname, "..", "..", "data", "db.json"),
);

export const getAverageRating = (req, res) => {
  const sellerId = req.params.id;
  const db = router.db.getState();

  const sellerReviews = db.reviews.filter(
    (review) => review.sellerId === sellerId,
  );

  if (sellerReviews.length === 0) {
    return res.json({
      sellerId: sellerId,
      averageRating: 0,
      totalReviews: 0,
      message: "Ce vendeur n'a pas encore reçu de note.",
    });
  }

  const totalRating = sellerReviews.reduce(
    (sum, review) => sum + review.rating,
    0,
  );
  const averageRating =
    Math.round((totalRating / sellerReviews.length) * 10) / 10;

  res.json({
    sellerId: sellerId,
    averageRating: averageRating,
    totalReviews: sellerReviews.length,
  });
};
