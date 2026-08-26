import express from "express";

/**
 * Routes custom pour les signalements et la modération.
 * Le GET standard (/api/signalements) reste géré par json-server.
 * Le POST est custom car il applique aussi la logique de modération.
 *
 * Responsable : Ceti Louamba fait par Val Pedro
 */

// Seuil au-delà duquel une annonce est automatiquement marquée
// comme suspecte. À ajuster en équipe selon les retours du MVP.
const SEUIL_SIGNALEMENTS_AUTO = 3;

export default function signalementsRoutes(db) {
  const router = express.Router();

  // POST /api/signalements
  router.post("/", express.json(), (req, res) => {
    const { annonceId, signaleParId, raison, description } = req.body;

    if (!annonceId || !raison) {
      return res.status(400).json({ error: "annonceId et raison sont requis" });
    }

    const nouveauSignalement = {
      id: `signalement-${Date.now()}`,
      annonceId,
      signaleParId: signaleParId || null,
      raison,
      description: description || "",
      statut: "en_attente",
      dateCreation: new Date().toISOString(),
    };

    db.get("signalements").push(nouveauSignalement).write();

    const totalSignalements = db
      .get("signalements")
      .filter({ annonceId })
      .size()
      .value();

    if (totalSignalements >= SEUIL_SIGNALEMENTS_AUTO) {
      db.get("annonces")
        .find({ id: annonceId })
        .assign({ statut: "signalee", dateMaj: new Date().toISOString() })
        .write();
    }

    res.status(201).json(nouveauSignalement);
  });

  router.use((req, res, next) => next());

  return router;
}
