
import React from 'react';
import { Card } from "@/components/ui/card";
import { tmdbApi } from '@/services/api';
import { Link } from 'react-router-dom';

interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
    release_date: string;
  };
  size?: 'small' | 'medium' | 'large';
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, size = 'medium' }) => {
  const imageSizes = {
    small: 'w-32',
    medium: 'w-44',
    large: 'w-full max-w-xs',
  };
  
  const posterUrl = movie.poster_path 
    ? tmdbApi.getImageUrl(movie.poster_path, size === 'large' ? 'w500' : 'w342')
    : '/placeholder.svg';
  
  const releaseDate = movie.release_date 
    ? new Date(movie.release_date).toLocaleDateString('fr-FR', { year: 'numeric' })
    : 'À venir';
    
  const voteAverage = movie.vote_average 
    ? Math.round(movie.vote_average * 10) / 10
    : '-';

  return (
    <Link to={`/movie/${movie.id}`}>
      <Card className={`rounded-lg overflow-hidden bg-cinema-dark text-white border-0 transform transition-transform hover:scale-105 ${imageSizes[size]} shadow-md`}>
        <div className="relative">
          <img 
            src={posterUrl} 
            alt={movie.title} 
            className="w-full h-auto object-cover"
          />
          
          {size !== 'small' && (
            <div className="absolute top-2 right-2 bg-cinema-secondary text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center">
              {voteAverage}
            </div>
          )}
        </div>
        
        {size !== 'small' && (
          <div className="p-2 text-center">
            <h3 className="font-semibold text-sm line-clamp-2">{movie.title}</h3>
            <p className="text-xs text-gray-400 mt-1">{releaseDate}</p>
          </div>
        )}
      </Card>
    </Link>
  );
};

export default MovieCard;
