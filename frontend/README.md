# Frontend — SANGO-KAKA

React + Vite + Tailwind CSS, en JavaScript (pas de TypeScript).

## Prérequis

- Node.js 18+
- npm
- Le backend doit tourner en parallèle (voir [`../backend/README.md`](../backend/README.md))

## Installation

```bash
cd frontend
npm install
cp .env.example .env
```

Si Tailwind n'est pas encore configuré :

```bash
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

Dans `src/index.css` :

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Démarrage

```bash
npm run dev
```

Le frontend démarre par défaut sur `http://localhost:5173`.

## Structure du dossier `src/`

```
src/
├── assets/          # images, icônes statiques
├── components/       # composants réutilisables (CarteAnnonce, Navbar, BoutonSignalement...)
├── pages/            # une page = un écran (Accueil, Recherche, FicheAnnonce, DepotAnnonce, ProfilVendeur)
├── hooks/             # hooks custom (ex: useAnnonces, useVendeur)
├── services/          # appels API centralisés (api.js)
├── App.jsx
├── main.jsx
└── index.css
```

### Convention de nommage

- Composants : `PascalCase.jsx` (ex: `CarteAnnonce.jsx`)
- Hooks : `camelCase.js` préfixé `use` (ex: `useAnnonces.js`)
- Un composant par fichier, export par défaut

## Consommer l'API

Tous les appels réseau passent par `src/services/api.js`, jamais de `fetch()` direct dans un composant. Ça centralise l'URL de base et facilite les tests.

```javascript
// src/services/api.js
const API_BASE = import.meta.env.VITE_API_URL;

export const AnnonceAPI = {
  getAll: async (filtres = {}) => {
    const query = new URLSearchParams(filtres).toString();
    const res = await fetch(`${API_BASE}/annonces?${query}`);
    if (!res.ok) throw new Error("Erreur chargement annonces");
    return res.json();
  },
  create: async (annonce) => {
    const res = await fetch(`${API_BASE}/annonces`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...annonce,
        statut: "active",
        dateCreation: new Date().toISOString(),
      }),
    });
    if (!res.ok) throw new Error("Erreur création annonce");
    return res.json();
  },
};
```

Utilisation dans un composant :

```jsx
import { useEffect, useState } from "react";
import { AnnonceAPI } from "../services/api";

function ListeAnnonces() {
  const [annonces, setAnnonces] = useState([]);

  useEffect(() => {
    AnnonceAPI.getAll({ statut: "active" })
      .then(setAnnonces)
      .catch(console.error);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {annonces.map((a) => (
        <div key={a.id} className="bg-white rounded-lg shadow p-4">
          <h3 className="font-bold text-lg">{a.titre}</h3>
          <p className="text-red-700 font-semibold">{a.prix} FCFA</p>
        </div>
      ))}
    </div>
  );
}
```

Le détail complet des routes disponibles est dans [`../API.md`](../API.md) — toujours vérifier ce fichier avant de coder un appel, et le compléter si une route custom manque.

## Répartition des rôles frontend

| Zone                             | Responsable |
| -------------------------------- | ----------- |
| Recherche & fiche annonce        | À compléter |
| Espace vendeur & dépôt d'annonce | À compléter |

## Lien WhatsApp

Le contact vendeur se fait via un simple lien `wa.me`, pas d'intégration API :

```javascript
const lienWhatsApp = `https://wa.me/${vendeur.whatsapp.replace(/\D/g, "")}`;
```

## Variables d'environnement

Voir `.env.example`. `VITE_API_URL` doit pointer vers le backend (`http://localhost:3001/api` en développement).
