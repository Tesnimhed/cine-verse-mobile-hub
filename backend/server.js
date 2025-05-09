
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Charger les variables d'environnement
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/cinemas', require('./routes/cinemas'));
app.use('/api/screenings', require('./routes/screenings'));
app.use('/api/snacks', require('./routes/snacks'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/admin', require('./routes/admin'));

// Route par défaut
app.get('/api', (req, res) => {
  res.send('MyCiné API est en ligne!');
});

// Connexion à MongoDB
const mongoURI = process.env.MONGODB_URI.replace('<db_password>', process.env.DB_PASSWORD);

mongoose
  .connect(mongoURI)
  .then(() => console.log('MongoDB connecté'))
  .catch((err) => console.log('Erreur MongoDB:', err));

// Port du serveur
const PORT = process.env.PORT || 5000;

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
