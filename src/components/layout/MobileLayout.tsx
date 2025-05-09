
import React, { ReactNode } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Home, Ticket, User, Search } from "lucide-react";
import { NavLink } from "react-router-dom";

interface MobileLayoutProps {
  children: ReactNode;
  hideNavigation?: boolean;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ 
  children, 
  hideNavigation = false 
}) => {
  return (
    <div className="flex flex-col h-screen bg-cinema-primary">
      <main className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="pb-16">
            {children}
          </div>
        </ScrollArea>
      </main>
      
      {!hideNavigation && (
        <div className="fixed bottom-0 left-0 right-0 bg-cinema-dark border-t border-cinema-primary shadow-lg">
          <nav className="flex justify-around items-center py-2">
            <NavLink 
              to="/" 
              className={({ isActive }) => `flex flex-col items-center p-2 ${isActive ? 'text-cinema-secondary' : 'text-gray-400'}`}
              end
            >
              <Home size={20} />
              <span className="text-xs mt-1">Accueil</span>
            </NavLink>
            
            <NavLink 
              to="/search" 
              className={({ isActive }) => `flex flex-col items-center p-2 ${isActive ? 'text-cinema-secondary' : 'text-gray-400'}`}
            >
              <Search size={20} />
              <span className="text-xs mt-1">Recherche</span>
            </NavLink>
            
            <NavLink 
              to="/bookings" 
              className={({ isActive }) => `flex flex-col items-center p-2 ${isActive ? 'text-cinema-secondary' : 'text-gray-400'}`}
            >
              <Ticket size={20} />
              <span className="text-xs mt-1">Billets</span>
            </NavLink>
            
            <NavLink 
              to="/profile" 
              className={({ isActive }) => `flex flex-col items-center p-2 ${isActive ? 'text-cinema-secondary' : 'text-gray-400'}`}
            >
              <User size={20} />
              <span className="text-xs mt-1">Profil</span>
            </NavLink>
          </nav>
        </div>
      )}
    </div>
  );
};

export default MobileLayout;
