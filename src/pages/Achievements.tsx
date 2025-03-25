import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, ExternalLink, Trash } from 'lucide-react';
import AddAchievementDialog from '../components/AddAchievementDialog';
import { achievements as initialAchievements, Achievement } from '../lib/achievements';
import { getAllAchievements, addAchievement as fbAddAchievement, updateAchievement as fbUpdateAchievement, deleteAchievement as fbDeleteAchievement } from '../services/achievementService';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useToast } from '../components/ui/use-toast';

const AchievementsPage = () => {
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setIsLoading(true);
        const data = await getAllAchievements();
        
        if (data.length > 0) {
          setAchievements(data);
        } else {
          setAchievements(initialAchievements);
        }
      } catch (error) {
        console.error("Error fetching achievements:", error);
        toast({
          title: "Error",
          description: "Failed to load achievements. Please try again later.",
          variant: "destructive",
        });
        setAchievements(initialAchievements);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAchievements();
  }, [toast]);

  const handleEdit = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (achievementId: string) => {
    try {
      await fbDeleteAchievement(achievementId);
      setAchievements(prev => prev.filter(achievement => achievement.id !== achievementId));
      toast({
        title: "Success",
        description: "Achievement deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting achievement:", error);
      toast({
        title: "Error",
        description: "Failed to delete achievement. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddNewAchievement = () => {
    setEditingAchievement(null);
    setIsAddDialogOpen(true);
  };

  const handleSaveAchievement = async (achievement: Achievement) => {
    try {
      if (editingAchievement) {
        const { id, ...achievementData } = achievement;
        await fbUpdateAchievement(id, achievementData);
        setAchievements(prev => 
          prev.map(a => a.id === achievement.id ? achievement : a)
        );
        toast({
          title: "Success",
          description: "Achievement updated successfully",
        });
      } else {
        const { id, ...achievementData } = achievement;
        const newId = await fbAddAchievement(achievementData);
        setAchievements(prev => [...prev, { ...achievement, id: newId }]);
        toast({
          title: "Success",
          description: "Achievement added successfully",
        });
      }
      setIsAddDialogOpen(false);
      setEditingAchievement(null);
    } catch (error) {
      console.error("Error saving achievement:", error);
      toast({
        title: "Error",
        description: "Failed to save achievement. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

        {isLoading ? (
          <div className="flex justify-center py-12 animate-fade-in">
            <div className="h-12 w-12 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
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
                    {formatDate(achievement.date)}
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="capitalize bg-white/90 dark:bg-black/90">
                      {achievement.category}
                    </Badge>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{achievement.title}</h3>
                <p className="text-muted-foreground mb-4 flex-grow">{achievement.description}</p>
                
                <div className="mt-auto flex justify-between items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(achievement.image, '_blank')}
                    className="flex items-center gap-1"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Achievement
                  </Button>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(achievement)}
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(achievement.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
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
        )}
      </div>

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