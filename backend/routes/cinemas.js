
const express = require('express');
const router = express.Router();
const Cinema = require('../models/Cinema');
const Screening = require('../models/Screening');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// @route   GET api/cinemas
// @desc    Obtenir tous les cinémas
// @access  Public
router.get('/', async (req, res) => {
  try {
    const cinemas = await Cinema.find();
    res.json(cinemas);
  } catch (err) {
    console.error('Erreur lors de la récupération des cinémas:', err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   GET api/cinemas/:id
// @desc    Obtenir un cinéma par son ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const cinema = await Cinema.findById(req.params.id);
    if (!cinema) {
      return res.status(404).json({ message: 'Cinéma non trouvé' });
    }
    res.json(cinema);
  } catch (err) {
    console.error('Erreur lors de la récupération du cinéma:', err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   GET api/cinemas/:cinemaId/movies/:movieId/screenings
// @desc    Obtenir toutes les séances pour un film dans un cinéma
// @access  Public
router.get('/:cinemaId/movies/:movieId/screenings', async (req, res) => {
  try {
    const { cinemaId, movieId } = req.params;

    const screenings = await Screening.find({
      cinema: cinemaId,
      tmdbMovieId: parseInt(movieId)
    }).sort({ startTime: 1 });

    res.json(screenings);
  } catch (err) {
    console.error('Erreur lors de la récupération des séances:', err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Routes pour l'administration des cinémas
// @route   POST api/cinemas
// @desc    Ajouter un nouveau cinéma
// @access  Private/Admin
router.post('/', adminAuth, async (req, res) => {
  try {
    const newCinema = new Cinema(req.body);
    const cinema = await newCinema.save();
    res.json(cinema);
  } catch (err) {
    console.error('Erreur lors de l\'ajout du cinéma:', err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   PUT api/cinemas/:id
// @desc    Mettre à jour un cinéma
// @access  Private/Admin
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const cinema = await Cinema.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!cinema) {
      return res.status(404).json({ message: 'Cinéma non trouvé' });
    }
    res.json(cinema);
  } catch (err) {
    console.error('Erreur lors de la mise à jour du cinéma:', err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   DELETE api/cinemas/:id
// @desc    Supprimer un cinéma
// @access  Private/Admin
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const cinema = await Cinema.findById(req.params.id);
    if (!cinema) {
      return res.status(404).json({ message: 'Cinéma non trouvé' });
    }
    await cinema.deleteOne();
    res.json({ message: 'Cinéma supprimé' });
  } catch (err) {
    console.error('Erreur lors de la suppression du cinéma:', err.message);
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
