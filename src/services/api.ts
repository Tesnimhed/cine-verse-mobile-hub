
import axios from 'axios';

const TMDB_API_KEY = 'ce05b0aeccbb018b815e9aade2287f2c';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// This would be your actual backend API URL in production
const API_BASE_URL = 'https://mycine-api.example.com';

// For demo purposes, we'll create a mock API
const mockApiDelay = () => new Promise(resolve => setTimeout(resolve, 500));

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
 * User Authentication Services
 */
export const authApi = {
  // Mock user data for demonstration
  users: [
    { id: 1, email: 'user@example.com', password: 'password123', name: 'Demo User' }
  ],
  currentUser: null,

  // Register a new user
  register: async (userData: { email: string; password: string; name: string }) => {
    await mockApiDelay();
    // Check if email already exists
    if (authApi.users.some(user => user.email === userData.email)) {
      throw new Error('Cet e-mail est déjà utilisé');
    }

    const newUser = {
      id: authApi.users.length + 1,
      ...userData
    };
    authApi.users.push(newUser);
    
    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return {
      user: userWithoutPassword,
      token: `mock-jwt-token-${newUser.id}`
    };
  },

  // Login a user
  login: async (credentials: { email: string; password: string }) => {
    await mockApiDelay();
    const user = authApi.users.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      throw new Error('Email ou mot de passe incorrect');
    }

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    authApi.currentUser = userWithoutPassword;
    return {
      user: userWithoutPassword,
      token: `mock-jwt-token-${user.id}`
    };
  },

  // Logout a user
  logout: async () => {
    await mockApiDelay();
    authApi.currentUser = null;
    return true;
  },

  // Get current user
  getCurrentUser: async () => {
    await mockApiDelay();
    return authApi.currentUser;
  }
};

/**
 * Cinema Services
 */
export const cinemaApi = {
  // Mock cinemas
  cinemas: [
    { id: 1, name: 'Ciné Paradiso', address: '123 rue du Cinéma, Paris', location: { lat: 48.8566, lng: 2.3522 } },
    { id: 2, name: 'MegaCiné', address: '456 avenue des Films, Lyon', location: { lat: 45.7640, lng: 4.8357 } },
    { id: 3, name: 'StarPlex', address: '789 boulevard des Stars, Marseille', location: { lat: 43.2965, lng: 5.3698 } }
  ],

  // Get all cinemas
  getCinemas: async () => {
    await mockApiDelay();
    return cinemaApi.cinemas;
  },

  // Get cinema by ID
  getCinema: async (cinemaId: number) => {
    await mockApiDelay();
    const cinema = cinemaApi.cinemas.find(c => c.id === cinemaId);
    if (!cinema) throw new Error('Cinéma non trouvé');
    return cinema;
  },

  // Get screenings for a movie at a cinema
  getScreenings: async (cinemaId: number, movieId: number) => {
    await mockApiDelay();
    // Mock screenings for the next 5 days
    const screenings = [];
    const today = new Date();
    
    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      // Create 3 random screenings per day
      const dayScreenings = [10, 14, 18, 21].map(hour => {
        const screeningDate = new Date(date);
        screeningDate.setHours(hour, 0, 0, 0);
        
        return {
          id: `${cinemaId}-${movieId}-${i}-${hour}`,
          cinemaId,
          movieId,
          roomId: Math.floor(Math.random() * 5) + 1,
          roomName: `Salle ${Math.floor(Math.random() * 5) + 1}`,
          startTime: screeningDate.toISOString(),
          endTime: new Date(screeningDate.getTime() + 120 * 60000).toISOString(),
          format: Math.random() > 0.5 ? '2D' : '3D',
          language: Math.random() > 0.7 ? 'VO' : 'VF'
        };
      });
      
      screenings.push(...dayScreenings);
    }
    
    return screenings;
  },

  // Get seats for a screening
  getSeats: async (screeningId: string) => {
    await mockApiDelay();
    // Generate a random seating arrangement
    const rows = 8;
    const seatsPerRow = 12;
    const seats = [];
    
    const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < seatsPerRow; j++) {
        // Add some spaces (aisle) in the middle
        if (j === 3 || j === seatsPerRow - 4) {
          row.push({ type: 'space' });
          continue;
        }
        
        // Generate some already reserved seats
        const isReserved = Math.random() < 0.2;
        row.push({
          id: `${rowLabels[i]}${j + 1}`,
          row: rowLabels[i],
          number: j + 1,
          type: 'seat',
          status: isReserved ? 'reserved' : 'available',
          price: 9.50
        });
      }
      seats.push(row);
    }
    
    return seats;
  }
};

/**
 * Snack Services
 */
export const snackApi = {
  // Mock snacks
  snacks: [
    { id: 1, name: 'Popcorn (petit)', price: 4.50, image: '/snacks/popcorn-small.jpg', category: 'Popcorn' },
    { id: 2, name: 'Popcorn (moyen)', price: 6.00, image: '/snacks/popcorn-medium.jpg', category: 'Popcorn' },
    { id: 3, name: 'Popcorn (grand)', price: 7.50, image: '/snacks/popcorn-large.jpg', category: 'Popcorn' },
    { id: 4, name: 'Coca-Cola', price: 3.50, image: '/snacks/coke.jpg', category: 'Boissons' },
    { id: 5, name: 'Eau Minérale', price: 2.50, image: '/snacks/water.jpg', category: 'Boissons' },
    { id: 6, name: 'Nachos avec sauce fromage', price: 5.50, image: '/snacks/nachos.jpg', category: 'Snacks' },
    { id: 7, name: 'M&M\'s', price: 3.50, image: '/snacks/mm.jpg', category: 'Confiseries' },
    { id: 8, name: 'Menu Ciné (Popcorn moyen + Boisson)', price: 8.50, image: '/snacks/combo.jpg', category: 'Menus' }
  ],

  // Get all snacks
  getSnacks: async () => {
    await mockApiDelay();
    return snackApi.snacks;
  },

  // Get snack by ID
  getSnack: async (snackId: number) => {
    await mockApiDelay();
    const snack = snackApi.snacks.find(s => s.id === snackId);
    if (!snack) throw new Error('Snack non trouvé');
    return snack;
  }
};

/**
 * Booking Services
 */
export const bookingApi = {
  // Mock bookings
  bookings: [],

  // Create a booking
  createBooking: async (bookingData: {
    userId: number,
    screeningId: string,
    seats: string[],
    snacks: { id: number, quantity: number }[],
    totalAmount: number
  }) => {
    await mockApiDelay();
    
    const booking = {
      id: `booking-${Date.now()}`,
      ...bookingData,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
    
    bookingApi.bookings.push(booking);
    return booking;
  },

  // Get user bookings
  getUserBookings: async (userId: number) => {
    await mockApiDelay();
    return bookingApi.bookings.filter(booking => booking.userId === userId);
  },

  // Get booking by ID
  getBooking: async (bookingId: string) => {
    await mockApiDelay();
    const booking = bookingApi.bookings.find(b => b.id === bookingId);
    if (!booking) throw new Error('Réservation non trouvée');
    return booking;
  },

  // Cancel booking
  cancelBooking: async (bookingId: string) => {
    await mockApiDelay();
    const bookingIndex = bookingApi.bookings.findIndex(b => b.id === bookingId);
    if (bookingIndex === -1) throw new Error('Réservation non trouvée');
    
    bookingApi.bookings[bookingIndex].status = 'cancelled';
    return bookingApi.bookings[bookingIndex];
  }
};

export default {
  tmdb: tmdbApi,
  auth: authApi,
  cinema: cinemaApi,
  snack: snackApi,
  booking: bookingApi
};
