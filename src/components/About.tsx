import { useState, useEffect } from 'react';
import { 
  BookOpen, GraduationCap, HeartPulse, 
  ChevronLeft, ChevronRight, Edit, X, Save
} from 'lucide-react';
import { getAllAbout, updateAbout, addAbout, getAboutById } from '../services/aboutService';
import { getAllEducation, updateEducation, addEducation, deleteEducation } from '../services/educationService';
import { getAllHobbies, updateHobby, addHobby } from '../services/hobbiesService';
import { About as AboutType } from '../lib/about';
import { debug } from '../lib/debug';
import { debugEducation } from '../lib/debugEducation';
import { debugHobbies } from '../lib/debugHobbies';

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
          onClick={() => onEdit()}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary/80 dark:hover:bg-secondary/40 transition-colors"
          aria-label={`Edit ${title}`}
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
            <div className="text-justify" dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br>') }} />
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

  console.log('EditModal rendered with title:', title);

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
              console.log('=== DEBUG: Save Button Click ===');
              console.log('Saving content for:', title);
              console.log('Content to save:', editedContent);
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

  const [cards, setCards] = useState<AboutCardData[]>([...defaultCards]);

  // Add debug log to check initial cards state
  useEffect(() => {
    console.log('Initial cards state:', cards.map(card => card.title));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      debug.log('Fetching About data in component');
      try {
        // Create a single updatedCards array to track all changes
        let updatedCards = [...defaultCards];

        // Fetch About data
        const aboutData = await getAllAbout();
        console.log('Fetched About data:', aboutData);
        
        if (aboutData && aboutData.length > 0) {
          const latestAbout = aboutData[0];
          console.log('Setting About data:', latestAbout);
          
          // Update about state
          setAbout(latestAbout);
          
          // Update About Me card
          updatedCards[0] = {
            ...updatedCards[0],
            id: latestAbout.id,
            content: latestAbout.bio || "",
            title: "About Me"
          };
        }

        // Fetch Education data
        const educationData = await getAllEducation();
        if (educationData && educationData.length > 0) {
          // Update Education card
          updatedCards[1] = {
            ...updatedCards[1],
            id: educationData[0].id,
            content: educationData[0].description || "",
            title: "Education"
          };
        }

        // Fetch Hobbies data
        const hobbiesData = await getAllHobbies();
        if (hobbiesData && hobbiesData.length > 0) {
          // Update Hobbies card
          updatedCards[2] = {
            ...updatedCards[2],
            id: hobbiesData[0].id,
            content: hobbiesData[0].description || "",
            title: "Hobbies"
          };
        }

        // Set all cards at once after gathering all data
        console.log('Setting all cards:', updatedCards);
        setCards(updatedCards);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [refreshKey]);

  const prevCard = () => {
    setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const nextCard = () => {
    setActiveIndex((prev) => (prev + 1) % cards.length);
  };

  const handleEditClick = (index: number) => {
    // Clear debugging to see exactly what's happening
    console.log('==================== EDIT BUTTON DEBUG ====================');
    console.log('Clicked index:', index);
    console.log('Card title being edited:', defaultCards[index].title);
    console.log('Card content being edited:', cards[index].content);
    console.log('All card titles:', cards.map(card => card.title));
    console.log('========================================================');

    setEditingIndex(index);
    setIsEditModalOpen(true);
  };

  const handleSaveContent = async (content: string) => {
    if (editingIndex === null) return;

    try {
      if (editingIndex === 0) {
        // Handle About Me content
        console.log('Saving About Me content to Firebase');
        const updatedContent: Partial<AboutType> = {
          bio: content,
          title: "About Me",
          headline: about?.headline || "Data Analyst",
          email: about?.email || "example@example.com",
          location: about?.location || "Your Location"
        };

        let docId;
        if (about?.id) {
          console.log('Updating existing About document:', about.id);
          await updateAbout(about.id, updatedContent);
          docId = about.id;
        } else {
          console.log('Creating new About document');
          docId = await addAbout(updatedContent as AboutType);
        }

        // Update both states at once
        const updatedCards = [...cards];
        updatedCards[editingIndex] = {
          ...updatedCards[editingIndex],
          id: docId,
          content: content
        };

        // Update states
        setCards(updatedCards);
        setAbout(prev => ({
          ...prev,
          id: docId,
          bio: content,
          ...updatedContent
        } as AboutType));

        console.log('About Me content saved successfully');
        
        // Force refresh after successful save
        setRefreshKey(prev => prev + 1);
      } else if (editingIndex === 1) {
        console.log('Saving Education content');
        try {
          // Create education content object with the raw content
          const educationContent = {
            degree: "High School",
            field: "General",
            institution: "Angels Babyland Matric Higher Secondary School",
            location: "India",
            startDate: "2019",
            endDate: "2021",
            description: content,
            additionalInfo: {
              college: "SIMATS Engineering",
              department: "Computer Science & Engineering (CSE)",
              cgpa: "9.0"
            }
          };

          console.log('Saving education content:', educationContent);

          // Always update the existing document if we have an ID
          const existingId = cards[editingIndex].id;
          if (existingId) {
            console.log('Updating existing Education document:', existingId);
            await updateEducation(existingId, educationContent);
            console.log('Document updated successfully');

            // Update local state with exactly what the user entered
            const updatedCards = [...cards];
            updatedCards[editingIndex] = {
              ...updatedCards[editingIndex],
              id: existingId,
              content: content  // Use the raw content directly
            };
            setCards(updatedCards);
          } else {
            // Create new document if we don't have an existing one
            console.log('Creating new Education document');
            const newId = await addEducation(educationContent);
            console.log('New document created:', newId);
            
            // Update local state with exactly what the user entered
            const updatedCards = [...cards];
            updatedCards[editingIndex] = {
              ...updatedCards[editingIndex],
              id: newId,
              content: content  // Use the raw content directly
            };
            setCards(updatedCards);
          }

          // Force refresh to get the latest data
          setRefreshKey(prev => prev + 1);
        } catch (err) {
          console.error('Error saving education content:', err);
          setError('Failed to save education content. Please try again.');
          throw err;
        }
      } else if (editingIndex === 2) {
        console.log('Saving Hobbies content');
        try {
          const hobbiesContent = {
            name: "Hobbies",
            description: content,
            lastUpdated: new Date().toISOString()
          };

          console.log('Saving hobbies content:', hobbiesContent);

          // Always update the existing document if we have an ID
          const existingId = cards[editingIndex].id;
          if (existingId) {
            console.log('Updating existing Hobbies document:', existingId);
            await updateHobby(existingId, hobbiesContent);
            console.log('Document updated successfully');

            // Update local state with exactly what the user entered
            const updatedCards = [...cards];
            updatedCards[editingIndex] = {
              ...updatedCards[editingIndex],
              id: existingId,
              content: content
            };
            setCards(updatedCards);
          } else {
            // Create new document if we don't have an existing one
            console.log('Creating new Hobbies document');
            const newId = await addHobby(hobbiesContent);
            console.log('New document created:', newId);
            
            // Update local state with exactly what the user entered
            const updatedCards = [...cards];
            updatedCards[editingIndex] = {
              ...updatedCards[editingIndex],
              id: newId,
              content: content
            };
            setCards(updatedCards);
          }

          // Force refresh to get the latest data
          setRefreshKey(prev => prev + 1);
        } catch (err) {
          console.error('Error saving hobbies content:', err);
          setError('Failed to save hobbies content. Please try again.');
          throw err;
        }
      }

      // Force refresh to get the latest data
      setRefreshKey(prev => prev + 1);
      
    } catch (err) {
      console.error('Error saving content:', err);
      setError('Failed to save content. Please try again.');
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
            {defaultCards.map((card, index) => (
              <AboutCard 
                key={index}
                title={card.title} 
                icon={card.icon}
                content={cards[index].content}
                isActive={index === activeIndex}
                onEdit={() => handleEditClick(activeIndex)}
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
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingIndex(null);
        }}
        title={editingIndex !== null ? defaultCards[editingIndex].title : ""}
        content={editingIndex !== null ? cards[editingIndex].content : ""}
        onSave={handleSaveContent}
      />
    </section>
  );
};

export default About;
