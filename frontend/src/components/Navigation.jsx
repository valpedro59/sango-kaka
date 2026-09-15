

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";

export default function Navigation() {
  const naviguer = useNavigate();
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [menuProfilOuvert, setMenuProfilOuvert] = useState(false);
  const [estConnecte, setEstConnecte] = useState(true); // Fake state for frontend

  function fermerMenu() {
    setMenuOuvert(false);
    setMenuProfilOuvert(false);
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-100 bg-white/80 backdrop-blur-lg">
      <div className="container-shell flex items-center gap-4 py-3">
        <Link
          to="/"
          className="flex flex-shrink-0 items-center gap-2.5"
          onClick={fermerMenu}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-sm font-extrabold text-white">
            S
          </div>

          <span className="text-xl font-extrabold tracking-tight text-neutral-900">
            Sango<span className="text-brand-500">&middot;</span>Kaka
          </span>
        </Link>

        <div className="hidden flex-1 justify-center md:flex">
          <SearchBar compacte />
        </div>

        {/* MENU DESKTOP */}
        <div className="hidden flex-shrink-0 items-center gap-3 sm:flex">
          <button
            onClick={() => naviguer("/")}
            className="nav-link"
          >
            Explorer
          </button>

          {estConnecte ? (
            <div className="relative">
              <button
                onClick={() => setMenuProfilOuvert(!menuProfilOuvert)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition"
                aria-label="Menu profil"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                </svg>
              </button>
              
              {menuProfilOuvert && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-neutral-100 bg-white shadow-lg overflow-hidden">
                  <div className="p-2 flex flex-col gap-1">
                    <button
                      onClick={() => {
                        naviguer("/profil");
                        setMenuProfilOuvert(false);
                      }}
                      className="block w-full rounded-lg px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 transition"
                    >
                      Mon profil
                    </button>
                    <button
                      onClick={() => {
                        setEstConnecte(false);
                        setMenuProfilOuvert(false);
                      }}
                      className="block w-full rounded-lg px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              className="btn-secondary"
              onClick={() => naviguer("/connexion")}
            >
              Connexion
            </button>
          )}

          <button
            className="btn-primary"
            onClick={() => naviguer("/depot-annonce")}
          >
            Deposer annonce
          </button>
        </div>

        {/* BOUTON BURGER MOBILE */}
        <button
          type="button"
          onClick={() => setMenuOuvert(!menuOuvert)}
          className="ml-auto flex h-10 w-10 items-center justify-center rounded-xl text-neutral-900 transition hover:bg-neutral-100 sm:hidden"
          aria-label={menuOuvert ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOuvert}
        >
          {menuOuvert ? (
            /* X */
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          ) : (
            /* BURGER */
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="h-6 w-6"
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

      {/* MENU MOBILE */}
      {menuOuvert && (
        <div className="border-t border-neutral-100 bg-white px-5 py-4 shadow-sm sm:hidden">
          <div className="flex flex-col gap-3">

            <button
              onClick={() => {
                naviguer("/");
                fermerMenu();
              }}
              className="nav-link w-full rounded-xl px-4 py-3 text-left"
            >
              Explorer
            </button>

            {estConnecte ? (
              <>
                <button
                  onClick={() => {
                    naviguer("/profil");
                    fermerMenu();
                  }}
                  className="nav-link w-full rounded-xl px-4 py-3 text-left"
                >
                  Mon profil
                </button>
                <button
                  onClick={() => {
                    setEstConnecte(false);
                    fermerMenu();
                  }}
                  className="nav-link w-full rounded-xl px-4 py-3 text-left text-red-600 hover:bg-red-50"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  naviguer("/connexion");
                  fermerMenu();
                }}
                className="btn-secondary w-full"
              >
                Connexion
              </button>
            )}

            <button
              onClick={() => {
                naviguer("/depot-annonce");
                fermerMenu();
              }}
              className="btn-primary w-full"
            >
              Deposer annonce
            </button>

          </div>
        </div>
      )}
    </nav>
  );
}


