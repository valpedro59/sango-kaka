
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import CarteVendeur from "../components/CarteVendeur";
import ListeAvis from "../components/ListeAvis";

const API_URL = "http://localhost:3000/api";

export default function SellerProfile() {
  // ID du vendeur récupéré depuis l'URL
  const { id } = useParams();

  const [vendeur, setVendeur] = useState(null);
  const [avis, setAvis] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function chargerProfil() {
      try {
        setLoading(true);
        setError("");

        // Récupérer le vendeur
        const vendeurResponse = await fetch(
          `${API_URL}/utilisateurs/${id}`
        );

        if (!vendeurResponse.ok) {
          throw new Error("Vendeur introuvable.");
        }

        const vendeurData = await vendeurResponse.json();

        // Récupérer les avis du vendeur
        const avisResponse = await fetch(
          `${API_URL}/avis?vendeurId=${id}`
        );

        if (!avisResponse.ok) {
          throw new Error("Impossible de récupérer les avis.");
        }

        const avisData = await avisResponse.json();

        setVendeur(vendeurData);
        setAvis(Array.isArray(avisData) ? avisData : []);

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
        <div className="mx-auto max-w-5xl">
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
        <div className="mx-auto max-w-5xl">
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
        <div className="mx-auto max-w-5xl">
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
      <div className="mx-auto max-w-5xl">

        {/* EN-TÊTE */}
        <div className="mb-6">
          <h1 className="mt-2 text-2xl font-extrabold text-neutral-900 sm:text-3xl">
            Profil vendeur
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Consultez les informations et les avis de ce vendeur.
          </p>
        </div>

        {/* CONTENU */}
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
      </div>
    </main>
  );
}