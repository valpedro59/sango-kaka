import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const MAX_PHOTOS = 6;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

function DepotAnnonceForm() {
  const [formData, setFormData] = useState({
    titre: "",
    categorieId: "",
    prix: "",
    quartierId: "",
    description: "",
    photos: [],
  });

  const [categories, setCategories] = useState([]);
  const [quartiers, setQuartiers] = useState([]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // --------------------------------------------------
  // RÉCUPÉRATION DES CATÉGORIES ET QUARTIERS
  // --------------------------------------------------

  useEffect(() => {
    async function fetchFormData() {
      try {
        setLoadingData(true);
        setError("");

        const [categoriesResponse, quartiersResponse] =
          await Promise.all([
            fetch(`${API_URL}/categories`),
            fetch(`${API_URL}/quartiers`),
          ]);

        if (!categoriesResponse.ok || !quartiersResponse.ok) {
          throw new Error(
            "Impossible de récupérer les catégories et les quartiers."
          );
        }

        const categoriesData = await categoriesResponse.json();
        const quartiersData = await quartiersResponse.json();

        console.log("CATEGORIES :", categoriesData);
        console.log("QUARTIERS :", quartiersData);

        setCategories(categoriesData);
        setQuartiers(quartiersData);
      } catch (error) {
        console.error("Erreur récupération données :", error);

        setError(
          "Impossible de charger les catégories et les quartiers. Vérifiez que le backend est lancé."
        );
      } finally {
        setLoadingData(false);
      }
    }

    fetchFormData();
  }, []);

  // --------------------------------------------------
  // CHANGEMENT DES CHAMPS
  // --------------------------------------------------

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  // --------------------------------------------------
  // AJOUT DES PHOTOS
  // --------------------------------------------------

  function handlePhotoChange(event) {
    const selectedFiles = Array.from(event.target.files);

    if (selectedFiles.length === 0) {
      return;
    }

    setError("");
    setSuccess("");

    // Vérifier le nombre maximum de photos
    if (formData.photos.length + selectedFiles.length > MAX_PHOTOS) {
      setError(
        `Vous pouvez ajouter au maximum ${MAX_PHOTOS} photos par annonce.`
      );

      event.target.value = "";
      return;
    }

    const validPhotos = [];

    for (const file of selectedFiles) {
      // Vérification du type
      if (!file.type.startsWith("image/")) {
        setError(
          `Le fichier "${file.name}" n'est pas une image valide.`
        );
        continue;
      }

      // Vérification de la taille
      if (file.size > MAX_FILE_SIZE) {
        setError(
          `La photo "${file.name}" dépasse la taille maximale de 5 MB.`
        );
        continue;
      }

      validPhotos.push(file);
    }

    if (validPhotos.length > 0) {
      setFormData((previousData) => ({
        ...previousData,
        photos: [...previousData.photos, ...validPhotos],
      }));
    }

    // Permet de sélectionner à nouveau le même fichier
    event.target.value = "";
  }

  // --------------------------------------------------
  // SUPPRESSION D'UNE PHOTO
  // --------------------------------------------------

  function handleRemovePhoto(indexToRemove) {
    setFormData((previousData) => ({
      ...previousData,
      photos: previousData.photos.filter(
        (_, index) => index !== indexToRemove
      ),
    }));

    setError("");
  }

  // --------------------------------------------------
  // PRÉVISUALISATION D'UNE PHOTO
  // --------------------------------------------------

  function getPhotoPreview(file) {
    return URL.createObjectURL(file);
  }

  // --------------------------------------------------
  // SOUMISSION DU FORMULAIRE
  // --------------------------------------------------

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (!formData.titre.trim()) {
      setError("Veuillez renseigner le titre de l'annonce.");
      return;
    }

    if (!formData.categorieId) {
      setError("Veuillez sélectionner une catégorie.");
      return;
    }

    if (!formData.prix || Number(formData.prix) <= 0) {
      setError("Veuillez renseigner un prix valide.");
      return;
    }

    if (!formData.quartierId) {
      setError("Veuillez sélectionner un quartier.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Veuillez renseigner une description.");
      return;
    }

    try {
      setLoading(true);

      // --------------------------------------------------
      // FORM DATA POUR ENVOYER LES FICHIERS
      // --------------------------------------------------

      const data = new FormData();

      data.append("titre", formData.titre.trim());
      data.append("description", formData.description.trim());
      data.append("prix", Number(formData.prix));
      data.append("categorieId", formData.categorieId);
      data.append("quartierId", formData.quartierId);
      data.append("vendeurId", "utilisateur-001");
      data.append("statut", "active");
      data.append("estEnAvant", "false");
      data.append("vues", "0");

      const date = new Date().toISOString();

      data.append("dateCreation", date);
      data.append("dateMaj", date);

      // Ajouter les photos
      formData.photos.forEach((photo) => {
        data.append("photos", photo);
      });

      console.log("Nombre de photos :", formData.photos.length);

      // --------------------------------------------------
      // ENVOI AU BACKEND
      // --------------------------------------------------

      const response = await fetch(`${API_URL}/annonces`, {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        const errorText = await response.text();

        console.error("Erreur backend :", errorText);

        throw new Error(
          `Erreur HTTP ${response.status}: impossible de publier l'annonce.`
        );
      }

      const nouvelleAnnonce = await response.json();

      console.log("Annonce créée :", nouvelleAnnonce);

      setSuccess("Votre annonce a été publiée avec succès !");

      // --------------------------------------------------
      // RESET
      // --------------------------------------------------

      setFormData({
        titre: "",
        categorieId: "",
        prix: "",
        quartierId: "",
        description: "",
        photos: [],
      });
    } catch (error) {
      console.error("Erreur publication annonce :", error);

      setError(
        "Une erreur est survenue lors de la publication. Vérifiez que le serveur backend est bien lancé."
      );
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------------------------
  // AFFICHAGE
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-white">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex w-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:h-screen lg:overflow-hidden lg:px-8 lg:py-4"
      >
        {/* HEADER */}
        <header className="mb-5 shrink-0">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl">
                Sango·Kaka
              </span>

              <h1 className="mt-1 font-['Bricolage_Grotesque'] text-3xl font-extrabold leading-tight text-[#1D1D1F] sm:text-4xl">
                Déposer une annonce
              </h1>
            </div>

            <p className="max-w-lg text-sm leading-relaxed text-[#6E6E73] sm:text-right">
              Présentez votre article et donnez aux acheteurs toutes les
              informations nécessaires.
            </p>
          </div>
        </header>

        {/* CONTENU */}
        <div className="grid gap-5 lg:min-h-0 lg:flex-1 lg:grid-cols-[1.5fr_1fr]">
          {/* INFORMATIONS */}
          <section className="rounded-[14px] bg-[#F5F5F7] p-4 sm:p-5">
            <h2 className="mb-4 font-['Bricolage_Grotesque'] text-xl font-bold text-[#1D1D1F]">
              Informations de l'annonce
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* TITRE */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="titre"
                  className="mb-1.5 block text-sm font-semibold text-[#1D1D1F]"
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
                  className="h-11 w-full rounded-[9px] border border-[#D2D2D7] bg-white px-3 text-sm text-[#1D1D1F] outline-none placeholder:text-[#9A9AA0] focus:border-[#0066CC] focus:ring-4 focus:ring-[#0066CC]/10"
                />
              </div>

              {/* CATÉGORIE */}
              <div>
                <label
                  htmlFor="categorieId"
                  className="mb-1.5 block text-sm font-semibold text-[#1D1D1F]"
                >
                  Catégorie
                </label>

                <select
                  id="categorieId"
                  name="categorieId"
                  value={formData.categorieId}
                  onChange={handleChange}
                  disabled={loadingData}
                  className="h-11 w-full rounded-[9px] border border-[#D2D2D7] bg-white px-3 text-sm text-[#1D1D1F] outline-none focus:border-[#0066CC] focus:ring-4 focus:ring-[#0066CC]/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">
                    {loadingData
                      ? "Chargement..."
                      : "Sélectionner une catégorie"}
                  </option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.nom}
                    </option>
                  ))}
                </select>
              </div>

              {/* PRIX */}
              <div>
                <label
                  htmlFor="prix"
                  className="mb-1.5 block text-sm font-semibold text-[#1D1D1F]"
                >
                  Prix
                </label>

                <div className="relative">
                  <input
                    id="prix"
                    name="prix"
                    type="number"
                    min="0"
                    placeholder="450000"
                    value={formData.prix}
                    onChange={handleChange}
                    className="h-11 w-full rounded-[9px] border border-[#D2D2D7] bg-white px-3 pr-16 text-sm text-[#1D1D1F] outline-none placeholder:text-[#9A9AA0] focus:border-[#0066CC] focus:ring-4 focus:ring-[#0066CC]/10"
                  />

                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[11px] font-bold text-[#6E6E73]">
                    FCFA
                  </span>
                </div>
              </div>

              {/* QUARTIER */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="quartierId"
                  className="mb-1.5 block text-sm font-semibold text-[#1D1D1F]"
                >
                  Quartier
                </label>

                <select
                  id="quartierId"
                  name="quartierId"
                  value={formData.quartierId}
                  onChange={handleChange}
                  disabled={loadingData}
                  className="h-11 w-full rounded-[9px] border border-[#D2D2D7] bg-white px-3 text-sm text-[#1D1D1F] outline-none focus:border-[#0066CC] focus:ring-4 focus:ring-[#0066CC]/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">
                    {loadingData
                      ? "Chargement..."
                      : "Sélectionner un quartier"}
                  </option>

                  {quartiers.map((quartier) => (
                    <option key={quartier.id} value={quartier.id}>
                      {quartier.nom} — {quartier.ville}
                    </option>
                  ))}
                </select>
              </div>

              {/* DESCRIPTION */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="description"
                  className="mb-1.5 block text-sm font-semibold text-[#1D1D1F]"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  placeholder="Décrivez votre article : état, caractéristiques, informations importantes..."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full resize-none rounded-[9px] border border-[#D2D2D7] bg-white p-3 text-sm leading-relaxed text-[#1D1D1F] outline-none placeholder:text-[#9A9AA0] focus:border-[#0066CC] focus:ring-4 focus:ring-[#0066CC]/10"
                />
              </div>
            </div>
          </section>

          {/* PHOTOS */}
          <section className="flex min-h-[300px] flex-col rounded-[14px] bg-[#F5F5F7] p-4 sm:p-5 lg:min-h-0">
            <div>
              <h2 className="font-['Bricolage_Grotesque'] text-xl font-bold text-[#1D1D1F]">
                Photos
              </h2>

              <p className="mt-1 text-sm text-[#6E6E73]">
                Ajoutez jusqu'à {MAX_PHOTOS} photos pour présenter votre
                article.
              </p>
            </div>

            {/* INPUT FILE CACHÉ */}
            <input
              id="photos"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handlePhotoChange}
              className="hidden"
            />

            {/* ZONE D'AJOUT */}
            <label
              htmlFor="photos"
              className="mt-4 flex min-h-[220px] flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#B8B8BD] bg-white px-4 text-[#6E6E73] transition hover:border-[#0066CC] hover:text-[#0066CC] sm:min-h-[260px] lg:min-h-0"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0066CC] text-3xl leading-none text-white">
                +
              </span>

              <span className="text-sm font-medium">
                Ajouter des photos
              </span>

              <span className="text-center text-xs text-[#9A9AA0]">
                JPG, PNG ou WEBP — plusieurs photos possibles
              </span>
            </label>

            {/* APERÇUS */}
            {formData.photos.length > 0 && (
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#1D1D1F]">
                    {formData.photos.length} photo
                    {formData.photos.length > 1 ? "s" : ""} sélectionnée
                    {formData.photos.length > 1 ? "s" : ""}
                  </span>

                  <span className="text-xs text-[#9A9AA0]">
                    {MAX_PHOTOS - formData.photos.length} restante
                    {MAX_PHOTOS - formData.photos.length > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {formData.photos.map((photo, index) => (
                    <div
                      key={`${photo.name}-${index}`}
                      className="group relative overflow-hidden rounded-lg border border-[#D2D2D7] bg-white"
                    >
                      <img
                        src={getPhotoPreview(photo)}
                        alt={`Aperçu ${index + 1}`}
                        className="h-24 w-full object-cover"
                      />

                      {/* NUMÉRO */}
                      <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                        {index + 1}
                      </span>

                      {/* SUPPRIMER */}
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-sm font-bold text-white transition hover:bg-red-600"
                        aria-label={`Supprimer ${photo.name}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RAPPEL */}
            <div className="mt-4 rounded-[10px] bg-white p-3">
              <p className="text-xs leading-relaxed text-[#6E6E73]">
                Une bonne photo permet aux acheteurs de mieux évaluer votre
                article. Formats acceptés : JPG, PNG et WEBP. Taille maximale :
                5 MB par photo.
              </p>
            </div>
          </section>
        </div>

        {/* MESSAGES */}
        <div className="mt-4 shrink-0">
          {error && (
            <p
              role="alert"
              className="mb-3 rounded-[9px] bg-[#FFF1F1] px-4 py-2.5 text-sm text-[#B42318]"
            >
              {error}
            </p>
          )}

          {success && (
            <p
              role="status"
              className="mb-3 rounded-[9px] bg-green-50 px-4 py-2.5 text-sm text-green-700"
            >
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || loadingData}
            className="h-11 w-full rounded-[9px] bg-[#0066CC] px-6 text-sm font-semibold text-white transition hover:opacity-90 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Publication en cours..." : "Publier l'annonce"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default DepotAnnonceForm;