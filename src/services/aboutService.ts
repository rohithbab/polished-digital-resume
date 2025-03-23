import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, setDoc } from '@firebase/firestore';
import { db } from '../lib/firebase';
import { About } from '../lib/about';

const COLLECTION_NAME = 'about';
const aboutCollection = collection(db, COLLECTION_NAME);

// Get all about data
export const getAllAbout = async (): Promise<About[]> => {
  console.log('Fetching all about data from collection:', COLLECTION_NAME);
  try {
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
  } catch (error) {
    console.error('Error fetching all about data:', error);
    throw new Error(`Failed to fetch about data: ${error.message}`);
  }
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
    throw new Error(`Failed to fetch document with ID ${id}: ${error.message}`);
  }
};

// Add new about data
export const addAbout = async (about: Omit<About, 'id'>): Promise<string> => {
  console.log('Adding new About document with data:', about);
  try {
    // Validate required fields
    if (!about.bio || !about.headline || !about.email || !about.location) {
      throw new Error('Missing required fields in about data');
    }
    
    const docRef = await addDoc(aboutCollection, about);
    console.log('Successfully added document with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding document:', error);
    throw new Error(`Failed to add document: ${error.message}`);
  }
};

// Update about data
export const updateAbout = async (id: string, about: Partial<About>): Promise<void> => {
  console.log(`Updating About document with ID: ${id}`, about);
  try {
    if (!id) {
      throw new Error('Document ID is required for update');
    }
    
    const docRef = doc(db, COLLECTION_NAME, id);
    
    // Use setDoc with merge option instead of updateDoc for more reliability
    await setDoc(docRef, about, { merge: true });
    console.log('Update successful');
  } catch (error) {
    console.error('Error updating document:', error);
    throw new Error(`Failed to update document with ID ${id}: ${error.message}`);
  }
};

// Delete about data
export const deleteAbout = async (id: string): Promise<void> => {
  console.log(`Deleting About document with ID: ${id}`);
  try {
    if (!id) {
      throw new Error('Document ID is required for delete');
    }
    
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    console.log('Delete successful');
  } catch (error) {
    console.error('Error deleting document:', error);
    throw new Error(`Failed to delete document with ID ${id}: ${error.message}`);
  }
}; 