import React from 'react';
import ProjectCard from '../components/ProjectCard';

const ProjectsPage = () => {
  return (
    <section className="py-20">
      <div className="section-container">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="mb-4">All Projects</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Here you can explore all my projects and add new ones.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {/* Placeholder for Project Cards */}
          {[...Array(6)].map((_, index) => (
            <ProjectCard key={index} />
          ))}
          <div className="project-card flex items-center justify-center h-48 bg-secondary/10 dark:bg-secondary/20 rounded-lg cursor-pointer">
            <span className="text-primary dark:text-accent font-bold text-2xl">+</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsPage;
