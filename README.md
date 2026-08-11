# SANGO-KAKA — Marché d'occasion au Congo

Plateforme centralisant les annonces d'objets d'occasion (téléphones, meubles, motos, électroménager) avec profils vendeurs vérifiables et signalement des annonces frauduleuses. Objectif : remplacer les groupes Facebook/WhatsApp non structurés par une expérience fiable et centralisée.

## Objectif MVP (3 semaines)

- Dépôt d'annonce avec photos, prix et quartier
- Recherche par catégorie, quartier et budget
- Profil vendeur avec ancienneté et avis
- Bouton de signalement des annonces suspectes
- Contact direct du vendeur via lien WhatsApp (`wa.me`)

## Stack technique

| Côté     | Techno                                                      |
| -------- | ----------------------------------------------------------- |
| Frontend | React + Vite + Tailwind CSS (JavaScript, pas de TypeScript) |
| Backend  | Node.js + Express                                           |
| Données  | json-server monté en middleware Express sur `data/db.json`  |

Le backend expose une API REST générée automatiquement par json-server (`/api/annonces`, `/api/vendeurs`, etc.), avec des routes Express custom ajoutées par-dessus pour la logique métier (note moyenne, modération...). Détail complet : [`API.md`](./API.md).

## Structure du repo

```
SANGO-KAKA/
├── backend/
│   ├── data/
│   │   └── db.json          # source de données (json-server)
│   ├── server.js             # point d'entrée Express
│   ├── package.json
│   └── README.md              # setup & conventions backend
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/          # appels API (fetch vers le backend)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── README.md              # setup & conventions frontend
├── API.md                     # contrat d'API partagé frontend/backend
├── CONTRIBUTING.md            # workflow Git, conventions de code
└── README.md                  # ce fichier
```

## Démarrage rapide

Deux terminaux, un pour chaque côté.

**Backend** (port 3001 par défaut) :

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

**Frontend** (port 5173 par défaut) :

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Détails complets dans [`backend/README.md`](./backend/README.md) et [`frontend/README.md`](./frontend/README.md).

## Équipe — HACKTIVITI

| Rôle                                        | Membre           |
| ------------------------------------------- | ---------------- |
| Lead Dev / Architecture                     | Val Clancy Pedro |
| Backend — annonces & recherche              | À compléter      |
| Backend — profils, avis & modération        | À compléter      |
| Frontend — recherche & fiche annonce        | À compléter      |
| Frontend — espace vendeur & dépôt d'annonce | À compléter      |
| QA & Tests / Déploiement                    | À compléter      |

## Documentation

- [`API.md`](./API.md) — toutes les routes de l'API, formats de requête/réponse
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — workflow Git, convention de branches, process de PR
- [`backend/README.md`](./backend/README.md) — setup backend, architecture json-server + Express
- [`frontend/README.md`](./frontend/README.md) — setup frontend, structure des dossiers, conventions React
