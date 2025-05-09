
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MobileLayout from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { tmdbApi, cinemaApi } from '@/services/api';
import { useBooking } from '@/contexts/BookingContext';
import { ArrowLeft, Star, Clock, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const MovieDetailPage = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cinemas, setCinemas] = useState<any[]>([]);
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setSelectedMovie } = useBooking();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [movieDetails, cinemasList] = await Promise.all([
          tmdbApi.getMovieDetails(Number(movieId)),
          cinemaApi.getCinemas()
        ]);
        
        setMovie(movieDetails);
        setCinemas(cinemasList);
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError("Impossible de charger les détails du film. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };
    
    if (movieId) {
      fetchData();
    }
  }, [movieId]);

  const handleSelectCinema = (cinema: any) => {
    setSelectedMovie(movie);
    navigate(`/cinema/${cinema.id}/movie/${movieId}`);
  };
  
  if (loading) {
    return (
      <MobileLayout>
        <div className="bg-cinema-primary min-h-screen p-4 animate-pulse">
          <div className="mb-4 h-8 w-32 bg-gray-800 rounded"></div>
          <div className="h-72 bg-gray-800 rounded-lg mb-4"></div>
          <div className="h-8 w-3/4 bg-gray-800 rounded mb-2"></div>
          <div className="h-4 w-1/2 bg-gray-800 rounded mb-4"></div>
          <div className="h-24 bg-gray-800 rounded mb-6"></div>
          <div className="h-12 bg-gray-800 rounded"></div>
        </div>
      </MobileLayout>
    );
  }
  
  if (error || !movie) {
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
            {error || "Film non trouvé"}
          </div>
        </div>
      </MobileLayout>
    );
  }
  
  const backdropUrl = movie.backdrop_path 
    ? tmdbApi.getImageUrl(movie.backdrop_path, 'w780')
    : movie.poster_path 
      ? tmdbApi.getImageUrl(movie.poster_path, 'w780')
      : '/placeholder.svg';
  
  const releaseDate = movie.release_date 
    ? new Date(movie.release_date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Date inconnue';
  
  const runtime = movie.runtime 
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}min`
    : 'Durée inconnue';
  
  return (
    <MobileLayout>
      <div className="bg-cinema-primary min-h-screen">
        {/* Header with backdrop */}
        <div className="relative h-72">
          <div className="absolute top-0 left-0 p-4 z-10">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="bg-black bg-opacity-50 text-white rounded-full h-10 w-10 p-0"
            >
              <ArrowLeft size={18} />
            </Button>
          </div>
          <img 
            src={backdropUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cinema-primary to-transparent h-24"></div>
        </div>
        
        {/* Movie info */}
        <div className="p-4 -mt-10 relative">
          <h1 className="text-2xl font-bold text-white mb-1">{movie.title}</h1>
          
          <div className="flex items-center text-sm text-gray-400 mb-4">
            <div className="flex items-center mr-4">
              <Star size={16} className="text-cinema-gold mr-1" />
              <span>{movie.vote_average.toFixed(1)}/10</span>
            </div>
            <div className="flex items-center mr-4">
              <Clock size={16} className="mr-1" />
              <span>{runtime}</span>
            </div>
            <div className="flex items-center">
              <Calendar size={16} className="mr-1" />
              <span>{releaseDate}</span>
            </div>
          </div>
          
          {movie.genres && movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres.map((genre: any) => (
                <span 
                  key={genre.id}
                  className="bg-cinema-dark text-xs text-gray-300 px-2 py-1 rounded-full"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-2">Synopsis</h2>
            <p className="text-gray-300 text-sm">
              {movie.overview || "Aucun synopsis disponible."}
            </p>
          </div>
          
          {/* Cinemas selection */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-white mb-3">Choisir un cinéma</h2>
            
            {!user ? (
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <p className="text-gray-300 mb-3">Connectez-vous pour voir les séances et réserver</p>
                <Button 
                  onClick={() => navigate('/auth')}
                  className="bg-cinema-secondary hover:bg-red-700"
                >
                  Se connecter
                </Button>
              </div>
            ) : cinemas.length > 0 ? (
              <div className="space-y-3">
                {cinemas.map((cinema) => (
                  <Button 
                    key={cinema.id}
                    onClick={() => handleSelectCinema(cinema)}
                    className="w-full justify-start bg-cinema-dark hover:bg-gray-800 text-white"
                  >
                    <div className="text-left">
                      <div className="font-medium">{cinema.name}</div>
                      <div className="text-xs text-gray-400">{cinema.address}</div>
                    </div>
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center">Aucun cinéma disponible</p>
            )}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default MovieDetailPage;
