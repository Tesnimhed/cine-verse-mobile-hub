
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LogOut, 
  User, 
  Ticket, 
  CreditCard, 
  Settings,
  ChevronRight,
  Heart
} from 'lucide-react';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };
  
  if (!user) {
    navigate('/auth');
    return null;
  }
  
  return (
    <MobileLayout>
      <div className="bg-cinema-primary min-h-screen">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-white mb-6">Mon profil</h1>
          
          <div className="bg-cinema-dark rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full bg-cinema-secondary flex items-center justify-center text-white text-xl font-bold mr-4">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">{user.name}</h2>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <SectionTitle title="Compte" />
            
            <MenuButton 
              icon={<User size={20} />}
              label="Informations personnelles"
              onClick={() => {}}
            />
            
            <MenuButton 
              icon={<Ticket size={20} />}
              label="Mes réservations"
              onClick={() => navigate('/bookings')}
            />
            
            <MenuButton 
              icon={<CreditCard size={20} />}
              label="Moyens de paiement"
              onClick={() => {}}
            />
            
            <MenuButton 
              icon={<Heart size={20} />}
              label="Mes favoris"
              onClick={() => {}}
            />
            
            <SectionTitle title="Préférences" />
            
            <MenuButton 
              icon={<Settings size={20} />}
              label="Paramètres"
              onClick={() => {}}
            />
            
            <SectionTitle title="Autres" />
            
            <Button 
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start text-red-500 hover:text-red-400 hover:bg-gray-800"
            >
              <LogOut size={20} className="mr-3" />
              Se déconnecter
            </Button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

const SectionTitle = ({ title }: { title: string }) => (
  <h2 className="text-sm font-medium text-gray-400 pt-2">{title}</h2>
);

const MenuButton = ({ 
  icon, 
  label, 
  onClick 
}: { 
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) => (
  <Button 
    variant="ghost"
    onClick={onClick}
    className="w-full justify-between text-white hover:bg-gray-800"
  >
    <span className="flex items-center">
      {React.cloneElement(icon as React.ReactElement, { className: "mr-3" })}
      {label}
    </span>
    <ChevronRight size={16} />
  </Button>
);

export default ProfilePage;
