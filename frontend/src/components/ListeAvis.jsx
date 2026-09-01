import { useEffect, useState } from "react";
import { UtilisateurAPI } from "../services/api";
import NoteEtoiles from "./NoteEtoiles";

export default function ListeAvis({ avis = [] }) {
  const [auteurs, setAuteurs] = useState({});

  const auteursManquants = [
    ...new Set(
      avis
        .filter((avisItem) => !avisItem.nomAuteur && avisItem.auteurId)
        .map((avisItem) => avisItem.auteurId)
    ),
  ];

  useEffect(() => {
    if (auteursManquants.length === 0) return;
    let annule = false;

    UtilisateurAPI.getByIds(auteursManquants)
      .then((liste) => {
        if (annule) return;
        setAuteurs(Object.fromEntries(liste.map((utilisateur) => [utilisateur.id, utilisateur])));
      })
      .catch(() => {});

    return () => {
      annule = true;
    };
  }, [auteursManquants.join(",")]);

  if (!Array.isArray(avis) || avis.length === 0) return null;

  return (
    <div className="card p-5">
      <h3 className="mb-4 text-lg font-extrabold text-neutral-900">
        Avis clients
      </h3>
      <div className="space-y-4">
        {avis.map((avisItem) => {
          const auteur = auteurs[avisItem.auteurId];
          const nomAuteur =
            avisItem.nomAuteur ||
            (auteur ? `${auteur.prenom} ${auteur.nom}` : "Client");
          const initiale =
            auteur?.prenom?.charAt(0).toUpperCase() ||
            avisItem.nomAuteur?.charAt(0).toUpperCase() ||
            "?";

          return (
            <div
              key={avisItem.id}
              className="border-b border-neutral-100 pb-3 last:border-0 last:pb-0"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-500">
                    {initiale}
                  </div>
                  <p className="truncate text-sm font-semibold text-neutral-900">
                    {nomAuteur}
                  </p>
                </div>
                <NoteEtoiles note={avisItem.note} />
              </div>
              <p className="mt-1 text-sm leading-relaxed text-neutral-500">
                {avisItem.commentaire}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}