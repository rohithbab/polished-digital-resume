import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, setDoc } from '@firebase/firestore';
import { db } from '../lib/firebase';
import { Education } from '../lib/education';
import { debugEducation } from '../lib/debugEducation';

const COLLECTION_NAME = 'education';
const educationCollection = collection(db, COLLECTION_NAME);

// Get all education data
export const getAllEducation = async (): Promise<Education[]> => {
  debugEducation.log('Fetching all education data', { collection: COLLECTION_NAME });
  try {
    const snapshot = await getDocs(educationCollection);
    debugEducation.log(`Found ${snapshot.docs.length} documents`, { count: snapshot.docs.length }, 'success');
    
    const results = snapshot.docs.map(docSnapshot => {
      const data = docSnapshot.data() as Education;
      return {
        ...data,
        id: docSnapshot.id
      };
    });
    
    debugEducation.log('Parsed Education data', results, 'success');
    return results;
  } catch (error) {
    debugEducation.log('Error fetching all education data', error, 'error');
    throw new Error(`Failed to fetch education data: ${error.message}`);
  }
};

// Get a single education document by ID
export const getEducationById = async (id: string): Promise<Education | null> => {
  debugEducation.log(`Fetching education document`, { id });
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnapshot = await getDoc(docRef);
    
    if (docSnapshot.exists()) {
      const data = docSnapshot.data() as Education;
      debugEducation.log('Retrieved document data', data, 'success');
      return {
        ...data,
        id: docSnapshot.id
      };
    } else {
      debugEducation.log(`Document not found`, { id }, 'error');
      return null;
    }
  } catch (error) {
    debugEducation.log('Error fetching document', error, 'error');
    throw new Error(`Failed to fetch document with ID ${id}: ${error.message}`);
  }
};

// Add new education data
export const addEducation = async (education: Omit<Education, 'id'>): Promise<string> => {
  debugEducation.log('Adding new Education document', education);
  try {
    // Validate required fields
    if (!education.degree || !education.field || !education.institution || !education.location) {
      const error = new Error('Missing required fields in education data');
      debugEducation.log('Validation failed', { 
        degree: !!education.degree,
        field: !!education.field,
        institution: !!education.institution,
        location: !!education.location
      }, 'error');
      throw error;
    }
    
    // Create a new document with a unique ID
    const docRef = await addDoc(educationCollection, {
      ...education,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    debugEducation.log('Successfully added document', { id: docRef.id }, 'success');
    return docRef.id;
  } catch (error) {
    debugEducation.log('Error adding document', error, 'error');
    throw new Error(`Failed to add document: ${error.message}`);
  }
};

// Update education data
export const updateEducation = async (id: string, education: Partial<Education>): Promise<void> => {
  debugEducation.log(`Updating Education document`, { id, data: education });
  try {
    if (!id) {
      const error = new Error('Document ID is required for update');
      debugEducation.log('Update failed - missing ID', null, 'error');
      throw error;
    }
    
    const docRef = doc(db, COLLECTION_NAME, id);
    
    // Use setDoc with merge option instead of updateDoc for more reliability
    await setDoc(docRef, {
      ...education,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    
    debugEducation.log('Update successful', { id }, 'success');
  } catch (error) {
    debugEducation.log('Error updating document', error, 'error');
    throw new Error(`Failed to update document with ID ${id}: ${error.message}`);
  }
};

// Delete education data
export const deleteEducation = async (id: string): Promise<void> => {
  debugEducation.log(`Deleting Education document`, { id });
  try {
    if (!id) {
      const error = new Error('Document ID is required for delete');
      debugEducation.log('Delete failed - missing ID', null, 'error');
      throw error;
    }
    
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    debugEducation.log('Delete successful', { id }, 'success');
  } catch (error) {
    debugEducation.log('Error deleting document', error, 'error');
    throw new Error(`Failed to delete document with ID ${id}: ${error.message}`);
  }
}; 