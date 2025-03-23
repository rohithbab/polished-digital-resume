import React, { useState, useEffect } from 'react';
import ProjectCard from '../components/ProjectCard';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import AddProjectDialog from '../components/AddProjectDialog';
import { projects as initialProjects, Project } from '../lib/projects';
import { getAllProjects, addProject as fbAddProject, updateProject as fbUpdateProject, deleteProject as fbDeleteProject } from '../services/projectService';

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
  }, []);

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (projectId: string) => {
    try {
      await fbDeleteProject(projectId);
      setProjects(prev => prev.filter(project => project.id !== projectId));
    } catch (error) {
      console.error("Error deleting project:", error);
      // Handle error (maybe show a toast notification)
    }
  };

  const handleAddNewProject = () => {
    setEditingProject(null);
    setIsAddDialogOpen(true);
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
      } else {
        // Add new project
        const { id, ...projectData } = project;
        const newId = await fbAddProject(projectData);
        setProjects(prev => [...prev, { ...project, id: newId }]);
      }
      setIsAddDialogOpen(false);
      setEditingProject(null);
    } catch (error) {
      console.error("Error saving project:", error);
      // Handle error (maybe show a toast notification)
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
                onDelete={() => handleDelete(project.id)} 
              />
            ))}
            
            {/* Add new project card */}
            <div 
              className="project-card flex flex-col items-center justify-center h-48 bg-secondary/10 dark:bg-secondary/20 rounded-lg cursor-pointer hover:bg-secondary/20 transition-all"
              onClick={handleAddNewProject}
            >
              <Plus className="h-8 w-8 text-primary mb-2" />
              <span className="text-primary dark:text-accent font-medium">Add Project</span>
            </div>
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
    </section>
  );
};

export default ProjectsPage;
