import { ArrowRight, Download, Edit, Save, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const Hero = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [cvLink, setCvLink] = useState('/resume.pdf');
  const [tempCvLink, setTempCvLink] = useState('');

  useEffect(() => {
    const loadCvLink = async () => {
      try {
        const cvDoc = await getDoc(doc(db, 'cv', 'link'));
        if (cvDoc.exists()) {
          setCvLink(cvDoc.data().url || '/resume.pdf');
        }
      } catch (error) {
        console.error('Error loading CV link:', error);
      }
    };
    loadCvLink();
  }, []);

  const handleSaveCvLink = async () => {
    try {
      await setDoc(doc(db, 'cv', 'link'), {
        url: tempCvLink
      });
      setCvLink(tempCvLink);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving CV link:', error);
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
                    value={tempCvLink}
                    onChange={(e) => setTempCvLink(e.target.value)}
                    placeholder="Enter CV PDF link"
                    className="px-3 py-1.5 rounded-md border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-accent/50"
                  />
                  <button
                    onClick={handleSaveCvLink}
                    className="p-1.5 rounded-md hover:bg-secondary/80 dark:hover:bg-secondary/60 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="p-1.5 rounded-md hover:bg-secondary/80 dark:hover:bg-secondary/60 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <a href={cvLink} download className="btn-secondary group">
                    Download CV
                    <Download className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
                  </a>
                  <button
                    onClick={() => {
                      setTempCvLink(cvLink);
                      setIsEditing(true);
                    }}
                    className="p-1.5 rounded-md hover:bg-secondary/80 dark:hover:bg-secondary/60 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
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
    </section>
  );
};

export default Hero;
