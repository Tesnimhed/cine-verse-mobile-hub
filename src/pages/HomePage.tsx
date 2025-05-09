
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/layout/MobileLayout';
import MovieList from '@/components/movies/MovieList';
import { tmdbApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Search } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

const HomePage = () => {
  const [trendingMovies, setTrendingMovies] = useState<any[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<any[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const [trending, nowPlaying, upcoming] = await Promise.all([
          tmdbApi.getTrendingMovies(),
          tmdbApi.getNowPlayingMovies(),
          tmdbApi.getUpcomingMovies()
        ]);
        
        setTrendingMovies(trending);
        setNowPlayingMovies(nowPlaying);
        setUpcomingMovies(upcoming);
        setError(null);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError("Impossible de charger les films. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovies();
  }, []);

  return (
    <MobileLayout>
      <div className="bg-cinema-primary">
        <div className="p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">MyCiné</h1>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/search')}
            className="text-white"
          >
            <Search size={20} />
          </Button>
        </div>
        
        <div className="px-4 pb-4">
          <div className="bg-gradient-to-r from-cinema-secondary to-red-800 rounded-lg p-4 shadow-lg">
            <h2 className="text-white font-bold mb-2">
              {user ? `Bienvenue, ${user.name}!` : 'Bienvenue sur MyCiné!'}
            </h2>
            <p className="text-white text-sm mb-3">
              {user 
                ? 'Découvrez les dernières sorties et réservez vos places en quelques clics.'
                : 'Connectez-vous pour profiter de toutes les fonctionnalités et réserver vos places.'}
            </p>
            {!user && (
              <Button 
                className="bg-white text-cinema-secondary hover:bg-gray-100"
                onClick={() => navigate('/auth')}
              >
                Se connecter
              </Button>
            )}
          </div>
        </div>
        
        {loading ? (
          <div className="p-4 space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-6 bg-gray-800 rounded w-1/3 mb-4"></div>
                <div className="flex space-x-4">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="w-32 h-48 bg-gray-800 rounded-lg"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-4 text-red-500">
            {error}
          </div>
        ) : (
          <>
            <MovieList 
              title="Tendances" 
              movies={trendingMovies} 
              horizontal
              movieSize="medium"
            />
            
            <MovieList 
              title="À l'affiche" 
              movies={nowPlayingMovies} 
              horizontal
              movieSize="medium"
            />
            
            <MovieList 
              title="Prochainement" 
              movies={upcomingMovies} 
              horizontal
              movieSize="medium"
            />
          </>
        )}
      </div>
    </MobileLayout>
  );
};

export default HomePage;
