import { Link, useNavigate } from "react-router-dom";

export default function Navigation() {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-100 bg-white/80 backdrop-blur-lg">
      <div className="container-shell flex items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-sm font-extrabold text-white">
            S
          </div>
          <span className="text-xl font-extrabold tracking-tight text-neutral-900">
            Sango<span className="text-brand-500">&middot;</span>Kaka
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="nav-link hidden sm:block"
          >
            Explorer
          </button>
          <button className="btn-secondary hidden sm:block">Connexion</button>
          <button
            className="btn-primary"
            onClick={() => navigate("/depot-annonce")}
          >
            Deposer annonce
          </button>
        </div>
      </div>
    </nav>
  );
}
