import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";

export default function Navigation() {
  const naviguer = useNavigate();

  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-100 bg-white/80 backdrop-blur-lg">
      <div className="container-shell flex items-center gap-4 py-3">
        <Link to="/" className="flex flex-shrink-0 items-center gap-2.5">
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

        <div className="flex flex-shrink-0 items-center gap-3">
          <button
            onClick={() => naviguer("/")}
            className="nav-link hidden sm:block"
          >
            Explorer
          </button>
          <button 
            className="btn-secondary hidden sm:block"
            onClick={()=>naviguer("/connexion")}
          >
              Connexion
          </button>
          <button
            className="btn-primary"
            onClick={() => naviguer("/depot-annonce")}
          >
            Deposer annonce
          </button>
        </div>
      </div>
    </nav>
  );
}