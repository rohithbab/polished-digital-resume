import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from '@firebase/firestore';
import { db } from '../lib/firebase';
import { Education } from '../lib/education';

const COLLECTION_NAME = 'education';
const educationCollection = collection(db, COLLECTION_NAME);

// Get all education items
export const getAllEducation = async (): Promise<Education[]> => {
  const snapshot = await getDocs(educationCollection);
  return snapshot.docs.map(doc => ({
    ...doc.data() as Education,
    id: doc.id
  }));
};

// Add a new education item
export const addEducation = async (education: Omit<Education, 'id'>): Promise<string> => {
  const docRef = await addDoc(educationCollection, education);
  return docRef.id;
};

// Update an education item
export const updateEducation = async (id: string, education: Partial<Education>): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, education);
};

// Delete an education item
export const deleteEducation = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}; 