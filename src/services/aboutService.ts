import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc } from '@firebase/firestore';
import { db } from '../lib/firebase';
import { About } from '../lib/about';

const COLLECTION_NAME = 'about';
const aboutCollection = collection(db, COLLECTION_NAME);

// Get all about data
export const getAllAbout = async (): Promise<About[]> => {
  console.log('Fetching all about data from collection:', COLLECTION_NAME);
  const snapshot = await getDocs(aboutCollection);
  console.log(`Found ${snapshot.docs.length} documents`);
  
  const results = snapshot.docs.map(docSnapshot => {
    const data = docSnapshot.data() as About;
    return {
      ...data,
      id: docSnapshot.id
    };
  });
  
  console.log('Parsed About data:', results);
  return results;
};

// Get a single about document by ID
export const getAboutById = async (id: string): Promise<About | null> => {
  console.log(`Fetching about document with ID: ${id}`);
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnapshot = await getDoc(docRef);
    
    if (docSnapshot.exists()) {
      const data = docSnapshot.data() as About;
      console.log('Retrieved document data:', data);
      return {
        ...data,
        id: docSnapshot.id
      };
    } else {
      console.log(`Document with ID ${id} does not exist`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching document:', error);
    throw error;
  }
};

// Add new about data
export const addAbout = async (about: Omit<About, 'id'>): Promise<string> => {
  console.log('Adding new About document with data:', about);
  try {
    const docRef = await addDoc(aboutCollection, about);
    console.log('Successfully added document with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding document:', error);
    throw error;
  }
};

// Update about data
export const updateAbout = async (id: string, about: Partial<About>): Promise<void> => {
  console.log(`Updating About document with ID: ${id}`, about);
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, about);
    console.log('Update successful');
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};

// Delete about data
export const deleteAbout = async (id: string): Promise<void> => {
  console.log(`Deleting About document with ID: ${id}`);
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    console.log('Delete successful');
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
}; 