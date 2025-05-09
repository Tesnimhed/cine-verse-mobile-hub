
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { BookingProvider } from "./contexts/BookingContext";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import SearchPage from "./pages/SearchPage";
import MovieDetailPage from "./pages/MovieDetailPage";
import CinemaScreeningsPage from "./pages/CinemaScreeningsPage";
import SeatSelectionPage from "./pages/SeatSelectionPage";
import SnackSelectionPage from "./pages/SnackSelectionPage";
import CheckoutPage from "./pages/CheckoutPage";
import BookingConfirmationPage from "./pages/BookingConfirmationPage";
import BookingsPage from "./pages/BookingsPage";
import ProfilePage from "./pages/ProfilePage";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BookingProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/movie/:movieId" element={<MovieDetailPage />} />
              <Route path="/cinema/:cinemaId/movie/:movieId" element={<CinemaScreeningsPage />} />
              <Route path="/booking/seats/:screeningId" element={<SeatSelectionPage />} />
              <Route path="/booking/snacks" element={<SnackSelectionPage />} />
              <Route path="/booking/checkout" element={<CheckoutPage />} />
              <Route path="/booking/confirmation/:bookingId" element={<BookingConfirmationPage />} />
              <Route path="/bookings" element={<BookingsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </BookingProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
