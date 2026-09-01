import { useEffect, useState } from "react";
import { UtilisateurAPI } from "../services/api";
import NoteEtoiles from "./NoteEtoiles";

export default function ListeAvis({ reviews = [] }) {
  const [auteurs, setAuteurs] = useState({});

  const auteursManquants = [
    ...new Set(
      reviews
        .filter((avis) => !avis.authorName && avis.auteurId)
        .map((avis) => avis.auteurId)
    ),
  ];

  useEffect(() => {
    if (auteursManquants.length === 0) return;
    let cancelled = false;

    UtilisateurAPI.getByIds(auteursManquants)
      .then((liste) => {
        if (cancelled) return;
        setAuteurs(Object.fromEntries(liste.map((u) => [u.id, u])));
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [auteursManquants.join(",")]);

  if (!Array.isArray(reviews) || reviews.length === 0) return null;

  return (
    <div className="card p-5">
      <h3 className="mb-4 text-lg font-extrabold text-neutral-900">
        Avis clients
      </h3>
      <div className="space-y-4">
        {reviews.map((avis) => {
          const auteur = auteurs[avis.auteurId];
          const nomAuteur =
            avis.authorName ||
            (auteur ? `${auteur.prenom} ${auteur.nom}` : "Client");
          const initiale =
            auteur?.prenom?.charAt(0).toUpperCase() ||
            avis.authorName?.charAt(0).toUpperCase() ||
            "?";

          return (
            <div
              key={avis.id}
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
                <NoteEtoiles note={avis.note} />
              </div>
              <p className="mt-1 text-sm leading-relaxed text-neutral-500">
                {avis.commentaire}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}