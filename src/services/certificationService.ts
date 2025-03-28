import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from '@firebase/firestore';
import { db } from '../lib/firebase';
import { Certification } from '../lib/certifications';

const COLLECTION_NAME = 'certifications';
const certificationsCollection = collection(db, COLLECTION_NAME);

// Get all certifications
export const getAllCertifications = async (): Promise<Certification[]> => {
  const snapshot = await getDocs(certificationsCollection);
  return snapshot.docs.map(doc => ({
    ...doc.data() as Certification,
    id: doc.id
  }));
};

// Add a new certification
export const addCertification = async (certification: Omit<Certification, 'id'>): Promise<string> => {
  const docRef = await addDoc(certificationsCollection, certification);
  return docRef.id;
};

// Update a certification
export const updateCertification = async (id: string, certification: Partial<Certification>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const { id: _, ...certificationData } = certification; // Remove id from the data to update
    await updateDoc(docRef, certificationData);
  } catch (error) {
    console.error('Error updating certification:', error);
    throw error;
  }
};

// Delete a certification
export const deleteCertification = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}; 