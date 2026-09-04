import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAnnonce from "../hooks/useAnnonce";
import { AnnonceAPI, SignalementAPI } from "../services/api";
import { construireLienWhatsApp } from "../utils/whatsapp";
import { formaterDate, formaterPrix } from "../utils/formatage";
import GaleriePhotos from "../components/GaleriePhotos";
import CarteVendeur from "../components/CarteVendeur";
import ListeAvis from "../components/ListeAvis";

export default function FicheAnnoncePage() {
  const { id } = useParams();
  const naviguer = useNavigate();
  const { annonce, vendeur, avis, noteMoyenne, categories, quartiers, chargement, erreur } = useAnnonce(id);

  const [afficherModalSignalement, setAfficherModalSignalement] = useState(false);
  const [raisonSignalement, setRaisonSignalement] = useState("");
  const [signalementEnvoye, setSignalementEnvoye] = useState(false);
  const [erreurSignalement, setErreurSignalement] = useState(null);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const vueComptabilisee = useRef(false);

  const lienWhatsApp = construireLienWhatsApp(vendeur?.whatsapp);

  useEffect(() => {
    if (!annonce?.id || vueComptabilisee.current) return;
    vueComptabilisee.current = true;
    AnnonceAPI.patch(annonce.id, { vues: (annonce.vues || 0) + 1 }).catch(() => {});
  }, [annonce?.id]);

  const nomCategorie = categories?.find((c) => c.id === annonce?.categorieId)?.nom || null;
  const nomQuartier = quartiers?.find((q) => q.id === annonce?.quartierId)?.nom || null;

  async function gererSignalement(evenement) {
    evenement.preventDefault();
    if (!raisonSignalement.trim()) return;
    setEnvoiEnCours(true);
    setErreurSignalement(null);
    try {
      await SignalementAPI.creer({ annonceId: annonce.id, raison: raisonSignalement.trim() });
      setSignalementEnvoye(true);
    } catch {
      setErreurSignalement("Erreur lors de l'envoi du signalement.");
    } finally {
      setEnvoiEnCours(false);
    }
  }

  if (chargement) {
    return (
      <div className="container-shell py-8">
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-neutral-500">Chargement...</p>
        </div>
      </div>
    );
  }

  if (erreur || !annonce) {
    return (
      <div className="container-shell py-8">
        <p className="text-center text-sm text-neutral-500">
          {erreur || "Annonce introuvable."}
        </p>
        <button onClick={() => naviguer("/")} className="btn-secondary mx-auto mt-4">
          Retour
        </button>
      </div>
    );
  }

  return (
    <div className="container-shell py-6 md:py-8">
      <button
        onClick={() => naviguer(-1)}
        className="mb-5 flex items-center gap-2 text-sm font-medium text-neutral-500 transition hover:text-neutral-900"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Retour
      </button>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <GaleriePhotos images={annonce.images || annonce.image} titre={annonce.titre} />

          <div className="card p-5">
            <div className="flex flex-wrap items-center gap-2">
              {nomCategorie && <span className="badge">{nomCategorie}</span>}
              {annonce.statut === "active" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Disponible
                </span>
              )}
            </div>

            <h1 className="mt-4 text-2xl font-extrabold text-neutral-900 sm:text-3xl">
              {annonce.titre}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-neutral-500">
              {nomQuartier && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
                    <path fillRule="evenodd" d="M9.546 19.045a.75.75 0 01.75-.75h.013a.75.75 0 010 1.5h-.013a.75.75 0 01-.75-.75zM10.75 19.424a.75.75 0 01.75-.75h.013a.75.75 0 010 1.5h-.013a.75.75 0 01-.75-.75zM11.954 19.804a.75.75 0 01.75-.75h.013a.75.75 0 010 1.5h-.013a.75.75 0 01-.75-.75zM9.546 18.4a.75.75 0 010 1.5h-.013a.75.75 0 010-1.5h.013zM5.222 2.09a.75.75 0 01.75.75v9.5a.75.75 0 01-1.5 0V2.84a.75.75 0 01.75-.75zM15.333 2.09a.75.75 0 01.75.75v9.5a.75.75 0 01-1.5 0v-9.5a.75.75 0 01.75-.75zM8.223 6.094a.75.75 0 010 1.5H5.972a.75.75 0 010-1.5H8.223zM10 12.754a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                  </svg>
                  {nomQuartier}
                </span>
              )}
              {nomQuartier && <span className="h-1 w-1 rounded-full bg-neutral-300" />}
              <span>{formaterDate(annonce.dateCreation)}</span>
              <span className="h-1 w-1 rounded-full bg-neutral-300" />
              <span>{annonce.vues || 0} vues</span>
            </div>

            <p className="mt-5 text-base leading-relaxed text-neutral-500">
              {annonce.description}
            </p>

            <div className="mt-6 flex items-center justify-between">
              <span className="font-tag text-2xl font-bold text-brand-500">
                {formaterPrix(annonce.prix)}
              </span>
              {lienWhatsApp && (
                <a
                  href={lienWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp"
                >
                  Contacter
                </a>
              )}
            </div>

            <button
              onClick={() => setAfficherModalSignalement(true)}
              className="mt-4 flex items-center gap-2 text-xs font-medium text-neutral-500 transition hover:text-red-600"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V3zm4 1v12h6V4H7z" clipRule="evenodd" />
              </svg>
              Signaler cette annonce
            </button>
          </div>
        </div>

        <aside className="space-y-6">
          <CarteVendeur vendeur={vendeur} noteMoyenne={noteMoyenne} />
          {vendeur?.id && (
            <button
              onClick={() => naviguer(`/vendeur/${vendeur.id}`)}
              className="btn-secondary w-full"
            >
              Voir profil
            </button>
          )}
          <ListeAvis avis={avis} />
        </aside>
      </div>

      {afficherModalSignalement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="card w-full max-w-md p-6">
            {signalementEnvoye ? (
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                  <svg viewBox="0 0 20 20" fill="#16a34a" className="h-6 w-6">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-extrabold text-neutral-900">Merci</h3>
                <p className="mt-2 text-sm text-neutral-500">Votre signalement a été envoyé.</p>
                <button onClick={() => { setAfficherModalSignalement(false); setSignalementEnvoye(false); setRaisonSignalement(""); }} className="btn-primary mt-4">
                  Fermer
                </button>
              </div>
            ) : (
              <form onSubmit={gererSignalement}>
                <h3 className="text-lg font-extrabold text-neutral-900">Signaler l'annonce</h3>
                <p className="mt-1 text-sm text-neutral-500">
                  Décrivez le problème pour nous aider à modérer.
                </p>
                <textarea
                  value={raisonSignalement}
                  onChange={(e) => setRaisonSignalement(e.target.value)}
                  rows={4}
                  placeholder="Ex : Prix suspect, arnaque probable..."
                  className="textarea-field mt-4"
                  required
                />
                {erreurSignalement && <p className="mt-2 text-xs text-red-600">{erreurSignalement}</p>}
                <div className="mt-4 flex gap-3">
                  <button type="button" onClick={() => setAfficherModalSignalement(false)} className="btn-secondary flex-1">
                    Annuler
                  </button>
                  <button type="submit" disabled={envoiEnCours} className="btn-primary flex-1">
                    {envoiEnCours ? "Envoi..." : "Envoyer"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}