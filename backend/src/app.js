import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import jsonServer from "json-server";
import cors from "cors";

import utilisateursRoutes from "./routes/utilisateurs.js";
import signalementsRoutes from "./routes/signalements.js";
import annoncesRoutes from "./routes/annonces.js";

// Gestion de __dirname obligatoire en modules ES (import/export)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 1. Initialisation unique du routeur avec le bon chemin
const router = jsonServer.router(path.join(__dirname, "..", "data", "db.json"));
const jsonServerMiddlewares = jsonServer.defaults();

// 2. Middlewares globaux (Suppression définitive de express.json())
app.use(cors());
app.use(jsonServerMiddlewares); // <-- Gère le body parser pour TOUTE l'application

// Images statiques servies depuis backend/public/images et backend/images
app.use("/images", express.static(path.join(__dirname, "..", "public", "images")));
app.use("/images", express.static(path.join(__dirname, "..", "images")));

// 3. Routes personnalisées (montées avant le router json-server)
app.use("/api/utilisateurs", utilisateursRoutes(router.db));
app.use("/api/signalements", signalementsRoutes(router.db));
app.use("/api/annonces", annoncesRoutes(router.db));

// 4. Le routeur json-server final pour le CRUD automatique
app.use("/api", router);

export default app;
