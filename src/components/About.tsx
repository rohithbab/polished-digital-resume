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

// Add this debug function at the file level, outside any component
const debugLog = (message, data = null) => {
  try {
    // Safe stringify to handle circular references
    const safeStringify = (obj) => {
      const seen = new WeakSet();
      return JSON.stringify(obj, (key, value) => {
        // Skip React component references that cause circular references
        if (key === 'icon' || key === '_owner' || key === '_reactInternalInstance' || 
            key.startsWith('_react') || key.startsWith('__react')) {
          return '[React Component]';
        }
        
        // Handle circular references
        if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) {
            return '[Circular Reference]';
          }
          seen.add(value);
        }
        return value;
      }, 2);
    };
    
    const log = data 
      ? `DEBUG: ${message} ${safeStringify(data)}`
      : `DEBUG: ${message}`;
      
    console.log(log);
    return log;
  } catch (error) {
    console.log(`DEBUG: ${message} [Error stringifying data: ${error.message}]`);
    return `DEBUG: ${message} [Data not serializable]`;
  }
};

const About = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0); // Add a refresh key to force re-render
  
  // Add debug flag for more verbose logging
  const DEBUG = true;

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

  // Fetch data from Firebase when component mounts or refresh key changes
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setIsLoading(true);
        DEBUG && debugLog('Fetching data from Firebase...');
        
        // Fetch about data
        DEBUG && debugLog('Fetching about data...');
        const aboutData = await getAllAbout();
        DEBUG && debugLog('About data received:', aboutData);
        
        let aboutMe = aboutData.find(item => item.title === "About Me");
        DEBUG && debugLog('About Me data:', aboutMe);
        
        // Fetch education data and format it
        DEBUG && debugLog('Fetching education data...');
        const educationData = await getAllEducation();
        DEBUG && debugLog('Education data received:', educationData);
        
        let educationContent = "";
        if (educationData.length > 0) {
          educationContent = educationData.map(edu => 
            `<strong>${edu.degree} in ${edu.field}</strong><br>` +
            `${edu.institution}, ${edu.location}<br>` +
            `${edu.startDate} - ${edu.endDate}<br>` +
            `${edu.description || ""}`
          ).join("<br><br>");
          DEBUG && debugLog('Formatted education content created');
        }
        
        // Fetch hobbies data and format it
        DEBUG && debugLog('Fetching hobbies data...');
        const hobbiesData = await getAllHobbies();
        DEBUG && debugLog('Hobbies data received:', hobbiesData);
        
        let hobbiesContent = "";
        if (hobbiesData.length > 0) {
          hobbiesContent = hobbiesData.map(hobby => 
            `<strong>${hobby.name}</strong><br>${hobby.description}`
          ).join("<br><br>");
          DEBUG && debugLog('Formatted hobbies content created');
        }
        
        // Update cards with fetched data
        const updatedCards = [...defaultCards];
        
        if (aboutMe) {
          updatedCards[0] = {
            ...updatedCards[0],
            id: aboutMe.id,
            content: aboutMe.bio || ""
          };
          DEBUG && debugLog('About Me card updated with Firebase data');
        } else {
          DEBUG && debugLog('No About Me data found in Firebase');
        }
        
        if (educationContent) {
          updatedCards[1] = {
            ...updatedCards[1],
            content: educationContent
          };
          DEBUG && debugLog('Education card updated with Firebase data');
        }
        
        if (hobbiesContent) {
          updatedCards[2] = {
            ...updatedCards[2],
            content: hobbiesContent
          };
          DEBUG && debugLog('Hobbies card updated with Firebase data');
        }
        
        setCards(updatedCards);
        DEBUG && debugLog('All cards updated with Firebase data', updatedCards);
      } catch (error) {
        console.error("Error fetching about data:", error);
        debugLog('ERROR fetching data:', error);
      } finally {
        setIsLoading(false);
        DEBUG && debugLog('Loading state completed');
      }
    };
    
    fetchAboutData();
  }, [refreshKey]); // Add refreshKey as a dependency to re-fetch data when it changes

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

  // Function to refresh data from Firebase
  const refreshData = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleSaveContent = async (content: string) => {
    if (editingIndex === null) return;
    
    try {
      DEBUG && debugLog('Starting save operation...');
      DEBUG && debugLog('Content to save:', content);
      DEBUG && debugLog('Editing index:', editingIndex);
      
      // Create a clean copy of the cards array without React elements to avoid circular refs
      const updatedCards = [...cards].map(card => ({
        ...card,
        icon: '[React Component]', // Replace React component with a placeholder string
        content: card.content
      }));
      
      // Update the specific card's content
      updatedCards[editingIndex] = {
        ...updatedCards[editingIndex],
        content
      };
      
      // Save to Firebase based on which card is being edited
      if (editingIndex === 0) {
        // About Me
        DEBUG && debugLog('Saving About Me content...');
        
        // Create the final state update for our React component with the original icon
        const finalCards = cards.map((card, idx) => {
          if (idx === editingIndex) {
            return {
              ...card,
              content
            };
          }
          return card;
        });
        
        // Check Firebase connection before attempting save
        DEBUG && debugLog('Checking Firebase connection...');
        try {
          const testGet = await getAllAbout();
          DEBUG && debugLog('Firebase connection test successful', testGet);
        } catch (connectionError) {
          console.error("Firebase connection test failed:", connectionError);
          debugLog('ERROR in Firebase connection test:', connectionError);
          alert("Failed to connect to Firebase. Check console for details.");
          return;
        }
        
        // Create a clean about data object with only the required fields
        const aboutData = {
          title: "About Me",
          bio: content,
          headline: "Data Analyst",
          email: "example@example.com", 
          location: "Your Location"
        };
        
        DEBUG && debugLog('About data prepared for save:', aboutData);
        
        let saveSuccess = false;
        
        if (updatedCards[0].id) {
          // Update existing record
          const docId = updatedCards[0].id;
          DEBUG && debugLog('Updating existing record with ID:', docId);
          try {
            console.log('Attempting to update about with ID:', docId);
            // Only update the bio field to avoid overwriting other fields
            const updateData = { bio: content };
            console.log('Update data:', updateData);
            
            await updateAbout(docId, updateData);
            console.log('Update completed, verifying...');
            
            // Verify the update succeeded by fetching the document again
            const verifyData = await getAllAbout();
            const updatedDoc = verifyData.find(item => item.id === docId);
            
            if (updatedDoc && updatedDoc.bio === content) {
              console.log('Verification successful: Document updated correctly');
              saveSuccess = true;
            } else {
              console.warn('Verification warning: Document may not have updated correctly', 
                { expected: content, actual: updatedDoc?.bio });
            }
            
            DEBUG && debugLog('Update operation completed successfully');
          } catch (updateError) {
            console.error("Error updating about data:", updateError);
            debugLog('ERROR updating about data:', updateError);
            alert(`Failed to update. Error: ${updateError.message || 'Unknown error'}`);
            return;
          }
        } else {
          // Add new record
          DEBUG && debugLog('Creating new About Me record...');
          try {
            console.log('Attempting to add new about record:', aboutData);
            const newId = await addAbout(aboutData);
            finalCards[0].id = newId;
            console.log('New record created with ID:', newId);
            
            // Verify the add succeeded by fetching the document again
            const verifyData = await getAllAbout();
            const newDoc = verifyData.find(item => item.id === newId);
            
            if (newDoc && newDoc.bio === content) {
              console.log('Verification successful: Document created correctly');
              saveSuccess = true;
            } else {
              console.warn('Verification warning: Document may not have been created correctly', 
                { expected: content, actual: newDoc?.bio });
            }
            
            DEBUG && debugLog('New record created with ID:', newId);
          } catch (addError) {
            console.error("Error adding about data:", addError);
            debugLog('ERROR adding about data:', addError);
            alert(`Failed to add new record. Error: ${addError.message || 'Unknown error'}`);
            return;
          }
        }
        
        // Update the component state with our properly formatted cards
        setCards(finalCards);
        DEBUG && debugLog('Cards state updated successfully');
        
        // Force a refresh to ensure we get the latest data from Firebase
        if (saveSuccess) {
          setTimeout(() => {
            console.log('Refreshing data from Firebase...');
            refreshData();
          }, 1000); // Give Firebase a second to propagate the changes
        }
      }
      // Note: For Education and Hobbies, the editing is simplified in this component
      
      alert('Content saved successfully!');
    } catch (error) {
      console.error("Error saving content:", error);
      debugLog('ERROR in save operation:', error);
      alert(`Failed to save. Error: ${error.message}`);
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
