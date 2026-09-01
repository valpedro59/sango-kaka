
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8">

        {/* CONTENU PRINCIPAL */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* LOGO / DESCRIPTION */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="inline-block text-2xl font-extrabold tracking-tight text-brand-500"
            >
              Sango-Kaka
            </Link>

            <p className="mt-4 max-w-md text-sm leading-6 text-neutral-500">
              La plateforme congolaise pour acheter et vendre facilement
              des produits près de chez vous.
            </p>

            <p className="mt-4 text-xs font-medium uppercase tracking-wider text-neutral-400">
              Acheter • Vendre • Échanger
            </p>
          </div>

          {/* NAVIGATION */}
          <div>
            <h3 className="text-sm font-extrabold text-neutral-900">
              Navigation
            </h3>

            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-sm text-neutral-500 transition hover:text-brand-500"
                >
                  Accueil
                </Link>
              </li>

              <li>
                <Link
                  to="/search"
                  className="text-sm text-neutral-500 transition hover:text-brand-500"
                >
                  Rechercher
                </Link>
              </li>

              <li>
                <Link
                  to="/depot-annonce"
                  className="text-sm text-neutral-500 transition hover:text-brand-500"
                >
                  Déposer une annonce
                </Link>
              </li>
            </ul>
          </div>

          {/* COMPTE */}
          <div>
            <h3 className="text-sm font-extrabold text-neutral-900">
              Mon compte
            </h3>

            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  to="/connexion"
                  className="text-sm text-neutral-500 transition hover:text-brand-500"
                >
                  Se connecter
                </Link>
              </li>

              <li>
                <Link
                  to="/inscription"
                  className="text-sm text-neutral-500 transition hover:text-brand-500"
                >
                  Créer un compte
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* SÉPARATION */}
        <div className="my-10 border-t border-neutral-200" />

        {/* BAS DU FOOTER */}
        <div className="flex flex-col gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">

          <p className="text-xs text-neutral-400">
            © {new Date().getFullYear()} Sango-Kaka. Tous droits réservés.
          </p>

          <div className="flex justify-center gap-5 sm:justify-end">
            <Link
              to="/"
              className="text-xs text-neutral-400 transition hover:text-brand-500"
            >
              Conditions
            </Link>

            <Link
              to="/"
              className="text-xs text-neutral-400 transition hover:text-brand-500"
            >
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

