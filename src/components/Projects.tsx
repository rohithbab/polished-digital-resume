import { useState, useEffect } from 'react';
import { ArrowRight, ExternalLink, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProjectCard from './ProjectCard';
import { projects as allProjects } from '../lib/projects';
import { getAllProjects } from '../services/projectService';

const Projects = () => {
  const [projects, setProjects] = useState(allProjects.slice(0, 3));
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const data = await getAllProjects();
        
        // If there are projects in Firebase, use them. Otherwise, use the local data
        if (data.length > 0) {
          setProjects(data.slice(0, 3)); // Only show first 3 projects on homepage
        } else {
          setProjects(allProjects.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        // Fall back to local data if there's an error
        setProjects(allProjects.slice(0, 3));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  return (
    <section id="projects" className="py-20">
      <div className="section-container">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="mb-4">Projects</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore some of my recent data analysis and visualization projects.
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12 animate-fade-in">
            <div className="h-12 w-12 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <p className="text-muted-foreground">No projects added yet. Click below to add your first project.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {projects.map((project, index) => (
              <ProjectCard 
                key={project.id} 
                project={project}
                onEdit={() => {}} 
                onDelete={() => {}} 
                isPreview={true}
              />
            ))}
          </div>
        )}
        
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
