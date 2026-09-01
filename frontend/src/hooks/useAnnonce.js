import { useEffect, useState } from "react";
import { AnnonceAPI, UtilisateurAPI, AvisAPI, CategorieAPI, QuartierAPI } from "../services/api";

export default function useAnnonce(id) {
  const [annonce, setAnnonce] = useState(null);
  const [vendeur, setVendeur] = useState(null);
  const [avis, setAvis] = useState([]);
  const [noteMoyenne, setNoteMoyenne] = useState(0);
  const [categories, setCategories] = useState([]);
  const [quartiers, setQuartiers] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    if (!id) return;

    let annule = false;

    async function charger() {
      setChargement(true);
      setErreur(null);
      try {
        const [donneesAnnonce, donneesCategories, donneesQuartiers] = await Promise.all([
          AnnonceAPI.getById(id),
          CategorieAPI.getAll(),
          QuartierAPI.getAll(),
        ]);

        if (annule) return;
        setAnnonce(donneesAnnonce);
        setCategories(donneesCategories);
        setQuartiers(donneesQuartiers);

        const [donneesVendeur, donneesAvis, donneesNote] = await Promise.all([
          UtilisateurAPI.getById(donneesAnnonce.vendeurId),
          AvisAPI.getParVendeur(donneesAnnonce.vendeurId),
          UtilisateurAPI.getNoteMoyenne(donneesAnnonce.vendeurId),
        ]);

        if (annule) return;
        setVendeur(donneesVendeur);
        setNoteMoyenne(donneesNote.note ?? 0);

        if (donneesAvis.length > 0) {
          const idsAuteurs = [...new Set(donneesAvis.map((a) => a.auteurId))];
          const donneesUtilisateurs = await UtilisateurAPI.getByIds(idsAuteurs).catch(() => []);

          const mapUtilisateurs = Object.fromEntries(donneesUtilisateurs.map((u) => [u.id, u]));
          const avisEnrichis = donneesAvis.map((avisItem) => ({
            ...avisItem,
            nomAuteur: mapUtilisateurs[avisItem.auteurId]
              ? `${mapUtilisateurs[avisItem.auteurId].prenom} ${mapUtilisateurs[avisItem.auteurId].nom}`
              : avisItem.auteurId,
          }));

          setAvis(avisEnrichis);
        } else {
          setAvis([]);
        }
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
  }, [id]);

  return { annonce, vendeur, avis, noteMoyenne, categories, quartiers, chargement, erreur };
}