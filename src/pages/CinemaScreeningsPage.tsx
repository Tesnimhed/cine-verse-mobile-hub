
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format, isToday, isTomorrow, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import MobileLayout from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { cinemaApi, tmdbApi } from '@/services/api';
import { ArrowLeft } from 'lucide-react';
import { useBooking } from '@/contexts/BookingContext';

const CinemaScreeningsPage = () => {
  const { cinemaId, movieId } = useParams();
  const [cinema, setCinema] = useState<any | null>(null);
  const [movie, setMovie] = useState<any | null>(null);
  const [screenings, setScreenings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [groupedScreenings, setGroupedScreenings] = useState<any>({});
  const [activeDay, setActiveDay] = useState<string>('');
  
  const navigate = useNavigate();
  const { setSelectedMovie, setSelectedCinema, setSelectedScreening } = useBooking();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [cinemaData, movieData, screeningsData] = await Promise.all([
          cinemaApi.getCinema(Number(cinemaId)),
          tmdbApi.getMovieDetails(Number(movieId)),
          cinemaApi.getScreenings(Number(cinemaId), Number(movieId))
        ]);
        
        setCinema(cinemaData);
        setMovie(movieData);
        setScreenings(screeningsData);
        
        // Group screenings by date
        const grouped = screeningsData.reduce((acc: any, screening: any) => {
          const date = format(new Date(screening.startTime), 'yyyy-MM-dd');
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(screening);
          return acc;
        }, {});
        
        setGroupedScreenings(grouped);
        
        // Set first day as active
        const dates = Object.keys(grouped);
        if (dates.length > 0) {
          setActiveDay(dates[0]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError("Impossible de charger les séances. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };
    
    if (cinemaId && movieId) {
      fetchData();
    }
  }, [cinemaId, movieId]);

  const formatDayLabel = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) return 'Aujourd\'hui';
    if (isTomorrow(date)) return 'Demain';
    return format(date, 'EEE dd/MM', { locale: fr });
  };
  
  const handleSelectScreening = (screening: any) => {
    setSelectedMovie(movie);
    setSelectedCinema(cinema);
    setSelectedScreening(screening);
    navigate(`/booking/seats/${screening.id}`);
  };
  
  if (loading) {
    return (
      <MobileLayout>
        <div className="bg-cinema-primary min-h-screen p-4 animate-pulse">
          <div className="mb-4 h-8 w-32 bg-gray-800 rounded"></div>
          <div className="h-8 w-3/4 bg-gray-800 rounded mb-4"></div>
          <div className="h-10 bg-gray-800 rounded mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </MobileLayout>
    );
  }
  
  if (error || !cinema || !movie) {
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
            {error || "Données non trouvées"}
          </div>
        </div>
      </MobileLayout>
    );
  }
  
  const dayTabs = Object.keys(groupedScreenings).map((date) => ({
    date,
    label: formatDayLabel(date)
  }));
  
  const sortedScreenings = groupedScreenings[activeDay]?.sort((a: any, b: any) => {
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  }) || [];
  
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
          
          <h1 className="text-xl font-bold text-white mb-1">{movie.title}</h1>
          <h2 className="text-lg text-cinema-gold mb-4">{cinema.name}</h2>
          
          {dayTabs.length > 0 ? (
            <>
              <Tabs 
                defaultValue={dayTabs[0].date} 
                value={activeDay} 
                onValueChange={setActiveDay}
                className="mb-6"
              >
                <TabsList className="bg-cinema-dark w-full grid" style={{ 
                  gridTemplateColumns: `repeat(${dayTabs.length <= 5 ? dayTabs.length : 5}, 1fr)` 
                }}>
                  {dayTabs.map((tab) => (
                    <TabsTrigger 
                      key={tab.date}
                      value={tab.date}
                      className="text-xs py-2"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {dayTabs.map((tab) => (
                  <TabsContent key={tab.date} value={tab.date} className="mt-4">
                    {sortedScreenings.length > 0 ? (
                      <div className="space-y-3">
                        {sortedScreenings.map((screening: any) => (
                          <Card 
                            key={screening.id}
                            className="bg-cinema-dark border-0 p-4 text-white cursor-pointer hover:bg-gray-800 transition-colors"
                            onClick={() => handleSelectScreening(screening)}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-medium text-lg">
                                  {format(new Date(screening.startTime), 'HH:mm')}
                                </div>
                                <div className="text-xs text-gray-400">
                                  Salle {screening.roomName} • {screening.format} • {screening.language}
                                </div>
                              </div>
                              <Button 
                                size="sm"
                                className="bg-cinema-secondary hover:bg-red-700"
                              >
                                Réserver
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-gray-400">
                        Pas de séance disponible à cette date
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </>
          ) : (
            <div className="text-center text-gray-400 py-8">
              Aucune séance disponible pour ce film
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default CinemaScreeningsPage;
