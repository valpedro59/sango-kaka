import { useEffect, useState } from "react";
import useAnnonces from "../hooks/useAnnonces";
import CarteAnnonce from "../components/CarteAnnonce";
import SkeletonCard from "../components/SkeletonCard";

const categoriesFiltres = ["Tous", "Telephones", "Moto", "Meubles", "Electromenager", "Autres"];
const tranches = [
  { label: "Moins de 150k", value: "150000" },
  { label: "150k - 500k", value: "500000" },
  { label: "500k - 1M", value: "1000000" },
  { label: "1M+", value: "1000000+" },
];

const routeMap = {
  Tous: "/",
  Telephones: "/categories/telephones",
  Moto: "/categories/moto",
  Meubles: "/categories/meubles",
  Electromenager: "/categories/electromenager",
  Autres: "/categories/autres",
};

const getCategoryFromPath = () => {
  const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";
  const found = Object.entries(routeMap).find(([, route]) => route === currentPath);
  return found ? found[0] : "Tous";
};

export default function RecherchePage() {
  const [selectedCategory, setSelectedCategory] = useState(() => getCategoryFromPath());
  const [selectedBudget, setSelectedBudget] = useState("all");
  const { annonces, loading, error } = useAnnonces({ statut: "active" });

  useEffect(() => {
    const nextRoute = routeMap[selectedCategory] || "/";
    const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";
    if (currentPath !== nextRoute) {
      window.history.pushState({}, "", nextRoute);
    }
  }, [selectedCategory]);

  useEffect(() => {
    const handleRouteChange = () => setSelectedCategory(getCategoryFromPath());
    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="container-shell py-6 md:py-8">
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="card h-fit p-5">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-xl font-extrabold text-neutral-900">Filtres</h2>
              <button className="text-xs font-semibold uppercase tracking-wide text-brand-500">
                Reinitialiser
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">
                  Categorie
                </p>
                <div className="flex flex-wrap gap-2">
                  {categoriesFiltres.map((category) => {
                    const isSelected = selectedCategory === category;
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setSelectedCategory(category)}
                        className={`chip transition ${
                          isSelected
                            ? "border-brand-100 bg-brand-50 text-brand-500 shadow-sm"
                            : "border-neutral-200 bg-neutral-50 text-neutral-500 hover:border-brand-100 hover:bg-brand-50 hover:text-brand-500"
                        }`}
                      >
                        {category}
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
                    const isSelected = selectedBudget === tranche.value;
                    return (
                      <button
                        key={tranche.label}
                        type="button"
                        onClick={() => setSelectedBudget(tranche.value)}
                        className={`flex w-full items-center justify-between rounded-[12px] border px-3 py-2 text-left text-sm transition ${
                          isSelected
                            ? "border-brand-100 bg-brand-50 text-brand-500 shadow-sm"
                            : "border-neutral-200 bg-neutral-50 text-neutral-600 hover:border-brand-100 hover:bg-brand-50 hover:text-brand-500"
                        }`}
                      >
                        <span>{tranche.label}</span>
                        <span className="font-tag text-[11px]">{tranche.value}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button className="btn-primary w-full">Appliquer les filtres</button>
            </div>
          </aside>

          <section>
            <div className="mb-5">
              <p className="font-tag text-[11px] font-bold uppercase tracking-[0.2em] text-brand-500">
                Annonces
              </p>
              <h2 className="mt-1 text-3xl font-extrabold text-neutral-900">Annonces populaires</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {loading && Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
              {error && (
                <p className="col-span-full py-12 text-center text-sm text-red-500">
                  {error}
                </p>
              )}
              {!loading && !error && annonces.length === 0 && (
                <p className="col-span-full py-12 text-center text-sm text-neutral-500">
                  Aucune annonce pour le moment.
                </p>
              )}
              {!loading && !error && annonces.map((annonce) => (
                <CarteAnnonce key={annonce.id} annonce={annonce} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
