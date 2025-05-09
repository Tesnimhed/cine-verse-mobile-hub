import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from '@/components/ui/card';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
import { Users, Film, Ticket, Calendar, Edit, Trash2, UserX, UserCheck, Menu, ChevronRight, ChevronLeft } from 'lucide-react';

import { userApi, screeningApi } from '../services/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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

const moviesData = [
  { id: 'movie-1', title: 'Dune: Part Two', bookings: 48, revenue: '456.00€', screening: 12 },
  { id: 'movie-2', title: 'Civil War', bookings: 36, revenue: '342.00€', screening: 10 },
  { id: 'movie-3', title: 'The First Omen', bookings: 24, revenue: '228.00€', screening: 8 },
  { id: 'movie-4', title: 'Godzilla x Kong', bookings: 42, revenue: '399.00€', screening: 11 },
  { id: 'movie-5', title: 'Kung Fu Panda 4', bookings: 30, revenue: '285.00€', screening: 9 }
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [screeningDetails, setScreeningDetails] = useState({
    id: '',
    startTime: '',
    endTime: '',
    format: '',
    language: ''
  });
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);
  const [isBlockUserDialogOpen, setIsBlockUserDialogOpen] = useState(false);
  const [isEditScreeningDialogOpen, setIsEditScreeningDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedScreening, setSelectedScreening] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab]);
  
  const fetchUsers = async () => {
    try {
      const userData = await userApi.getAllUsers();
      setUsers(userData);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer la liste des utilisateurs",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteUser = async (userId) => {
    try {
      await userApi.deleteUser(userId);
      setUsers(users.filter(user => user._id !== userId));
      setIsDeleteUserDialogOpen(false);
      toast({
        title: "Succès",
        description: "L'utilisateur a été supprimé avec succès"
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'utilisateur",
        variant: "destructive"
      });
    }
  };
  
  const handleToggleBlockUser = async (userId, blocked) => {
    try {
      await userApi.toggleBlockUser(userId, blocked);
      setUsers(users.map(user => 
        user._id === userId ? { ...user, blocked } : user
      ));
      setIsBlockUserDialogOpen(false);
      toast({
        title: "Succès",
        description: blocked ? "L'utilisateur a été bloqué avec succès" : "L'utilisateur a été débloqué avec succès"
      });
    } catch (error) {
      console.error('Erreur lors du changement de statut de l\'utilisateur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut de l'utilisateur",
        variant: "destructive"
      });
    }
  };
  
  const handleUpdateScreening = async (screeningId) => {
    try {
      // Format dates correctly for backend
      const formattedData = {
        ...screeningDetails,
        startTime: new Date(screeningDetails.startTime).toISOString(),
        endTime: new Date(screeningDetails.endTime).toISOString()
      };
      
      await screeningApi.updateScreening(screeningId, formattedData);
      setIsEditScreeningDialogOpen(false);
      toast({
        title: "Succès",
        description: "La séance a été mise à jour avec succès"
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la séance:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la séance",
        variant: "destructive"
      });
    }
  };
  
  const handleOpenEditScreening = async (screening) => {
    try {
      const screeningData = await screeningApi.getScreeningDetails(screening.id);
      
      // Format dates for form inputs
      const startDateTime = new Date(screeningData.startTime);
      const endDateTime = new Date(screeningData.endTime);
      
      const formatDateForInput = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };
      
      setScreeningDetails({
        id: screeningData._id,
        startTime: formatDateForInput(startDateTime),
        endTime: formatDateForInput(endDateTime),
        format: screeningData.format,
        language: screeningData.language
      });
      
      setSelectedScreening(screeningData);
      setIsEditScreeningDialogOpen(true);
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de la séance:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les détails de la séance",
        variant: "destructive"
      });
    }
  };
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-cinema-dark h-screen fixed transition-all duration-300 ease-in-out`}>
          <div className="p-5 flex justify-between items-center">
            {!sidebarCollapsed && (
              <h1 className="text-xl font-bold text-white flex items-center">
                <span className="text-cinema-secondary mr-2">My</span>Ciné Admin
              </h1>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="text-white hover:bg-gray-800"
            >
              {sidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
            </Button>
          </div>
          
          <nav className="mt-6">
            <SidebarLink 
              isActive={activeTab === "overview"} 
              onClick={() => setActiveTab("overview")}
              icon={<BarChart className="h-5 w-5" />}
              label="Vue d'ensemble"
              collapsed={sidebarCollapsed}
            />
            
            <SidebarLink 
              isActive={activeTab === "bookings"} 
              onClick={() => setActiveTab("bookings")}
              icon={<Ticket className="h-5 w-5" />}
              label="Réservations"
              collapsed={sidebarCollapsed}
            />
            
            <SidebarLink 
              isActive={activeTab === "users"} 
              onClick={() => setActiveTab("users")}
              icon={<Users className="h-5 w-5" />}
              label="Utilisateurs"
              collapsed={sidebarCollapsed}
            />
            
            <SidebarLink 
              isActive={activeTab === "movies"} 
              onClick={() => setActiveTab("movies")}
              icon={<Film className="h-5 w-5" />}
              label="Films"
              collapsed={sidebarCollapsed}
            />
            
            <SidebarLink 
              isActive={activeTab === "scheduling"} 
              onClick={() => setActiveTab("scheduling")}
              icon={<Calendar className="h-5 w-5" />}
              label="Programmation"
              collapsed={sidebarCollapsed}
            />
          </nav>
        </div>
        
        {/* Main content */}
        <div className={`${sidebarCollapsed ? 'ml-16' : 'ml-64'} w-full transition-all duration-300 ease-in-out`}>
          <div className="p-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              {/* Mobile sidebar trigger */}
              <div className="md:hidden mb-4">
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent className="bg-cinema-dark text-white">
                    <div className="p-4">
                      <h2 className="text-lg font-bold mb-4">Menu Admin</h2>
                      <div className="flex flex-col space-y-2">
                        <Button variant="ghost" className="justify-start" onClick={() => setActiveTab("overview")}>
                          <BarChart className="h-5 w-5 mr-2" />
                          Vue d'ensemble
                        </Button>
                        <Button variant="ghost" className="justify-start" onClick={() => setActiveTab("bookings")}>
                          <Ticket className="h-5 w-5 mr-2" />
                          Réservations
                        </Button>
                        <Button variant="ghost" className="justify-start" onClick={() => setActiveTab("users")}>
                          <Users className="h-5 w-5 mr-2" />
                          Utilisateurs
                        </Button>
                        <Button variant="ghost" className="justify-start" onClick={() => setActiveTab("movies")}>
                          <Film className="h-5 w-5 mr-2" />
                          Films
                        </Button>
                        <Button variant="ghost" className="justify-start" onClick={() => setActiveTab("scheduling")}>
                          <Calendar className="h-5 w-5 mr-2" />
                          Programmation
                        </Button>
                      </div>
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>

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
                          <th className="text-left py-3 px-2">Rôle</th>
                          <th className="text-left py-3 px-2">Statut</th>
                          <th className="text-left py-3 px-2">Inscription</th>
                          <th className="text-left py-3 px-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user._id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-2">{user._id}</td>
                            <td className="py-3 px-2">{user.name}</td>
                            <td className="py-3 px-2">{user.email}</td>
                            <td className="py-3 px-2">
                              <span className={`px-2 py-1 rounded text-xs ${
                                user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
                              }`}>
                                {user.role === 'admin' ? 'Admin' : 'Utilisateur'}
                              </span>
                            </td>
                            <td className="py-3 px-2">
                              <span className={`px-2 py-1 rounded text-xs ${
                                user.blocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {user.blocked ? 'Bloqué' : 'Actif'}
                              </span>
                            </td>
                            <td className="py-3 px-2">
                              {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                            </td>
                            <td className="py-3 px-2">
                              <div className="flex space-x-2">
                                {user.role !== 'admin' && (
                                  <>
                                    {user.blocked ? (
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => {
                                          setSelectedUser(user);
                                          setIsBlockUserDialogOpen(true);
                                        }}
                                      >
                                        <UserCheck className="h-4 w-4 mr-1" />
                                        Débloquer
                                      </Button>
                                    ) : (
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => {
                                          setSelectedUser(user);
                                          setIsBlockUserDialogOpen(true);
                                        }}
                                      >
                                        <UserX className="h-4 w-4 mr-1" />
                                        Bloquer
                                      </Button>
                                    )}
                                    <Button 
                                      variant="destructive" 
                                      size="sm"
                                      onClick={() => {
                                        setSelectedUser(user);
                                        setIsDeleteUserDialogOpen(true);
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4 mr-1" />
                                      Supprimer
                                    </Button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
                
                {/* Confirmation dialog for user deletion */}
                <Dialog open={isDeleteUserDialogOpen} onOpenChange={setIsDeleteUserDialogOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirmer la suppression</DialogTitle>
                      <DialogDescription>
                        Êtes-vous sûr de vouloir supprimer l'utilisateur {selectedUser?.name} ? Cette action est irréversible.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Annuler</Button>
                      </DialogClose>
                      <Button 
                        variant="destructive"
                        onClick={() => handleDeleteUser(selectedUser?._id)}
                      >
                        Supprimer
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                {/* Confirmation dialog for blocking/unblocking user */}
                <Dialog open={isBlockUserDialogOpen} onOpenChange={setIsBlockUserDialogOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {selectedUser?.blocked ? 'Débloquer l\'utilisateur' : 'Bloquer l\'utilisateur'}
                      </DialogTitle>
                      <DialogDescription>
                        {selectedUser?.blocked 
                          ? `Êtes-vous sûr de vouloir débloquer l'utilisateur ${selectedUser?.name} ?`
                          : `Êtes-vous sûr de vouloir bloquer l'utilisateur ${selectedUser?.name} ? Il ne pourra plus se connecter à son compte.`}
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Annuler</Button>
                      </DialogClose>
                      <Button 
                        variant={selectedUser?.blocked ? "default" : "destructive"}
                        onClick={() => handleToggleBlockUser(selectedUser?._id, !selectedUser?.blocked)}
                      >
                        {selectedUser?.blocked ? 'Débloquer' : 'Bloquer'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleOpenEditScreening({
                                  id: 'screening-1', 
                                  film: 'Dune: Part Two',
                                  cinema: 'Ciné Paradiso',
                                  salle: 'Salle 1'
                                })}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Modifier
                              </Button>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4 mr-1" />
                                Supprimer
                              </Button>
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
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleOpenEditScreening({
                                  id: 'screening-2', 
                                  film: 'Civil War',
                                  cinema: 'MegaCiné',
                                  salle: 'Salle 3'
                                })}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Modifier
                              </Button>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4 mr-1" />
                                Supprimer
                              </Button>
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
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleOpenEditScreening({
                                  id: 'screening-3', 
                                  film: 'Kung Fu Panda 4',
                                  cinema: 'StarPlex',
                                  salle: 'Salle 2'
                                })}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Modifier
                              </Button>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4 mr-1" />
                                Supprimer
                              </Button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card>
                
                {/* Dialog for editing screening schedule */}
                <Dialog open={isEditScreeningDialogOpen} onOpenChange={setIsEditScreeningDialogOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Modifier la séance</DialogTitle>
                      <DialogDescription>
                        Modifiez les informations de la séance {selectedScreening?.film}.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <Label htmlFor="startTime">Début de la séance</Label>
                          <Input 
                            id="startTime" 
                            type="datetime-local" 
                            value={screeningDetails.startTime}
                            onChange={(e) => setScreeningDetails({ 
                              ...screeningDetails, 
                              startTime: e.target.value 
                            })}
                          />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="endTime">Fin de la séance</Label>
                          <Input 
                            id="endTime" 
                            type="datetime-local" 
                            value={screeningDetails.endTime}
                            onChange={(e) => setScreeningDetails({ 
                              ...screeningDetails, 
                              endTime: e.target.value 
                            })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="format">Format</Label>
                          <Select 
                            value={screeningDetails.format}
                            onValueChange={(value) => setScreeningDetails({ 
                              ...screeningDetails, 
                              format: value 
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez un format" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="2D">2D</SelectItem>
                              <SelectItem value="3D">3D</SelectItem>
                              <SelectItem value="4DX">4DX</SelectItem>
                              <SelectItem value="IMAX">IMAX</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="language">Langue</Label>
                          <Select 
                            value={screeningDetails.language}
                            onValueChange={(value) => setScreeningDetails({ 
                              ...screeningDetails, 
                              language: value 
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez une langue" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="VO">VO</SelectItem>
                              <SelectItem value="VF">VF</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Annuler</Button>
                      </DialogClose>
                      <Button 
                        onClick={() => handleUpdateScreening(screeningDetails.id)}
                      >
                        Enregistrer les modifications
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
  label,
  collapsed
}: { 
  isActive: boolean; 
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}) => (
  <button
    className={`w-full flex items-center py-3 px-5 ${
      isActive 
        ? 'bg-gray-800 text-cinema-secondary' 
        : 'text-gray-300 hover:bg-gray-800 hover:text-gray-100'
    } ${collapsed ? 'justify-center' : ''}`}
    onClick={onClick}
    title={collapsed ? label : ""}
  >
    {React.cloneElement(icon as React.ReactElement, { className: collapsed ? "h-5 w-5" : "mr-3 h-5 w-5" })}
    {!collapsed && <span>{label}</span>}
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
