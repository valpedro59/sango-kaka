
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000/api";

function SignupForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    telephone: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const prenom = formData.prenom.trim();
      const nom = formData.nom.trim();
      const telephone = formData.telephone.trim();
      const email = formData.email.trim();

      if (!prenom || !nom || !telephone) {
        throw new Error(
          "Veuillez remplir tous les champs obligatoires."
        );
      }

      // Vérifier si le numéro existe déjà
      const checkResponse = await fetch(
        `${API_URL}/utilisateurs?telephone=${encodeURIComponent(
          telephone
        )}`
      );

      if (!checkResponse.ok) {
        throw new Error(
          "Impossible de vérifier le numéro de téléphone."
        );
      }

      const utilisateursExistants = await checkResponse.json();

      if (utilisateursExistants.length > 0) {
        throw new Error(
          "Un compte existe déjà avec ce numéro de téléphone."
        );
      }

      // Création de l'utilisateur
      const utilisateur = {
        prenom,
        nom,
        telephone,
        whatsapp: telephone,
        email,
        avatar: "",
        bio: "",
        estVerifie: false,
        dateCreation: new Date().toISOString(),
      };

      const response = await fetch(
        `${API_URL}/utilisateurs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(utilisateur),
        }
      );

      if (!response.ok) {
        throw new Error("Impossible de créer le compte.");
      }

      const nouvelUtilisateur = await response.json();

      console.log("Utilisateur créé :", nouvelUtilisateur);

      setSuccess(
        "Compte créé avec succès ! Redirection vers la connexion..."
      );

      setFormData({
        prenom: "",
        nom: "",
        telephone: "",
        email: "",
      });

      setTimeout(() => {
        navigate("/connexion");
      }, 1200);
    } catch (error) {
      console.error("Erreur inscription :", error);

      setError(
        error.message ||
          "Une erreur est survenue lors de la création du compte."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="w-full max-w-md rounded-3xl border border-[#E5E5E7] bg-white p-6 shadow-sm sm:p-8">

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

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

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
            autoComplete="given-name"
            disabled={loading}
            required
            className="w-full rounded-xl border border-[#D2D2D7] px-4 py-3 text-sm outline-none transition focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/10 disabled:bg-gray-100"
          />
        </div>

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
            autoComplete="family-name"
            disabled={loading}
            required
            className="w-full rounded-xl border border-[#D2D2D7] px-4 py-3 text-sm outline-none transition focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/10 disabled:bg-gray-100"
          />
        </div>

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
            autoComplete="tel"
            disabled={loading}
            required
            className="w-full rounded-xl border border-[#D2D2D7] px-4 py-3 text-sm outline-none transition focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/10 disabled:bg-gray-100"
          />

          <p className="mt-2 text-xs text-[#6E6E73]">
            Ce numéro sera utilisé pour vous connecter.
          </p>
        </div>

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
            autoComplete="email"
            disabled={loading}
            className="w-full rounded-xl border border-[#D2D2D7] px-4 py-3 text-sm outline-none transition focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/10 disabled:bg-gray-100"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-xl bg-[#0066CC] px-4 py-3 font-semibold text-white transition hover:bg-[#0052A3] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Création du compte..."
            : "Créer mon compte"}
        </button>
      </form>

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

