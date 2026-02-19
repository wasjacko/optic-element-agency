# Backend de Réservation Studio

API Node.js/TypeScript pour la gestion de réservations de studio (PostgreSQL, Prisma, Resend).

## Prérequis

1. Node.js (v18+)
2. PostgreSQL (Local ou Cloud comme Vercel/Neon/Supabase)

## Installation & Lancement

1. **Installer les dépendances**
   ```bash
   cd backend
   npm install
   ```

2. **Configuration**
   - Copier le fichier d'exemple : `cp .env.example .env`
   - Remplir les variables dans `.env` :
     - `DATABASE_URL`: URL de connexion Postgres.
     - `RESEND_API_KEY`: Clé API de [Resend.com](https://resend.com).
     - `JWT_SECRET`: Une chaîne aléatoire longue.
     - `ADMIN_EMAIL`: L'email qui recevra les demandes.

3. **Base de Données**
   - Créer les tables :
     ```bash
     npx prisma db push
     ```

4. **Lancer le serveur**
   ```bash
   npm run dev
   ```
   Le serveur sera accessible sur `http://localhost:3000`.

## API Endpoints

### 1. Créer une demande de réservation
**POST** `/api/bookings`

Input:
```json
{
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "phone": "+33612345678",
  "start": "2026-02-10T09:00:00.000Z",
  "end": "2026-02-10T11:00:00.000Z",
  "notes": "Besoin de lumière.", 
  "_gotcha": "" // Laisser vide (anti-spam)
}
```

Réponses :
- `201 Created`: Succès, email envoyé.
- `400 Bad Request`: Validation échouée (horaires, durée < 1h, dimanche...).
- `409 Conflict`: Créneau déjà pris.

### 2. Vérifier la disponibilité
**GET** `/api/bookings/availability`

Params: `from` (ISO date), `to` (ISO date)

Exemple:
`/api/bookings/availability?from=2026-02-10&to=2026-02-11`

Réponse :
```json
{
  "busy": [
    { "start": "...", "end": "..." }
  ]
}
```

### 3. Actions Admin (Liens Email)
- **Confirmer**: `GET /api/bookings/confirm?token=...`
- **Annuler**: `GET /api/bookings/cancel?token=...`

## Déploiement

- **Render/Railway** : Déployer comme un "Web Service". Commande de start : `npm run start` (après `npm run build`).
- **Verif Environment** : Assurez-vous que les variables d'environnement (`DATABASE_URL`, etc.) sont configurées dans l'interface de l'hébergeur.
