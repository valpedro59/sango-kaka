import express from "express";
import multer from "multer";
import path from "path";

/**
 * Routes custom pour les annonces.
 * Responsable : Benit Mamonsono fait par Val Pedro
 */

// Multer pour l'enregistrement des fichiers
const storage = multer.diskStorage({
  // Utilisation de path.join pour un chemin universel (Windows/Linux/Mac)
  destination: (req, file, cb) => {
    cb(null, path.join("public", "images"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

export default function annoncesRoutes(db) {
  const router = express.Router();

  // POST /api/annonces/avec-image
  router.post("/avec-image", upload.single("image"), (req, res) => {
    const { titre, prix } = req.body;

    // CORRECTION : Utilisation de /images/ à la place de /uploads/
    const imageUrl = req.file
      ? `http://localhost:3001/images/${req.file.filename}`
      : `http://localhost:3001/images/default.jpg`;

    // Récupération sécurisée du reste des champs si présents dans req.body
    const nouvelleAnnonce = {
      id: `annonce-${Date.now()}`,
      titre,
      description: req.body.description || "",
      prix: Number(prix) || 0,
      categorieId: req.body.categorieId || null,
      quartierId: req.body.quartierId || null,
      vendeurId: req.body.vendeurId || null,
      image: imageUrl,
      statut: "active",
      estEnAvant: false,
      vues: 0,
      dateCreation: new Date().toISOString(),
      dateMaj: null,
    };

    // Sauvegarde directe dans Lowdb (json-server)
    db.get("annonces").push(nouvelleAnnonce).write();

    res.status(201).json(nouvelleAnnonce);
  });

  // GET /api/annonces/recherche?q=votre_recherche
  router.get("/recherche", (req, res) => {
    const query = req.query.q;

    // Sécurité si le paramètre q est manquant
    if (!query) {
      return res.json([]);
    }

    const searchStr = query.toLowerCase();

    const resultats = db
      .get("annonces")
      .filter((a) => {
        const titreMatch = a.titre
          ? a.titre.toLowerCase().includes(searchStr)
          : false;
        // Sécurité si description est absente ou undefined
        const descMatch = a.description
          ? a.description.toLowerCase().includes(searchStr)
          : false;

        return titreMatch || descMatch;
      })
      .value();

    res.json(resultats);
  });

  return router;
}
