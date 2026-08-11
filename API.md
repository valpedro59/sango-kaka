# Contrat d'API — SANGO-KAKA

Base URL en développement : `http://localhost:3001/api`

Toutes les réponses sont en JSON. Pas d'authentification pour le MVP (à ajouter en V2 si besoin).

Les routes standard (CRUD) sont générées automatiquement par **json-server** à partir de `backend/data/db.json`. Les routes marquées **[Custom]** sont écrites à la main dans `server.js` avec Express.

---

## Annonces

### `GET /api/annonces`

Liste toutes les annonces. Supporte les filtres en query params (générés par json-server) :

```
GET /api/annonces?categorie=moto&quartier=Bacongo
GET /api/annonces?prix_gte=10000&prix_lte=50000
GET /api/annonces?statut=active
```

**Réponse 200 :**

```json
[
  {
    "id": 1,
    "titre": "Moto Yamaha 125cc",
    "categorie": "moto",
    "prix": 450000,
    "quartier": "Bacongo",
    "photos": ["https://.../photo1.jpg"],
    "description": "Bon état, entretien à jour",
    "vendeurId": 3,
    "statut": "active",
    "dateCreation": "2026-08-10T09:00:00.000Z"
  }
]
```

### `GET /api/annonces/:id`

Détail d'une annonce. **404** si l'id n'existe pas.

### `POST /api/annonces`

Crée une annonce.

**Body attendu :**

```json
{
  "titre": "Moto Yamaha 125cc",
  "categorie": "moto",
  "prix": 450000,
  "quartier": "Bacongo",
  "photos": ["https://.../photo1.jpg"],
  "description": "Bon état, entretien à jour",
  "vendeurId": 3
}
```

`statut` et `dateCreation` sont ajoutés côté frontend avant l'envoi (`statut: "active"`, `dateCreation: new Date().toISOString()`).

### `PUT /api/annonces/:id`

Remplace une annonce complète.

### `PATCH /api/annonces/:id`

Met à jour un ou plusieurs champs (ex : changer le `statut` en `"vendue"`).

### `DELETE /api/annonces/:id`

Supprime une annonce.

---

## Vendeurs

### `GET /api/vendeurs`

Liste tous les vendeurs.

### `GET /api/vendeurs/:id`

Détail d'un vendeur.

**Réponse 200 :**

```json
{
  "id": 3,
  "nom": "Jean Malonga",
  "telephone": "+242066408340",
  "whatsapp": "+242066408340",
  "quartier": "Bacongo",
  "dateInscription": "2026-05-12T00:00:00.000Z"
}
```

### `POST /api/vendeurs`

Crée un profil vendeur. `dateInscription` ajoutée automatiquement côté frontend.

### `PUT /api/vendeurs/:id`

Met à jour un profil vendeur.

---

## Avis

### `GET /api/avis?vendeurId=3`

Liste les avis d'un vendeur donné.

**Réponse 200 :**

```json
[
  {
    "id": 1,
    "vendeurId": 3,
    "note": 5,
    "commentaire": "Vendeur sérieux",
    "auteur": "Client A"
  }
]
```

### `POST /api/avis`

Ajoute un avis sur un vendeur.

**Body attendu :**

```json
{
  "vendeurId": 3,
  "note": 5,
  "commentaire": "Transaction rapide",
  "auteur": "Client B"
}
```

### `GET /api/vendeurs/:id/note-moyenne` **[Custom]**

Calcule et renvoie la note moyenne d'un vendeur côté serveur.

**Réponse 200 :**

```json
{ "note": 4.5 }
```

Renvoie `{ "note": 0 }` si le vendeur n'a aucun avis.

---

## Signalements

### `GET /api/signalements?annonceId=1`

Liste les signalements d'une annonce donnée (usage interne / modération).

### `POST /api/signalements`

Signale une annonce suspecte.

**Body attendu :**

```json
{ "annonceId": 1, "raison": "Prix suspect / probable arnaque" }
```

`date` ajoutée automatiquement côté frontend.

**Réponse 201 :**

```json
{
  "id": 5,
  "annonceId": 1,
  "raison": "Prix suspect / probable arnaque",
  "date": "2026-08-11T10:30:00.000Z"
}
```

---

## Codes de statut utilisés

| Code | Signification                                     |
| ---- | ------------------------------------------------- |
| 200  | Succès (GET, PUT, PATCH)                          |
| 201  | Ressource créée (POST)                            |
| 400  | Requête invalide (champ manquant, mauvais format) |
| 404  | Ressource introuvable                             |
| 500  | Erreur serveur                                    |

## Conventions

- Tous les prix sont en FCFA, stockés en nombre entier (pas de string).
- Les dates sont au format ISO 8601 (`new Date().toISOString()`).
- `statut` d'une annonce : `"active"` | `"vendue"` | `"signalee"`.
- Le lien WhatsApp se construit côté frontend à partir du champ `whatsapp` du vendeur : `https://wa.me/242066408340` (préfixe pays + numéro, sans espaces ni `+` dans l'URL finale).
