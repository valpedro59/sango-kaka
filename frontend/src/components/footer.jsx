
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Partie principale */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* Logo / Présentation */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
                S
              </div>

              <span className="text-xl font-extrabold text-white">
                Sango<span className="text-blue-500">-Kaka</span>
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-6 text-gray-400">
              La plateforme qui vous permet de trouver, publier et vendre
              facilement vos produits et services au Congo.
            </p>

            {/* Réseaux sociaux */}
            <div className="mt-6 flex gap-3">

              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800 text-sm font-bold text-gray-300 transition hover:bg-blue-600 hover:text-white"
              >
                f
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800 text-sm font-bold text-gray-300 transition hover:bg-pink-600 hover:text-white"
              >
                ◎
              </a>

              <a
                href="#"
                aria-label="WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800 text-sm font-bold text-gray-300 transition hover:bg-green-600 hover:text-white"
              >
                
              </a>

            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Navigation
            </h3>

            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link
                  to="/"
                  className="transition hover:text-blue-500"
                >
                  Accueil
                </Link>
              </li>

              <li>
                <Link
                  to="/search"
                  className="transition hover:text-blue-500"
                >
                  Rechercher une annonce
                </Link>
              </li>

              <li>
                <Link
                  to="/depot-annonce"
                  className="transition hover:text-blue-500"
                >
                  Déposer une annonce
                </Link>
              </li>

              <li>
                <Link
                  to="/vendeurs"
                  className="transition hover:text-blue-500"
                >
                  Nos vendeurs
                </Link>
              </li>
            </ul>
          </div>

          {/* Informations */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Informations
            </h3>

            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link
                  to="/a-propos"
                  className="transition hover:text-blue-500"
                >
                  À propos de Sango-Kaka
                </Link>
              </li>

              <li>
                <Link
                  to="/comment-ca-marche"
                  className="transition hover:text-blue-500"
                >
                  Comment ça marche ?
                </Link>
              </li>

              <li>
                <Link
                  to="/aide"
                  className="transition hover:text-blue-500"
                >
                  Centre d'aide
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="transition hover:text-blue-500"
                >
                  Nous contacter
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Contact
            </h3>

            <ul className="mt-4 space-y-4 text-sm">

              <li className="flex items-start gap-3">
                <span className="mt-0.5">📍</span>
                <span>
                  Congo
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span className="mt-0.5">📧</span>
                <a
                  href="mailto:contact@sango-kaka.com"
                  className="transition hover:text-blue-500"
                >
                  contact@sango-kaka.com
                </a>
              </li>

              <li className="flex items-start gap-3">
                <span className="mt-0.5">💬</span>
                <span>
                  Disponible sur WhatsApp
                </span>
              </li>

            </ul>
          </div>
        </div>

        {/* Séparateur */}
        <div className="my-10 border-t border-gray-800" />

        {/* Bas du footer */}
        <div className="flex flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">

          <p className="text-gray-500">
            © {currentYear} Sango-Kaka. Tous droits réservés.
          </p>

          <div className="flex flex-wrap gap-5">
            <Link
              to="/conditions"
              className="text-gray-500 transition hover:text-gray-300"
            >
              Conditions d'utilisation
            </Link>

            <Link
              to="/confidentialite"
              className="text-gray-500 transition hover:text-gray-300"
            >
              Politique de confidentialité
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
}

