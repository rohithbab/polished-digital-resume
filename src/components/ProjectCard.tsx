import React from 'react';
import { ExternalLink, Github, Edit, Trash } from 'lucide-react';

const ProjectCard = ({ demoUrl = '#', codeUrl = '#', onEdit, onDelete }) => {
  return (
    <div className="project-card flex flex-col h-full animate-fade-in">
      <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
        <img 
          src="/path/to/image.jpg" 
          alt="Project Title" 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <h3 className="text-xl font-bold mb-2">Project Title</h3>
      <p className="text-muted-foreground mb-4 flex-grow">Project Explanation</p>
      <div className="mt-auto flex justify-between items-center">
        <div className="flex space-x-3">
          <a 
            href={demoUrl} 
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-secondary/80 dark:hover:bg-secondary/40 transition-colors"
            aria-label="View Demo"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
          <a 
            href={codeUrl} 
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-secondary/80 dark:hover:bg-secondary/40 transition-colors"
            aria-label="View Code"
          >
            <Github className="h-4 w-4" />
          </a>
          <button 
            onClick={onEdit}
            className="p-2 rounded-full hover:bg-secondary/80 dark:hover:bg-secondary/40 transition-colors" 
            aria-label="Edit Project"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button 
            onClick={onDelete}
            className="p-2 rounded-full hover:bg-secondary/80 dark:hover:bg-secondary/40 transition-colors" 
            aria-label="Delete Project"
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
