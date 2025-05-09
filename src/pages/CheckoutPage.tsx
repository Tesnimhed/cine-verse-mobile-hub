
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import MobileLayout from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CreditCard, Banknote } from 'lucide-react';
import { useBooking } from '@/contexts/BookingContext';

const CheckoutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  const navigate = useNavigate();
  const { 
    selectedMovie, 
    selectedCinema, 
    selectedScreening, 
    selectedSeats, 
    selectedSnacks, 
    totalAmount,
    completeBooking
  } = useBooking();
  
  if (!selectedMovie || !selectedCinema || !selectedScreening || selectedSeats.length === 0) {
    navigate('/');
    return null;
  }
  
  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      const booking = await completeBooking();
      navigate(`/booking/confirmation/${booking.id}`);
    } catch (error) {
      console.error('Error completing booking:', error);
      setIsProcessing(false);
    }
  };
  
  const screeningDate = selectedScreening
    ? format(new Date(selectedScreening.startTime), 'EEEE d MMMM à HH:mm', { locale: fr })
    : '';
  
  const seatPrice = selectedSeats.reduce((total, seat) => total + seat.price, 0);
  const snackPrice = selectedSnacks.reduce((total, snack) => total + (snack.price * snack.quantity), 0);
  
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
          
          <h1 className="text-xl font-bold text-white mb-6">Finaliser votre commande</h1>
          
          <div className="space-y-6 mb-8">
            <div className="bg-cinema-dark p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-white mb-3">Récapitulatif</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-white font-medium">{selectedMovie.title}</p>
                  <p className="text-sm text-gray-400">{selectedCinema.name} • {screeningDate}</p>
                  <p className="text-xs text-gray-400">{selectedScreening.roomName} • {selectedScreening.format} • {selectedScreening.language}</p>
                </div>
                
                <div className="border-t border-gray-800 pt-3">
                  <p className="text-white font-medium">Sièges ({selectedSeats.length})</p>
                  <p className="text-sm text-gray-400">
                    {selectedSeats.map(seat => seat.id).join(', ')}
                  </p>
                </div>
                
                {selectedSnacks.length > 0 && (
                  <div className="border-t border-gray-800 pt-3">
                    <p className="text-white font-medium">Snacks et boissons</p>
                    {selectedSnacks.map((snack) => (
                      <p key={snack.id} className="text-sm text-gray-400">
                        {snack.name} x{snack.quantity}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-cinema-dark p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-white mb-3">Paiement</h2>
              
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                <div className="flex items-center space-x-2 bg-gray-800 p-3 rounded">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center text-white cursor-pointer">
                    <CreditCard size={18} className="mr-2" />
                    Carte bancaire
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 bg-gray-800 p-3 rounded">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="flex items-center text-white cursor-pointer">
                    <Banknote size={18} className="mr-2" />
                    Payer sur place
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <div className="bg-cinema-dark p-4 rounded-lg mb-24">
            <h2 className="text-lg font-semibold text-white mb-3">Détails du prix</h2>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Billets ({selectedSeats.length})</span>
                <span className="text-white">{seatPrice.toFixed(2)}€</span>
              </div>
              
              {snackPrice > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Snacks et boissons</span>
                  <span className="text-white">{snackPrice.toFixed(2)}€</span>
                </div>
              )}
              
              <div className="border-t border-gray-800 pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-cinema-gold">{totalAmount.toFixed(2)}€</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="fixed bottom-16 left-0 right-0 bg-cinema-dark border-t border-gray-800 p-4 shadow-lg">
          <Button 
            className="w-full bg-cinema-secondary hover:bg-red-700"
            disabled={isProcessing}
            onClick={handleCheckout}
          >
            {isProcessing ? 'Traitement en cours...' : 'Payer'}
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default CheckoutPage;
