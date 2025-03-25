import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc } from '@firebase/firestore';
import { db } from '../lib/firebase';
import { SocialLink } from '../lib/socialLinks';

const COLLECTION_NAME = 'socialLinks';
const socialLinksCollection = collection(db, COLLECTION_NAME);

// Get all social links
export const getAllSocialLinks = async (): Promise<SocialLink[]> => {
  const snapshot = await getDocs(socialLinksCollection);
  return snapshot.docs.map(doc => ({
    ...doc.data() as SocialLink,
    id: doc.id
  }));
};

// Add a new social link
export const addSocialLink = async (socialLink: Omit<SocialLink, 'id'>): Promise<string> => {
  const docRef = await addDoc(socialLinksCollection, socialLink);
  return docRef.id;
};

// Update a social link
export const updateSocialLink = async (id: string, socialLink: Partial<SocialLink>): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, socialLink);
};

// Delete a social link
export const deleteSocialLink = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
};

// Set a specific social link with a known ID (useful for maintaining consistent IDs)
export const setSocialLink = async (socialLink: SocialLink): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, socialLink.id);
  await setDoc(docRef, socialLink);
};

// Initialize social links with default data if they don't exist
export const initializeSocialLinks = async (initialLinks: SocialLink[]): Promise<void> => {
  const snapshot = await getDocs(socialLinksCollection);
  
  // If collection is empty, add default items
  if (snapshot.empty) {
    for (const link of initialLinks) {
      // Use the predefined ID to ensure consistency
      const docRef = doc(db, COLLECTION_NAME, link.id);
      await setDoc(docRef, link);
    }
  }
}; 