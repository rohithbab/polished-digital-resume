// Skill interface definition
export interface Skill {
  id?: string;
  name: string;
  level: number; // Percentage value between 0-100
  subtopics: string[];
}

// Empty array for initial state
export const skillsData: Skill[] = [];

// Export skillsData as skills for compatibility with component imports
export const skills = skillsData; 