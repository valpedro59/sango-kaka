import express from "express";
import { getAverageRating } from "../controllers/sellerController.js";
import { checkSellerExists } from "../middlewares/sellerMiddleware.js"; // Import du middleware

const router = express.Router();

// Le middleware s'exécute en premier, puis le contrôleur prend le relais
router.get("/:id/note-moyenne", checkSellerExists, getAverageRating);

export default router;
