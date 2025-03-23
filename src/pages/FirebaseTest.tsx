import { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from '@firebase/firestore';
import { testFirebaseConnection } from '../utils/firebaseDebug';

const FirebaseTest = () => {
  const [status, setStatus] = useState('Idle');
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    collection: 'test_data',
    field: 'message',
    value: 'Test value from Firebase Test page'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const runConnectionTest = async () => {
    try {
      setStatus('Testing connection...');
      setError(null);
      
      const result = await testFirebaseConnection();
      setResults(result);
      
      if (result.success) {
        setStatus('Connection test successful');
      } else {
        setStatus('Connection test failed');
        setError(result.error);
      }
    } catch (err: any) {
      setStatus('Error running test');
      setError(err.message);
      console.error('Error running connection test:', err);
    }
  };

  const listCollections = async () => {
    try {
      setStatus('Listing collections...');
      setError(null);
      
      // Cannot directly list collections in client-side Firebase
      // Instead, we'll make a best effort by trying a few common collections
      const collections = ['about', 'skills', 'projects', 'achievements', 'education', 'hobbies', 'test_data'];
      const results: Record<string, any> = {};
      
      for (const collName of collections) {
        try {
          const collRef = collection(db, collName);
          const snapshot = await getDocs(collRef);
          results[collName] = {
            exists: true,
            documentCount: snapshot.docs.length,
            sample: snapshot.docs.length > 0 ? snapshot.docs[0].data() : null
          };
        } catch (collError: any) {
          results[collName] = { exists: false, error: collError.message };
        }
      }
      
      setResults(results);
      setStatus('Finished checking collections');
    } catch (err: any) {
      setStatus('Error listing collections');
      setError(err.message);
      console.error('Error listing collections:', err);
    }
  };

  const addTestDocument = async () => {
    try {
      setStatus(`Adding document to ${formData.collection}...`);
      setError(null);
      
      const collRef = collection(db, formData.collection);
      const testDoc = {
        [formData.field]: formData.value,
        timestamp: new Date().toISOString()
      };
      
      const docRef = await addDoc(collRef, testDoc);
      
      setResults({
        success: true,
        documentId: docRef.id,
        data: testDoc
      });
      
      setStatus(`Document added successfully to ${formData.collection}`);
    } catch (err: any) {
      setStatus('Error adding document');
      setError(err.message);
      console.error('Error adding document:', err);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Firebase Connection Test</h1>
      
      <div className="mb-8 p-4 border rounded bg-gray-50 dark:bg-gray-800">
        <h2 className="text-xl font-semibold mb-4">Test Firebase Connection</h2>
        <button 
          onClick={runConnectionTest}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Run Basic Connection Test
        </button>
        
        <button 
          onClick={listCollections}
          className="mb-4 ml-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Check Collections
        </button>
      </div>
      
      <div className="mb-8 p-4 border rounded bg-gray-50 dark:bg-gray-800">
        <h2 className="text-xl font-semibold mb-4">Add Test Document</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2">Collection Name</label>
            <input
              type="text"
              name="collection"
              value={formData.collection}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block mb-2">Field Name</label>
            <input
              type="text"
              name="field"
              value={formData.field}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">Value</label>
          <input
            type="text"
            name="value"
            value={formData.value}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        
        <button 
          onClick={addTestDocument}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Add Test Document
        </button>
      </div>
      
      <div className="p-4 border rounded bg-gray-50 dark:bg-gray-800">
        <h2 className="text-xl font-semibold mb-2">Status</h2>
        <p className="mb-2">{status}</p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded dark:bg-red-800 dark:text-red-100">
            <h3 className="font-bold">Error:</h3>
            <p>{error}</p>
          </div>
        )}
        
        {results && (
          <div className="mt-4">
            <h3 className="font-bold mb-2">Results:</h3>
            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}
      </div>
      
      <div className="mt-8">
        <a href="/" className="text-blue-500 hover:underline">← Back to Home</a>
      </div>
    </div>
  );
};

export default FirebaseTest; 