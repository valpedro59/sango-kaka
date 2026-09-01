import { useEffect, useState } from "react";
import NoteEtoiles from "../NoteEtoiles";
import ReviewCard from "./ReviewCard";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Pour le moment, on affiche le profil de cet utilisateur.
// Plus tard, cet ID pourra venir de l'URL.
const VENDEUR_ID = "utilisateur-001";

function SellerProfile() {
  const [vendeur, setVendeur] = useState(null);
  const [avis, setAvis] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // RÉCUPÉRATION DU VENDEUR + AVIS
  // ============================================================
  useEffect(() => {
    async function fetchSellerData() {
      try {
        setLoading(true);
        setError("");

        // Récupération du vendeur et de ses avis en parallèle
        const [vendeurResponse, avisResponse] = await Promise.all([
          fetch(`${API_URL}/utilisateurs/${VENDEUR_ID}`),
          fetch(`${API_URL}/avis?vendeurId=${VENDEUR_ID}`),
        ]);

        if (!vendeurResponse.ok) {
          throw new Error("Impossible de récupérer le vendeur.");
        }

        if (!avisResponse.ok) {
          throw new Error("Impossible de récupérer les avis.");
        }

        const vendeurData = await vendeurResponse.json();
        const avisData = await avisResponse.json();

        console.log("VENDEUR :", vendeurData);
        console.log("AVIS :", avisData);

        setVendeur(vendeurData);
        setAvis(avisData);
      } catch (error) {
        console.error("Erreur récupération profil vendeur :", error);

        setError(
          "Impossible de charger les informations du vendeur. Vérifiez que le backend est lancé."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchSellerData();
  }, []);

  // ============================================================
  // CALCUL DE LA NOTE MOYENNE
  // ============================================================
  const noteMoyenne =
    avis.length > 0
      ? avis.reduce((total, avisItem) => total + Number(avisItem.note), 0) /
        avis.length
      : 0;

  // Arrondi à 1 chiffre après la virgule
  const noteMoyenneFormatee = noteMoyenne.toFixed(1);

  // ============================================================
  // DATE D'INSCRIPTION
  // ============================================================
  function formaterDate(date) {
    if (!date) return "Date inconnue";

    return new Date(date).toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric",
    });
  }

  // ============================================================
  // CHARGEMENT
  // ============================================================
  if (loading) {
    return (
      <div className="mx-auto w-full max-w-5xl px-5 py-10 md:px-8">
        <div className="rounded-3xl border border-[#E5E5E7] bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-[#6E6E73]">
            Chargement du profil vendeur...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // ERREUR
  // ============================================================
  if (error) {
    return (
      <div className="mx-auto w-full max-w-5xl px-5 py-10 md:px-8">
        <div className="rounded-3xl border border-red-100 bg-red-50 p-8 text-center">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  // Si aucun vendeur n'a été récupéré
  if (!vendeur) {
    return (
      <div className="mx-auto w-full max-w-5xl px-5 py-10 md:px-8">
        <div className="rounded-3xl border border-[#E5E5E7] bg-white p-8 text-center">
          <p className="text-sm text-[#6E6E73]">
            Vendeur introuvable.
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // NOM COMPLET
  // ============================================================
  const nomComplet = `${vendeur.prenom} ${vendeur.nom}`;

  // Première lettre pour l'avatar de secours
  const initiale = vendeur.prenom?.charAt(0).toUpperCase() || "?";

  return (
    <div className="mx-auto w-full max-w-5xl px-5 md:px-8">

      {/* EN-TÊTE */}
      <div className="mb-8">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#0066CC]">
          Profil vendeur
        </p>

        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#1D1D1F] md:text-4xl">
          Découvrez ce vendeur
        </h1>

        <p className="mt-2 text-sm leading-6 text-[#6E6E73] md:text-base">
          Consultez les informations et les avis des clients avant de prendre
          contact.
        </p>
      </div>

      {/* CARTE PROFIL */}
      <section className="overflow-hidden rounded-3xl border border-[#E5E5E7] bg-white shadow-sm">

        {/* PROFIL */}
        <div className="px-5 pb-7 md:px-8">
          <div className="mt-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

            {/* IDENTITÉ */}
            <div className="flex items-end gap-4">

              {/* AVATAR */}
              {vendeur.avatar ? (
                <img
                  src={vendeur.avatar}
                  alt={`Photo de ${nomComplet}`}
                  className="h-24 w-24 rounded-2xl border-4 border-white object-cover shadow-sm"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-[#EAF3FF] text-3xl font-bold text-[#0066CC] shadow-sm">
                  {initiale}
                </div>
              )}

              <div className="pb-1">

                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-[#1D1D1F]">
                    {nomComplet}
                  </h2>

                  {/* VENDEUR VÉRIFIÉ */}
                  {vendeur.estVerifie && (
                    <span
                      title="Vendeur vérifié"
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0066CC] text-xs font-bold text-white"
                    >
                      ✓
                    </span>
                  )}
                </div>

                <p className="mt-1 flex items-center gap-1.5 text-sm text-[#6E6E73]">
                  <span>📍</span>
                  Profil vendeur
                </p>
              </div>
            </div>

            {/* NOTE */}
            <div className="rounded-2xl bg-[#F5F5F7] px-5 py-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#6E6E73]">
                Note moyenne
              </p>

              <NoteEtoiles note={Number(noteMoyenneFormatee)} afficherValeur />
            </div>
          </div>

          {/* BIO */}
          {vendeur.bio && (
            <div className="mt-6 rounded-2xl bg-[#F5F5F7] p-4">
              <p className="text-sm leading-relaxed text-[#6E6E73]">
                {vendeur.bio}
              </p>
            </div>
          )}

          {/* STATISTIQUES */}
          <div className="mt-8 grid grid-cols-1 divide-y divide-[#E5E5E7] rounded-2xl border border-[#E5E5E7] sm:grid-cols-3 sm:divide-x sm:divide-y-0">

            {/* NOTE */}
            <div className="p-4 text-center">
              <p className="text-2xl font-bold text-[#1D1D1F]">
                {noteMoyenneFormatee}
              </p>

              <p className="mt-1 text-xs text-[#6E6E73]">
                Note moyenne
              </p>
            </div>

            {/* AVIS */}
            <div className="p-4 text-center">
              <p className="text-2xl font-bold text-[#1D1D1F]">
                {avis.length}
              </p>

              <p className="mt-1 text-xs text-[#6E6E73]">
                Avis clients
              </p>
            </div>

            {/* DATE */}
            <div className="p-4 text-center">
              <p className="text-2xl font-bold capitalize text-[#1D1D1F]">
                {formaterDate(vendeur.dateCreation)}
              </p>

              <p className="mt-1 text-xs text-[#6E6E73]">
                Inscrit depuis
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AVIS */}
      <section className="mt-10">

        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#1D1D1F]">
              Avis des clients
            </h2>

            <p className="mt-1 text-sm text-[#6E6E73]">
              Ce que les clients pensent de ce vendeur.
            </p>
          </div>

          <span className="hidden rounded-full bg-[#EAF3FF] px-3 py-1 text-xs font-semibold text-[#0066CC] sm:block">
            {avis.length} avis
          </span>
        </div>

        {/* LISTE DES AVIS */}
        {avis.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {avis.map((avisItem) => (
              <ReviewCard
                key={avisItem.id}
                avis={avisItem}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[#E5E5E7] bg-white p-8 text-center">
            <p className="text-sm text-[#6E6E73]">
              Ce vendeur n'a pas encore reçu d'avis.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default SellerProfile;