import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAnnonce from "../hooks/useAnnonce";
import { AnnonceAPI, SignalementAPI } from "../services/api";
import { buildWhatsAppLink } from "../utils/whatsapp";
import { formatDate } from "../utils/formatage";
import GaleriePhotos from "../components/GaleriePhotos";
import CarteVendeur from "../components/CarteVendeur";
import ListeAvis from "../components/ListeAvis";

export default function FicheAnnoncePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { listing, seller, reviews, averageRating, categories, quartiers, loading, error } = useAnnonce(id);

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportSent, setReportSent] = useState(false);
  const [reportError, setReportError] = useState(null);
  const [sendingReport, setSendingReport] = useState(false);
  const viewCountedRef = useRef(false);

  const lienWhatsApp = buildWhatsAppLink(seller?.whatsapp);

  useEffect(() => {
    if (!listing?.id || viewCountedRef.current) return;
    viewCountedRef.current = true;
    AnnonceAPI.patch(listing.id, { vues: (listing.vues || 0) + 1 }).catch(() => {});
  }, [listing?.id]);

  const categoryName = categories?.find((c) => c.id === listing?.categorieId)?.nom || null;
  const quartierName = quartiers?.find((q) => q.id === listing?.quartierId)?.nom || null;

  async function handleReport(e) {
    e.preventDefault();
    if (!reportReason.trim()) return;
    setSendingReport(true);
    setReportError(null);
    try {
      await SignalementAPI.create({ annonceId: listing.id, raison: reportReason.trim() });
      setReportSent(true);
    } catch {
      setReportError("Erreur lors de l'envoi du signalement.");
    } finally {
      setSendingReport(false);
    }
  }

  if (loading) {
    return (
      <div className="container-shell py-8">
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-neutral-500">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="container-shell py-8">
        <p className="text-center text-sm text-neutral-500">
          {error || "Annonce introuvable."}
        </p>
        <button onClick={() => navigate("/")} className="btn-secondary mx-auto mt-4">
          Retour
        </button>
      </div>
    );
  }

  return (
    <div className="container-shell py-6 md:py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-5 flex items-center gap-2 text-sm font-medium text-neutral-500 transition hover:text-neutral-900"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Retour
      </button>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <GaleriePhotos images={listing.images} title={listing.titre} />

          <div className="card p-5">
            <div className="flex flex-wrap items-center gap-2">
              {categoryName && <span className="badge">{categoryName}</span>}
              {listing.statut === "active" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Disponible
                </span>
              )}
            </div>

            <h1 className="mt-4 text-2xl font-extrabold text-neutral-900 sm:text-3xl">
              {listing.titre}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-neutral-500">
              {quartierName && (
                <span className="font-tag text-[11px] uppercase tracking-[0.14em]">
                  {quartierName}
                </span>
              )}
              {quartierName && <span className="h-1 w-1 rounded-full bg-neutral-300" />}
              <span>{formatDate(listing.dateCreation)}</span>
              <span className="h-1 w-1 rounded-full bg-neutral-300" />
              <span>{listing.vues || 0} vues</span>
            </div>

            <p className="mt-5 text-base leading-relaxed text-neutral-500">
              {listing.description}
            </p>

            <div className="mt-6 flex items-center justify-between">
              <span className="font-tag text-2xl font-bold text-brand-500">
                {listing.prix?.toLocaleString("fr-FR")} FCFA
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
              onClick={() => setShowReportModal(true)}
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
          <CarteVendeur seller={seller} averageRating={averageRating} />
          <ListeAvis reviews={reviews} />
        </aside>
      </div>

      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="card w-full max-w-md p-6">
            {reportSent ? (
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                  <svg viewBox="0 0 20 20" fill="#16a34a" className="h-6 w-6">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-extrabold text-neutral-900">Merci</h3>
                <p className="mt-2 text-sm text-neutral-500">Votre signalement a ete envoye.</p>
                <button onClick={() => { setShowReportModal(false); setReportSent(false); setReportReason(""); }} className="btn-primary mt-4">
                  Fermer
                </button>
              </div>
            ) : (
              <form onSubmit={handleReport}>
                <h3 className="text-lg font-extrabold text-neutral-900">Signaler l'annonce</h3>
                <p className="mt-1 text-sm text-neutral-500">
                  Decrivez le probleme pour nous aider a moderer.
                </p>
                <textarea
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  rows={4}
                  placeholder="Ex : Prix suspect, arnaque probable..."
                  className="textarea-field mt-4"
                  required
                />
                {reportError && <p className="mt-2 text-xs text-red-600">{reportError}</p>}
                <div className="mt-4 flex gap-3">
                  <button type="button" onClick={() => setShowReportModal(false)} className="btn-secondary flex-1">
                    Annuler
                  </button>
                  <button type="submit" disabled={sendingReport} className="btn-primary flex-1">
                    {sendingReport ? "Envoi..." : "Envoyer"}
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
