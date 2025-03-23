import { useState, useEffect } from 'react';
import { LineChart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { skills as allSkills } from '../lib/skills';
import { getAllSkills } from '../services/skillService';

const SkillCard = ({ skill, isPreview = false }) => {
  // Helper function to safely handle subtopics whether it's an array or string
  const getSubtopics = () => {
    if (Array.isArray(skill.subtopics)) {
      return skill.subtopics;
    } else if (typeof skill.subtopics === 'string') {
      return skill.subtopics.split(',').map(s => s.trim());
    }
    return [];
  };
  
  const subtopics = getSubtopics();
  
  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">{skill.name}</h3>
      </div>
      
      <div className="flex justify-between text-sm mb-1">
        <span>Proficiency</span>
        <span>{skill.level}%</span>
      </div>
      <div className="w-full bg-secondary/50 dark:bg-secondary/30 rounded-full h-2.5 mb-4">
        <div 
          className="bg-primary dark:bg-accent h-2.5 rounded-full"
          style={{ width: `${skill.level}%` }}
        ></div>
      </div>
      
      <div>
        <h4 className="font-semibold mb-2">Subtopics:</h4>
        <ul className="space-y-1">
          {subtopics.slice(0, 3).map((subtopic, index) => (
            <li key={index} className="flex items-center">
              <div className="w-1.5 h-1.5 bg-primary dark:bg-accent rounded-full mr-2"></div>
              <span>{subtopic}</span>
            </li>
          ))}
          {subtopics.length > 3 && (
            <li className="text-muted-foreground text-sm">
              +{subtopics.length - 3} more subtopics
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

const Skills = () => {
  const [skills, setSkills] = useState(allSkills.slice(0, 3));
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setIsLoading(true);
        const data = await getAllSkills();
        
        // If there are skills in Firebase, use them. Otherwise, use the local data
        if (data.length > 0) {
          setSkills(data.slice(0, 3)); // Only show first 3 skills on homepage
        } else {
          setSkills(allSkills.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
        // Fall back to local data if there's an error
        setSkills(allSkills.slice(0, 3));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSkills();
  }, []);
  
  return (
    <section id="skills" className="py-20 bg-secondary/30 dark:bg-secondary/10">
      <div className="section-container">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="mb-4">Skills</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Technical expertise and competencies that I bring to data analytics projects.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12 animate-fade-in">
            <div className="h-12 w-12 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
        ) : skills.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <p className="text-muted-foreground">No skills added yet. Click below to add your skills.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {skills.map((skill, index) => (
              <SkillCard key={skill.id} skill={skill} isPreview={true} />
            ))}
          </div>
        )}
        
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
