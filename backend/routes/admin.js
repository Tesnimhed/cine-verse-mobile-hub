const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Cinema = require('../models/Cinema');
const Movie = require('../models/Movie');
const Screening = require('../models/Screening');
const Booking = require('../models/Booking');
const Snack = require('../models/Snack');
const adminAuth = require('../middleware/adminAuth');
const axios = require('axios');

// @route   GET api/admin/dashboard
// @desc    Obtenir les statistiques pour le tableau de bord admin
// @access  Private/Admin
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    // Statistiques des utilisateurs
    const userCount = await User.countDocuments();
    
    // Statistiques des cinémas
    const cinemaCount = await Cinema.countDocuments();
    
    // Statistiques des films
    const movieCount = await Movie.countDocuments();
    
    // Statistiques des séances
    const screeningCount = await Screening.countDocuments();
    const screeningsToday = await Screening.countDocuments({
      startTime: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lt: new Date(new Date().setHours(23, 59, 59, 999))
      }
    });
    
    // Statistiques des réservations
    const bookingCount = await Booking.countDocuments();
    const bookingsToday = await Booking.countDocuments({
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lt: new Date(new Date().setHours(23, 59, 59, 999))
      }
    });
    
    // Calcul du revenu total et d'aujourd'hui
    const bookings = await Booking.find({ status: { $ne: 'cancelled' } });
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
    
    const todayBookings = await Booking.find({
      status: { $ne: 'cancelled' },
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lt: new Date(new Date().setHours(23, 59, 59, 999))
      }
    });
    const todayRevenue = todayBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
    
    // Revenu par catégorie (billets vs snacks)
    const ticketRevenue = bookings.reduce((sum, booking) => {
      const ticketTotal = booking.seats.reduce((seatsSum, seat) => seatsSum + (seat.price || 0), 0);
      return sum + ticketTotal;
    }, 0);
    
    const snackRevenue = totalRevenue - ticketRevenue;
    
    // Répartition des réservations par statut
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    
    // Envoyer toutes les statistiques
    res.json({
      users: {
        total: userCount
      },
      cinemas: {
        total: cinemaCount
      },
      movies: {
        total: movieCount
      },
      screenings: {
        total: screeningCount,
        today: screeningsToday
      },
      bookings: {
        total: bookingCount,
        today: bookingsToday,
        confirmed: confirmedBookings,
        cancelled: cancelledBookings,
        completed: completedBookings
      },
      revenue: {
        total: Math.round(totalRevenue * 100) / 100,
        today: Math.round(todayRevenue * 100) / 100,
        tickets: Math.round(ticketRevenue * 100) / 100,
        snacks: Math.round(snackRevenue * 100) / 100
      }
    });
  } catch (err) {
    console.error('Erreur lors de la récupération des statistiques:', err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   GET api/admin/users
// @desc    Obtenir tous les utilisateurs
// @access  Private/Admin
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error('Erreur lors de la récupération des utilisateurs:', err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   DELETE api/admin/users/:id
// @desc    Supprimer un utilisateur
// @access  Private/Admin
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    // Vérifier qu'on ne supprime pas un administrateur
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Impossible de supprimer un administrateur' });
    }
    
    // Supprimer l'utilisateur
    await user.deleteOne();
    
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (err) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   PUT api/admin/users/:id/block
// @desc    Bloquer/Débloquer un utilisateur
// @access  Private/Admin
router.put('/users/:id/block', adminAuth, async (req, res) => {
  try {
    const { blocked } = req.body;
    
    if (blocked === undefined) {
      return res.status(400).json({ message: 'Le statut de blocage est requis' });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    // Vérifier qu'on ne bloque pas un administrateur
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Impossible de bloquer un administrateur' });
    }
    
    // Mettre à jour le statut de blocage
    user.blocked = blocked;
    await user.save();
    
    res.json({
      message: blocked ? 'Utilisateur bloqué avec succès' : 'Utilisateur débloqué avec succès',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        blocked: user.blocked
      }
    });
  } catch (err) {
    console.error('Erreur lors du changement de statut de l\'utilisateur:', err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   GET api/admin/movies/tmdb/:id
// @desc    Importer un film depuis TMDB
// @access  Private/Admin
router.get('/movies/tmdb/:id', adminAuth, async (req, res) => {
  try {
    const tmdbId = req.params.id;
    
    // Vérifier si le film existe déjà dans la base de données
    const existingMovie = await Movie.findOne({ tmdbId: parseInt(tmdbId) });
    if (existingMovie) {
      return res.status(400).json({ message: 'Ce film existe déjà dans la base de données' });
    }
    
    // Récupérer les détails du film depuis l'API TMDB
    const response = await axios.get(
      `${process.env.TMDB_BASE_URL}/movie/${tmdbId}?api_key=${process.env.TMDB_API_KEY}&language=fr-FR&append_to_response=credits,videos`
    );
    
    const movieData = response.data;
    
    // Extraire le réalisateur
    const director = movieData.credits?.crew.find(person => person.job === 'Director')?.name || '';
    
    // Extraire les acteurs principaux (les 5 premiers)
    const cast = movieData.credits?.cast.slice(0, 5).map(person => person.name) || [];
    
    // Extraire la bande-annonce YouTube
    const trailer = movieData.videos?.results.find(video => 
      video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser')
    );
    
    const trailerUrl = trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : '';
    
    // Créer le nouveau film
    const newMovie = new Movie({
      tmdbId: parseInt(tmdbId),
      title: movieData.title,
      overview: movieData.overview,
      posterPath: movieData.poster_path,
      backdropPath: movieData.backdrop_path,
      releaseDate: movieData.release_date,
      runtime: movieData.runtime,
      voteAverage: movieData.vote_average,
      genres: movieData.genres.map(genre => genre.name),
      director,
      cast,
      trailerUrl
    });
    
    await newMovie.save();
    res.json(newMovie);
  } catch (err) {
    console.error('Erreur lors de l\'importation du film depuis TMDB:', err.message);
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
