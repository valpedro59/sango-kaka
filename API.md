# Contrat d'API — SANGO-KAKA

Base URL en développement : `http://localhost:3001/api`

Toutes les réponses sont en JSON. Pas d'authentification pour le MVP.

Les routes CRUD standard sont générées automatiquement par **json-server** à partir de `backend/data/db.json`. Les routes marquées **[Custom]** sont écrites à la main dans `backend/routes/` avec Express.

Les identifiants sont des chaînes préfixées par ressource (ex : `annonce-001`, `utilisateur-002`) plutôt que des entiers auto-incrémentés.

---

## Utilisateurs

### `GET /api/utilisateurs`

Liste tous les utilisateurs (vendeurs et acheteurs confondus — un même utilisateur peut vendre, laisser des avis, ou signaler).

### `GET /api/utilisateurs/:id`

Détail d'un utilisateur.

**Réponse 200 :**

```json
{
  "id": "utilisateur-001",
  "prenom": "Val",
  "nom": "Pedro",
  "telephone": "+242060000001",
  "whatsapp": "+242060000001",
  "email": "val@example.com",
  "avatar": null,
  "bio": "Vendeur de téléphones et accessoires",
  "estVerifie": true,
  "dateCreation": "2025-04-12T10:30:00Z"
}
```

### `POST /api/utilisateurs`

Crée un utilisateur. `dateCreation` ajoutée automatiquement côté frontend. `estVerifie` démarre à `false` (la vérification est un processus manuel/à définir, hors scope MVP strict).

### `PUT /api/utilisateurs/:id`

Met à jour un profil (bio, avatar, téléphone...).

### `GET /api/utilisateurs/:id/note-moyenne` **[Custom]**

Calcule la note moyenne d'un utilisateur en tant que vendeur, à partir de la collection `avis`.

**Réponse 200 :**

```json
{ "note": 4.5, "nombreAvis": 3 }
```

Renvoie `{ "note": 0, "nombreAvis": 0 }` si aucun avis.

---

## Catégories

### `GET /api/categories`

Liste les catégories disponibles (fixes pour le MVP : Téléphones, Meubles, Motos, Électroménager).

**Réponse 200 :**

```json
[
  {
    "id": "categorie-001",
    "nom": "Téléphones",
    "slug": "telephones",
    "icone": "mobile-screen-button"
  }
]
```

Pas de POST/PUT/DELETE prévu pour le MVP — les catégories sont fixes dans `db.json`.

---

## Quartiers

### `GET /api/quartiers`

Liste les quartiers disponibles, avec leur ville.

**Réponse 200 :**

```json
[{ "id": "quartier-001", "nom": "Tié-Tié", "ville": "Pointe-Noire" }]
```

Pas de POST/PUT/DELETE prévu pour le MVP — liste fixe dans `db.json`. À étendre si de nouvelles villes sont ajoutées.

---

## Annonces

### `GET /api/annonces`

Liste toutes les annonces. Filtres via query params (générés automatiquement par json-server) :

```
GET /api/annonces?categorieId=categorie-001&quartierId=quartier-001
GET /api/annonces?prix_gte=10000&prix_lte=500000
GET /api/annonces?statut=active
GET /api/annonces?vendeurId=utilisateur-001
```

**Réponse 200 :**

```json
{
  "id": "annonce-001",
  "titre": "iPhone 13 Pro 256 Go",
  "description": "iPhone 13 Pro en très bon état. Batterie 88%. Aucun problème technique.",
  "prix": 450000,
  "devise": "FCFA",
  "categorieId": "categorie-001",
  "quartierId": "quartier-001",
  "vendeurId": "utilisateur-001",
  "images": ["/uploads/iphone-13-pro-1.jpg", "/uploads/iphone-13-pro-2.jpg"],
  "statut": "active",
  "estEnAvant": false,
  "vues": 0,
  "dateCreation": "2026-08-10T10:30:00Z",
  "dateMaj": "2026-08-10T10:30:00Z"
}
```

### `GET /api/annonces/:id`

Détail d'une annonce. **404** si l'id n'existe pas.

### `POST /api/annonces`

Crée une annonce.

**Body attendu (Content-Type: application/json obligatoire) :**

```json
{
  "titre": "iPhone 13 Pro 256 Go",
  "description": "iPhone 13 Pro en très bon état.",
  "prix": 450000,
  "devise": "FCFA",
  "categorieId": "categorie-001",
  "quartierId": "quartier-001",
  "vendeurId": "utilisateur-001",
  "images": ["/uploads/iphone-13-pro-1.jpg"]
}
```

Champs ajoutés automatiquement côté frontend avant l'envoi : `statut: "active"`, `estEnAvant: false`, `vues: 0`, `dateCreation` et `dateMaj` (`new Date().toISOString()`).

### `PUT /api/annonces/:id`

Remplace une annonce complète. Penser à mettre à jour `dateMaj`.

### `PATCH /api/annonces/:id`

Met à jour un ou plusieurs champs (ex : changer `statut` en `"vendue"`, ou incrémenter `vues`).

### `DELETE /api/annonces/:id`

Supprime une annonce.

---

## Avis

### `GET /api/avis?vendeurId=utilisateur-001`

Liste les avis reçus par un vendeur donné.

**Réponse 200 :**

```json
[
  {
    "id": "avis-001",
    "vendeurId": "utilisateur-001",
    "auteurId": "utilisateur-002",
    "note": 5,
    "commentaire": "Très bon vendeur, transaction rapide.",
    "dateCreation": "2026-07-20T16:00:00Z"
  }
]
```

### `POST /api/avis`

Ajoute un avis sur un vendeur.

**Body attendu :**

```json
{
  "vendeurId": "utilisateur-001",
  "auteurId": "utilisateur-002",
  "note": 5,
  "commentaire": "Transaction rapide"
}
```

`dateCreation` ajoutée automatiquement côté frontend.

---

## Signalements

### `GET /api/signalements?annonceId=annonce-001`

Liste les signalements d'une annonce (usage interne / modération).

### `POST /api/signalements` **[Custom]**

Signale une annonce suspecte. Applique aussi la logique de modération automatique.

**Body attendu :**

```json
{
  "annonceId": "annonce-001",
  "signaleParId": "utilisateur-002",
  "raison": "arnaque_suspectee",
  "description": "Prix anormalement bas pour ce modèle."
}
```

**Réponse 201 :**

```json
{
  "id": "signalement-...",
  "annonceId": "annonce-001",
  "signaleParId": "utilisateur-002",
  "raison": "arnaque_suspectee",
  "description": "Prix anormalement bas pour ce modèle.",
  "statut": "en_attente",
  "dateCreation": "2026-08-11T08:00:00Z"
}
```

Valeurs possibles pour `raison` (à figer en équipe, exemples) : `arnaque_suspectee`, `annonce_frauduleuse`, `contenu_inapproprie`, `autre`.

**Comportement automatique :** si une annonce atteint **3 signalements**, son `statut` passe automatiquement à `"signalee"` (seuil définit dans `routes/signalements.js`, ajustable en équipe).

---

## Codes de statut utilisés

| Code | Signification                                    |
| ---- | ------------------------------------------------ |
| 200  | Succès (GET, PUT, PATCH)                         |
| 201  | Ressource créée (POST)                           |
| 400  | Requête invalide (champ manquant, JSON malformé) |
| 404  | Ressource introuvable                            |
| 500  | Erreur serveur                                   |

## Conventions

- Tous les prix sont en FCFA, stockés en nombre entier.
- Les dates sont au format ISO 8601 (`new Date().toISOString()`).
- `statut` d'une annonce : `"active"` | `"vendue"` | `"signalee"`.
- `statut` d'un signalement : `"en_attente"` | `"traite"` | `"rejete"`.
- Le lien WhatsApp se construit côté frontend à partir du champ `whatsapp` de l'utilisateur : `https://wa.me/242060000001` (numéro sans espaces ni `+` dans l'URL finale).
- Les identifiants sont des chaînes préfixées (`annonce-`, `utilisateur-`, `categorie-`, `avis-`, `signalement-`), pas des entiers.
