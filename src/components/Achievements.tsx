import { Trophy, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { achievements } from '../lib/achievements';

const Achievements = () => {
  return (
    <section id="achievements" className="py-20">
      <div className="section-container">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="mb-4">Achievements</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Recognition and noteworthy accomplishments in my data science journey.
          </p>
        </div>
        
        <div className="text-center py-12 animate-fade-in">
          <p className="text-muted-foreground">No achievements added yet. Click below to add your first achievement.</p>
        </div>
        
        <div className="flex justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Link
            to="/achievements"
            className="btn-primary"
          >
            See All Achievements
            <Trophy className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Achievements;
