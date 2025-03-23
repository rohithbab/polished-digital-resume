import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, ExternalLink, Trash } from 'lucide-react';
import AddAchievementDialog from '../components/AddAchievementDialog';

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
  link?: string;
}

const AchievementsPage = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);

  const handleEdit = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setIsAddDialogOpen(true);
  };

  const handleDelete = (achievementId: string) => {
    setAchievements(prev => prev.filter(achievement => achievement.id !== achievementId));
  };

  const handleAddNewAchievement = () => {
    setEditingAchievement(null);
    setIsAddDialogOpen(true);
  };

  const handleSaveAchievement = (achievement: Achievement) => {
    if (editingAchievement) {
      // Update existing achievement
      setAchievements(prev => 
        prev.map(a => a.id === achievement.id ? achievement : a)
      );
    } else {
      // Add new achievement
      setAchievements(prev => [...prev, achievement]);
    }
    setIsAddDialogOpen(false);
    setEditingAchievement(null);
  };

  return (
    <section className="py-20">
      <div className="section-container">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="mb-4">All Achievements</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Here you can explore all my achievements and add new ones.
          </p>
        </div>
        
        <div className="flex justify-center animate-fade-in mb-6">
          <Link to="/" className="btn-secondary">
            Back to Home
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {/* Display existing achievements */}
          {achievements.map((achievement) => (
            <div 
              key={achievement.id}
              className="achievement-card flex flex-col h-full animate-fade-in"
            >
              <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
                <img 
                  src={achievement.image} 
                  alt={achievement.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-primary/90 dark:bg-accent/90 text-white text-xs px-2 py-1 rounded">
                  {achievement.date}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">{achievement.title}</h3>
              <p className="text-muted-foreground mb-4 flex-grow">{achievement.description}</p>
              
              <div className="mt-auto flex justify-between items-center">
                <div>
                  {achievement.link && (
                    <a 
                      href={achievement.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-primary dark:text-accent font-medium hover:underline"
                    >
                      View Award
                      <ExternalLink className="ml-1 h-4 w-4" />
                    </a>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => handleEdit(achievement)}
                    className="p-2 rounded-full hover:bg-secondary/80 dark:hover:bg-secondary/40 transition-colors" 
                    aria-label="Edit Achievement"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(achievement.id)}
                    className="p-2 rounded-full hover:bg-secondary/80 dark:hover:bg-secondary/40 transition-colors" 
                    aria-label="Delete Achievement"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {/* Add new achievement card */}
          <div 
            className="achievement-card flex flex-col items-center justify-center h-48 bg-secondary/10 dark:bg-secondary/20 rounded-lg cursor-pointer hover:bg-secondary/20 transition-all"
            onClick={handleAddNewAchievement}
          >
            <Plus className="h-8 w-8 text-primary mb-2" />
            <span className="text-primary dark:text-accent font-medium">Add Achievement</span>
          </div>
        </div>
      </div>

      {/* Achievement Dialog for adding/editing */}
      <AddAchievementDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={handleSaveAchievement}
        achievement={editingAchievement}
      />
    </section>
  );
};

export default AchievementsPage;
