import React, { createContext, useState, useContext } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { bookingApi } from '../services/api';
import { useAuth } from './AuthContext';

interface Seat {
  id: string;
  row: string;
  number: number;
  type: string;
  status: string;
  price: number;
}

interface Snack {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface BookingContextType {
  selectedMovie: any | null;
  selectedCinema: any | null;
  selectedScreening: any | null;
  selectedSeats: Seat[];
  selectedSnacks: Snack[];
  totalAmount: number;
  setSelectedMovie: (movie: any | null) => void;
  setSelectedCinema: (cinema: any | null) => void;
  setSelectedScreening: (screening: any | null) => void;
  addSeat: (seat: Seat) => void;
  removeSeat: (seatId: string) => void;
  addSnack: (snack: any) => void;
  updateSnackQuantity: (snackId: number, quantity: number) => void;
  removeSnack: (snackId: number) => void;
  clearBooking: () => void;
  completeBooking: () => Promise<any>;
}

const BookingContext = createContext<BookingContextType>({
  selectedMovie: null,
  selectedCinema: null,
  selectedScreening: null,
  selectedSeats: [],
  selectedSnacks: [],
  totalAmount: 0,
  setSelectedMovie: () => {},
  setSelectedCinema: () => {},
  setSelectedScreening: () => {},
  addSeat: () => {},
  removeSeat: () => {},
  addSnack: () => {},
  updateSnackQuantity: () => {},
  removeSnack: () => {},
  clearBooking: () => {},
  completeBooking: async () => ({}),
});

export const useBooking = () => useContext(BookingContext);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedMovie, setSelectedMovie] = useState<any | null>(null);
  const [selectedCinema, setSelectedCinema] = useState<any | null>(null);
  const [selectedScreening, setSelectedScreening] = useState<any | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [selectedSnacks, setSelectedSnacks] = useState<Snack[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  const calculateTotalAmount = () => {
    const seatTotal = selectedSeats.reduce((total, seat) => total + seat.price, 0);
    const snackTotal = selectedSnacks.reduce((total, snack) => total + (snack.price * snack.quantity), 0);
    return seatTotal + snackTotal;
  };

  const addSeat = (seat: Seat) => {
    if (selectedSeats.find(s => s.id === seat.id)) return;
    setSelectedSeats([...selectedSeats, seat]);
  };

  const removeSeat = (seatId: string) => {
    setSelectedSeats(selectedSeats.filter(seat => seat.id !== seatId));
  };

  const addSnack = (snack: any) => {
    const existingSnack = selectedSnacks.find(s => s.id === snack.id);
    if (existingSnack) {
      updateSnackQuantity(snack.id, existingSnack.quantity + 1);
    } else {
      setSelectedSnacks([...selectedSnacks, { ...snack, quantity: 1 }]);
    }
  };

  const updateSnackQuantity = (snackId: number, quantity: number) => {
    if (quantity <= 0) {
      removeSnack(snackId);
      return;
    }
    
    setSelectedSnacks(
      selectedSnacks.map(snack => 
        snack.id === snackId ? { ...snack, quantity } : snack
      )
    );
  };

  const removeSnack = (snackId: number) => {
    setSelectedSnacks(selectedSnacks.filter(snack => snack.id !== snackId));
  };

  const clearBooking = () => {
    setSelectedMovie(null);
    setSelectedCinema(null);
    setSelectedScreening(null);
    setSelectedSeats([]);
    setSelectedSnacks([]);
  };

  const completeBooking = async () => {
    if (!user) {
      toast({
        title: "Erreur de réservation",
        description: "Vous devez être connecté pour effectuer une réservation",
        variant: "destructive"
      });
      throw new Error("Utilisateur non connecté");
    }

    if (!selectedMovie || !selectedCinema || !selectedScreening || selectedSeats.length === 0) {
      toast({
        title: "Réservation incomplète",
        description: "Veuillez sélectionner un film, un cinéma, une séance et au moins un siège",
        variant: "destructive"
      });
      throw new Error("Données de réservation incomplètes");
    }

    try {
      const booking = await bookingApi.createBooking({
        screeningId: selectedScreening.id,
        seats: selectedSeats.map(seat => seat.id),
        snacks: selectedSnacks.map(snack => ({ id: snack.id, quantity: snack.quantity })),
        totalAmount: calculateTotalAmount()
      });
      
      toast({
        title: "Réservation confirmée !",
        description: `Votre réservation #${booking.id} a été enregistrée avec succès.`,
      });
      
      clearBooking();
      return booking;
    } catch (error: any) {
      toast({
        title: "Erreur de réservation",
        description: error.message || "Une erreur s'est produite lors de la réservation",
        variant: "destructive"
      });
      throw error;
    }
  };

  return (
    <BookingContext.Provider
      value={{
        selectedMovie,
        selectedCinema,
        selectedScreening,
        selectedSeats,
        selectedSnacks,
        totalAmount: calculateTotalAmount(),
        setSelectedMovie,
        setSelectedCinema,
        setSelectedScreening,
        addSeat,
        removeSeat,
        addSnack,
        updateSnackQuantity,
        removeSnack,
        clearBooking,
        completeBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
