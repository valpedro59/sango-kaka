
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import CarteVendeur from "../components/CarteVendeur";
import ListeAvis from "../components/ListeAvis";
import CarteAnnonce from "../components/CarteAnnonce";

const API_URL = "http://localhost:3000/api";

export default function SellerProfile() {
  // =====================================================
  // ID DU VENDEUR
  // =====================================================

  const { id } = useParams();

  // =====================================================
  // ÉTATS
  // =====================================================

  const [vendeur, setVendeur] = useState(null);
  const [avis, setAvis] = useState([]);
  const [annonces, setAnnonces] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // CHARGEMENT DU PROFIL
  // =====================================================

  useEffect(() => {
    async function chargerProfil() {
      try {
        setLoading(true);
        setError("");

        // -------------------------------------------------
        // RÉCUPÉRER VENDEUR + AVIS + ANNONCES
        // -------------------------------------------------

        const [vendeurResponse, avisResponse, annoncesResponse] =
          await Promise.all([
            fetch(`${API_URL}/utilisateurs/${id}`),

            fetch(`${API_URL}/avis?vendeurId=${id}`),

            fetch(
              `${API_URL}/annonces?vendeurId=${id}&statut=active`
            ),
          ]);

        // -------------------------------------------------
        // VÉRIFIER LE VENDEUR
        // -------------------------------------------------

        if (!vendeurResponse.ok) {
          throw new Error("Vendeur introuvable.");
        }

        // -------------------------------------------------
        // VÉRIFIER LES AVIS
        // -------------------------------------------------

        if (!avisResponse.ok) {
          throw new Error("Impossible de récupérer les avis.");
        }

        // -------------------------------------------------
        // VÉRIFIER LES ANNONCES
        // -------------------------------------------------

        if (!annoncesResponse.ok) {
          throw new Error(
            "Impossible de récupérer les annonces du vendeur."
          );
        }

        // -------------------------------------------------
        // CONVERTIR LES RÉPONSES EN JSON
        // -------------------------------------------------

        const vendeurData = await vendeurResponse.json();
        const avisData = await avisResponse.json();
        const annoncesData = await annoncesResponse.json();

        // -------------------------------------------------
        // ENREGISTRER LES DONNÉES
        // -------------------------------------------------

        setVendeur(vendeurData);

        setAvis(
          Array.isArray(avisData)
            ? avisData
            : []
        );

        setAnnonces(
          Array.isArray(annoncesData)
            ? annoncesData
            : []
        );
      } catch (error) {
        console.error(
          "Erreur lors du chargement du profil :",
          error
        );

        setError(
          error.message ||
            "Impossible de charger le profil du vendeur."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      chargerProfil();
    }
  }, [id]);

  // =====================================================
  // CALCUL DE LA NOTE MOYENNE
  // =====================================================

  const noteMoyenne =
    avis.length > 0
      ? avis.reduce(
          (total, avisItem) =>
            total + Number(avisItem.note || 0),
          0
        ) / avis.length
      : 0;

  // =====================================================
  // CHARGEMENT
  // =====================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-50 px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="card p-8 text-center">
            <p className="text-sm text-neutral-500">
              Chargement du profil vendeur...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // =====================================================
  // ERREUR
  // =====================================================

  if (error) {
    return (
      <main className="min-h-screen bg-neutral-50 px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <h2 className="text-lg font-bold text-red-700">
              Impossible de charger le profil
            </h2>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>
          </div>
        </div>
      </main>
    );
  }

  // =====================================================
  // VENDEUR INTROUVABLE
  // =====================================================

  if (!vendeur) {
    return (
      <main className="min-h-screen bg-neutral-50 px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="card p-8 text-center">
            <p className="text-sm text-neutral-500">
              Vendeur introuvable.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // =====================================================
  // AFFICHAGE
  // =====================================================

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* =================================================
            EN-TÊTE
        ================================================= */}

        <div className="mb-6">
          <h1 className="mt-2 text-2xl font-extrabold text-neutral-900 sm:text-3xl">
            Profil vendeur
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Consultez les informations, les annonces et les avis
            de ce vendeur.
          </p>
        </div>

        {/* =================================================
            INFORMATIONS VENDEUR + AVIS
        ================================================= */}

        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">

          {/* CARTE VENDEUR */}

          <div>
            <CarteVendeur
              vendeur={vendeur}
              noteMoyenne={noteMoyenne}
            />
          </div>

          {/* AVIS */}

          <div>
            <ListeAvis avis={avis} />

            {avis.length === 0 && (
              <div className="card p-6 text-center">
                <p className="text-sm text-neutral-500">
                  Ce vendeur n'a pas encore reçu d'avis.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* =================================================
            ANNONCES DU VENDEUR
        ================================================= */}

        <section className="mt-10">

          {/* TITRE */}

          <div className="mb-5">
            <p className="font-tag text-[11px] font-bold uppercase tracking-[0.2em] text-brand-500">
              Boutique du vendeur
            </p>

            <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="text-2xl font-extrabold text-neutral-900">
                Ses annonces
              </h2>

              <span className="text-sm text-neutral-500">
                {annonces.length} annonce
                {annonces.length > 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* AUCUNE ANNONCE */}

          {annonces.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-sm text-neutral-500">
                Ce vendeur n'a aucune annonce disponible pour le
                moment.
              </p>
            </div>
          ) : (
            /* LISTE DES ANNONCES */

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {annonces.map((annonce) => (
                <CarteAnnonce
                  key={annonce.id}
                  annonce={annonce}
                />
              ))}
            </div>
          )}

        </section>
      </div>
    </main>
  );
}
