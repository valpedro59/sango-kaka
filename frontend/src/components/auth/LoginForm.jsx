import { useState } from "react";
import { Link } from "react-router-dom";

function SignupForm() {
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    telephone: "",
    email: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    console.log("Données inscription :", formData);
  }

  return (
    <section className="w-full max-w-md rounded-3xl border border-[#E5E5E7] bg-white p-6 shadow-sm sm:p-8">

      {/* EN-TÊTE */}
      <div className="mb-8 text-center">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#0066CC]">
          Sango-Kaka
        </p>

        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#1D1D1F]">
          Créer un compte
        </h1>

        <p className="mt-2 text-sm leading-6 text-[#6E6E73]">
          Rejoignez Sango-Kaka pour publier et gérer vos annonces.
        </p>
      </div>

      {/* FORMULAIRE */}
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* PRÉNOM */}
        <div>
          <label
            htmlFor="prenom"
            className="mb-2 block text-sm font-semibold text-[#1D1D1F]"
          >
            Prénom
          </label>

          <input
            id="prenom"
            name="prenom"
            type="text"
            value={formData.prenom}
            onChange={handleChange}
            placeholder="Votre prénom"
            className="w-full rounded-xl border border-[#D2D2D7] px-4 py-3 text-sm outline-none transition focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/10"
            required
          />
        </div>

        {/* NOM */}
        <div>
          <label
            htmlFor="nom"
            className="mb-2 block text-sm font-semibold text-[#1D1D1F]"
          >
            Nom
          </label>

          <input
            id="nom"
            name="nom"
            type="text"
            value={formData.nom}
            onChange={handleChange}
            placeholder="Votre nom"
            className="w-full rounded-xl border border-[#D2D2D7] px-4 py-3 text-sm outline-none transition focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/10"
            required
          />
        </div>

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
            name="telephone"
            type="tel"
            value={formData.telephone}
            onChange={handleChange}
            placeholder="+242 06 00 00 00"
            className="w-full rounded-xl border border-[#D2D2D7] px-4 py-3 text-sm outline-none transition focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/10"
            required
          />
        </div>

        {/* EMAIL */}
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-semibold text-[#1D1D1F]"
          >
            Email
            <span className="ml-1 font-normal text-[#6E6E73]">
              (facultatif)
            </span>
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="vous@example.com"
            className="w-full rounded-xl border border-[#D2D2D7] px-4 py-3 text-sm outline-none transition focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/10"
          />
        </div>

        {/* BOUTON */}
        <button
          type="submit"
          className="mt-2 w-full rounded-xl bg-[#0066CC] px-4 py-3 font-semibold text-white transition hover:bg-[#0052A3]"
        >
          Créer mon compte
        </button>
      </form>

      {/* CONNEXION */}
      <div className="mt-6 text-center">
        <p className="text-sm text-[#6E6E73]">
          Vous avez déjà un compte ?
        </p>

        <Link
          to="/connexion"
          className="mt-1 inline-block text-sm font-semibold text-[#0066CC] hover:underline"
        >
          Se connecter
        </Link>
      </div>
    </section>
  );
}

export default SignupForm;