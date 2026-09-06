import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";

export default function Navigation() {
  const naviguer = useNavigate();

  const [menuOuvert, setMenuOuvert] = useState(false);
  const [utilisateurConnecte, setUtilisateurConnecte] = useState(null);

  function fermerMenu() {
    setMenuOuvert(false);
  }

  // Vérifier si un utilisateur est déjà connecté
  useEffect(() => {
    function verifierConnexion() {
      const utilisateur = localStorage.getItem("utilisateurConnecte");

      if (utilisateur) {
        try {
          setUtilisateurConnecte(JSON.parse(utilisateur));
        } catch {
          localStorage.removeItem("utilisateurConnecte");
          setUtilisateurConnecte(null);
        }
      } else {
        setUtilisateurConnecte(null);
      }
    }

    verifierConnexion();

    // Écouter les changements de connexion
    window.addEventListener("connexionChangee", verifierConnexion);

    return () => {
      window.removeEventListener(
        "connexionChangee",
        verifierConnexion
      );
    };
  }, []);

  function gererDeconnexion() {
    localStorage.removeItem("utilisateurConnecte");

    setUtilisateurConnecte(null);

    window.dispatchEvent(new Event("connexionChangee"));

    fermerMenu();
    naviguer("/");
  }

  function allerConnexion() {
    naviguer("/connexion");
    fermerMenu();
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-100 bg-white/80 backdrop-blur-lg">
      <div className="container-shell flex items-center gap-4 py-3">

        {/* LOGO */}
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

        {/* RECHERCHE */}
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

          {utilisateurConnecte ? (
            <button
              className="btn-secondary"
              onClick={gererDeconnexion}
            >
              Déconnexion
            </button>
          ) : (
            <button
              className="btn-secondary"
              onClick={allerConnexion}
            >
              Connexion
            </button>
          )}

          <button
            className="btn-primary"
            onClick={() => naviguer("/depot-annonce")}
          >
            Déposer annonce
          </button>
        </div>

        {/* BOUTON BURGER MOBILE */}
        <button
          type="button"
          onClick={() => setMenuOuvert(!menuOuvert)}
          className="ml-auto flex h-10 w-10 items-center justify-center rounded-xl text-neutral-900 transition hover:bg-neutral-100 sm:hidden"
          aria-label={
            menuOuvert
              ? "Fermer le menu"
              : "Ouvrir le menu"
          }
          aria-expanded={menuOuvert}
        >
          {menuOuvert ? (
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

            {utilisateurConnecte ? (
              <button
                onClick={gererDeconnexion}
                className="btn-secondary w-full"
              >
                Déconnexion
              </button>
            ) : (
              <button
                onClick={allerConnexion}
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
              Déposer annonce
            </button>

          </div>
        </div>
      )}
    </nav>
  );
}