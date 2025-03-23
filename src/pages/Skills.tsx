import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash } from 'lucide-react';
import AddSkillDialog, { Skill } from '../components/AddSkillDialog';

const SkillsPage = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setIsAddDialogOpen(true);
  };

  const handleDelete = (skillId: string) => {
    setSkills(prev => prev.filter(skill => skill.id !== skillId));
  };

  const handleAddNewSkill = () => {
    setEditingSkill(null);
    setIsAddDialogOpen(true);
  };

  const handleSaveSkill = (skill: Skill) => {
    if (editingSkill) {
      // Update existing skill
      setSkills(prev => 
        prev.map(s => s.id === skill.id ? skill : s)
      );
    } else {
      // Add new skill
      setSkills(prev => [...prev, skill]);
    }
    setIsAddDialogOpen(false);
    setEditingSkill(null);
  };

  return (
    <section className="py-20 bg-secondary/30 dark:bg-secondary/10">
      <div className="section-container">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="mb-4">All Skills</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Here you can explore all my skills and add new ones.
          </p>
        </div>
        
        <div className="flex justify-center animate-fade-in mb-6">
          <Link to="/" className="btn-secondary">
            Back to Home
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {/* Display existing skills */}
          {skills.map((skill) => (
            <div 
              key={skill.id}
              className="glass-card p-6 animate-fade-in"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{skill.name}</h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEdit(skill)}
                    className="p-2 rounded-full hover:bg-secondary/80 dark:hover:bg-secondary/40 transition-colors" 
                    aria-label="Edit Skill"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(skill.id)}
                    className="p-2 rounded-full hover:bg-secondary/80 dark:hover:bg-secondary/40 transition-colors" 
                    aria-label="Delete Skill"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Proficiency</span>
                  <span>{skill.level}%</span>
                </div>
                <div className="w-full bg-secondary/50 dark:bg-secondary/30 rounded-full h-2.5">
                  <div 
                    className="bg-primary dark:bg-accent h-2.5 rounded-full"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Subtopics:</h4>
                <ul className="space-y-1">
                  {skill.subtopics.split(',').map((subtopic, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-primary dark:bg-accent rounded-full mr-2"></div>
                      <span>{subtopic.trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
          
          {/* Add new skill card */}
          <div 
            className="glass-card p-6 flex flex-col items-center justify-center min-h-[220px] cursor-pointer hover:bg-secondary/20 transition-all"
            onClick={handleAddNewSkill}
          >
            <Plus className="h-10 w-10 text-primary dark:text-accent mb-4" />
            <span className="text-primary dark:text-accent font-medium text-lg">Add Skill</span>
          </div>
        </div>
      </div>

      {/* Skill Dialog for adding/editing */}
      <AddSkillDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={handleSaveSkill}
        skill={editingSkill}
      />
    </section>
  );
};

export default SkillsPage; 