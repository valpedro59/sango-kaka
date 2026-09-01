import NoteEtoiles from "./NoteEtoiles";
import { construireLienWhatsApp } from "../utils/whatsapp";
import { formaterMembreDepuis } from "../utils/formatage";

export default function CarteVendeur({ vendeur, noteMoyenne }) {
  const lienWhatsApp = construireLienWhatsApp(vendeur?.whatsapp);

  return (
    <div className="card p-5">
      <h3 className="mb-4 text-lg font-extrabold text-neutral-900">Vendeur</h3>

      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-base font-bold text-brand-500">
          {vendeur?.prenom?.[0]}{vendeur?.nom?.[0]}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-bold text-neutral-900">
              {vendeur?.prenom} {vendeur?.nom}
            </p>
            {vendeur?.estVerifie && (
              <span className="verification-stamp !h-6 !w-6 !border-[1.5px] !text-[10px]" />
            )}
          </div>
          <p className="font-tag text-[11px] text-neutral-500">
            {vendeur?.bio || ""}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <NoteEtoiles note={noteMoyenne} />
        <span className="font-tag text-xs text-neutral-500">
          {noteMoyenne > 0 ? noteMoyenne.toFixed(1) : "Aucune note"}
        </span>
      </div>

      <p className="mt-3 font-tag text-[11px] text-neutral-500">
        Membre depuis {formaterMembreDepuis(vendeur?.dateCreation)}
      </p>

      {lienWhatsApp && (
        <a
          href={lienWhatsApp}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp mt-4 w-full text-center"
        >
          Contacter sur WhatsApp
        </a>
      )}
    </div>
  );
}