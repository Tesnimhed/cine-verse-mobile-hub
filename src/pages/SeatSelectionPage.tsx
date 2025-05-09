
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import MobileLayout from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { cinemaApi } from '@/services/api';
import { ArrowLeft, Info } from 'lucide-react';
import { useBooking } from '@/contexts/BookingContext';

const SeatSelectionPage = () => {
  const { screeningId } = useParams();
  const [seats, setSeats] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { 
    selectedMovie, 
    selectedCinema,
    selectedScreening,
    selectedSeats,
    addSeat,
    removeSeat 
  } = useBooking();
  
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        setLoading(true);
        const seatsData = await cinemaApi.getSeats(screeningId!);
        setSeats(seatsData);
      } catch (err) {
        console.error('Error fetching seats:', err);
        setError("Impossible de charger le plan de salle. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };
    
    if (screeningId) {
      fetchSeats();
    }
  }, [screeningId]);

  const handleSeatSelection = (seat: any) => {
    if (seat.status === 'reserved') return;
    
    const isSelected = selectedSeats.some(s => s.id === seat.id);
    if (isSelected) {
      removeSeat(seat.id);
    } else {
      addSeat(seat);
    }
  };
  
  const isSelectedSeat = (seatId: string) => {
    return selectedSeats.some(seat => seat.id === seatId);
  };
  
  if (!selectedMovie || !selectedCinema || !selectedScreening) {
    navigate('/');
    return null;
  }
  
  const screeningTime = selectedScreening ? format(new Date(selectedScreening.startTime), 'EEEE d MMMM à HH:mm', { locale: fr }) : '';
  
  if (loading) {
    return (
      <MobileLayout>
        <div className="bg-cinema-primary min-h-screen p-4 animate-pulse">
          <div className="mb-4 h-8 w-32 bg-gray-800 rounded"></div>
          <div className="h-8 w-3/4 bg-gray-800 rounded mb-4"></div>
          <div className="h-48 bg-gray-800 rounded mb-6"></div>
        </div>
      </MobileLayout>
    );
  }
  
  if (error) {
    return (
      <MobileLayout>
        <div className="bg-cinema-primary min-h-screen p-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4 text-white p-0"
          >
            <ArrowLeft size={20} className="mr-2" /> Retour
          </Button>
          <div className="text-red-500 text-center mt-8">
            {error}
          </div>
        </div>
      </MobileLayout>
    );
  }
  
  return (
    <MobileLayout>
      <div className="bg-cinema-primary min-h-screen">
        <div className="p-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4 text-white p-0"
          >
            <ArrowLeft size={20} className="mr-2" /> Retour
          </Button>
          
          <div className="mb-6">
            <h1 className="text-xl font-bold text-white mb-1">{selectedMovie.title}</h1>
            <p className="text-sm text-cinema-gold">{selectedCinema.name} • {screeningTime}</p>
            <p className="text-xs text-gray-400">{selectedScreening.roomName} • {selectedScreening.format} • {selectedScreening.language}</p>
          </div>
          
          <div className="mb-8">
            <div className="bg-cinema-dark p-4 rounded-lg mb-4">
              <div className="text-center mb-6">
                <div className="w-3/4 h-2 bg-cinema-secondary mx-auto mb-2 rounded"></div>
                <p className="text-xs text-gray-400">ÉCRAN</p>
              </div>
              
              <div className="flex flex-col items-center space-y-2 mb-4">
                {seats.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex">
                    {row.map((seat: any, seatIndex: number) => (
                      <div 
                        key={`${rowIndex}-${seatIndex}`} 
                        className={`seat ${
                          seat.type === 'space' 
                            ? 'seat-space' 
                            : isSelectedSeat(seat.id)
                              ? 'seat-selected'
                              : seat.status === 'available'
                                ? 'seat-available'
                                : 'seat-reserved'
                        }`}
                        onClick={() => seat.type !== 'space' ? handleSeatSelection(seat) : null}
                      >
                        {seat.type !== 'space' && seat.row + seat.number}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center space-x-6">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-cinema-light rounded mr-2"></div>
                  <span className="text-xs text-gray-300">Disponible</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                  <span className="text-xs text-gray-300">Sélectionné</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-cinema-secondary opacity-60 rounded mr-2"></div>
                  <span className="text-xs text-gray-300">Occupé</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 p-3 rounded-lg flex items-start space-x-3">
              <Info size={18} className="text-gray-400 mt-0.5" />
              <p className="text-xs text-gray-300">
                Sélectionnez vos sièges pour continuer. Vous pouvez sélectionner jusqu'à 10 sièges par commande.
              </p>
            </div>
          </div>
          
          <div className="fixed bottom-16 left-4 right-4">
            {selectedSeats.length > 0 ? (
              <div className="bg-cinema-dark rounded-lg p-4 shadow-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white">{selectedSeats.length} {selectedSeats.length > 1 ? 'sièges' : 'siège'} sélectionné{selectedSeats.length > 1 ? 's' : ''}</span>
                  <span className="text-cinema-gold font-bold">
                    {(selectedSeats.reduce((total, seat) => total + seat.price, 0)).toFixed(2)}€
                  </span>
                </div>
                
                <Button 
                  className="w-full bg-cinema-secondary hover:bg-red-700"
                  onClick={() => navigate('/booking/snacks')}
                >
                  Continuer
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default SeatSelectionPage;
