import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function SearchBar({ compacte }) {
  const [requete, setRequete] = useState("");
  const naviguer = useNavigate();
  const emplacement = useLocation();

  useEffect(() => {
    setRequete("");
  }, [emplacement]);

  function gererSoumission(evenement) {
    evenement.preventDefault();
    if (requete.trim()) {
      naviguer(`/?q=${encodeURIComponent(requete.trim())}`);
    } else {
      naviguer("/");
    }
  }

  return (
    <form
      onSubmit={gererSoumission}
      className={`relative w-full ${compacte ? "max-w-md" : "max-w-xl"}`}
    >
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
      >
        <path
          fillRule="evenodd"
          d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
          clipRule="evenodd"
        />
      </svg>
      <input
        type="text"
        value={requete}
        onChange={(e) => setRequete(e.target.value)}
        placeholder="Rechercher..."
        className={`w-full rounded-full border border-neutral-200 bg-neutral-50 text-sm text-neutral-900 shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 ${
          compacte ? "py-2 pl-9 pr-3" : "py-3 pl-11 pr-4"
        }`}
      />
    </form>
  );
}