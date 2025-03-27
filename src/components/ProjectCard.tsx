import React from 'react';
import { ExternalLink, Github, Pencil, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Project } from '../lib/projects';
import { useAuth } from '../context/AuthContext';

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  isPreview?: boolean;
}

const ProjectCard = ({ project, onEdit, onDelete, isPreview = false }: ProjectCardProps) => {
  const { user } = useAuth();
  
  return (
    <Card className="group relative overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-xl">{project.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{project.summary}</p>
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech, index) => (
              <Badge key={index} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex space-x-3">
          {project.demoUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Live Demo
              </a>
            </Button>
          )}
          {project.codeUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={project.codeUrl} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4 mr-2" />
                View Code
              </a>
            </Button>
          )}
        </div>
        {!isPreview && user && (
          <div className="flex space-x-2">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(project);
                }}
                className="hover:bg-primary/10"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(project);
                }}
                className="hover:bg-destructive/10 text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
