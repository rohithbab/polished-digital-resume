import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from '@firebase/firestore';
import { db } from '../lib/firebase';
import { About } from '../lib/about';

const COLLECTION_NAME = 'about';
const aboutCollection = collection(db, COLLECTION_NAME);

// Get all about data
export const getAllAbout = async (): Promise<About[]> => {
  const snapshot = await getDocs(aboutCollection);
  return snapshot.docs.map(doc => ({
    ...doc.data() as About,
    id: doc.id
  }));
};

// Add new about data
export const addAbout = async (about: Omit<About, 'id'>): Promise<string> => {
  const docRef = await addDoc(aboutCollection, about);
  return docRef.id;
};

// Update about data
export const updateAbout = async (id: string, about: Partial<About>): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, about);
};

// Delete about data
export const deleteAbout = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}; 