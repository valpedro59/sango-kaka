import { useEffect, useState } from "react";
import NoteEtoiles from "../NoteEtoiles";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

function ReviewCard({ avis }) {
  const [auteur, setAuteur] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAuteur() {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_URL}/utilisateurs/${avis.auteurId}`
        );

        if (!response.ok) {
          throw new Error("Impossible de récupérer l'auteur de l'avis.");
        }

        const auteurData = await response.json();

        console.log("AUTEUR AVIS :", auteurData);

        setAuteur(auteurData);
      } catch (error) {
        console.error("Erreur récupération auteur :", error);
        setAuteur(null);
      } finally {
        setLoading(false);
      }
    }

    if (avis?.auteurId) {
      fetchAuteur();
    } else {
      setLoading(false);
    }
  }, [avis?.auteurId]);

  // Nom à afficher
  const nomAuteur = auteur
    ? `${auteur.prenom} ${auteur.nom}`
    : "Client";

  // Initiale de l'auteur
  const initiale = auteur?.prenom
    ? auteur.prenom.charAt(0).toUpperCase()
    : "?";

  return (
    <article className="rounded-2xl border border-[#E5E5E7] bg-white p-5 transition hover:shadow-sm">
      <div className="flex items-start justify-between gap-4">

        {/* IDENTITÉ DE L'AUTEUR */}
        <div className="flex items-center gap-3">

          {/* AVATAR */}
          {auteur?.avatar ? (
            <img
              src={auteur.avatar}
              alt={`Photo de ${nomAuteur}`}
              className="h-11 w-11 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EAF3FF] font-semibold text-[#0066CC]">
              {initiale}
            </div>
          )}

          <div>
            <h3 className="font-semibold text-[#1D1D1F]">
              {loading ? "Chargement..." : nomAuteur}
            </h3>

            <p className="text-xs text-[#6E6E73]">
              Avis client
            </p>
          </div>
        </div>

        {/* NOTE */}
        <NoteEtoiles note={avis.note} />
      </div>

      {/* COMMENTAIRE */}
      <p className="mt-4 text-sm leading-6 text-[#4A4A4F]">
        {avis.commentaire}
      </p>
    </article>
  );
}

export default ReviewCard;