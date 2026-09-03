import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import useAnnonces from "../hooks/useAnnonces";
import CarteAnnonce from "../components/CarteAnnonce";
import SkeletonCard from "../components/SkeletonCard";

const tranches = [
  { id: "moins-150k", label: "Moins de 150k", min: 0, max: 150000 },
  { id: "150k-500k", label: "150k - 500k", min: 150000, max: 500000 },
  { id: "500k-1M", label: "500k - 1M", min: 500000, max: 1000000 },
  { id: "1M-plus", label: "1M+", min: 1000000, max: null },
];

export default function RecherchePage() {
  const { slug } = useParams();
  const naviguer = useNavigate();
  const [parametresRecherche] = useSearchParams();
  const requeteRecherche = parametresRecherche.get("q") || "";

  const [budgetSelectionne, setBudgetSelectionne] = useState(null);
  const { annonces, categories, chargement, erreur } = useAnnonces({
    statut: "active",
  });

  const categorieActive = slug
    ? categories.find((categorie) => categorie.slug === slug) || null
    : null;

  function allerVersCategorie(slugCategorie) {
    const base = slugCategorie ? `/categories/${slugCategorie}` : "/";
    naviguer(requeteRecherche ? `${base}?q=${encodeURIComponent(requeteRecherche)}` : base);
  }

  function reinitialiser() {
    setBudgetSelectionne(null);
    naviguer(requeteRecherche ? `/?q=${encodeURIComponent(requeteRecherche)}` : "/");
  }

  const annoncesFiltrees = annonces.filter((annonce) => {
    const motRecherche = requeteRecherche.trim().toLowerCase();
    if (motRecherche) {
      const correspond =
        annonce.titre?.toLowerCase().includes(motRecherche) ||
        annonce.description?.toLowerCase().includes(motRecherche);
      if (!correspond) return false;
    }

    if (categorieActive && annonce.categorieId !== categorieActive.id) {
      return false;
    }

    if (budgetSelectionne) {
      const prix = Number(annonce.prix);
      if (budgetSelectionne.min != null && prix < budgetSelectionne.min) return false;
      if (budgetSelectionne.max != null && prix >= budgetSelectionne.max) return false;
    }

    return true;
  });

  const categoriesFiltres = [{ slug: null, nom: "Tous" }, ...categories];

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="container-shell py-6 md:py-8">
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="card h-fit p-5">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-xl font-extrabold text-neutral-900">Filtres</h2>
              <button
                onClick={reinitialiser}
                className="text-xs font-semibold uppercase tracking-wide text-brand-500 transition hover:text-brand-600"
              >
                Reinitialiser
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">
                  Catégorie
                </p>
                <div className="flex flex-wrap gap-2">
                  {categoriesFiltres.map((categorie) => {
                    const estSelectionne = slug === categorie.slug;
                    return (
                      <button
                        key={categorie.slug ?? "tous"}
                        type="button"
                        onClick={() => allerVersCategorie(categorie.slug)}
                        className={`chip transition ${
                          estSelectionne
                            ? "border-brand-100 bg-brand-50 text-brand-500 shadow-sm"
                            : "border-neutral-200 bg-neutral-50 text-neutral-500 hover:border-brand-100 hover:bg-brand-50 hover:text-brand-500"
                        }`}
                      >
                        {categorie.nom}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">
                  Budget
                </p>
                <div className="space-y-2">
                  {tranches.map((tranche) => {
                    const estSelectionne = budgetSelectionne?.id === tranche.id;
                    return (
                      <button
                        key={tranche.id}
                        type="button"
                        onClick={() => setBudgetSelectionne(estSelectionne ? null : tranche)}
                        className={`flex w-full items-center justify-between rounded-[12px] border px-3 py-2 text-left text-sm transition ${
                          estSelectionne
                            ? "border-brand-100 bg-brand-50 text-brand-500 shadow-sm"
                            : "border-neutral-200 bg-neutral-50 text-neutral-600 hover:border-brand-100 hover:bg-brand-50 hover:text-brand-500"
                        }`}
                      >
                        <span>{tranche.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          <section>
            <div className="mb-5">
              <p className="font-tag text-[11px] font-bold uppercase tracking-[0.2em] text-brand-500">
                {requeteRecherche
                  ? `Resultats pour "${requeteRecherche}"`
                  : categorieActive
                    ? categorieActive.nom
                    : "Annonces"}
              </p>
              <h2 className="mt-1 text-3xl font-extrabold text-neutral-900">
                {requeteRecherche
                  ? "Recherche"
                  : categorieActive
                    ? `Catégorie ${categorieActive.nom}`
                    : "Annonces populaires"}
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {chargement && Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
              {erreur && (
                <p className="col-span-full py-12 text-center text-sm text-red-500">
                  {erreur}
                </p>
              )}
              {!chargement && !erreur && annoncesFiltrees.length === 0 && (
                <p className="col-span-full py-12 text-center text-sm text-neutral-500">
                  Aucune annonce ne correspond à ces critères.
                </p>
              )}
              {!chargement && !erreur && annoncesFiltrees.map((annonce) => (
                <CarteAnnonce key={annonce.id} annonce={annonce} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
