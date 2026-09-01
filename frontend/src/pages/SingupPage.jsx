
import { Link, useNavigate } from "react-router-dom";
import SignupForm from "../components/auth/SinupForm";
import Footer from "../components/Footer";

function SignupPage() {
  const navigate = useNavigate();

  function handleRetour() {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7]">

      {/* HEADER AUTHENTIFICATION */}
      <header className="border-b border-neutral-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">

          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-sm font-extrabold text-white">
              S
            </div>

            <span className="text-xl font-extrabold tracking-tight text-neutral-900">
              Sango<span className="text-brand-500">&middot;</span>Kaka
            </span>
          </Link>

          {/* ALTERNANCE */}
          <Link
            to="/connexion"
            className="text-sm font-semibold text-brand-500 hover:underline"
          >
            Se connecter
          </Link>
        </div>
      </header>

      {/* CONTENU */}
      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">

          {/* RETOUR */}
          <button
            onClick={handleRetour}
            className="mb-5 flex items-center gap-2 text-sm font-medium text-neutral-500 transition hover:text-neutral-900"
          >
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 011.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>

            Retour
          </button>

          <SignupForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default SignupPage;

