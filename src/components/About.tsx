import { useState, useEffect } from 'react';
import { 
  BookOpen, GraduationCap, HeartPulse, 
  ChevronLeft, ChevronRight, Edit, X, Save
} from 'lucide-react';
import { getAllAbout, updateAbout, addAbout, getAboutById } from '../services/aboutService';
import { getAllEducation } from '../services/educationService';
import { getAllHobbies } from '../services/hobbiesService';
import { About as AboutType } from '../lib/about';
import { debug } from '../lib/debug';

interface AboutCardProps {
  title: string;
  icon: React.ReactNode;
  content: string;
  isActive: boolean;
  onEdit: () => void;
}

interface AboutCardData {
  id?: string;
  title: string;
  icon: React.ReactNode;
  content: string;
}

const AboutCard = ({ title, icon, content, isActive, onEdit }: AboutCardProps) => {
  return (
    <div 
      className={`w-full max-w-md transition-all duration-500 ease-in-out ${
        isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute'
      }`}
    >
      <div className="p-8 bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg relative">
        <button 
          onClick={onEdit}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary/80 dark:hover:bg-secondary/40 transition-colors"
          aria-label="Edit content"
        >
          <Edit className="h-5 w-5" />
        </button>
        
        <div className="flex items-center mb-6">
          <div className="bg-primary/10 dark:bg-accent/10 p-3 rounded-md mr-4">
            {icon}
          </div>
          <h3 className="text-2xl font-bold">{title}</h3>
        </div>
        <div className="min-h-[230px] text-lg">
          {content ? (
            <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br>') }} />
          ) : (
            <div className="flex justify-center items-center h-full text-muted-foreground">
              <p>Click the edit button to add content</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const EditModal = ({ isOpen, onClose, title, content, onSave }: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  onSave: (content: string) => void;
}) => {
  const [editedContent, setEditedContent] = useState(content);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold">Edit {title}</h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-secondary/80 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 flex-grow overflow-auto">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full h-64 p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter content here..."
          />
        </div>
        <div className="p-4 border-t flex justify-end gap-2">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-md border hover:bg-secondary/20 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              onSave(editedContent);
              onClose();
            }}
            className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const About = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [about, setAbout] = useState<AboutType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const defaultCards: AboutCardData[] = [
    {
      title: "About Me",
      icon: <BookOpen className="h-7 w-7" />,
      content: ""
    },
    {
      title: "Education",
      icon: <GraduationCap className="h-7 w-7" />,
      content: ""
    },
    {
      title: "Hobbies",
      icon: <HeartPulse className="h-7 w-7" />,
      content: ""
    }
  ];

  const [cards, setCards] = useState<AboutCardData[]>(defaultCards);

  useEffect(() => {
    const fetchAbout = async () => {
      debug.log('Fetching About data in component');
      try {
        const data = await getAllAbout();
        if (data && data.length > 0) {
          setAbout(data[0]);
          // Update the cards state with the fetched data
          const updatedCards = [...cards];
          updatedCards[0] = {
            ...updatedCards[0],
            id: data[0].id,
            content: data[0].bio || ""
          };
          setCards(updatedCards);
          debug.log('About data loaded successfully', data[0], 'success');
        } else {
          debug.log('No About data found', null, 'info');
        }
      } catch (err) {
        debug.log('Error fetching About data', err, 'error');
        setError('Failed to load about data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAbout();
  }, [refreshKey]);

  const prevCard = () => {
    setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const nextCard = () => {
    setActiveIndex((prev) => (prev + 1) % cards.length);
  };

  const handleEditClick = (index: number) => {
    setEditingIndex(index);
    setIsEditModalOpen(true);
  };

  const handleSaveContent = async (content: string) => {
    debug.log('Attempting to save About content', { content });
    try {
      const updatedContent: Partial<AboutType> = {
        title: "About Me",
        bio: content,
        headline: "Data Analyst",
        email: "example@example.com",
        location: "Your Location"
      };

      if (!about?.id) {
        // Create new document
        debug.log('Creating new About document');
        const newId = await addAbout(updatedContent as Omit<AboutType, 'id'>);
        debug.log('New document created', { id: newId }, 'success');
      } else {
        // Update existing document
        debug.log('Updating existing About document', { id: about.id });
        await updateAbout(about.id, updatedContent);
        debug.log('Document updated successfully', { id: about.id }, 'success');
      }

      // Update local cards state
      if (editingIndex !== null) {
        const updatedCards = [...cards];
        updatedCards[editingIndex] = {
          ...updatedCards[editingIndex],
          content: content
        };
        setCards(updatedCards);
        debug.log('Local cards state updated', updatedCards, 'success');
      }

      // Verify the update
      const verificationData = await getAllAbout();
      debug.log('Verification data', verificationData, 'success');

      // Force refresh
      setRefreshKey(prev => prev + 1);
      
      // Show success message
      debug.log('Content saved successfully', null, 'success');
    } catch (err) {
      debug.log('Error saving content', err, 'error');
      setError('Failed to save content');
      throw err;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section id="about" className="py-20 bg-secondary/30 dark:bg-secondary/10">
      <div className="section-container">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="mb-6 text-4xl">About</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-xl">
            Learn more about my background, education, and personal interests.
          </p>
        </div>

        <div className="relative">
          {/* Simple Card Carousel */}
          <div className="relative flex justify-center items-center h-[400px]">
            {cards.map((card, index) => (
              <AboutCard 
                key={index}
                title={card.title} 
                icon={card.icon}
                content={card.content}
                isActive={index === activeIndex}
                onEdit={() => handleEditClick(index)}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex justify-center gap-8 mt-12">
            <button
              onClick={prevCard}
              className="p-4 rounded-full bg-secondary/70 hover:bg-secondary/90 dark:bg-secondary/40 dark:hover:bg-secondary/60 transition-colors shadow-md"
              aria-label="Previous card"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextCard}
              className="p-4 rounded-full bg-secondary/70 hover:bg-secondary/90 dark:bg-secondary/40 dark:hover:bg-secondary/60 transition-colors shadow-md"
              aria-label="Next card"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={editingIndex !== null ? cards[editingIndex].title : ""}
        content={editingIndex !== null ? cards[editingIndex].content : ""}
        onSave={handleSaveContent}
      />

      <div className="debug-panel">
        <h3>Debug Information</h3>
        <pre>{JSON.stringify(about, null, 2)}</pre>
      </div>
    </section>
  );
};

export default About;
