import { projects } from './projects';
import { achievements } from './achievements';
import { skillsData } from './skills';
import { aboutData } from './about';
import { educationData } from './education';
import { hobbiesData } from './hobbies';
import { getAllProjects } from '../services/projectService';
import { getAllAchievements } from '../services/achievementService';
import { getAllSkills } from '../services/skillService';
import { getAllAbout } from '../services/aboutService';
import { getAllEducation } from '../services/educationService';
import { getAllHobbies } from '../services/hobbiesService';

/**
 * Checks Firebase collections and logs their status
 */
export async function initializeAllCollections() {
  try {
    // Check if projects collection exists
    const projectsData = await getAllProjects();
    console.log(`Projects collection has ${projectsData.length} items`);

    // Check if achievements collection exists
    const achievementsData = await getAllAchievements();
    console.log(`Achievements collection has ${achievementsData.length} items`);

    // Check if skills collection exists
    const skillsData = await getAllSkills();
    console.log(`Skills collection has ${skillsData.length} items`);

    // Check if about collection exists
    const aboutData = await getAllAbout();
    console.log(`About collection has ${aboutData.length} items`);

    // Check if education collection exists
    const educationData = await getAllEducation();
    console.log(`Education collection has ${educationData.length} items`);

    // Check if hobbies collection exists
    const hobbiesData = await getAllHobbies();
    console.log(`Hobbies collection has ${hobbiesData.length} items`);

    console.log('All Firebase collections are ready');
  } catch (error) {
    console.error('Error checking collections:', error);
  }
} 