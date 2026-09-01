import { useEffect, useState } from "react";
import { AnnonceAPI, CategorieAPI, QuartierAPI } from "../services/api";

export default function useAnnonces(filtres = {}) {
  const [annonces, setAnnonces] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    let annule = false;

    async function charger() {
      setChargement(true);
      setErreur(null);
      try {
        const [donneesAnnonces, categories, quartiers] = await Promise.all([
          AnnonceAPI.getAll(filtres),
          CategorieAPI.getAll(),
          QuartierAPI.getAll(),
        ]);

        if (annule) return;

        const mapCategories = Object.fromEntries(categories.map((c) => [c.id, c.nom]));
        const mapQuartiers = Object.fromEntries(quartiers.map((q) => [q.id, q.nom]));

        const annoncesEnrichies = donneesAnnonces.map((annonce) => ({
          ...annonce,
          nomCategorie: mapCategories[annonce.categorieId] || annonce.categorieId,
          nomQuartier: mapQuartiers[annonce.quartierId] || annonce.quartierId,
        }));

        setAnnonces(annoncesEnrichies);
      } catch (err) {
        if (!annule) setErreur(err.message);
      } finally {
        if (!annule) setChargement(false);
      }
    }

    charger();
    return () => {
      annule = true;
    };
  }, [JSON.stringify(filtres)]);

  return { annonces, chargement, erreur };
}