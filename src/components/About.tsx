import { useState, useEffect } from 'react';
import { 
  BookOpen, GraduationCap, HeartPulse, 
  ChevronLeft, ChevronRight, Edit, X, Save
} from 'lucide-react';
import { getAllAbout, updateAbout, addAbout } from '../services/aboutService';
import { getAllEducation } from '../services/educationService';
import { getAllHobbies } from '../services/hobbiesService';

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

  // Fetch data from Firebase when component mounts
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch about data
        const aboutData = await getAllAbout();
        let aboutMe = aboutData.find(item => item.title === "About Me");
        
        // Fetch education data and format it
        const educationData = await getAllEducation();
        let educationContent = "";
        if (educationData.length > 0) {
          educationContent = educationData.map(edu => 
            `<strong>${edu.degree} in ${edu.field}</strong><br>` +
            `${edu.institution}, ${edu.location}<br>` +
            `${edu.startDate} - ${edu.endDate}<br>` +
            `${edu.description || ""}`
          ).join("<br><br>");
        }
        
        // Fetch hobbies data and format it
        const hobbiesData = await getAllHobbies();
        let hobbiesContent = "";
        if (hobbiesData.length > 0) {
          hobbiesContent = hobbiesData.map(hobby => 
            `<strong>${hobby.name}</strong><br>${hobby.description}`
          ).join("<br><br>");
        }
        
        // Update cards with fetched data
        const updatedCards = [...defaultCards];
        
        if (aboutMe) {
          updatedCards[0] = {
            ...updatedCards[0],
            id: aboutMe.id,
            content: aboutMe.bio || ""
          };
        }
        
        if (educationContent) {
          updatedCards[1] = {
            ...updatedCards[1],
            content: educationContent
          };
        }
        
        if (hobbiesContent) {
          updatedCards[2] = {
            ...updatedCards[2],
            content: hobbiesContent
          };
        }
        
        setCards(updatedCards);
      } catch (error) {
        console.error("Error fetching about data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAboutData();
  }, []);

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
    if (editingIndex === null) return;
    
    try {
      const updatedCards = [...cards];
      updatedCards[editingIndex] = {
        ...updatedCards[editingIndex],
        content
      };
      
      // Save to Firebase based on which card is being edited
      if (editingIndex === 0) {
        // About Me
        const aboutData = {
          title: "About Me",
          bio: content,
          headline: "Data Analyst", // Default values
          email: "",
          location: ""
        };
        
        if (updatedCards[0].id) {
          // Update existing record
          await updateAbout(updatedCards[0].id, { bio: content });
        } else {
          // Add new record
          const newId = await addAbout(aboutData);
          updatedCards[0].id = newId;
        }
      }
      
      // Note: For Education and Hobbies, the editing is simplified in this component
      // A more complete implementation would use dedicated forms for each education/hobby item
      
      setCards(updatedCards);
    } catch (error) {
      console.error("Error saving content:", error);
      alert("Failed to save. Please try again.");
    }
  };

  return (
    <section id="about" className="py-20 bg-secondary/30 dark:bg-secondary/10">
      <div className="section-container">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="mb-6 text-4xl">About</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-xl">
            Learn more about my background, education, and personal interests.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12 animate-fade-in">
            <div className="h-12 w-12 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
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
        )}
      </div>

      {/* Edit Modal */}
      <EditModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={editingIndex !== null ? cards[editingIndex].title : ""}
        content={editingIndex !== null ? cards[editingIndex].content : ""}
        onSave={handleSaveContent}
      />
    </section>
  );
};

export default About;
