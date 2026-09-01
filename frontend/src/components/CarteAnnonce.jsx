import { useNavigate } from "react-router-dom";
import { formaterPrix } from "../utils/formatage";

export default function CarteAnnonce({ annonce }) {
  const naviguer = useNavigate();
  const sourceImage = annonce.images?.[0] || annonce.image || null;

  return (
    <article
      onClick={() => naviguer(`/annonce/${annonce.id}`)}
      className="group flex flex-col cursor-pointer overflow-hidden rounded-[14px] border border-neutral-200 bg-white shadow-sm shadow-neutral-200/60 transition duration-200 hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative h-40 overflow-hidden bg-neutral-200">
        {sourceImage ? (
          <img
            src={sourceImage}
            alt={annonce.titre}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-400">
            Aucune photo
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-3">
          <span className="badge">{annonce.nomCategorie}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <span className="font-tag text-[11px] uppercase tracking-[0.14em] text-neutral-500">
          {annonce.nomQuartier}
        </span>

        <h3 className="mt-3 text-lg font-extrabold text-neutral-900">{annonce.titre}</h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-neutral-500">{annonce.description}</p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="font-tag text-lg font-bold text-brand-500">
            {formaterPrix(annonce.prix)}
          </span>
        </div>
      </div>
    </article>
  );
}