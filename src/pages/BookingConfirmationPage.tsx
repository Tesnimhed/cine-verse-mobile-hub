
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MobileLayout from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import QRCode from '../components/QRCode';

const BookingConfirmationPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  
  return (
    <MobileLayout>
      <div className="bg-cinema-primary min-h-screen flex flex-col items-center justify-center p-6">
        <div className="bg-cinema-dark rounded-lg p-6 w-full max-w-md text-center">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white">Réservation confirmée!</h1>
            <p className="text-gray-400 mt-2">Votre réservation a été enregistrée avec succès</p>
          </div>
          
          <div className="bg-black bg-opacity-20 p-4 rounded-lg mb-6">
            <p className="text-white font-medium">Référence</p>
            <p className="text-cinema-gold font-bold text-xl">{bookingId}</p>
          </div>
          
          <div className="mb-6">
            <QRCode value={bookingId || ''} />
            <p className="text-xs text-gray-400 mt-2">Présentez ce code lors de votre arrivée</p>
          </div>
          
          <div className="space-y-4">
            <Button 
              className="w-full bg-cinema-secondary hover:bg-red-700"
              onClick={() => navigate('/bookings')}
            >
              Voir mes réservations
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full border-gray-600 text-white hover:bg-gray-800"
              onClick={() => navigate('/')}
            >
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default BookingConfirmationPage;
