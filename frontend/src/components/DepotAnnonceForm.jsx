
import { useEffect, useState } from "react";
import {
  AnnonceAPI,
  CategorieAPI,
  QuartierAPI,
} from "../services/api";

const NOMBRE_MAX_PHOTOS = 1;
const TAILLE_MAX_FICHIER = 5 * 1024 * 1024; // 5 MB

function DepotAnnonceForm() {
  const [donneesFormulaire, setDonneesFormulaire] = useState({
    titre: "",
    categorieId: "",
    prix: "",
    quartierId: "",
    description: "",
    photos: [],
  });

  const [categories, setCategories] = useState([]);
  const [quartiers, setQuartiers] = useState([]);

  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState("");
  const [chargement, setChargement] = useState(false);
  const [chargementDonnees, setChargementDonnees] = useState(true);

  /* =====================================================
     RÉCUPÉRATION CATÉGORIES + QUARTIERS
     ===================================================== */

  useEffect(() => {
    async function chargerDonneesFormulaire() {
      try {
        setChargementDonnees(true);
        setErreur("");

        const [
          donneesCategories,
          donneesQuartiers,
        ] = await Promise.all([
          CategorieAPI.getAll(),
          QuartierAPI.getAll(),
        ]);

        setCategories(donneesCategories);
        setQuartiers(donneesQuartiers);
      } catch (err) {
        console.error(err);

        setErreur(
          "Impossible de charger les catégories et les quartiers. Vérifiez que le backend est lancé."
        );
      } finally {
        setChargementDonnees(false);
      }
    }

    chargerDonneesFormulaire();
  }, []);

  /* =====================================================
     CHANGEMENT DES CHAMPS
     ===================================================== */

  function gererChangement(evenement) {
    const { name, value } = evenement.target;

    setDonneesFormulaire((donneesPrecedentes) => ({
      ...donneesPrecedentes,
      [name]: value,
    }));
  }

  /* =====================================================
     AJOUT DE LA PHOTO
     ===================================================== */

  function gererChangementPhotos(evenement) {
    const fichiersSelectionnes = Array.from(
      evenement.target.files
    );

    if (fichiersSelectionnes.length === 0) {
      return;
    }

    setErreur("");
    setSucces("");

    // Le backend actuel accepte UNE seule image.
    if (fichiersSelectionnes.length > NOMBRE_MAX_PHOTOS) {
      setErreur(
        "Vous pouvez ajouter une seule photo pour le moment."
      );

      evenement.target.value = "";
      return;
    }

    const fichier = fichiersSelectionnes[0];

    // Vérification du type
    if (!fichier.type.startsWith("image/")) {
      setErreur(
        `Le fichier "${fichier.name}" n'est pas une image valide.`
      );

      evenement.target.value = "";
      return;
    }

    // Vérification de la taille
    if (fichier.size > TAILLE_MAX_FICHIER) {
      setErreur(
        `La photo "${fichier.name}" dépasse la taille maximale de 5 MB.`
      );

      evenement.target.value = "";
      return;
    }

    setDonneesFormulaire((donneesPrecedentes) => ({
      ...donneesPrecedentes,
      photos: [fichier],
    }));

    evenement.target.value = "";
  }

  /* =====================================================
     SUPPRESSION PHOTO
     ===================================================== */

  function gererSuppressionPhoto() {
    setDonneesFormulaire((donneesPrecedentes) => ({
      ...donneesPrecedentes,
      photos: [],
    }));

    setErreur("");
  }

  /* =====================================================
     APERÇU PHOTO
     ===================================================== */

  function obtenirApercuPhoto(fichier) {
    return URL.createObjectURL(fichier);
  }

  /* =====================================================
     SOUMISSION
     ===================================================== */

  async function gererSoumission(evenement) {
    evenement.preventDefault();

    setErreur("");
    setSucces("");

    /* -----------------------------
       VALIDATION
       ----------------------------- */

    if (!donneesFormulaire.titre.trim()) {
      setErreur(
        "Veuillez renseigner le titre de l'annonce."
      );
      return;
    }

    if (!donneesFormulaire.categorieId) {
      setErreur(
        "Veuillez sélectionner une catégorie."
      );
      return;
    }

    if (
      !donneesFormulaire.prix ||
      Number(donneesFormulaire.prix) <= 0
    ) {
      setErreur("Veuillez renseigner un prix valide.");
      return;
    }

    if (!donneesFormulaire.quartierId) {
      setErreur(
        "Veuillez sélectionner un quartier."
      );
      return;
    }

    if (!donneesFormulaire.description.trim()) {
      setErreur(
        "Veuillez renseigner une description."
      );
      return;
    }

    try {
      setChargement(true);

      /* -----------------------------
         FORM DATA
         ----------------------------- */

      const donnees = new FormData();

      donnees.append(
        "titre",
        donneesFormulaire.titre.trim()
      );

      donnees.append(
        "description",
        donneesFormulaire.description.trim()
      );

      donnees.append(
        "prix",
        String(Number(donneesFormulaire.prix))
      );

      donnees.append(
        "categorieId",
        donneesFormulaire.categorieId
      );

      donnees.append(
        "quartierId",
        donneesFormulaire.quartierId
      );

      /*
       * Pour le moment, on utilise l'utilisateur
       * de test prévu par le projet.
       */
      donnees.append(
        "vendeurId",
        "utilisateur-001"
      );

      /*
       * Le backend définit lui-même :
       * statut
       * estEnAvant
       * vues
       * id
       * dateCreation
       * dateMaj
       *
       * On n'a donc pas besoin de les envoyer.
       */

      /* -----------------------------
         IMAGE
         ----------------------------- */

      if (donneesFormulaire.photos.length > 0) {
        donnees.append(
          "image",
          donneesFormulaire.photos[0]
        );
      }

      /* -----------------------------
         ENVOI
         ----------------------------- */

      const annonceCreee = await AnnonceAPI.creer(
        donnees
      );

      console.log(
        "Annonce créée :",
        annonceCreee
      );

      setSucces(
        "Votre annonce a été publiée avec succès !"
      );

      /* -----------------------------
         RESET
         ----------------------------- */

      setDonneesFormulaire({
        titre: "",
        categorieId: "",
        prix: "",
        quartierId: "",
        description: "",
        photos: [],
      });
    } catch (err) {
      console.error(
        "Erreur publication annonce :",
        err
      );

      setErreur(
        "Une erreur est survenue lors de la publication. Vérifiez que le serveur backend est bien lancé."
      );
    } finally {
      setChargement(false);
    }
  }

  /* =====================================================
     AFFICHAGE
     ===================================================== */

  return (
    <div className="min-h-screen bg-white">
      <form
        onSubmit={gererSoumission}
        className="mx-auto flex w-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:h-screen lg:overflow-hidden lg:px-8 lg:py-4"
      >
        {/* HEADER */}

        <header className="mb-5 shrink-0">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="mt-1 font-['Bricolage_Grotesque'] text-3xl font-extrabold leading-tight text-[#1D1D1F] sm:text-4xl">
                Déposer une annonce
              </h1>
            </div>

            <p className="max-w-lg text-sm leading-relaxed text-[#6E6E73] sm:text-right">
              Présentez votre article et donnez aux acheteurs
              toutes les informations nécessaires.
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
                  value={donneesFormulaire.titre}
                  onChange={gererChangement}
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
                  value={donneesFormulaire.categorieId}
                  onChange={gererChangement}
                  disabled={chargementDonnees}
                  className="h-11 w-full rounded-[9px] border border-[#D2D2D7] bg-white px-3 text-sm text-[#1D1D1F] outline-none focus:border-[#0066CC] focus:ring-4 focus:ring-[#0066CC]/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">
                    {chargementDonnees
                      ? "Chargement..."
                      : "Sélectionner une catégorie"}
                  </option>

                  {categories.map((categorie) => (
                    <option
                      key={categorie.id}
                      value={categorie.id}
                    >
                      {categorie.nom}
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
                    value={donneesFormulaire.prix}
                    onChange={gererChangement}
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
                  value={donneesFormulaire.quartierId}
                  onChange={gererChangement}
                  disabled={chargementDonnees}
                  className="h-11 w-full rounded-[9px] border border-[#D2D2D7] bg-white px-3 text-sm text-[#1D1D1F] outline-none focus:border-[#0066CC] focus:ring-4 focus:ring-[#0066CC]/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">
                    {chargementDonnees
                      ? "Chargement..."
                      : "Sélectionner un quartier"}
                  </option>

                  {quartiers.map((quartier) => (
                    <option
                      key={quartier.id}
                      value={quartier.id}
                    >
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
                  value={donneesFormulaire.description}
                  onChange={gererChangement}
                  className="w-full resize-none rounded-[9px] border border-[#D2D2D7] bg-white p-3 text-sm leading-relaxed text-[#1D1D1F] outline-none placeholder:text-[#9A9AA0] focus:border-[#0066CC] focus:ring-4 focus:ring-[#0066CC]/10"
                />
              </div>
            </div>
          </section>

          {/* PHOTOS */}

          <section className="flex min-h-[300px] flex-col rounded-[14px] bg-[#F5F5F7] p-4 sm:p-5 lg:min-h-0">
            <div>
              <h2 className="font-['Bricolage_Grotesque'] text-xl font-bold text-[#1D1D1F]">
                Photo
              </h2>

              <p className="mt-1 text-sm text-[#6E6E73]">
                Ajoutez une photo pour présenter votre article.
              </p>
            </div>

            {/* INPUT */}

            <input
              id="photos"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={gererChangementPhotos}
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
                Ajouter une photo
              </span>

              <span className="text-center text-xs text-[#9A9AA0]">
                JPG, PNG ou WEBP — maximum 5 MB
              </span>
            </label>

            {/* APERÇU */}

            {donneesFormulaire.photos.length > 0 && (
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#1D1D1F]">
                    Photo sélectionnée
                  </span>

                  <span className="text-xs text-[#9A9AA0]">
                    1 / 1
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {donneesFormulaire.photos.map(
                    (photo, index) => (
                      <div
                        key={`${photo.name}-${index}`}
                        className="group relative overflow-hidden rounded-lg border border-[#D2D2D7] bg-white"
                      >
                        <img
                          src={obtenirApercuPhoto(photo)}
                          alt={`Aperçu ${index + 1}`}
                          className="h-40 w-full object-cover"
                        />

                        <span className="absolute bottom-2 left-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                          1
                        </span>

                        <button
                          type="button"
                          onClick={gererSuppressionPhoto}
                          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-sm font-bold text-white transition hover:bg-red-600"
                          aria-label={`Supprimer ${photo.name}`}
                        >
                          ×
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* RAPPEL */}

            <div className="mt-4 rounded-[10px] bg-white p-3">
              <p className="text-xs leading-relaxed text-[#6E6E73]">
                Une bonne photo permet aux acheteurs de mieux
                évaluer votre article. Formats acceptés : JPG,
                PNG et WEBP. Taille maximale : 5 MB.
              </p>
            </div>
          </section>
        </div>

        {/* MESSAGES */}

        <div className="mt-4 shrink-0">
          {erreur && (
            <p
              role="alert"
              className="mb-3 rounded-[9px] bg-[#FFF1F1] px-4 py-2.5 text-sm text-[#B42318]"
            >
              {erreur}
            </p>
          )}

          {succes && (
            <p
              role="status"
              className="mb-3 rounded-[9px] bg-green-50 px-4 py-2.5 text-sm text-green-700"
            >
              {succes}
            </p>
          )}

          <button
            type="submit"
            disabled={
              chargement || chargementDonnees
            }
            className="h-11 w-full rounded-[9px] bg-[#0066CC] px-6 text-sm font-semibold text-white transition hover:opacity-90 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
          >
            {chargement
              ? "Publication en cours..."
              : "Publier l'annonce"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default DepotAnnonceForm;

