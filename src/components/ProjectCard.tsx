import React from 'react';
import { ExternalLink, Github, Edit, Trash } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  summary: string;
  image: string;
  demoUrl?: string;
  codeUrl?: string;
  technologies: string[];
}

interface ProjectCardProps {
  project?: Project;
  onEdit: () => void;
  onDelete: () => void;
  isPreview?: boolean;
}

const ProjectCard = ({ project, onEdit, onDelete, isPreview = false }: ProjectCardProps) => {
  // If no project is provided, return a placeholder card
  if (!project) {
    return (
      <div className="project-card flex flex-col h-full animate-fade-in">
        <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg bg-secondary/10">
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-muted-foreground">No Image</span>
          </div>
        </div>
        <h3 className="text-xl font-bold mb-2">Project Title</h3>
        <p className="text-muted-foreground mb-4 flex-grow">Project Explanation</p>
        <div className="mt-auto flex justify-between items-center">
          <div className="flex space-x-3">
            <button className="p-2 rounded-full hover:bg-secondary/80 dark:hover:bg-secondary/40 transition-colors">
              <ExternalLink className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-full hover:bg-secondary/80 dark:hover:bg-secondary/40 transition-colors">
              <Github className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-full hover:bg-secondary/80 dark:hover:bg-secondary/40 transition-colors">
              <Edit className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-full hover:bg-secondary/80 dark:hover:bg-secondary/40 transition-colors">
              <Trash className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete();
  };

  return (
    <div className="project-card flex flex-col h-full animate-fade-in">
      <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <h3 className="text-xl font-bold mb-2">{project.title}</h3>
      <p className="text-muted-foreground mb-4 flex-grow">{project.description}</p>
      <div className="mt-auto flex justify-between items-center">
        <div className="flex space-x-3">
          {project.demoUrl && (
            <a 
              href={project.demoUrl} 
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-secondary/80 dark:hover:bg-secondary/40 transition-colors"
              aria-label="View Demo"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          {project.codeUrl && (
            <a 
              href={project.codeUrl} 
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-secondary/80 dark:hover:bg-secondary/40 transition-colors"
              aria-label="View Code"
            >
              <Github className="h-4 w-4" />
            </a>
          )}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-2 rounded-full hover:bg-primary/10 dark:hover:bg-accent/10 transition-colors" 
            aria-label="Edit Project"
          >
            <Edit className="h-4 w-4 text-primary dark:text-accent" />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2 rounded-full hover:bg-destructive/10 transition-colors" 
            aria-label="Delete Project"
          >
            <Trash className="h-4 w-4 text-destructive" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
