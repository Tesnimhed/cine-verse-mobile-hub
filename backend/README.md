
# MyCiné Backend

Ce dossier contient le code du serveur backend de l'application MyCiné.

## Installation

```bash
# Installer les dépendances
npm install

# Configurer les variables d'environnement
# Créer un fichier .env basé sur le modèle .env.example

# Démarrer le serveur en mode développement
npm run dev

# Démarrer le serveur en production
npm start
```

## Structure du projet

```
/backend
  /middleware - Middleware pour l'authentification
  /models - Modèles Mongoose pour MongoDB
  /routes - Routes API Express
  server.js - Point d'entrée du serveur
  .env - Variables d'environnement (à créer)
```

## API Endpoints

### Authentification
- POST /api/users/register - Inscription d'un utilisateur
- POST /api/users/login - Connexion d'un utilisateur
- GET /api/users/me - Récupérer les infos de l'utilisateur courant

### Cinémas
- GET /api/cinemas - Récupérer tous les cinémas
- GET /api/cinemas/:id - Récupérer un cinéma par ID
- GET /api/cinemas/:cinemaId/movies/:movieId/screenings - Récupérer les séances

### Séances
- GET /api/screenings/:id - Récupérer une séance par ID
- GET /api/screenings/:id/seats - Récupérer les sièges d'une séance

### Snacks
- GET /api/snacks - Récupérer tous les snacks
- GET /api/snacks/:id - Récupérer un snack par ID

### Réservations
- POST /api/bookings - Créer une réservation
- GET /api/bookings/me - Récupérer les réservations de l'utilisateur
- GET /api/bookings/:id - Récupérer une réservation par ID
- PUT /api/bookings/:id/cancel - Annuler une réservation

### Admin
- GET /api/admin/dashboard - Statistiques du tableau de bord
- GET /api/admin/movies/tmdb/:id - Importer un film depuis TMDB

## Modèles de données

### User
- Nom, email, mot de passe, rôle

### Cinema
- Nom, adresse, géolocalisation, description

### Movie
- Titre, description, images, durée, genres

### Screening
- Cinéma, film, salle, horaires, format, prix, sièges

### Booking
- Utilisateur, séance, sièges, snacks, montant total, statut

### Snack
- Nom, prix, image, catégorie, description

## Sécurité
- Authentification par JWT (JSON Web Tokens)
- Middleware d'authentification pour les routes protégées
- Rôles utilisateur: user, admin
