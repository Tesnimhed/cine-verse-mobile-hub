
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { snackApi } from '@/services/api';
import { useBooking } from '@/contexts/BookingContext';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SnackSelectionPage = () => {
  const [snacks, setSnacks] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { selectedSnacks, addSnack, updateSnackQuantity, removeSnack, selectedMovie, totalAmount } = useBooking();
  
  useEffect(() => {
    if (!selectedMovie) {
      navigate('/');
      return;
    }
    
    const fetchSnacks = async () => {
      try {
        setLoading(true);
        const snacksData = await snackApi.getSnacks();
        setSnacks(snacksData);
        
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(snacksData.map((snack: any) => snack.category)));
        setCategories(uniqueCategories as string[]);
      } catch (err) {
        console.error('Error fetching snacks:', err);
        setError("Impossible de charger les produits. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchSnacks();
  }, [navigate, selectedMovie]);

  const handleUpdateQuantity = (snack: any, change: number) => {
    const existingSnack = selectedSnacks.find(s => s.id === snack.id);
    if (existingSnack) {
      const newQuantity = existingSnack.quantity + change;
      if (newQuantity <= 0) {
        removeSnack(snack.id);
      } else {
        updateSnackQuantity(snack.id, newQuantity);
      }
    } else if (change > 0) {
      addSnack(snack);
    }
  };
  
  const getSnackQuantity = (snackId: number) => {
    const snack = selectedSnacks.find(s => s.id === snackId);
    return snack ? snack.quantity : 0;
  };
  
  if (loading) {
    return (
      <MobileLayout>
        <div className="bg-cinema-primary min-h-screen p-4 animate-pulse">
          <div className="mb-4 h-8 w-32 bg-gray-800 rounded"></div>
          <div className="h-10 bg-gray-800 rounded mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-800 rounded"></div>
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
          
          <h1 className="text-xl font-bold text-white mb-6">Ajoutez des snacks</h1>
          
          <Tabs defaultValue={categories[0]} className="mb-24">
            <TabsList className="bg-cinema-dark grid mb-6" style={{ 
              gridTemplateColumns: `repeat(${categories.length <= 4 ? categories.length : 4}, 1fr)` 
            }}>
              {categories.map((category) => (
                <TabsTrigger 
                  key={category}
                  value={category}
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {categories.map((category) => (
              <TabsContent key={category} value={category}>
                <div className="space-y-4">
                  {snacks
                    .filter((snack) => snack.category === category)
                    .map((snack) => (
                      <Card key={snack.id} className="bg-cinema-dark border-0">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-16 h-16 bg-gray-800 rounded overflow-hidden mr-3 shrink-0">
                              <img 
                                src={snack.image || '/placeholder.svg'} 
                                alt={snack.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/placeholder.svg';
                                }}
                              />
                            </div>
                            <div>
                              <h3 className="font-medium text-white">{snack.name}</h3>
                              <p className="text-cinema-gold">{snack.price.toFixed(2)}€</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            {getSnackQuantity(snack.id) > 0 ? (
                              <>
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="h-8 w-8 rounded-full border-gray-700"
                                  onClick={() => handleUpdateQuantity(snack, -1)}
                                >
                                  -
                                </Button>
                                <span className="mx-3 text-white">
                                  {getSnackQuantity(snack.id)}
                                </span>
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="h-8 w-8 rounded-full border-gray-700"
                                  onClick={() => handleUpdateQuantity(snack, 1)}
                                >
                                  +
                                </Button>
                              </>
                            ) : (
                              <Button 
                                variant="outline"
                                className="text-cinema-gold border-cinema-gold hover:text-white hover:bg-cinema-gold"
                                onClick={() => handleUpdateQuantity(snack, 1)}
                              >
                                Ajouter
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
        
        <div className="fixed bottom-16 left-0 right-0 bg-cinema-dark border-t border-gray-800 p-4 shadow-lg">
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-white font-medium">Total</p>
              <p className="text-xs text-gray-400">
                {selectedSnacks.reduce((total, snack) => total + snack.quantity, 0)} articles
              </p>
            </div>
            <p className="text-cinema-gold text-xl font-bold">{totalAmount.toFixed(2)}€</p>
          </div>
          
          <Button 
            className="w-full bg-cinema-secondary hover:bg-red-700"
            onClick={() => navigate('/booking/checkout')}
          >
            Continuer
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default SnackSelectionPage;
