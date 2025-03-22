
import { useState, useEffect } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Project } from '@/lib/projects';

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
  const [summary, setSummary] = useState('');
  const [image, setImage] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [codeUrl, setCodeUrl] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLinkEditing, setIsLinkEditing] = useState({
    demo: false,
    code: false
  });

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setDescription(project.description);
      setSummary(project.summary);
      setImage(project.image);
      setDemoUrl(project.demoUrl || '');
      setCodeUrl(project.codeUrl || '');
      setTechnologies(project.technologies.join(', '));
      setIsEditing(true);
    } else {
      resetForm();
      setIsEditing(false);
    }
  }, [project, open]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSummary('');
    setImage('');
    setDemoUrl('');
    setCodeUrl('');
    setTechnologies('');
    setIsLinkEditing({
      demo: false,
      code: false
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newProject: Project = {
      id: project ? project.id : `project-${Date.now()}`,
      title,
      description,
      summary,
      image,
      demoUrl: demoUrl.trim() !== '' ? demoUrl : undefined,
      codeUrl: codeUrl.trim() !== '' ? codeUrl : undefined,
      technologies: technologies.split(',').map(tech => tech.trim()).filter(tech => tech !== '')
    };
    
    onSave(newProject);
    resetForm();
  };

  const toggleLinkEdit = (type: 'demo' | 'code') => {
    setIsLinkEditing(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Project' : 'Add New Project'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Project title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Short Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of your project"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="summary">Detailed Summary</Label>
            <Textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Detailed summary of your project"
              required
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="URL to project image"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="demoUrl" className="flex justify-between">
              <span>Demo URL (Optional)</span>
              {isEditing && demoUrl && !isLinkEditing.demo && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => toggleLinkEdit('demo')}
                  className="h-6 px-2 text-xs"
                >
                  Edit Link
                </Button>
              )}
            </Label>
            
            {(isLinkEditing.demo || !demoUrl || !isEditing) ? (
              <Input
                id="demoUrl"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                placeholder="URL to live demo (optional)"
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
                    href={demoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-center"
                  >
                    View Demo
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={() => toggleLinkEdit('demo')}
                >
                  Edit
                </Button>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="codeUrl" className="flex justify-between">
              <span>Code URL (Optional)</span>
              {isEditing && codeUrl && !isLinkEditing.code && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => toggleLinkEdit('code')}
                  className="h-6 px-2 text-xs"
                >
                  Edit Link
                </Button>
              )}
            </Label>
            
            {(isLinkEditing.code || !codeUrl || !isEditing) ? (
              <Input
                id="codeUrl"
                value={codeUrl}
                onChange={(e) => setCodeUrl(e.target.value)}
                placeholder="URL to code repository (optional)"
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
                    href={codeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-center"
                  >
                    View Code
                    <Github className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={() => toggleLinkEdit('code')}
                >
                  Edit
                </Button>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="technologies">Technologies (comma separated)</Label>
            <Input
              id="technologies"
              value={technologies}
              onChange={(e) => setTechnologies(e.target.value)}
              placeholder="e.g., React, Node.js, MongoDB"
              required
            />
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
              {isEditing ? 'Update Project' : 'Add Project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProjectDialog;
