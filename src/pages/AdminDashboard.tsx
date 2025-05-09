
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Users, Film, Ticket, Calendar } from 'lucide-react';

// Mock data for dashboard
const salesData = [
  { date: 'Lun', tickets: 120, snacks: 85 },
  { date: 'Mar', tickets: 150, snacks: 90 },
  { date: 'Mer', tickets: 180, snacks: 120 },
  { date: 'Jeu', tickets: 160, snacks: 100 },
  { date: 'Ven', tickets: 210, snacks: 130 },
  { date: 'Sam', tickets: 280, snacks: 180 },
  { date: 'Dim', tickets: 240, snacks: 160 }
];

const bookingsData = [
  { id: 'book-1', user: 'Jean Dupont', movie: 'Dune: Part Two', seats: 2, total: '19.00€', date: '09/05/2025' },
  { id: 'book-2', user: 'Marie Martin', movie: 'Civil War', seats: 3, total: '28.50€', date: '09/05/2025' },
  { id: 'book-3', user: 'Lucas Bernard', movie: 'The First Omen', seats: 1, total: '9.50€', date: '08/05/2025' },
  { id: 'book-4', user: 'Sophie Petit', movie: 'Godzilla x Kong', seats: 4, total: '38.00€', date: '08/05/2025' },
  { id: 'book-5', user: 'Thomas Richard', movie: 'Kung Fu Panda 4', seats: 2, total: '19.00€', date: '07/05/2025' }
];

const usersData = [
  { id: 'user-1', name: 'Jean Dupont', email: 'jean.dupont@example.com', bookings: 3, joined: '02/04/2025' },
  { id: 'user-2', name: 'Marie Martin', email: 'marie.martin@example.com', bookings: 5, joined: '15/03/2025' },
  { id: 'user-3', name: 'Lucas Bernard', email: 'lucas.bernard@example.com', bookings: 1, joined: '30/04/2025' },
  { id: 'user-4', name: 'Sophie Petit', email: 'sophie.petit@example.com', bookings: 2, joined: '10/04/2025' },
  { id: 'user-5', name: 'Thomas Richard', email: 'thomas.richard@example.com', bookings: 4, joined: '22/03/2025' }
];

const moviesData = [
  { id: 'movie-1', title: 'Dune: Part Two', bookings: 48, revenue: '456.00€', screening: 12 },
  { id: 'movie-2', title: 'Civil War', bookings: 36, revenue: '342.00€', screening: 10 },
  { id: 'movie-3', title: 'The First Omen', bookings: 24, revenue: '228.00€', screening: 8 },
  { id: 'movie-4', title: 'Godzilla x Kong', bookings: 42, revenue: '399.00€', screening: 11 },
  { id: 'movie-5', title: 'Kung Fu Panda 4', bookings: 30, revenue: '285.00€', screening: 9 }
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-cinema-dark h-screen fixed">
          <div className="p-5">
            <h1 className="text-xl font-bold text-white flex items-center">
              <span className="text-cinema-secondary mr-2">My</span>Ciné Admin
            </h1>
          </div>
          
          <nav className="mt-6">
            <SidebarLink 
              isActive={activeTab === "overview"} 
              onClick={() => setActiveTab("overview")}
              icon={<BarChart className="h-5 w-5" />}
              label="Vue d'ensemble"
            />
            
            <SidebarLink 
              isActive={activeTab === "bookings"} 
              onClick={() => setActiveTab("bookings")}
              icon={<Ticket className="h-5 w-5" />}
              label="Réservations"
            />
            
            <SidebarLink 
              isActive={activeTab === "users"} 
              onClick={() => setActiveTab("users")}
              icon={<Users className="h-5 w-5" />}
              label="Utilisateurs"
            />
            
            <SidebarLink 
              isActive={activeTab === "movies"} 
              onClick={() => setActiveTab("movies")}
              icon={<Film className="h-5 w-5" />}
              label="Films"
            />
            
            <SidebarLink 
              isActive={activeTab === "scheduling"} 
              onClick={() => setActiveTab("scheduling")}
              icon={<Calendar className="h-5 w-5" />}
              label="Programmation"
            />
          </nav>
        </div>
        
        {/* Main content */}
        <div className="ml-64 w-full">
          <div className="p-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="bookings">Réservations</TabsTrigger>
                <TabsTrigger value="users">Utilisateurs</TabsTrigger>
                <TabsTrigger value="movies">Films</TabsTrigger>
                <TabsTrigger value="scheduling">Programmation</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <h2 className="text-2xl font-bold mb-6">Tableau de bord</h2>
                
                <div className="grid grid-cols-4 gap-6 mb-8">
                  <StatCard 
                    title="Réservations"
                    value="253"
                    change="+12%"
                    trend="up"
                    icon={<Ticket className="h-6 w-6" />}
                  />
                  
                  <StatCard 
                    title="Utilisateurs"
                    value="1,284"
                    change="+8%"
                    trend="up"
                    icon={<Users className="h-6 w-6" />}
                  />
                  
                  <StatCard 
                    title="Films"
                    value="18"
                    change="0"
                    trend="neutral"
                    icon={<Film className="h-6 w-6" />}
                  />
                  
                  <StatCard 
                    title="Revenus"
                    value="9,382€"
                    change="+15%"
                    trend="up"
                    icon={<BarChart className="h-6 w-6" />}
                  />
                </div>
                
                <Card className="p-6 mb-8">
                  <h3 className="text-lg font-medium mb-4">Revenus hebdomadaires</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="tickets" name="Billets" fill="#0A1929" />
                      <Bar dataKey="snacks" name="Snacks" fill="#E50914" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
                
                <div className="grid grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h3 className="text-lg font-medium mb-4">Réservations récentes</h3>
                    <div className="space-y-4">
                      {bookingsData.slice(0, 3).map((booking) => (
                        <div key={booking.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                          <div>
                            <p className="font-medium">{booking.movie}</p>
                            <p className="text-sm text-gray-500">{booking.user}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{booking.total}</p>
                            <p className="text-sm text-gray-500">{booking.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                  
                  <Card className="p-6">
                    <h3 className="text-lg font-medium mb-4">Films populaires</h3>
                    <div className="space-y-4">
                      {moviesData.slice(0, 3).map((movie) => (
                        <div key={movie.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                          <div>
                            <p className="font-medium">{movie.title}</p>
                            <p className="text-sm text-gray-500">{movie.bookings} réservations</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{movie.revenue}</p>
                            <p className="text-sm text-gray-500">{movie.screening} séances</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="bookings">
                <h2 className="text-2xl font-bold mb-6">Gestion des réservations</h2>
                
                <Card className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2">ID</th>
                          <th className="text-left py-3 px-2">Utilisateur</th>
                          <th className="text-left py-3 px-2">Film</th>
                          <th className="text-left py-3 px-2">Sièges</th>
                          <th className="text-left py-3 px-2">Total</th>
                          <th className="text-left py-3 px-2">Date</th>
                          <th className="text-left py-3 px-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookingsData.map((booking) => (
                          <tr key={booking.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-2">{booking.id}</td>
                            <td className="py-3 px-2">{booking.user}</td>
                            <td className="py-3 px-2">{booking.movie}</td>
                            <td className="py-3 px-2">{booking.seats}</td>
                            <td className="py-3 px-2">{booking.total}</td>
                            <td className="py-3 px-2">{booking.date}</td>
                            <td className="py-3 px-2">
                              <Button variant="outline" size="sm">Voir</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="users">
                <h2 className="text-2xl font-bold mb-6">Gestion des utilisateurs</h2>
                
                <Card className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2">ID</th>
                          <th className="text-left py-3 px-2">Nom</th>
                          <th className="text-left py-3 px-2">Email</th>
                          <th className="text-left py-3 px-2">Réservations</th>
                          <th className="text-left py-3 px-2">Inscription</th>
                          <th className="text-left py-3 px-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {usersData.map((user) => (
                          <tr key={user.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-2">{user.id}</td>
                            <td className="py-3 px-2">{user.name}</td>
                            <td className="py-3 px-2">{user.email}</td>
                            <td className="py-3 px-2">{user.bookings}</td>
                            <td className="py-3 px-2">{user.joined}</td>
                            <td className="py-3 px-2">
                              <Button variant="outline" size="sm">Voir</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="movies">
                <h2 className="text-2xl font-bold mb-6">Gestion des films</h2>
                
                <Card className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2">ID</th>
                          <th className="text-left py-3 px-2">Titre</th>
                          <th className="text-left py-3 px-2">Réservations</th>
                          <th className="text-left py-3 px-2">Revenus</th>
                          <th className="text-left py-3 px-2">Séances</th>
                          <th className="text-left py-3 px-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {moviesData.map((movie) => (
                          <tr key={movie.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-2">{movie.id}</td>
                            <td className="py-3 px-2">{movie.title}</td>
                            <td className="py-3 px-2">{movie.bookings}</td>
                            <td className="py-3 px-2">{movie.revenue}</td>
                            <td className="py-3 px-2">{movie.screening}</td>
                            <td className="py-3 px-2">
                              <Button variant="outline" size="sm">Voir</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="scheduling">
                <h2 className="text-2xl font-bold mb-6">Programmation des séances</h2>
                
                <Card className="p-6 mb-6">
                  <h3 className="text-lg font-medium mb-4">Ajouter une séance</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Film</label>
                      <select className="w-full p-2 border rounded">
                        <option>Dune: Part Two</option>
                        <option>Civil War</option>
                        <option>The First Omen</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Cinéma</label>
                      <select className="w-full p-2 border rounded">
                        <option>Ciné Paradiso</option>
                        <option>MegaCiné</option>
                        <option>StarPlex</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Salle</label>
                      <select className="w-full p-2 border rounded">
                        <option>Salle 1</option>
                        <option>Salle 2</option>
                        <option>Salle 3</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Date</label>
                      <input type="date" className="w-full p-2 border rounded" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Heure</label>
                      <input type="time" className="w-full p-2 border rounded" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Format</label>
                      <select className="w-full p-2 border rounded">
                        <option>2D</option>
                        <option>3D</option>
                        <option>IMAX</option>
                      </select>
                    </div>
                  </div>
                  
                  <Button className="mt-4 bg-cinema-secondary hover:bg-red-700">
                    Ajouter la séance
                  </Button>
                </Card>
                
                <Card className="p-6">
                  <h3 className="text-lg font-medium mb-4">Séances programmées</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2">Film</th>
                          <th className="text-left py-3 px-2">Cinéma</th>
                          <th className="text-left py-3 px-2">Salle</th>
                          <th className="text-left py-3 px-2">Date</th>
                          <th className="text-left py-3 px-2">Heure</th>
                          <th className="text-left py-3 px-2">Format</th>
                          <th className="text-left py-3 px-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="py-3 px-2">Dune: Part Two</td>
                          <td className="py-3 px-2">Ciné Paradiso</td>
                          <td className="py-3 px-2">Salle 1</td>
                          <td className="py-3 px-2">10/05/2025</td>
                          <td className="py-3 px-2">18:30</td>
                          <td className="py-3 px-2">2D</td>
                          <td className="py-3 px-2">
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">Modifier</Button>
                              <Button variant="destructive" size="sm">Supprimer</Button>
                            </div>
                          </td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="py-3 px-2">Civil War</td>
                          <td className="py-3 px-2">MegaCiné</td>
                          <td className="py-3 px-2">Salle 3</td>
                          <td className="py-3 px-2">10/05/2025</td>
                          <td className="py-3 px-2">20:15</td>
                          <td className="py-3 px-2">IMAX</td>
                          <td className="py-3 px-2">
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">Modifier</Button>
                              <Button variant="destructive" size="sm">Supprimer</Button>
                            </div>
                          </td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="py-3 px-2">Kung Fu Panda 4</td>
                          <td className="py-3 px-2">StarPlex</td>
                          <td className="py-3 px-2">Salle 2</td>
                          <td className="py-3 px-2">11/05/2025</td>
                          <td className="py-3 px-2">15:00</td>
                          <td className="py-3 px-2">3D</td>
                          <td className="py-3 px-2">
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">Modifier</Button>
                              <Button variant="destructive" size="sm">Supprimer</Button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

const SidebarLink = ({ 
  isActive, 
  onClick, 
  icon, 
  label 
}: { 
  isActive: boolean; 
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) => (
  <button
    className={`w-full flex items-center py-3 px-5 ${
      isActive 
        ? 'bg-gray-800 text-cinema-secondary' 
        : 'text-gray-300 hover:bg-gray-800 hover:text-gray-100'
    }`}
    onClick={onClick}
  >
    {React.cloneElement(icon as React.ReactElement, { className: "mr-3 h-5 w-5" })}
    <span>{label}</span>
  </button>
);

const StatCard = ({ 
  title, 
  value, 
  change, 
  trend,
  icon 
}: {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
}) => {
  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'text-green-500';
    if (trend === 'down') return 'text-red-500';
    return 'text-gray-500';
  };
  
  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="p-2 bg-gray-100 rounded-full">
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold mb-2">{value}</p>
      <p className={`text-sm ${getTrendColor(trend)}`}>
        {change}
        {trend === 'up' && ' ↑'}
        {trend === 'down' && ' ↓'}
      </p>
    </Card>
  );
};

export default AdminDashboard;
