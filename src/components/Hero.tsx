import { ArrowRight, Download, Edit, Save, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuthGuard } from '../hooks/useAuthGuard';
import LoginModal from './ui/LoginModal';

const Hero = () => {
  const [cvUrl, setCvUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [tempUrl, setTempUrl] = useState('');
  const { isAuthenticated, showLoginModal, setShowLoginModal, handleProtectedAction } = useAuthGuard();

  useEffect(() => {
    const loadCvUrl = async () => {
      try {
        const cvDoc = await getDoc(doc(db, 'cv', 'url'));
        if (cvDoc.exists()) {
          setCvUrl(cvDoc.data().url);
        }
      } catch (error) {
        console.error('Error loading CV URL:', error);
      }
    };
    loadCvUrl();
  }, []);

  const startEditing = () => {
    handleProtectedAction(() => {
      setTempUrl(cvUrl);
      setIsEditing(true);
    });
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const saveCvUrl = async () => {
    try {
      await setDoc(doc(db, 'cv', 'url'), { url: tempUrl });
      setCvUrl(tempUrl);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving CV URL:', error);
    }
  };

  return (
    <section id="home" className="min-h-screen pt-20 flex items-center">
      <div className="section-container grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="flex flex-col space-y-6 animate-fade-in">
          <div>
            <h1 className="mb-2 tracking-tight">
              <span className="block">M E Rohith Babu</span>
            </h1>
            <h2 className="text-xl md:text-2xl text-muted-foreground font-medium">
              Data Analyst
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-md">
            Transforming complex data into meaningful insights and driving data-informed decisions.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <a href="#contact" className="btn-primary group">
              Contact Me
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <div className="relative">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tempUrl}
                    onChange={(e) => setTempUrl(e.target.value)}
                    placeholder="Enter CV URL"
                    className="px-4 py-2 rounded-md border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-accent/50"
                  />
                  <button
                    onClick={cancelEditing}
                    className="p-2 rounded-md hover:bg-secondary/80 dark:hover:bg-secondary/60 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <button
                    onClick={saveCvUrl}
                    className="p-2 rounded-md hover:bg-secondary/80 dark:hover:bg-secondary/60 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  {isAuthenticated && (
                    <button
                      onClick={startEditing}
                      className="absolute -top-2 -right-2 p-1.5 rounded-full hover:bg-secondary/80 dark:hover:bg-secondary/60 transition-colors"
                      aria-label="Edit CV link"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  )}
                  <a
                    href={cvUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download CV
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-center animate-fade-in-slow">
          <div className="relative">
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary/20 dark:border-accent/20 shadow-xl">
              <img 
                src="/rohithbabu_portfolio.png" 
                alt="M E Rohith Babu" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://placehold.co/400x400/3b82f6/ffffff?text=RB";
                }}
              />
            </div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-transparent dark:from-accent/20 dark:to-transparent animate-spin-slow"></div>
          </div>
        </div>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={() => setShowLoginModal(false)}
      />
    </section>
  );
};

export default Hero;
