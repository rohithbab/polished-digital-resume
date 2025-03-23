import { projects } from './projects';
import { achievements } from './achievements';
import { skillsData } from './skills';
import { getAllProjects } from '../services/projectService';
import { getAllAchievements } from '../services/achievementService';
import { getAllSkills } from '../services/skillService';

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

    console.log('All Firebase collections are ready');
  } catch (error) {
    console.error('Error checking collections:', error);
  }
} 