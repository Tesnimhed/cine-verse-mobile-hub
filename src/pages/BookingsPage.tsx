
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import MobileLayout from '@/components/layout/MobileLayout';
import { bookingApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const BookingsPage = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const bookingsData = await bookingApi.getUserBookings(user.id);
        setBookings(bookingsData);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError("Impossible de charger vos réservations. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, [navigate, user]);

  // Filter bookings by status
  const upcomingBookings = bookings.filter(
    booking => booking.status === 'confirmed'
  );
  
  const pastBookings = bookings.filter(
    booking => booking.status === 'completed' || booking.status === 'cancelled'
  );
  
  if (loading) {
    return (
      <MobileLayout>
        <div className="bg-cinema-primary min-h-screen p-4 animate-pulse">
          <div className="mb-4 h-8 w-32 bg-gray-800 rounded"></div>
          <div className="h-10 bg-gray-800 rounded mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </MobileLayout>
    );
  }
  
  if (error) {
    return (
      <MobileLayout>
        <div className="bg-cinema-primary min-h-screen p-4">
          <h1 className="text-2xl font-bold text-white mb-6">Mes réservations</h1>
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
          <h1 className="text-2xl font-bold text-white mb-6">Mes réservations</h1>
          
          {bookings.length === 0 ? (
            <div className="text-center mt-8">
              <p className="text-gray-400 mb-4">Vous n'avez pas encore de réservation</p>
              <Button 
                onClick={() => navigate('/')}
                className="bg-cinema-secondary hover:bg-red-700"
              >
                Explorer les films
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="upcoming">
              <TabsList className="bg-cinema-dark grid grid-cols-2 mb-6">
                <TabsTrigger value="upcoming">À venir</TabsTrigger>
                <TabsTrigger value="past">Historique</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming">
                {upcomingBookings.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} navigate={navigate} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">Aucune réservation à venir</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="past">
                {pastBookings.length > 0 ? (
                  <div className="space-y-4">
                    {pastBookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} navigate={navigate} isPast />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">Aucun historique de réservation</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

// BookingCard component
const BookingCard = ({ booking, navigate, isPast = false }: any) => {
  // In a real app, we'd fetch movie data based on the booking
  const mockMovieData = {
    title: "Film réservé",
    poster: "/placeholder.svg"
  };
  
  const dateStr = booking.createdAt ? format(new Date(booking.createdAt), 'EEEE d MMMM à HH:mm', { locale: fr }) : '';
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-700 text-white';
      case 'cancelled': return 'bg-red-700 text-white';
      case 'completed': return 'bg-gray-700 text-white';
      default: return 'bg-gray-700 text-white';
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmée';
      case 'cancelled': return 'Annulée';
      case 'completed': return 'Effectuée';
      default: return status;
    }
  };
  
  return (
    <Card className="bg-cinema-dark border-0 overflow-hidden">
      <div className="flex">
        <div className="w-24 h-32 bg-gray-800 shrink-0">
          <img 
            src={mockMovieData.poster} 
            alt={mockMovieData.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="p-4 flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-white">{mockMovieData.title}</h3>
              <p className="text-xs text-gray-400 mb-2">{dateStr}</p>
              <p className="text-xs text-gray-400">Réf: {booking.id}</p>
            </div>
            
            <div className={`px-2 py-1 rounded text-xs ${getStatusClass(booking.status)}`}>
              {getStatusLabel(booking.status)}
            </div>
          </div>
          
          <div className="mt-3 flex justify-between items-center">
            <span className="text-cinema-gold font-bold">{booking.totalAmount.toFixed(2)}€</span>
            
            {!isPast && booking.status === 'confirmed' && (
              <Button 
                variant="outline"
                size="sm"
                className="border-cinema-gold text-cinema-gold hover:bg-cinema-gold hover:text-white"
                onClick={() => navigate(`/booking/confirmation/${booking.id}`)}
              >
                Voir billet
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BookingsPage;
