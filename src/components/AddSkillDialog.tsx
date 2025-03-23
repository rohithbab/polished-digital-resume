import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export interface Skill {
  id: string;
  name: string;
  level: number;
  subtopics: string;
  icon?: string;
}

interface AddSkillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (skill: Skill) => void;
  skill: Skill | null;
}

const AddSkillDialog = ({
  open,
  onOpenChange,
  onSave,
  skill
}: AddSkillDialogProps) => {
  const [name, setName] = useState('');
  const [level, setLevel] = useState(50);
  const [subtopics, setSubtopics] = useState('');

  useEffect(() => {
    if (skill) {
      setName(skill.name);
      setLevel(skill.level);
      setSubtopics(skill.subtopics);
    } else {
      resetForm();
    }
  }, [skill, open]);

  const resetForm = () => {
    setName('');
    setLevel(50);
    setSubtopics('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newSkill: Skill = {
      id: skill ? skill.id : `skill-${Date.now()}`,
      name,
      level,
      subtopics
    };
    
    onSave(newSkill);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{skill ? 'Edit Skill' : 'Add New Skill'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Skill Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter skill name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="level">
              Skill Level: {level}%
            </Label>
            <Slider
              id="level"
              value={[level]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => setLevel(value[0])}
              className="py-4"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subtopics">Subtopics (comma separated)</Label>
            <Textarea
              id="subtopics"
              value={subtopics}
              onChange={(e) => setSubtopics(e.target.value)}
              placeholder="Enter subtopics covered in this skill (comma separated)"
              required
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Skill</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSkillDialog; 