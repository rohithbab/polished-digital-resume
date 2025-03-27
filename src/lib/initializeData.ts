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
import { debug } from '../utils/debug';

/**
 * Checks Firebase collections and logs their status
 */
export async function initializeAllCollections() {
  try {
    // Check if projects collection exists
    const projectsData = await getAllProjects();
    await debug.info(`Projects collection has ${projectsData.length} items`);

    // Check if achievements collection exists
    const achievementsData = await getAllAchievements();
    await debug.info(`Achievements collection has ${achievementsData.length} items`);

    // Check if skills collection exists
    const skillsData = await getAllSkills();
    await debug.info(`Skills collection has ${skillsData.length} items`);

    // Check if about collection exists
    const aboutData = await getAllAbout();
    await debug.info(`About collection has ${aboutData.length} items`);

    // Check if education collection exists
    const educationData = await getAllEducation();
    await debug.info(`Education collection has ${educationData.length} items`);

    // Check if hobbies collection exists
    const hobbiesData = await getAllHobbies();
    await debug.info(`Hobbies collection has ${hobbiesData.length} items`);

    await debug.info('All Firebase collections are ready');
  } catch (error) {
    await debug.error('Error checking collections:', error);
    throw error; // Re-throw to be caught by the caller
  }
} 