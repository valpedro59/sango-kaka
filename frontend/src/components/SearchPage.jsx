import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAnnonces from "../hooks/useAnnonces";

const categories = ["Tous", "Téléphones", "Moto", "Meubles", "Électroménager", "Autres"];
const quarters = [
  "Tous les quartiers",
  "Poto-Poto",
  "Makélékélé",
  "Ouenzé",
  "Bacongo",
  "Moungali",
  "Talangaï",
];
const budgets = [
  { label: "Moins de 150k", value: "150000" },
  { label: "150k - 500k", value: "500000" },
  { label: "500k - 1M", value: "1000000" },
  { label: "1M+", value: "1000000+" },
];

const routeMap = {
  Tous: "/",
  Téléphones: "/categories/telephones",
  Moto: "/categories/moto",
  Meubles: "/categories/meubles",
  "Électroménager": "/categories/electromenager",
  Autres: "/categories/autres",
};

const getCategoryFromPath = () => {
  const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";

  const foundCategory = Object.entries(routeMap).find(([, route]) => route === currentPath);

  return foundCategory ? foundCategory[0] : "Tous";
};

const slugifyCategory = (category) => routeMap[category] || "/";

function SearchPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(() => getCategoryFromPath());
  const [selectedQuarter, setSelectedQuarter] = useState("Tous les quartiers");
  const [selectedBudget, setSelectedBudget] = useState("all");
  const [selectedQuickFilter, setSelectedQuickFilter] = useState("Vérifiés");
  const { annonces, loading, error } = useAnnonces({ statut: "active" });

  useEffect(() => {
    const currentRoute = slugifyCategory(selectedCategory);
    const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";

    if (currentPath !== currentRoute) {
      window.history.pushState({}, "", currentRoute);
    }
  }, [selectedCategory]);

  useEffect(() => {
    const handleRouteChange = () => {
      const nextCategory = getCategoryFromPath();
      setSelectedCategory(nextCategory);
    };

    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="container-shell py-6 md:py-8">
        <header className="card mb-6 p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-500 text-lg font-extrabold text-white shadow-sm">
                S
              </div>
              <div>
                <p className="font-tag text-[10px] font-bold uppercase tracking-[0.2em] text-brand-500">
                  Marketplace
                </p>
                <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900">
                  Sango·Kaka
                </h1>
              </div>
            </div>

            <div className="w-full max-w-xl">
              <label className="relative block">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-neutral-500">
                  ⌕
                </span>
                <input
                  type="text"
                  placeholder="Rechercher un produit, un quartier..."
                  className="input-field pl-11"
                />
              </label>
            </div>

            <div className="flex items-center gap-3">
              <button className="btn-secondary">Connexion</button>
              <button 
                className="btn-primary"
                onClick={() => navigate("/depot-annonce")}
              >
                Déposer annonce
              </button>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="card h-fit p-5">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-xl font-extrabold text-neutral-900">Filtres</h2>
              <button className="text-xs font-semibold uppercase tracking-wide text-brand-500">
                Réinitialiser
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">
                  Catégorie
                </p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => {
                    const isSelected = selectedCategory === category;

                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(category);
                          const nextRoute = slugifyCategory(category);
                          window.history.pushState({}, "", nextRoute);
                        }}
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
                <label className="mb-3 block text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">
                  Quartier
                </label>
                <select
                  className="input-field"
                  value={selectedQuarter}
                  onChange={(event) => setSelectedQuarter(event.target.value)}
                >
                  {quarters.map((quarter) => (
                    <option key={quarter} value={quarter}>
                      {quarter}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">
                  Budget
                </p>
                <div className="space-y-2">
                  {budgets.map((budget) => {
                    const isSelected = selectedBudget === budget.value;

                    return (
                      <button
                        key={budget.label}
                        type="button"
                        onClick={() => setSelectedBudget(budget.value)}
                        className={`flex w-full items-center justify-between rounded-[12px] border px-3 py-2 text-left text-sm transition ${
                          isSelected
                            ? "border-brand-100 bg-brand-50 text-brand-500 shadow-sm"
                            : "border-neutral-200 bg-neutral-50 text-neutral-600 hover:border-brand-100 hover:bg-brand-50 hover:text-brand-500"
                        }`}
                      >
                        <span>{budget.label}</span>
                        <span className="font-tag text-[11px]">{budget.value}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 rounded-[12px] border border-neutral-200 bg-neutral-50 p-3">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">
                    Budget max
                  </label>
                  <input type="range" min="100000" max="2000000" defaultValue="750000" className="w-full accent-brand-500" />
                  <div className="mt-2 flex items-center justify-between text-xs text-neutral-500">
                    <span>100k</span>
                    <span className="font-tag text-brand-500">750k</span>
                    <span>2M</span>
                  </div>
                </div>
              </div>

              <button className="btn-primary w-full">Appliquer les filtres</button>
            </div>
          </aside>

          <section>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-tag text-[11px] font-bold uppercase tracking-[0.2em] text-brand-500">
                  Annonces
                </p>
                <h2 className="mt-1 text-3xl font-extrabold text-neutral-900">Annonces populaires</h2>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {[
                  "Vérifiés",
                  "Récents",
                  "À petit prix",
                ].map((filter) => {
                  const isSelected = selectedQuickFilter === filter;

                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setSelectedQuickFilter(filter)}
                      className={`chip transition ${
                        isSelected
                          ? "border-brand-100 bg-brand-50 text-brand-500 shadow-sm"
                          : "border-neutral-200 bg-neutral-50 text-neutral-500 hover:border-brand-100 hover:bg-brand-50 hover:text-brand-500"
                      }`}
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {loading && Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-[14px] border border-neutral-200 bg-white">
                  <div className="h-40 animate-pulse bg-neutral-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 w-20 animate-pulse rounded bg-neutral-200" />
                    <div className="h-5 w-3/4 animate-pulse rounded bg-neutral-200" />
                    <div className="space-y-2">
                      <div className="h-3 w-full animate-pulse rounded bg-neutral-200" />
                      <div className="h-3 w-2/3 animate-pulse rounded bg-neutral-200" />
                    </div>
                    <div className="h-5 w-1/3 animate-pulse rounded bg-neutral-200 mt-4" />
                  </div>
                </div>
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
                <article
                  key={annonce.id}
                  onClick={() => navigate(`/annonce/${annonce.id}`)}
                  className="group flex flex-col cursor-pointer overflow-hidden rounded-[14px] border border-neutral-200 bg-white shadow-sm shadow-neutral-200/60 transition duration-200 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="relative h-40 overflow-hidden bg-neutral-200">
                    {annonce.images?.[0] ? (
                      <img
                        src={annonce.images[0]}
                        alt={annonce.titre}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-neutral-400">
                        Aucune photo
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-3">
                      <span className="badge">{annonce.categoryName}</span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-tag text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                        {annonce.neighborhoodName}
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-extrabold text-neutral-900">{annonce.titre}</h3>
                    <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-neutral-500">{annonce.description}</p>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className="font-tag text-lg font-bold text-brand-500">
                        {annonce.prix?.toLocaleString("fr-FR")} FCFA
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default SearchPage;
