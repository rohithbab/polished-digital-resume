import React, { useState, useEffect } from 'react';
import ProjectCard from '../components/ProjectCard';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import AddProjectDialog from '../components/AddProjectDialog';
import { projects as initialProjects, Project } from '../lib/projects';
import { getAllProjects, addProject as fbAddProject, updateProject as fbUpdateProject, deleteProject as fbDeleteProject } from '../services/projectService';
import { toast } from '../components/ui/use-toast';
import { useAuthGuard } from '../hooks/useAuthGuard';
import LoginModal from '../components/ui/LoginModal';

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const { isAuthenticated, showLoginModal, setShowLoginModal, handleProtectedAction } = useAuthGuard();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const data = await getAllProjects();
        
        // If there are projects in Firebase, use them. Otherwise, use the local data
        if (data.length > 0) {
          setProjects(data);
        } else {
          setProjects(initialProjects);
          
          // Optionally seed the database with initial projects
          // initialProjects.forEach(async (project) => {
          //   const { id, ...projectData } = project;
          //   await fbAddProject(projectData);
          // });
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects(initialProjects);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjects();
  }, [refreshKey]);

  const handleEdit = (project: Project) => {
    handleProtectedAction(() => {
      setEditingProject(project);
      setIsAddDialogOpen(true);
    });
  };

  const handleDeleteProject = async (projectId: string) => {
    handleProtectedAction(async () => {
      try {
        await fbDeleteProject(projectId);
        setProjects(prev => prev.filter(project => project.id !== projectId));
        toast({
          title: "Project deleted",
          description: "Your project has been deleted successfully.",
        });
        
        // Force refresh to get the latest data
        setRefreshKey(prev => prev + 1);
      } catch (error) {
        console.error("Error deleting project:", error);
        toast({
          title: "Error",
          description: "Failed to delete project. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  const handleAddNewProject = () => {
    handleProtectedAction(() => {
      setEditingProject(null);
      setIsAddDialogOpen(true);
    });
  };

  const handleSaveProject = async (project: Project) => {
    try {
      if (editingProject) {
        // Update existing project
        const { id, ...projectData } = project;
        await fbUpdateProject(id, projectData);
        setProjects(prev => 
          prev.map(p => p.id === project.id ? project : p)
        );
        toast({
          title: "Project updated",
          description: "Your project has been updated successfully.",
        });
      } else {
        // Add new project
        const { id, ...projectData } = project;
        const newId = await fbAddProject(projectData);
        const newProject = { ...project, id: newId };
        setProjects(prev => [...prev, newProject]);
        toast({
          title: "Project added",
          description: "Your new project has been added successfully.",
        });
      }
      setIsAddDialogOpen(false);
      setEditingProject(null);
      
      // Force refresh to get the latest data
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error("Error saving project:", error);
      toast({
        title: "Error",
        description: "Failed to save project. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="py-20">
      <div className="section-container">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="mb-4">All Projects</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Here you can explore all my projects and add new ones.
          </p>
        </div>
        
        <div className="flex justify-center animate-fade-in mb-6">
          <Link to="/" className="btn-secondary">
            Back to Home
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12 animate-fade-in">
            <div className="h-12 w-12 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {/* Display existing projects */}
            {projects.map((project, index) => (
              <ProjectCard 
                key={project.id} 
                project={project}
                onEdit={() => handleEdit(project)} 
                onDelete={() => handleDeleteProject(project.id)}
                isPreview={false}
                isAuthenticated={isAuthenticated}
              />
            ))}
            
            {/* Add new project card */}
            {isAuthenticated && (
              <div 
                className="project-card flex flex-col items-center justify-center h-48 bg-secondary/10 dark:bg-secondary/20 rounded-lg cursor-pointer hover:bg-secondary/20 transition-all"
                onClick={handleAddNewProject}
              >
                <Plus className="h-8 w-8 text-primary mb-2" />
                <span className="text-primary dark:text-accent font-medium">Add Project</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Project Dialog for adding/editing */}
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
    </section>
  );
};

export default ProjectsPage;
