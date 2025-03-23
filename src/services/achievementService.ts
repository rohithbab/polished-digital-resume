import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from '@firebase/firestore';
import { db } from '../lib/firebase';
import { Achievement } from '../lib/achievements';

const COLLECTION_NAME = 'achievements';
const achievementsCollection = collection(db, COLLECTION_NAME);

// Get all achievements
export const getAllAchievements = async (): Promise<Achievement[]> => {
  const snapshot = await getDocs(achievementsCollection);
  return snapshot.docs.map(doc => ({
    ...doc.data() as Achievement,
    id: doc.id
  }));
};

// Add a new achievement
export const addAchievement = async (achievement: Omit<Achievement, 'id'>): Promise<string> => {
  const docRef = await addDoc(achievementsCollection, achievement);
  return docRef.id;
};

// Update an achievement
export const updateAchievement = async (id: string, achievement: Partial<Achievement>): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, achievement);
};

// Delete an achievement
export const deleteAchievement = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}; 