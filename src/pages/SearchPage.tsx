
import React, { useState } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { tmdbApi } from '@/services/api';
import MovieList from '@/components/movies/MovieList';
import { Button } from '@/components/ui/button';

const SearchPage = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  
  const handleSearch = async () => {
    if (!query.trim()) return;
    
    try {
      setIsLoading(true);
      setHasSearched(true);
      const searchResults = await tmdbApi.searchMovies(query);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClear = () => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
  };
  
  return (
    <MobileLayout>
      <div className="bg-cinema-primary min-h-screen">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-white mb-6">Recherche</h1>
          
          <div className="relative">
            <Input 
              type="text"
              placeholder="Rechercher un film..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="bg-gray-800 text-white border-gray-700 pl-10 pr-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            
            {query && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClear}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-gray-400"
              >
                <X size={16} />
              </Button>
            )}
          </div>
          
          <Button
            onClick={handleSearch}
            disabled={!query.trim() || isLoading}
            className="w-full mt-4 bg-cinema-secondary hover:bg-red-700"
          >
            {isLoading ? 'Recherche en cours...' : 'Rechercher'}
          </Button>
        </div>
        
        {isLoading ? (
          <div className="p-4">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex space-x-4">
                  <div className="rounded-lg bg-gray-800 h-32 w-24"></div>
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-800 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : hasSearched ? (
          results.length > 0 ? (
            <MovieList 
              title={`Résultats pour "${query}"`} 
              movies={results} 
              horizontal={false}
              movieSize="medium"
            />
          ) : (
            <div className="p-4 text-center">
              <p className="text-gray-400">Aucun résultat trouvé pour "{query}"</p>
              <p className="text-sm text-gray-500 mt-2">Essayez avec des termes différents</p>
            </div>
          )
        ) : (
          <div className="p-4 text-center">
            <p className="text-gray-400">Recherchez un film par titre</p>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default SearchPage;
