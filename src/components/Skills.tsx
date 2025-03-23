import { LineChart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Skills = () => {
  return (
    <section id="skills" className="py-20 bg-secondary/30 dark:bg-secondary/10">
      <div className="section-container">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="mb-4">Skills</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Technical expertise and competencies that I bring to data analytics projects.
          </p>
        </div>

        <div className="text-center py-12 animate-fade-in">
          <p className="text-muted-foreground">No skills added yet. Click below to add your skills.</p>
        </div>
        
        <div className="flex justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Link
            to="/skills"
            className="btn-primary"
          >
            See All Skills
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Skills;
