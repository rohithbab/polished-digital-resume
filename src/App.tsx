import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, Suspense } from "react";
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
import ErrorBoundary from './components/ErrorBoundary';
import { debug } from './utils/debug';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

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
        await debug.info('Firebase data initialized successfully');
      } catch (error) {
        await debug.error('Error initializing Firebase data:', error);
      }
    };
    
    initData();
  }, []);
  
  return null;
};

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Error boundary component
const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center p-8">
      <h1 className="text-2xl font-bold text-red-500 mb-4">Something went wrong</h1>
      <p className="text-muted-foreground mb-4">{error.message}</p>
      <button
        onClick={() => window.location.reload()}
        className="btn-primary"
      >
        Refresh Page
      </button>
    </div>
  </div>
);

const App = () => {
  useEffect(() => {
    debug.info('App component mounted');
  }, []);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <FirebaseInitializer />
            <ThemeProvider>
              <AuthProvider>
                <Suspense fallback={<LoadingFallback />}>
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
                </Suspense>
              </AuthProvider>
            </ThemeProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
