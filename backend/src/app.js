import express from "express";
import cors from "cors";
import jsonServer from "json-server";
import path from "path";
import { fileURLToPath } from "url";
import sellerRoutes from "./routes/sellerRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares globaux
app.use(express.json());
app.use(cors());

// Route de statut de l'API
app.get("/api/statut", (req, res) => {
  res.json({ message: "Api launched" });
});

// 1. Vos routes personnalisées (AVANT le json-server global)
app.use("/api/vendeurs", sellerRoutes);

// 2. Configuration de JSON Server pour le reste des données
const jsonServerRouter = jsonServer.router(
  path.join(__dirname, "..", "data", "db.json"),
);
const jsonServerMiddlewares = jsonServer.defaults();

app.use("/api", jsonServerMiddlewares);
app.use("/api", jsonServerRouter);

export default app;
