
import { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Achievement } from '@/lib/achievements';

interface AddAchievementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (achievement: Achievement) => void;
  achievement: Achievement | null;
}

const AddAchievementDialog = ({
  open,
  onOpenChange,
  onSave,
  achievement
}: AddAchievementDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [image, setImage] = useState('');
  const [link, setLink] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLinkEditing, setIsLinkEditing] = useState(false);

  useEffect(() => {
    if (achievement) {
      setTitle(achievement.title);
      setDescription(achievement.description);
      setDate(achievement.date);
      setImage(achievement.image);
      setLink(achievement.link || '');
      setIsEditing(true);
    } else {
      resetForm();
      setIsEditing(false);
    }
  }, [achievement, open]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDate('');
    setImage('');
    setLink('');
    setIsLinkEditing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAchievement: Achievement = {
      id: achievement ? achievement.id : `achievement-${Date.now()}`,
      title,
      description,
      date,
      image,
      link: link.trim() !== '' ? link : undefined
    };
    
    onSave(newAchievement);
    resetForm();
  };

  const toggleLinkEdit = () => {
    setIsLinkEditing(!isLinkEditing);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Achievement' : 'Add New Achievement'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Achievement title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of your achievement"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="e.g., June 2023"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="URL to achievement image"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="link" className="flex justify-between">
              <span>Link (Optional)</span>
              {isEditing && link && !isLinkEditing && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={toggleLinkEdit}
                  className="h-6 px-2 text-xs"
                >
                  Edit Link
                </Button>
              )}
            </Label>
            
            {(isLinkEditing || !link || !isEditing) ? (
              <Input
                id="link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="URL to more details (optional)"
              />
            ) : (
              <div className="flex items-center gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  asChild 
                  className="flex-1"
                >
                  <a 
                    href={link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-center"
                  >
                    View Link
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={toggleLinkEdit}
                >
                  Edit
                </Button>
              </div>
            )}
          </div>
          
          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? 'Update Achievement' : 'Add Achievement'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAchievementDialog;
