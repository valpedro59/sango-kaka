import "./App.css";

function App() {
  return (
    <main className="min-h-screen bg-grid-soft py-12">
      <div className="container-shell">
        <section className="card overflow-hidden p-8 sm:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="badge">Marketplace</span>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                Sango-Kaka
              </h1>
              <p className="mt-3 max-w-xl text-base text-slate-600 sm:text-lg">
                Trouvez des biens d’occasion fiables, vérifiés et bien présentés.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button className="btn-secondary">Explorer</button>
              <button className="btn-primary">Publier une annonce</button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">Annonces</span>
                <span className="status-dot" aria-label="en ligne" />
              </div>
              <p className="mt-3 text-3xl font-bold text-slate-900">1.2K</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <span className="text-sm font-medium text-slate-500">Vendeurs vérifiés</span>
              <p className="mt-3 text-3xl font-bold text-slate-900">340</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <span className="text-sm font-medium text-slate-500">Réponses rapides</span>
              <p className="mt-3 text-3xl font-bold text-slate-900">92%</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
