
import { useState } from 'react';
import { ArrowRight, ExternalLink, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projects } from '../lib/projects';

const Projects = () => {
  const displayedProjects = projects.slice(0, 3);
  
  return (
    <section id="projects" className="py-20">
      <div className="section-container">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="mb-4">Projects</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore some of my recent data analysis and visualization projects.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {displayedProjects.map((project, index) => (
            <div 
              key={project.id}
              className="project-card flex flex-col h-full animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">{project.title}</h3>
              <p className="text-muted-foreground mb-4 flex-grow">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.slice(0, 3).map((tech) => (
                  <span 
                    key={tech} 
                    className="text-xs px-2 py-1 rounded-full bg-secondary dark:bg-secondary/40"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span className="text-xs px-2 py-1 rounded-full bg-secondary dark:bg-secondary/40">
                    +{project.technologies.length - 3}
                  </span>
                )}
              </div>
              <div className="mt-auto flex justify-between items-center">
                <Link 
                  to={`/project/${project.id}`} 
                  className="text-primary dark:text-accent flex items-center font-medium hover:underline"
                >
                  See More
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
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
                </div>
              </div>
            </div>
          ))}
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
