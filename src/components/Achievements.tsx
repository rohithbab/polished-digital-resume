import { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { achievements as allAchievements } from '../lib/achievements';
import { getAllAchievements } from '../services/achievementService';
import AchievementCard from './AchievementCard';

const Achievements = () => {
  const [achievements, setAchievements] = useState(allAchievements.slice(0, 3));
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setIsLoading(true);
        const data = await getAllAchievements();
        
        // If there are achievements in Firebase, use them. Otherwise, use the local data
        if (data.length > 0) {
          setAchievements(data.slice(0, 3)); // Only show first 3 achievements on homepage
        } else {
          setAchievements(allAchievements.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching achievements:", error);
        // Fall back to local data if there's an error
        setAchievements(allAchievements.slice(0, 3));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAchievements();
  }, []);
  
  return (
    <section id="achievements" className="py-20">
      <div className="section-container">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="mb-4">Achievements</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Recognition and noteworthy accomplishments in my data science journey.
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12 animate-fade-in">
            <div className="h-12 w-12 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
        ) : achievements.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <p className="text-muted-foreground">No achievements added yet. Click below to add your first achievement.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {achievements.slice(0, 3).map((achievement) => (
              <AchievementCard 
                key={achievement.id} 
                achievement={achievement} 
                isPreview={true}
              />
            ))}
          </div>
        )}
        
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
