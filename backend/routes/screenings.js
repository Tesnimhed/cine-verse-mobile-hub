
const express = require('express');
const router = express.Router();
const Screening = require('../models/Screening');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// @route   GET api/screenings/:id/seats
// @desc    Obtenir les sièges pour une séance
// @access  Public
router.get('/:id/seats', async (req, res) => {
  try {
    const screening = await Screening.findById(req.params.id);
    if (!screening) {
      return res.status(404).json({ message: 'Séance non trouvée' });
    }
    
    // Organiser les sièges par rangée
    const rows = {};
    screening.seats.forEach(seat => {
      if (!rows[seat.row]) {
        rows[seat.row] = [];
      }
      rows[seat.row].push(seat);
    });
    
    // Convertir en tableau compatible avec le frontend
    const seatingPlan = Object.keys(rows).sort().map(rowKey => {
      return rows[rowKey].sort((a, b) => a.number - b.number);
    });
    
    res.json(seatingPlan);
  } catch (err) {
    console.error('Erreur lors de la récupération des sièges:', err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   GET api/screenings/:id
// @desc    Obtenir les détails d'une séance
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const screening = await Screening.findById(req.params.id)
      .populate('cinema', 'name address')
      .populate('movie', 'title posterPath');
    
    if (!screening) {
      return res.status(404).json({ message: 'Séance non trouvée' });
    }
    
    res.json(screening);
  } catch (err) {
    console.error('Erreur lors de la récupération de la séance:', err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Routes pour l'administration des séances
// @route   POST api/screenings
// @desc    Ajouter une nouvelle séance
// @access  Private/Admin
router.post('/', adminAuth, async (req, res) => {
  try {
    // Générer les sièges automatiquement
    const seatsConfig = req.body.seatsConfig || {
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
      seatsPerRow: 12
    };
    
    const seats = [];
    for (let i = 0; i < seatsConfig.rows.length; i++) {
      const row = seatsConfig.rows[i];
      for (let j = 1; j <= seatsConfig.seatsPerRow; j++) {
        // Ajouter un espace d'allée
        if (j === 4 || j === seatsConfig.seatsPerRow - 3) {
          continue;
        }
        
        seats.push({
          id: `${row}${j}`,
          row,
          number: j,
          status: 'available'
        });
      }
    }
    
    const screeningData = {
      ...req.body,
      seats
    };
    
    const newScreening = new Screening(screeningData);
    const screening = await newScreening.save();
    
    res.json(screening);
  } catch (err) {
    console.error('Erreur lors de l\'ajout de la séance:', err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   PUT api/screenings/:id
// @desc    Mettre à jour une séance
// @access  Private/Admin
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const screening = await Screening.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!screening) {
      return res.status(404).json({ message: 'Séance non trouvée' });
    }
    
    res.json(screening);
  } catch (err) {
    console.error('Erreur lors de la mise à jour de la séance:', err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   PUT api/screenings/:id/seats
// @desc    Réserver des sièges temporairement (pour les utilisateurs authentifiés)
// @access  Private
router.put('/:id/seats', auth, async (req, res) => {
  try {
    const { seats } = req.body;
    
    if (!seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ message: 'Sièges non spécifiés' });
    }
    
    const screening = await Screening.findById(req.params.id);
    
    if (!screening) {
      return res.status(404).json({ message: 'Séance non trouvée' });
    }
    
    // Vérifier si les sièges sont disponibles
    const unavailableSeats = [];
    
    seats.forEach(seatId => {
      const seat = screening.seats.find(s => s.id === seatId);
      if (!seat || seat.status !== 'available') {
        unavailableSeats.push(seatId);
      }
    });
    
    if (unavailableSeats.length > 0) {
      return res.status(400).json({
        message: 'Certains sièges ne sont pas disponibles',
        unavailableSeats
      });
    }
    
    // Réserver les sièges
    screening.seats.forEach(seat => {
      if (seats.includes(seat.id)) {
        seat.status = 'reserved';
      }
    });
    
    await screening.save();
    
    res.json(screening);
  } catch (err) {
    console.error('Erreur lors de la réservation des sièges:', err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   DELETE api/screenings/:id
// @desc    Supprimer une séance
// @access  Private/Admin
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const screening = await Screening.findById(req.params.id);
    
    if (!screening) {
      return res.status(404).json({ message: 'Séance non trouvée' });
    }
    
    await screening.deleteOne();
    res.json({ message: 'Séance supprimée' });
  } catch (err) {
    console.error('Erreur lors de la suppression de la séance:', err.message);
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
