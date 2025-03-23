import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from '@firebase/firestore';
import { db } from '../lib/firebase';
import { Skill } from '../lib/skills';

const COLLECTION_NAME = 'skills';
const skillsCollection = collection(db, COLLECTION_NAME);

// Get all skills
export const getAllSkills = async (): Promise<Skill[]> => {
  const snapshot = await getDocs(skillsCollection);
  return snapshot.docs.map(doc => ({
    ...doc.data() as Skill,
    id: doc.id
  }));
};

// Add a new skill
export const addSkill = async (skill: Omit<Skill, 'id'>): Promise<string> => {
  const docRef = await addDoc(skillsCollection, skill);
  return docRef.id;
};

// Update a skill
export const updateSkill = async (id: string, skill: Partial<Skill>): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, skill);
};

// Delete a skill
export const deleteSkill = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}; 