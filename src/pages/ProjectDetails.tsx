
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { Project, projects } from '../lib/projects';
import Navbar from '../components/Navbar';
import FloatingIcons from '../components/FloatingIcons';

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading to show animation
    const timer = setTimeout(() => {
      const foundProject = projects.find(p => p.id === id) || null;
      setProject(foundProject);
      setLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary/30 dark:border-accent/30 border-t-primary dark:border-t-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
        <p className="text-muted-foreground mb-8">The project you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <FloatingIcons />
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="section-container">
          <div className="mb-8 animate-fade-in">
            <Link to="/#projects" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </div>
          
          <div className="glass-card p-6 md:p-10 animate-scale-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="order-2 lg:order-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{project.title}</h1>
                
                <div className="mb-6">
                  <p className="text-lg mb-4">{project.summary}</p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-3">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span 
                        key={tech} 
                        className="px-3 py-1 rounded-full bg-secondary dark:bg-secondary/40"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  {project.demoUrl && (
                    <a 
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                    >
                      Live Demo
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  )}
                  
                  {project.codeUrl && (
                    <a 
                      href={project.codeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                    >
                      View Code
                      <Github className="ml-2 h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
              
              <div className="order-1 lg:order-2">
                <div className="relative rounded-xl overflow-hidden shadow-xl h-72 md:h-80 lg:h-full">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-10 animate-fade-in-slow">
            <h2 className="text-2xl font-bold mb-6">Other Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects
                .filter(p => p.id !== project.id)
                .slice(0, 3)
                .map((p) => (
                  <Link 
                    key={p.id}
                    to={`/project/${p.id}`}
                    className="project-card"
                  >
                    <div className="h-40 mb-4 rounded-lg overflow-hidden">
                      <img 
                        src={p.image} 
                        alt={p.title} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{p.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetails;
