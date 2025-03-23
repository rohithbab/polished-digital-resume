import { useState, useEffect } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export interface Project {
  id: string;
  title: string;
  description: string;
  summary: string;
  image: string;
  demoUrl?: string;
  codeUrl?: string;
  technologies: string[];
}

interface AddProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (project: Project) => void;
  project: Project | null;
}

const AddProjectDialog = ({
  open,
  onOpenChange,
  onSave,
  project
}: AddProjectDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [codeUrl, setCodeUrl] = useState('');

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setDescription(project.description);
      setImage(project.image);
      setDemoUrl(project.demoUrl || '');
      setCodeUrl(project.codeUrl || '');
    } else {
      resetForm();
    }
  }, [project, open]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setImage('');
    setDemoUrl('');
    setCodeUrl('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newProject: Project = {
      id: project ? project.id : `project-${Date.now()}`,
      title,
      description,
      summary: description, // Using description as summary for simplicity
      image,
      demoUrl: demoUrl.trim() !== '' ? demoUrl : undefined,
      codeUrl: codeUrl.trim() !== '' ? codeUrl : undefined,
      technologies: [] // Empty technologies for now
    };
    
    onSave(newProject);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{project ? 'Edit Project' : 'Add New Project'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter project title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter project description"
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
            <Label htmlFor="demoUrl">Demo URL</Label>
            <Input
              id="demoUrl"
              value={demoUrl}
              onChange={(e) => setDemoUrl(e.target.value)}
              placeholder="Enter demo URL"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="codeUrl">Code URL</Label>
            <Input
              id="codeUrl"
              value={codeUrl}
              onChange={(e) => setCodeUrl(e.target.value)}
              placeholder="Enter code URL"
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Project</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProjectDialog;
