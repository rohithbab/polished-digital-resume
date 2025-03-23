import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from '@firebase/firestore';
import { db } from '../lib/firebase';
import { Project } from '../lib/projects';

const COLLECTION_NAME = 'projects';
const projectsCollection = collection(db, COLLECTION_NAME);

// Get all projects
export const getAllProjects = async (): Promise<Project[]> => {
  const snapshot = await getDocs(projectsCollection);
  return snapshot.docs.map(doc => ({
    ...doc.data() as Project,
    id: doc.id
  }));
};

// Add a new project
export const addProject = async (project: Omit<Project, 'id'>): Promise<string> => {
  const docRef = await addDoc(projectsCollection, project);
  return docRef.id;
};

// Update a project
export const updateProject = async (id: string, project: Partial<Project>): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, project);
};

// Delete a project
export const deleteProject = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}; 