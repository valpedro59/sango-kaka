import express from "express";

/**
 * Routes custom pour les annonces.
 * La majorité des besoins (filtrer par categorieId, quartierId, prix,
 * statut, vendeurId) sont déjà couverts par les query params génériques
 * de json-server, ex :
 *   GET /api/annonces?categorieId=categorie-001&quartierId=quartier-001
 *
 * Ce fichier ne contient QUE les routes qui vont au-delà de ça.
 *
 * Responsable : Benit Mamonsono fait par Val Pedro
 */
export default function annoncesRoutes(db) {
  const router = express.Router();

  // Exemple de route custom si besoin d'une recherche texte libre
  // (titre + description) que les query params json-server ne
  // couvrent pas nativement.
  //
  // router.get('/recherche', (req, res) => {
  //   const { q } = req.query;
  //   const resultats = db.get('annonces')
  //     .filter(a =>
  //       a.titre.toLowerCase().includes(q.toLowerCase()) ||
  //       a.description.toLowerCase().includes(q.toLowerCase())
  //     )
  //     .value();
  //   res.json(resultats);
  // });

  // Exemple : incrémenter les vues d'une annonce à chaque consultation
  // router.post('/:id/vue', (req, res) => {
  //   const annonce = db.get('annonces').find({ id: req.params.id });
  //   if (!annonce.value()) return res.status(404).json({ error: 'Annonce introuvable' });
  //   annonce.assign({ vues: annonce.value().vues + 1 }).write();
  //   res.json(annonce.value());
  // });

  router.use((req, res, next) => next());

  return router;
}
