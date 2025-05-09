
import React from 'react';
import MovieCard from './MovieCard';
import { ScrollArea } from "@/components/ui/scroll-area";

interface MovieListProps {
  title: string;
  movies: any[];
  loading?: boolean;
  error?: string | null;
  horizontal?: boolean;
  movieSize?: 'small' | 'medium' | 'large';
}

const MovieList: React.FC<MovieListProps> = ({ 
  title, 
  movies, 
  loading = false, 
  error = null,
  horizontal = true,
  movieSize = 'medium'
}) => {
  if (loading) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4 text-white">{title}</h2>
        <div className="flex space-x-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-44 h-64 bg-gray-800 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4 text-white">{title}</h2>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4 text-white">{title}</h2>
        <div className="text-gray-400">Aucun film disponible</div>
      </div>
    );
  }

  if (horizontal) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4 text-white">{title}</h2>
        <ScrollArea className="pb-2">
          <div className="flex space-x-4 pb-4 pr-4 cinema-scrollbar">
            {movies.map((movie) => (
              <div key={movie.id} className="shrink-0">
                <MovieCard movie={movie} size={movieSize} />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4 text-white">{title}</h2>
      <div className="grid grid-cols-2 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} size={movieSize} />
        ))}
      </div>
    </div>
  );
};

export default MovieList;
