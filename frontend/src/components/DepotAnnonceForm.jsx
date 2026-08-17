import { useState } from "react";

const categories = [
  { value: "moto", label: "Moto" },
  { value: "voiture", label: "Voiture" },
  { value: "telephone", label: "Téléphone" },
  { value: "electronique", label: "Électronique" },
  { value: "maison", label: "Maison" },
  { value: "mode", label: "Mode" },
  { value: "autre", label: "Autre" },
];

function DepotAnnonceForm() {
  const [formData, setFormData] = useState({
    titre: "",
    categorie: "",
    prix: "",
    quartier: "",
    description: "",
    photos: [],
  });

  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!formData.titre.trim()) {
      setError("Veuillez renseigner le titre de l'annonce.");
      return;
    }

    if (!formData.categorie) {
      setError("Veuillez sélectionner une catégorie.");
      return;
    }

    if (!formData.prix || Number(formData.prix) <= 0) {
      setError("Veuillez renseigner un prix valide.");
      return;
    }

    if (!formData.quartier.trim()) {
      setError("Veuillez renseigner le quartier.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Veuillez renseigner une description.");
      return;
    }

    const annonce = {
      ...formData,
      prix: Number(formData.prix),
      statut: "active",
      dateCreation: new Date().toISOString(),
    };

    console.log("Annonce prête à être envoyée :", annonce);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-3xl px-5 py-8 md:px-6 md:py-12"
    >
      {/* EN-TÊTE */}
      <header className="mb-8">
        <span className="mt-4 text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl">
          Sango·Kaka
        </span>

        <h2 className="mt-2 font-['Bricolage_Grotesque'] text-4xl font-extrabold leading-tight text-[#1D1D1F] md:text-5xl">
          Déposer une annonce
        </h2>

        <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#6E6E73]">
          Présentez votre article et donnez aux acheteurs toutes les
          informations nécessaires.
        </p>
      </header>
      {/* INFORMATIONS */}
      <section className="mb-7 rounded-[14px] bg-[#F5F5F7] p-6">
        <div className="mb-5">
          <h2 className="font-['Bricolage_Grotesque'] text-2xl font-bold text-[#1D1D1F]">
            Informations de l'annonce
          </h2>
        </div>

        {/* TITRE */}
        <div className="mb-5">
          <label
            htmlFor="titre"
            className="mb-2 block text-sm font-semibold text-[#1D1D1F]"
          >
            Titre de l'annonce
          </label>

          <input
            id="titre"
            name="titre"
            type="text"
            placeholder="Ex : Moto Yamaha 125cc"
            value={formData.titre}
            onChange={handleChange}
            className="h-12 w-full rounded-[10px] border border-[#D2D2D7] bg-white px-4 text-sm text-[#1D1D1F] outline-none placeholder:text-[#9A9AA0] focus:border-[#0066CC] focus:ring-4 focus:ring-[#0066CC]/10"
          />
        </div>

        {/* CATÉGORIE */}
        <div className="mb-5">
          <label
            htmlFor="categorie"
            className="mb-2 block text-sm font-semibold text-[#1D1D1F]"
          >
            Catégorie
          </label>

          <select
            id="categorie"
            name="categorie"
            value={formData.categorie}
            onChange={handleChange}
            className="h-12 w-full rounded-[10px] border border-[#D2D2D7] bg-white px-4 text-sm text-[#1D1D1F] outline-none focus:border-[#0066CC] focus:ring-4 focus:ring-[#0066CC]/10"
          >
            <option value="">Sélectionner une catégorie</option>

            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* PRIX */}
        <div className="mb-5">
          <label
            htmlFor="prix"
            className="mb-2 block text-sm font-semibold text-[#1D1D1F]"
          >
            Prix
          </label>

          <div className="relative">
            <input
              id="prix"
              name="prix"
              type="number"
              min="0"
              placeholder="Ex : 450000"
              value={formData.prix}
              onChange={handleChange}
              className="h-12 w-full rounded-[10px] border border-[#D2D2D7] bg-white px-4 pr-20 text-sm text-[#1D1D1F] outline-none placeholder:text-[#9A9AA0] focus:border-[#0066CC] focus:ring-4 focus:ring-[#0066CC]/10"
            />

            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs font-bold text-[#6E6E73]">
              FCFA
            </span>
          </div>
        </div>

        {/* QUARTIER */}
        <div className="mb-5">
          <label
            htmlFor="quartier"
            className="mb-2 block text-sm font-semibold text-[#1D1D1F]"
          >
            Quartier
          </label>

          <input
            id="quartier"
            name="quartier"
            type="text"
            placeholder="Ex : Bacongo"
            value={formData.quartier}
            onChange={handleChange}
            className="h-12 w-full rounded-[10px] border border-[#D2D2D7] bg-white px-4 text-sm text-[#1D1D1F] outline-none placeholder:text-[#9A9AA0] focus:border-[#0066CC] focus:ring-4 focus:ring-[#0066CC]/10"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-semibold text-[#1D1D1F]"
          >
            Description
          </label>

          <textarea
            id="description"
            name="description"
            rows="6"
            placeholder="Décrivez votre article : état, caractéristiques, informations importantes..."
            value={formData.description}
            onChange={handleChange}
            className="w-full resize-y rounded-[10px] border border-[#D2D2D7] bg-white p-4 text-sm leading-relaxed text-[#1D1D1F] outline-none placeholder:text-[#9A9AA0] focus:border-[#0066CC] focus:ring-4 focus:ring-[#0066CC]/10"
          />
        </div>
      </section>
      {/* PHOTOS */}
      <section className="mb-7 rounded-[14px] bg-[#F5F5F7] p-6">
        <div className="mb-5">
          <h2 className="font-['Bricolage_Grotesque'] text-2xl font-bold text-[#1D1D1F]">
            Photos
          </h2>

          <p className="mt-1 text-sm text-[#6E6E73]">
            Ajoutez des photos pour présenter votre article.
          </p>
        </div>

        <button
          type="button"
          className="flex min-h-40 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#B8B8BD] bg-white text-[#6E6E73] transition hover:border-[#0066CC] hover:text-[#0066CC]"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0066CC] text-3xl leading-none text-white">
            +
          </span>

          <span className="text-sm font-medium">
            Ajouter des photos
          </span>
        </button>
      </section>


      {/* ERREUR */}
      {error && (
        <p
          role="alert"
          className="mb-5 rounded-[10px] bg-[#FFF1F1] px-4 py-3 text-sm leading-relaxed text-[#B42318]"
        >
          {error}
        </p>
      )}

      {/* BOUTON */}
      <button
        type="submit"
        className="min-h-[52px] w-full rounded-[10px] bg-[#0066CC] px-6 font-semibold text-white transition hover:opacity-90 active:translate-y-px"
      >
        Publier l'annonce
      </button>
    </form>
  );
}

export default DepotAnnonceForm;