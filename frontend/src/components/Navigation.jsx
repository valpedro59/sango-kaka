
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setIsOpen(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white shadow-sm">
              S
            </div>

            <div>
              <span className="text-xl font-extrabold tracking-tight text-gray-900">
                Sango<span className="text-blue-600">-Kaka</span>
              </span>
              <p className="hidden text-[10px] font-medium text-gray-500 sm:block">
                Trouvez. Publiez. Vendez.
              </p>
            </div>
          </Link>

          {/* Navigation Desktop */}
          <div className="hidden items-center gap-2 md:flex">

            <Link
              to="/"
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                isActive("/")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
              }`}
            >
              Accueil
            </Link>

            <Link
              to="/search"
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                isActive("/search")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
              }`}
            >
              Recherche
            </Link>

            <Link
              to="/depot-annonce"
              className="ml-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md active:scale-95"
            >
               Déposer une annonce
            </Link>
          </div>

          {/* Bouton Menu Mobile */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 md:hidden"
            aria-label="Ouvrir le menu"
            aria-expanded={isOpen}
          >
            {isOpen ? (
              /* X */
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              /* Hamburger */
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Menu Mobile */}
        {isOpen && (
          <div className="border-t border-gray-100 py-4 md:hidden">
            <div className="flex flex-col gap-2">

              <Link
                to="/"
                onClick={closeMenu}
                className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${
                  isActive("/")
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                 Accueil
              </Link>

              <Link
                to="/search"
                onClick={closeMenu}
                className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${
                  isActive("/search")
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                 Recherche
              </Link>

              <Link
                to="/depot-annonce"
                onClick={closeMenu}
                className="mt-2 rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-blue-700"
              >
                Déposer une annonce
              </Link>

            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
