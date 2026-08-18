import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-800">
            Sango-Kaka
          </Link>

          {/* Menu Links */}
          <div className="flex gap-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Accueil
            </Link>
            <Link
              to="/search"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Recherche
            </Link>
            <Link
              to="/depot-annonce"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium transition"
            >
              Déposer une annonce
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
