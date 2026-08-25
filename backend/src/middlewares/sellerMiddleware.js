import path from "path";
import { fileURLToPath } from "url";
import jsonServer from "json-server";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Accès à db.json
const router = jsonServer.router(
  path.join(__dirname, "..", "..", "data", "db.json"),
);

export const checkSellerExists = (req, res, next) => {
  const sellerId = req.params.id;
  const db = router.db.getState();

  // Chercher le vendeur dans le tableau "users"
  const seller = db.users.find((user) => user.id === sellerId);

  // Si le vendeur n'existe pas, on arrête la requête ici
  if (!seller) {
    return res.status(404).json({
      error: "Not Found",
      message: `Le vendeur avec l'id '${sellerId}' n'existe pas.`,
    });
  }

  // Si le vendeur existe, on passe à l'étape suivante (le contrôleur)
  next();
};
