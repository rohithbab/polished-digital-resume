import { db } from '../lib/firebase';
import { collection, getDocs, limit, query, setDoc, doc, deleteDoc } from '@firebase/firestore';

/**
 * Tests Firebase connection by attempting to read from a collection
 * @returns {Promise<{success: boolean, error?: string, data?: any}>} Result of the connection test
 */
export const testFirebaseConnection = async (): Promise<{success: boolean, error?: string, data?: any}> => {
  try {
    // Try to access a few collections to check connectivity
    const collectionsToTest = ['about', 'skills', 'projects'];
    let successfulCollection = null;
    let lastError = null;
    
    for (const collName of collectionsToTest) {
      try {
        // Create a query to get just 1 document
        const q = query(collection(db, collName), limit(1));
        const snapshot = await getDocs(q);
        
        // If we get here, we've successfully connected
        successfulCollection = {
          name: collName,
          empty: snapshot.empty,
          docs: snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data()
          }))
        };
        
        // We got a successful connection, no need to try other collections
        break;
      } catch (err: any) {
        // Store the error and try the next collection
        lastError = err;
      }
    }
    
    if (successfulCollection) {
      return {
        success: true,
        data: successfulCollection
      };
    } else {
      // All collections failed
      return {
        success: false,
        error: lastError ? lastError.message : 'Failed to connect to any collection'
      };
    }
  } catch (err: any) {
    console.error('Firebase connection test failed:', err);
    return {
      success: false,
      error: err.message || 'Unknown error during Firebase connection test'
    };
  }
};

/**
 * Tests Firebase permissions by attempting read and write operations
 */
export const testFirebasePermissions = async (): Promise<{
  read: {success: boolean, error?: string},
  write: {success: boolean, error?: string},
  delete: {success: boolean, error?: string}
}> => {
  const testCollectionName = 'firebase_test_permissions';
  const testDocId = 'test_permissions_doc';
  const results = {
    read: { success: false } as {success: boolean, error?: string},
    write: { success: false } as {success: boolean, error?: string},
    delete: { success: false } as {success: boolean, error?: string}
  };
  
  try {
    // Test write permission
    try {
      const docRef = doc(db, testCollectionName, testDocId);
      await setDoc(docRef, { 
        timestamp: new Date().toISOString(),
        message: 'Testing write permissions'
      });
      results.write = { success: true };
    } catch (error: any) {
      results.write = { 
        success: false, 
        error: error.message || 'Unknown write error' 
      };
    }
    
    // Test read permission
    try {
      const collRef = collection(db, testCollectionName);
      await getDocs(collRef);
      results.read = { success: true };
    } catch (error: any) {
      results.read = { 
        success: false, 
        error: error.message || 'Unknown read error' 
      };
    }
    
    // Test delete permission
    try {
      const docRef = doc(db, testCollectionName, testDocId);
      await deleteDoc(docRef);
      results.delete = { success: true };
    } catch (error: any) {
      results.delete = { 
        success: false, 
        error: error.message || 'Unknown delete error' 
      };
    }
    
    return results;
  } catch (err: any) {
    console.error('Firebase permissions test failed:', err);
    return {
      read: { success: false, error: 'Test failed to run' },
      write: { success: false, error: 'Test failed to run' },
      delete: { success: false, error: 'Test failed to run' }
    };
  }
};

/**
 * Checks Firebase configuration
 * @returns {Object} Firebase configuration details
 */
export const checkFirebaseConfig = () => {
  // Get the Firebase config without exposing sensitive details
  return {
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || '(not set)',
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ? 'configured' : '(not set)',
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY ? 'configured (hidden)' : '(not set)',
    hasStorage: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ? 'configured' : '(not set)',
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL ? 'configured' : '(not applicable)',
  };
};

/**
 * Helper to log Firebase configuration for debugging
 * Note: This only works if firebase is exposed on the window object
 */
export const logFirebaseConfig = () => {
  try {
    // Define firebase on window for TypeScript
    const anyWindow = window as any;
    
    // Get the firebase app instance and log its config
    const firebaseApp = anyWindow.firebase?.apps?.[0];
    if (!firebaseApp) {
      console.error('No Firebase app found in window.firebase.apps');
      return { success: false, error: 'No Firebase app found' };
    }
    
    // Get the config (but mask sensitive values)
    const config = firebaseApp.options;
    const maskedConfig = {
      ...config,
      apiKey: config.apiKey ? `${config.apiKey.substring(0, 5)}...` : undefined,
      appId: config.appId ? `${config.appId.substring(0, 5)}...` : undefined
    };
    
    console.log('Firebase configuration:', maskedConfig);
    return { success: true, config: maskedConfig };
  } catch (error) {
    console.error('Error getting Firebase config:', error);
    return { success: false, error: error.message };
  }
};

// Export a function that can be run directly from the browser console
(window as any).testFirebase = async () => {
  console.group('Firebase Debug Information');
  logFirebaseConfig();
  const result = await testFirebaseConnection();
  console.log('Test result:', result);
  console.groupEnd();
  return result;
}; 