import React, { useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import AddProjectDialog, { Project } from '../components/AddProjectDialog';

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsAddDialogOpen(true);
  };

  const handleDelete = (projectId: string) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
  };

  const handleAddNewProject = () => {
    setEditingProject(null);
    setIsAddDialogOpen(true);
  };

  const handleSaveProject = (project: Project) => {
    if (editingProject) {
      // Update existing project
      setProjects(prev => 
        prev.map(p => p.id === project.id ? project : p)
      );
    } else {
      // Add new project
      setProjects(prev => [...prev, project]);
    }
    setIsAddDialogOpen(false);
    setEditingProject(null);
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
