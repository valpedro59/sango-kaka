import { useState } from "react";
import { Link } from "react-router-dom";

function LoginForm() {
  const [telephone, setTelephone] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    console.log("Numéro saisi :", telephone);
  }

  return (
    <section className="w-full max-w-md rounded-3xl border border-[#E5E5E7] bg-white p-6 shadow-sm sm:p-8">

      {/* EN-TÊTE */}
      <div className="mb-8 text-center">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#0066CC]">
          Sango-Kaka
        </p>

        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#1D1D1F]">
          Connexion
        </h1>

        <p className="mt-2 text-sm leading-6 text-[#6E6E73]">
          Connectez-vous avec votre numéro de téléphone.
        </p>
      </div>

      {/* FORMULAIRE */}
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* TÉLÉPHONE */}
        <div>
          <label
            htmlFor="telephone"
            className="mb-2 block text-sm font-semibold text-[#1D1D1F]"
          >
            Numéro de téléphone
          </label>

          <input
            id="telephone"
            type="tel"
            value={telephone}
            onChange={(event) => setTelephone(event.target.value)}
            placeholder="+242 06 00 00 00"
            className="w-full rounded-xl border border-[#D2D2D7] px-4 py-3 text-sm outline-none transition focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/10"
            required
          />
        </div>

        {/* BOUTON */}
        <button
          type="submit"
          className="w-full rounded-xl bg-[#0066CC] px-4 py-3 font-semibold text-white transition hover:bg-[#0052A3]"
        >
          Se connecter
        </button>
      </form>

      {/* INSCRIPTION */}
      <div className="mt-6 text-center">
        <p className="text-sm text-[#6E6E73]">
          Vous n'avez pas encore de compte ?
        </p>

        <Link
          to="/inscription"
          className="mt-1 inline-block text-sm font-semibold text-[#0066CC] hover:underline"
        >
          Créer un compte
        </Link>
      </div>
    </section>
  );
}

export default LoginForm;