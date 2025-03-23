import { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
  link?: string;
}

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

  useEffect(() => {
    if (achievement) {
      setTitle(achievement.title);
      setDescription(achievement.description);
      setDate(achievement.date);
      setImage(achievement.image);
      setLink(achievement.link || '');
    } else {
      resetForm();
    }
  }, [achievement, open]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDate('');
    setImage('');
    setLink('');
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{achievement ? 'Edit Achievement' : 'Add New Achievement'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Achievement Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter achievement title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Achievement Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter achievement description"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="Enter date (e.g., June 2023)"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Background Image URL</Label>
            <Input
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Enter image URL"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="link">Link to View Achievement</Label>
            <Input
              id="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Enter URL to view the achievement"
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Achievement</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAchievementDialog;
