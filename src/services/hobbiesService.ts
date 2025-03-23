import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from '@firebase/firestore';
import { db } from '../lib/firebase';
import { Hobby } from '../lib/hobbies';

const COLLECTION_NAME = 'hobbies';
const hobbiesCollection = collection(db, COLLECTION_NAME);

// Get all hobbies
export const getAllHobbies = async (): Promise<Hobby[]> => {
  const snapshot = await getDocs(hobbiesCollection);
  return snapshot.docs.map(doc => ({
    ...doc.data() as Hobby,
    id: doc.id
  }));
};

// Add a new hobby
export const addHobby = async (hobby: Omit<Hobby, 'id'>): Promise<string> => {
  const docRef = await addDoc(hobbiesCollection, hobby);
  return docRef.id;
};

// Update a hobby
export const updateHobby = async (id: string, hobby: Partial<Hobby>): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, hobby);
};

// Delete a hobby
export const deleteHobby = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}; 