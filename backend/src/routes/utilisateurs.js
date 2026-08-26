import express from "express";

/**
 * Routes custom pour les utilisateurs (en tant que vendeurs).
 * Le CRUD standard (GET/POST/PUT /api/utilisateurs) est déjà géré
 * par json-server dans server.js — ce fichier ne contient QUE les
 * routes qui ont besoin de logique métier en plus du simple CRUD.
 *
 * Responsable : Ceti Louamba fait par Val Pedro
 */
export default function utilisateursRoutes(db) {
  const router = express.Router();

  // GET /api/utilisateurs/:id/note-moyenne
  // Calcule la note moyenne d'un vendeur à partir de la collection "avis".
  router.get("/:id/note-moyenne", (req, res) => {
    const vendeurId = req.params.id;

    const avis = db.get("avis").filter({ vendeurId }).value();

    if (!avis.length) {
      return res.json({ note: 0, nombreAvis: 0 });
    }

    const total = avis.reduce((sum, a) => sum + a.note, 0);
    const moyenne = Math.round((total / avis.length) * 10) / 10;

    res.json({ note: moyenne, nombreAvis: avis.length });
  });

  // Ajoute ici toute autre route custom liée aux utilisateurs
  // (ex: badge de vérification, historique des annonces vendues, etc.)

  router.use((req, res, next) => next());

  return router;
}
