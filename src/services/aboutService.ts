import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, setDoc } from '@firebase/firestore';
import { db } from '../lib/firebase';
import { About } from '../lib/about';
import { debug } from '../lib/debug';

const COLLECTION_NAME = 'about';
const aboutCollection = collection(db, COLLECTION_NAME);

// Get all about data
export const getAllAbout = async (): Promise<About[]> => {
  debug.log('Fetching all about data', { collection: COLLECTION_NAME });
  try {
    const snapshot = await getDocs(aboutCollection);
    debug.log(`Found ${snapshot.docs.length} documents`, { count: snapshot.docs.length }, 'success');
    
    const results = snapshot.docs.map(docSnapshot => {
      const data = docSnapshot.data() as About;
      return {
        ...data,
        id: docSnapshot.id
      };
    });
    
    debug.log('Parsed About data', results, 'success');
    return results;
  } catch (error) {
    debug.log('Error fetching all about data', error, 'error');
    throw new Error(`Failed to fetch about data: ${error.message}`);
  }
};

// Get a single about document by ID
export const getAboutById = async (id: string): Promise<About | null> => {
  debug.log(`Fetching about document`, { id });
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnapshot = await getDoc(docRef);
    
    if (docSnapshot.exists()) {
      const data = docSnapshot.data() as About;
      debug.log('Retrieved document data', data, 'success');
      return {
        ...data,
        id: docSnapshot.id
      };
    } else {
      debug.log(`Document not found`, { id }, 'error');
      return null;
    }
  } catch (error) {
    debug.log('Error fetching document', error, 'error');
    throw new Error(`Failed to fetch document with ID ${id}: ${error.message}`);
  }
};

// Add new about data
export const addAbout = async (about: Omit<About, 'id'>): Promise<string> => {
  debug.log('Adding new About document', about);
  try {
    // Validate required fields
    if (!about.bio || !about.headline || !about.email || !about.location) {
      const error = new Error('Missing required fields in about data');
      debug.log('Validation failed', { 
        bio: !!about.bio,
        headline: !!about.headline,
        email: !!about.email,
        location: !!about.location
      }, 'error');
      throw error;
    }
    
    // Create a new document with a unique ID
    const docRef = await addDoc(aboutCollection, {
      ...about,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    debug.log('Successfully added document', { id: docRef.id }, 'success');
    return docRef.id;
  } catch (error) {
    debug.log('Error adding document', error, 'error');
    throw new Error(`Failed to add document: ${error.message}`);
  }
};

// Update about data
export const updateAbout = async (id: string, about: Partial<About>): Promise<void> => {
  debug.log(`Updating About document`, { id, data: about });
  try {
    if (!id) {
      const error = new Error('Document ID is required for update');
      debug.log('Update failed - missing ID', null, 'error');
      throw error;
    }
    
    const docRef = doc(db, COLLECTION_NAME, id);
    
    // Use setDoc with merge option instead of updateDoc for more reliability
    await setDoc(docRef, {
      ...about,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    
    debug.log('Update successful', { id }, 'success');
  } catch (error) {
    debug.log('Error updating document', error, 'error');
    throw new Error(`Failed to update document with ID ${id}: ${error.message}`);
  }
};

// Delete about data
export const deleteAbout = async (id: string): Promise<void> => {
  debug.log(`Deleting About document`, { id });
  try {
    if (!id) {
      const error = new Error('Document ID is required for delete');
      debug.log('Delete failed - missing ID', null, 'error');
      throw error;
    }
    
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    debug.log('Delete successful', { id }, 'success');
  } catch (error) {
    debug.log('Error deleting document', error, 'error');
    throw new Error(`Failed to delete document with ID ${id}: ${error.message}`);
  }
}; 