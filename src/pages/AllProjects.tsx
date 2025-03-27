import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Github, Search, Plus, Trash2, Pen } from 'lucide-react';
import { projects as initialProjects } from '../lib/projects';
import Navbar from '../components/Navbar';
import FloatingIcons from '../components/FloatingIcons';
import { useToast } from '@/hooks/use-toast';
import AddProjectDialog from '@/components/AddProjectDialog';
import { Project } from '@/lib/projects';
import { useAuthGuard } from '../hooks/useAuthGuard';
import LoginModal from '../components/ui/LoginModal';

const AllProjects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProjects, setFilteredProjects] = useState(initialProjects);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [projects, setProjects] = useState(initialProjects);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { toast } = useToast();
  const { isAuthenticated, showLoginModal, setShowLoginModal, handleProtectedAction } = useAuthGuard();
  
  // Extract all unique technologies
  const allTechnologies = Array.from(
    new Set(projects.flatMap(project => project.technologies))
  ).sort();
  
  useEffect(() => {
    let result = projects;
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        project => 
          project.title.toLowerCase().includes(term) || 
          project.description.toLowerCase().includes(term) ||
          project.technologies.some(tech => tech.toLowerCase().includes(term))
      );
    }
    
    // Filter by selected technology
    if (selectedTech) {
      result = result.filter(
        project => project.technologies.includes(selectedTech)
      );
    }
    
    setFilteredProjects(result);
  }, [searchTerm, selectedTech, projects]);
  
  const handleTechFilter = (tech: string) => {
    setSelectedTech(prev => prev === tech ? null : tech);
  };

  const handleSaveProject = (project: Project) => {
    if (editingProject) {
      // Update existing project
      setProjects(prev => 
        prev.map(p => p.id === project.id ? project : p)
      );
      toast({
        title: "Project updated",
        description: "Your project has been updated successfully.",
      });
    } else {
      // Add new project
      setProjects(prev => [...prev, project]);
      toast({
        title: "Project added",
        description: "Your new project has been added successfully.",
      });
    }
    setIsAddDialogOpen(false);
    setEditingProject(null);
  };

  const handleEditProject = (project: Project) => {
    handleProtectedAction(() => {
      setEditingProject(project);
      setIsAddDialogOpen(true);
    });
  };

  const handleDeleteProject = (projectId: string) => {
    handleProtectedAction(() => {
      setProjects(prev => prev.filter(project => project.id !== projectId));
      toast({
        title: "Project deleted",
        description: "Your project has been deleted successfully.",
      });
    });
  };

  const openAddDialog = () => {
    handleProtectedAction(() => {
      setEditingProject(null);
      setIsAddDialogOpen(true);
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <div className="section-container">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="btn-secondary">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold">All Projects</h1>
          </div>

          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-accent/50"
              />
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Filter by Technology</h2>
            <div className="flex flex-wrap gap-2">
              {allTechnologies.map((tech) => (
                <button
                  key={tech}
                  onClick={() => handleTechFilter(tech)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedTech === tech
                      ? 'bg-primary text-white dark:bg-accent'
                      : 'bg-secondary hover:bg-secondary/80 dark:bg-secondary/40 dark:hover:bg-secondary/60'
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.length === 0 && !selectedTech && searchTerm === '' ? (
              <div className="text-center py-12 animate-fade-in">
                <p className="text-xl text-muted-foreground">No projects match your search criteria.</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedTech(null);
                  }}
                  className="mt-4 btn-secondary"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                {/* Always present "Add New Project" card */}
                {isAuthenticated && (
                  <div 
                    className="project-card flex flex-col h-full animate-fade-in bg-primary/5 border-dashed border-primary/30 hover:bg-primary/10 transition-colors cursor-pointer rounded-lg"
                    onClick={openAddDialog}
                  >
                    <div className="flex flex-col items-center justify-center h-full py-12">
                      <div className="rounded-full bg-primary/20 p-4 mb-4">
                        <Plus className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-medium text-center">New Project</h3>
                      <p className="text-muted-foreground text-center mt-2">Click to add a new project</p>
                    </div>
                  </div>
                )}

                {filteredProjects.map((project, index) => (
                  <div 
                    key={project.id}
                    className="project-card flex flex-col h-full animate-fade-in relative"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {isAuthenticated && (
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="absolute top-2 right-2 z-10 p-1.5 bg-destructive/90 text-white rounded-full hover:bg-destructive transition-colors"
                        aria-label="Delete Project"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                    
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
                    
                    <div className="flex gap-2 mt-auto">
                      <Link 
                        to={`/project/${project.id}`} 
                        className="btn-primary flex-1 justify-center"
                      >
                        View Details
                      </Link>
                      <div className="flex gap-2">
                        {project.demoUrl && (
                          <a 
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-secondary"
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
                            className="btn-secondary"
                            aria-label="View Code"
                          >
                            <Github className="h-4 w-4" />
                          </a>
                        )}
                        {isAuthenticated && (
                          <button
                            className="btn-secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditProject(project);
                            }}
                            aria-label="Edit Project"
                          >
                            <Pen className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </main>

      <AddProjectDialog
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
        onSave={handleSaveProject}
        project={editingProject}
      />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={() => setShowLoginModal(false)}
      />
    </div>
  );
};

export default AllProjects;
