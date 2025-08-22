import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Schools from "./pages/Schools";
import Blogs from "./pages/Blogs";
import Leaderboard from "./pages/Leaderboard";
import Admin from "./pages/Admin";
import DonorDashboard from "./pages/DonorDashboard";
import NotFound from "./pages/NotFound";
import StoryDetail from "@/pages/StoryDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/schools" element={<Schools />} />
          <Route path="/blogs" element={<Blogs />} />
           <Route path="/stories/:id" element={<StoryDetail />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/donor-login" element={<DonorDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
