
import axios from 'axios';

const TMDB_API_KEY = 'ce05b0aeccbb018b815e9aade2287f2c';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Configuration pour l'API backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * TMDB API Services
 */
export const tmdbApi = {
  // Get trending movies
  getTrendingMovies: async () => {
    try {
      const response = await axios.get(
        `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&language=fr-FR`
      );
      return response.data.results;
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      throw error;
    }
  },

  // Get now playing movies
  getNowPlayingMovies: async () => {
    try {
      const response = await axios.get(
        `${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=fr-FR`
      );
      return response.data.results;
    } catch (error) {
      console.error('Error fetching now playing movies:', error);
      throw error;
    }
  },

  // Get upcoming movies
  getUpcomingMovies: async () => {
    try {
      const response = await axios.get(
        `${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&language=fr-FR`
      );
      return response.data.results;
    } catch (error) {
      console.error('Error fetching upcoming movies:', error);
      throw error;
    }
  },

  // Get movie details
  getMovieDetails: async (movieId: number) => {
    try {
      const response = await axios.get(
        `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=fr-FR&append_to_response=videos,credits`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching movie details for ID ${movieId}:`, error);
      throw error;
    }
  },

  // Search movies
  searchMovies: async (query: string) => {
    try {
      const response = await axios.get(
        `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=fr-FR&query=${encodeURIComponent(query)}`
      );
      return response.data.results;
    } catch (error) {
      console.error(`Error searching movies for "${query}":`, error);
      throw error;
    }
  },

  // Get image URL
  getImageUrl: (path: string, size: string = 'w500') => {
    if (!path) return null;
    return `${IMAGE_BASE_URL}/${size}${path}`;
  }
};

/**
 * User API Services pour communiquer avec le backend
 */
export const userApi = {
  // Register user
  register: async (userData: { name: string; email: string; password: string }) => {
    try {
      const response = await axios.post(`${API_URL}/users/register`, userData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
  },

  // Login user
  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await axios.post(`${API_URL}/users/login`, credentials);
      localStorage.setItem('mycine_token', response.data.token);
      return response.data;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem('mycine_token');
      if (!token) return null;
      
      const response = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur:', error);
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    localStorage.removeItem('mycine_token');
    return true;
  }
};

/**
 * Cinema API Services
 */
export const cinemaApi = {
  // Get all cinemas
  getCinemas: async () => {
    try {
      const response = await axios.get(`${API_URL}/cinemas`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des cinémas:', error);
      throw error;
    }
  },

  // Get cinema by ID
  getCinema: async (cinemaId: number) => {
    try {
      const response = await axios.get(`${API_URL}/cinemas/${cinemaId}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du cinéma ${cinemaId}:`, error);
      throw error;
    }
  },

  // Get screenings
  getScreenings: async (cinemaId: number, movieId: number) => {
    try {
      const response = await axios.get(`${API_URL}/cinemas/${cinemaId}/movies/${movieId}/screenings`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des séances:', error);
      throw error;
    }
  },

  // Get seats for a screening
  getSeats: async (screeningId: string) => {
    try {
      const response = await axios.get(`${API_URL}/screenings/${screeningId}/seats`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des sièges pour la séance ${screeningId}:`, error);
      throw error;
    }
  }
};

/**
 * Snack API Services
 */
export const snackApi = {
  // Get all snacks
  getSnacks: async () => {
    try {
      const response = await axios.get(`${API_URL}/snacks`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des snacks:', error);
      throw error;
    }
  },

  // Get snack by ID
  getSnack: async (snackId: number) => {
    try {
      const response = await axios.get(`${API_URL}/snacks/${snackId}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du snack ${snackId}:`, error);
      throw error;
    }
  }
};

/**
 * Booking API Services
 */
export const bookingApi = {
  // Create a booking
  createBooking: async (bookingData: {
    screeningId: string,
    seats: string[],
    snacks: { id: number, quantity: number }[],
    totalAmount: number
  }) => {
    try {
      const token = localStorage.getItem('mycine_token');
      if (!token) throw new Error('Non autorisé: Veuillez vous connecter');
      
      const response = await axios.post(`${API_URL}/bookings`, bookingData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la réservation:', error);
      throw error;
    }
  },

  // Get user bookings
  getUserBookings: async () => {
    try {
      const token = localStorage.getItem('mycine_token');
      if (!token) throw new Error('Non autorisé: Veuillez vous connecter');
      
      const response = await axios.get(`${API_URL}/bookings/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des réservations:', error);
      throw error;
    }
  },

  // Get booking by ID
  getBooking: async (bookingId: string) => {
    try {
      const token = localStorage.getItem('mycine_token');
      if (!token) throw new Error('Non autorisé: Veuillez vous connecter');
      
      const response = await axios.get(`${API_URL}/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la réservation ${bookingId}:`, error);
      throw error;
    }
  },

  // Cancel booking
  cancelBooking: async (bookingId: string) => {
    try {
      const token = localStorage.getItem('mycine_token');
      if (!token) throw new Error('Non autorisé: Veuillez vous connecter');
      
      const response = await axios.put(
        `${API_URL}/bookings/${bookingId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de l'annulation de la réservation ${bookingId}:`, error);
      throw error;
    }
  }
};

export default {
  tmdb: tmdbApi,
  user: userApi,
  cinema: cinemaApi,
  snack: snackApi,
  booking: bookingApi
};
