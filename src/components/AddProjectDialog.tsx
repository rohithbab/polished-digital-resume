import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Project } from '../lib/projects';
import ImageUpload from './ImageUpload';

interface AddProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (project: Project) => void;
  project?: Project | null;
}

const AddProjectDialog = ({ open, onOpenChange, onSave, project }: AddProjectDialogProps) => {
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    description: '',
    summary: '',
    image: '',
    demoUrl: '',
    codeUrl: '',
    technologies: []
  });

  useEffect(() => {
    if (project) {
      setFormData(project);
    } else {
      setFormData({
        title: '',
        description: '',
        summary: '',
        image: '',
        demoUrl: '',
        codeUrl: '',
        technologies: []
      });
    }
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields (only title, description, and summary are required)
    if (!formData.title?.trim() || !formData.description?.trim() || !formData.summary?.trim()) {
      return;
    }

    // Create a placeholder image URL with the project title
    const placeholderImage = `https://placehold.co/400x400/3b82f6/ffffff?text=${encodeURIComponent(formData.title)}`;

    // Ensure technologies is an array and image has a default value if not provided
    const projectData = {
      ...formData,
      technologies: formData.technologies || [],
      image: formData.image || placeholderImage
    };

    // Call onSave with the complete project data
    onSave(projectData as Project);
  };

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({ ...prev, image: url }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{project ? 'Edit Project' : 'Add New Project'}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Project Image</Label>
              <ImageUpload
                onImageUpload={handleImageUpload}
                currentImage={formData.image}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Short Summary</Label>
              <Input
                id="summary"
                value={formData.summary}
                onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="demoUrl">Demo URL</Label>
              <Input
                id="demoUrl"
                type="url"
                value={formData.demoUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, demoUrl: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="codeUrl">Code URL</Label>
              <Input
                id="codeUrl"
                type="url"
                value={formData.codeUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, codeUrl: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="technologies">Technologies (comma or space-separated)</Label>
              <Input
                id="technologies"
                value={formData.technologies?.join(', ')}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  technologies: e.target.value
                    .split(/[,\s]+/) // Split by both comma and whitespace
                    .map(tech => tech.trim())
                    .filter(Boolean)
                }))}
                placeholder="e.g., React, TypeScript, Node.js"
              />
            </div>

            <div className="flex justify-end space-x-4 mt-6 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {project ? 'Update Project' : 'Add Project'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddProjectDialog;
