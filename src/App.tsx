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
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import { debug } from './utils/debug';
import './App.css';

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
        debug.log('Firebase data initialized successfully');
      } catch (error) {
        debug.error('Error initializing Firebase data:', error);
      }
    };
    
    initData();
  }, []);
  
  return null;
};

const App = () => {
  useEffect(() => {
    debug.log('App component mounted');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <FirebaseInitializer />
          <ThemeProvider>
            <AuthProvider>
              <Layout>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/project/:id" element={<ProjectDetails />} />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/achievements" element={<Achievements />} />
                  <Route path="/skills" element={<SkillsPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </AuthProvider>
          </ThemeProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
