import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import jsonServer from "json-server";
import cors from "cors";
import "dotenv/config";

import utilisateursRoutes from "./routes/utilisateurs.js";
import signalementsRoutes from "./routes/signalements.js";
import annoncesRoutes from "./routes/annonces.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const router = jsonServer.router("data/db.json");

app.use(cors());
app.use(express.json());

// Images statiques servies depuis backend/images/
app.use("/images", express.static(path.join(__dirname, "..", "images")));

// ---------------------------------------------------------------
// Routes custom — montées AVANT le router json-server pour que
// leurs chemins spécifiques (ex: /api/utilisateurs/:id/note-moyenne)
// soient bien interceptés avant le CRUD générique.
// Chaque dev backend travaille dans SON fichier sous routes/,
// pas directement ici, pour éviter les conflits Git.
// ---------------------------------------------------------------
app.use("/api/utilisateurs", utilisateursRoutes(router.db));
app.use("/api/signalements", signalementsRoutes(router.db));
app.use("/api/annonces", annoncesRoutes(router.db));

// ---------------------------------------------------------------
// CRUD standard généré automatiquement par json-server
// (annonces, utilisateurs, categories, quartiers, avis, signalements)
// pour tout ce qui n'est pas intercepté par les routes custom ci-dessus.
// ---------------------------------------------------------------
app.use("/api", router);

export default app;
