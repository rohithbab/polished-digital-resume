
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Pen, ExternalLink, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { achievements as initialAchievements } from '@/lib/achievements';
import AddAchievementDialog from '@/components/AddAchievementDialog';
import { Achievement } from '@/lib/achievements';
import { useToast } from '@/hooks/use-toast';

const Achievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const { toast } = useToast();

  const handleSaveAchievement = (achievement: Achievement) => {
    if (editingAchievement) {
      // Update existing achievement
      setAchievements(prev => 
        prev.map(a => a.id === achievement.id ? achievement : a)
      );
      toast({
        title: "Achievement updated",
        description: "Your achievement has been updated successfully.",
      });
    } else {
      // Add new achievement
      setAchievements(prev => [...prev, achievement]);
      toast({
        title: "Achievement added",
        description: "Your new achievement has been added successfully.",
      });
    }
    setIsAddDialogOpen(false);
    setEditingAchievement(null);
  };

  const handleEditAchievement = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setIsAddDialogOpen(true);
  };

  const handleDeleteAchievement = (achievementId: string) => {
    setAchievements(prev => prev.filter(achievement => achievement.id !== achievementId));
    toast({
      title: "Achievement deleted",
      description: "Your achievement has been deleted successfully.",
    });
  };

  const openAddDialog = () => {
    setEditingAchievement(null);
    setIsAddDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 dark:from-background dark:to-secondary/10 px-4 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <Link to="/" className="inline-flex items-center text-primary hover:underline mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold">My Achievements</h1>
            <p className="text-muted-foreground mt-2">A collection of my accomplishments and recognitions</p>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {/* Always present "Add New Achievement" card */}
          <Card className="flex flex-col h-full bg-primary/5 border-dashed border-primary/30 hover:bg-primary/10 transition-colors cursor-pointer" onClick={openAddDialog}>
            <div className="flex flex-col items-center justify-center h-full py-12">
              <div className="rounded-full bg-primary/20 p-4 mb-4">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium text-center">New Achievement</h3>
              <p className="text-muted-foreground text-center mt-2">Click to add a new achievement</p>
            </div>
          </Card>
          
          {/* Display existing achievements */}
          {achievements.map((achievement) => (
            <Card key={achievement.id} className="flex flex-col h-full relative">
              <button
                onClick={() => handleDeleteAchievement(achievement.id)}
                className="absolute top-3 right-3 z-10 p-1.5 bg-destructive/90 text-white rounded-full hover:bg-destructive transition-colors"
                aria-label="Delete Achievement"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              
              <CardHeader>
                <div className="relative w-full h-48 -mt-1 -mx-1 overflow-hidden rounded-t-lg">
                  <img 
                    src={achievement.image} 
                    alt={achievement.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-primary/90 dark:bg-accent/90 text-white text-xs px-2 py-1 rounded">
                    {achievement.date}
                  </div>
                </div>
                <CardTitle className="text-xl mt-4">{achievement.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">{achievement.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                {achievement.link ? (
                  <Button 
                    variant="outline" 
                    asChild
                    className="flex-1 mr-2"
                  >
                    <a 
                      href={achievement.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      View
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    disabled
                    className="flex-1 mr-2"
                  >
                    No Link Available
                  </Button>
                )}
                <Button 
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditAchievement(achievement);
                  }}
                >
                  <Pen className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <AddAchievementDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
        onSave={handleSaveAchievement}
        achievement={editingAchievement}
      />
    </div>
  );
};

export default Achievements;
