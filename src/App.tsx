import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProjectDetails from "./pages/ProjectDetails";
import ProjectsPage from "./pages/projects";
import Achievements from "./pages/Achievements";
import SkillsPage from "./pages/Skills";
import { initializeAllCollections } from "./lib/initializeData";
import FirebaseTest from "./pages/FirebaseTest";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return null;
};

// Component to initialize Firebase data
const FirebaseInitializer = () => {
  useEffect(() => {
    const initData = async () => {
      try {
        await initializeAllCollections();
      } catch (error) {
        console.error('Error initializing Firebase data:', error);
      }
    };
    
    initData();
  }, []);
  
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <FirebaseInitializer />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/project/:id" element={<ProjectDetails />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/firebase-test" element={<FirebaseTest />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
