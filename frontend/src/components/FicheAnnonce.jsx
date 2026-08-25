import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { SignalementAPI, AnnonceAPI } from "../services/api";
import { buildWhatsAppLink } from "../utils/whatsapp";

const NO_PHOTO_SVG = (
  <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-neutral-100 text-neutral-400">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-16 w-16">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
    </svg>
    <span className="text-sm font-medium">Pas de photo</span>
  </div>
);

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatMemberSince(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });
}

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Note ${rating}/5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          viewBox="0 0 20 20"
          fill={star <= Math.round(rating) ? "#F59E0B" : "#D1D5DB"}
          className="h-4 w-4"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.538 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.783.57-1.838-.197-1.538-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
        </svg>
      ))}
    </div>
  );
}

function SafeImage({ src, alt, className, loading = "lazy" }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  if (hasError || !imgSrc) {
    return NO_PHOTO_SVG;
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => setHasError(true)}
    />
  );
}

function GaleriePhotos({ images, title }) {
  const [active, setActive] = useState(0);
  const photos = images?.length ? images : [];

  if (photos.length === 0) {
    return (
      <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-neutral-100">
        {NO_PHOTO_SVG}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-neutral-100">
        <SafeImage
          src={photos[active]}
          alt={`${title} — photo ${active + 1}`}
          className="h-full w-full object-cover"
          loading="eager"
        />
      </div>
      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {photos.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-[10px] border-2 transition ${
                i === active
                  ? "border-brand-500"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <SafeImage src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CarteVendeur({ seller, averageRating }) {
  const lienWhatsApp = buildWhatsAppLink(seller?.whatsapp);

  return (
    <div className="card p-5">
      <h3 className="mb-4 text-lg font-extrabold text-neutral-900">Vendeur</h3>

      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-base font-bold text-brand-500">
          {seller?.prenom?.[0]}{seller?.nom?.[0]}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-bold text-neutral-900">
              {seller?.prenom} {seller?.nom}
            </p>
            {seller?.estVerifie && (
              <span className="verification-stamp !h-6 !w-6 !border-[1.5px] !text-[10px]" />
            )}
          </div>
          <p className="font-tag text-[11px] text-neutral-500">
            {seller?.bio || ""}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <StarRating rating={averageRating} />
        <span className="font-tag text-xs text-neutral-500">
          {averageRating > 0 ? averageRating.toFixed(1) : "Aucune note"}
        </span>
      </div>

      <p className="mt-3 font-tag text-[11px] text-neutral-500">
        Membre depuis {formatMemberSince(seller?.dateCreation)}
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

function ListeAvis({ reviews }) {
  if (!reviews.length) return null;

  return (
    <div className="card p-5">
      <h3 className="mb-4 text-lg font-extrabold text-neutral-900">
        Avis clients
      </h3>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-neutral-100 pb-3 last:border-0 last:pb-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-neutral-900">
                {review.authorName}
              </p>
              <StarRating rating={review.note} />
            </div>
            <p className="mt-1 text-sm leading-relaxed text-neutral-500">
              {review.commentaire}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FicheAnnonce({ listing, seller, reviews, averageRating, categories, quartiers, loading, error }) {
  const navigate = useNavigate();
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
      <main className="min-h-screen bg-neutral-50">
        <div className="container-shell py-8">
          <div className="flex items-center justify-center py-20">
            <p className="text-sm text-neutral-500">Chargement...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !listing) {
    return (
      <main className="min-h-screen bg-neutral-50">
        <div className="container-shell py-8">
          <p className="text-center text-sm text-neutral-500">
            {error || "Annonce introuvable."}
          </p>
          <button onClick={() => navigate("/")} className="btn-secondary mx-auto mt-4">
            Retour
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50">
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
                <p className="mt-2 text-sm text-neutral-500">Votre signalement a été envoyé.</p>
                <button onClick={() => { setShowReportModal(false); setReportSent(false); setReportReason(""); }} className="btn-primary mt-4">
                  Fermer
                </button>
              </div>
            ) : (
              <form onSubmit={handleReport}>
                <h3 className="text-lg font-extrabold text-neutral-900">Signaler l'annonce</h3>
                <p className="mt-1 text-sm text-neutral-500">
                  Décrivez le problème pour nous aider à modérer.
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
    </main>
  );
}
