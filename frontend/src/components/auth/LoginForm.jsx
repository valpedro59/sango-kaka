
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000/api";

function LoginForm() {
  const navigate = useNavigate();

  const [telephone, setTelephone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const numero = telephone.trim();

      if (!numero) {
        throw new Error(
          "Veuillez saisir votre numéro de téléphone."
        );
      }

      // Recherche de l'utilisateur
      const response = await fetch(
        `${API_URL}/utilisateurs?telephone=${encodeURIComponent(
          numero
        )}`
      );

      if (!response.ok) {
        throw new Error(
          "Impossible de vérifier le numéro de téléphone."
        );
      }

      const utilisateurs = await response.json();

      // Utilisateur inexistant
      if (utilisateurs.length === 0) {
        throw new Error(
          "Aucun compte ne correspond à ce numéro de téléphone."
        );
      }

      // Utilisateur trouvé
      const utilisateur = utilisateurs[0];

      console.log("Utilisateur connecté :", utilisateur);

      setSuccess(`Bienvenue ${utilisateur.prenom} !`);

      // Redirection vers Home
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Erreur connexion :", error);

      setError(
        error.message ||
          "Une erreur est survenue lors de la connexion."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="w-full max-w-md rounded-3xl border border-[#E5E5E7] bg-white p-6 shadow-sm sm:p-8">

      <div className="mb-8 text-center">
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#1D1D1F]">
          Connexion
        </h1>

        <p className="mt-2 text-sm leading-6 text-[#6E6E73]">
          Connectez-vous avec votre numéro de téléphone.
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

      <form onSubmit={handleSubmit} className="space-y-5">

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
            onChange={(event) => {
              setTelephone(event.target.value);
              setError("");
              setSuccess("");
            }}
            placeholder="+242 06 00 00 00"
            autoComplete="tel"
            disabled={loading}
            required
            className="w-full rounded-xl border border-[#D2D2D7] px-4 py-3 text-sm outline-none transition focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/10 disabled:bg-gray-100"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#0066CC] px-4 py-3 font-semibold text-white transition hover:bg-[#0052A3] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Vérification..." : "Se connecter"}
        </button>
      </form>

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

