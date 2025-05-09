
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Screening = require('../models/Screening');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// @route   POST api/bookings
// @desc    Créer une nouvelle réservation
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { screeningId, seats, snacks, totalAmount } = req.body;
    
    // Vérifier la disponibilité des sièges
    const screening = await Screening.findById(screeningId);
    if (!screening) {
      return res.status(404).json({ message: 'Séance non trouvée' });
    }
    
    // Vérifier si tous les sièges sont disponibles
    const unavailableSeats = [];
    seats.forEach(seatId => {
      const seat = screening.seats.find(s => s.id === seatId);
      if (!seat || seat.status !== 'available') {
        unavailableSeats.push(seatId);
      }
    });
    
    if (unavailableSeats.length > 0) {
      return res.status(400).json({
        message: 'Certains sièges ne sont plus disponibles',
        unavailableSeats
      });
    }
    
    // Marquer les sièges comme vendus
    screening.seats.forEach(seat => {
      if (seats.includes(seat.id)) {
        seat.status = 'sold';
      }
    });
    await screening.save();
    
    // Préparer les données de siège pour la réservation
    const seatDetails = seats.map(seatId => {
      const seat = screening.seats.find(s => s.id === seatId);
      return {
        id: seat.id,
        row: seat.row,
        number: seat.number,
        price: screening.price
      };
    });
    
    // Créer la référence unique pour la réservation
    const bookingReference = generateBookingReference();
    
    // Créer la réservation
    const newBooking = new Booking({
      user: req.user.id,
      screening: screeningId,
      seats: seatDetails,
      snacks: snacks || [],
      totalAmount,
      paymentStatus: 'completed',
      bookingReference
    });
    
    const booking = await newBooking.save();
    
    // Retourner la réservation créée
    res.json(booking);
  } catch (err) {
    console.error('Erreur lors de la création de la réservation:', err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Fonction pour générer une référence de réservation unique
function generateBookingReference() {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// @route   GET api/bookings/me
// @desc    Obtenir les réservations de l'utilisateur connecté
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('screening', 'startTime format language')
      .populate({
        path: 'screening',
        populate: {
          path: 'cinema',
          select: 'name address'
        }
      })
      .populate({
        path: 'screening',
        populate: {
          path: 'movie',
          select: 'title posterPath'
        }
      })
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (err) {
    console.error('Erreur lors de la récupération des réservations:', err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   GET api/bookings/:id
// @desc    Obtenir les détails d'une réservation
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('screening', 'startTime endTime format language roomName')
      .populate({
        path: 'screening',
        populate: {
          path: 'cinema',
          select: 'name address'
        }
      })
      .populate({
        path: 'screening',
        populate: {
          path: 'movie',
          select: 'title posterPath'
        }
      })
      .populate('snacks.snack', 'name price image');
    
    if (!booking) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    
    // Vérifier que la réservation appartient à l'utilisateur connecté
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    
    res.json(booking);
  } catch (err) {
    console.error('Erreur lors de la récupération de la réservation:', err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   PUT api/bookings/:id/cancel
// @desc    Annuler une réservation
// @access  Private
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    
    // Vérifier que la réservation appartient à l'utilisateur connecté
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    
    // Vérifier si la réservation peut être annulée
    const screening = await Screening.findById(booking.screening);
    
    if (!screening) {
      return res.status(404).json({ message: 'Séance non trouvée' });
    }
    
    const now = new Date();
    const screeningStartTime = new Date(screening.startTime);
    
    // Ne pas permettre l'annulation si la séance a commencé
    if (now >= screeningStartTime) {
      return res.status(400).json({
        message: 'Impossible d\'annuler une réservation après le début de la séance'
      });
    }
    
    // Marquer les sièges comme disponibles à nouveau
    booking.seats.forEach(bookedSeat => {
      const seat = screening.seats.find(s => s.id === bookedSeat.id);
      if (seat) {
        seat.status = 'available';
      }
    });
    
    await screening.save();
    
    // Marquer la réservation comme annulée
    booking.status = 'cancelled';
    await booking.save();
    
    res.json(booking);
  } catch (err) {
    console.error('Erreur lors de l\'annulation de la réservation:', err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Routes pour l'administration des réservations
// @route   GET api/bookings
// @desc    Obtenir toutes les réservations (admin)
// @access  Private/Admin
router.get('/', adminAuth, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('screening', 'startTime')
      .populate({
        path: 'screening',
        populate: {
          path: 'cinema',
          select: 'name'
        }
      })
      .populate({
        path: 'screening',
        populate: {
          path: 'movie',
          select: 'title'
        }
      })
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (err) {
    console.error('Erreur lors de la récupération des réservations:', err.message);
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
