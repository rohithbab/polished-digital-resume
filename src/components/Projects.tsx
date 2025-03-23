import { useState } from 'react';
import { ArrowRight, ExternalLink, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProjectCard from './ProjectCard';

const Projects = () => {
  return (
    <section id="projects" className="py-20">
      <div className="section-container">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="mb-4">Projects</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore some of my recent data analysis and visualization projects.
          </p>
        </div>
        
        <div className="text-center py-12 animate-fade-in">
          <p className="text-muted-foreground">No projects added yet. Click below to add your first project.</p>
        </div>
        
        <div className="flex justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Link
            to="/projects"
            className="btn-primary"
          >
            See More Projects
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Projects;
