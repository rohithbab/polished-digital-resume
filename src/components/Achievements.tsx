
import { Trophy, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { achievements } from '../lib/achievements';

const Achievements = () => {
  const displayedAchievements = achievements.slice(0, 3);
  
  return (
    <section id="achievements" className="py-20">
      <div className="section-container">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="mb-4">Achievements</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Recognition and noteworthy accomplishments in my data science journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {displayedAchievements.map((achievement, index) => (
            <div 
              key={achievement.id}
              className="achievement-card flex flex-col h-full animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
                <img 
                  src={achievement.image} 
                  alt={achievement.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-primary/90 dark:bg-accent/90 text-white text-xs px-2 py-1 rounded">
                  {achievement.date}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">{achievement.title}</h3>
              <p className="text-muted-foreground mb-4 flex-grow">{achievement.description}</p>
              
              {achievement.link && (
                <div className="mt-auto">
                  <a 
                    href={achievement.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-primary dark:text-accent font-medium hover:underline"
                  >
                    View Award
                    <ArrowUpRight className="ml-1 h-4 w-4" />
                  </a>
                </div>
              )}
            </div>
          ))}
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
