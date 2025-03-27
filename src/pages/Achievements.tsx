import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, ExternalLink, Trash } from 'lucide-react';
import AddAchievementDialog from '../components/AddAchievementDialog';
import { achievements as initialAchievements, Achievement } from '../lib/achievements';
import { getAllAchievements, addAchievement as fbAddAchievement, updateAchievement as fbUpdateAchievement, deleteAchievement as fbDeleteAchievement } from '../services/achievementService';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useToast } from '../components/ui/use-toast';
import { Card, CardHeader, CardContent } from '../components/ui/card';
import { useAuthGuard } from '../hooks/useAuthGuard';
import LoginModal from '../components/ui/LoginModal';

const AchievementsPage = () => {
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { isAuthenticated, showLoginModal, setShowLoginModal, handleProtectedAction } = useAuthGuard();

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
    handleProtectedAction(() => {
      setEditingAchievement(achievement);
      setIsAddDialogOpen(true);
    });
  };

  const handleDelete = async (achievementId: string) => {
    handleProtectedAction(async () => {
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
    });
  };

  const handleAddNewAchievement = () => {
    handleProtectedAction(() => {
      setEditingAchievement(null);
      setIsAddDialogOpen(true);
    });
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
    return new Date(dateString).toLocaleDateString('en-US', {
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
              <Card key={achievement.id} className="animate-fade-in group">
                <CardHeader>
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold">{achievement.title}</h3>
                      <Badge variant="secondary" className="capitalize">
                        {achievement.category}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(achievement.date)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">{achievement.description}</p>
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(achievement.image, '_blank')}
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="h-4 w-4" />
                        View Achievement
                      </Button>
                      {isAuthenticated && (
                        <>
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
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Add new achievement card */}
            {isAuthenticated && (
              <div 
                className="flex flex-col items-center justify-center h-48 rounded-lg border border-dashed hover:border-primary cursor-pointer transition-colors"
                onClick={handleAddNewAchievement}
              >
                <Plus className="h-8 w-8 text-primary mb-2" />
                <span className="text-primary font-medium">Add Achievement</span>
              </div>
            )}
          </div>
        )}
      </div>

      <AddAchievementDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={handleSaveAchievement}
        achievement={editingAchievement}
      />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={() => setShowLoginModal(false)}
      />
    </section>
  );
};

export default AchievementsPage; 