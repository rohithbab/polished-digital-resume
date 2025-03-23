import { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc } from '@firebase/firestore';
import { testFirebaseConnection, testFirebasePermissions } from '../utils/firebaseDebug';

const FirebaseTest = () => {
  const [status, setStatus] = useState('Idle');
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    collection: 'test_data',
    field: 'message',
    value: 'Test value from Firebase Test page'
  });
  
  // New state for additional fields
  const [additionalFields, setAdditionalFields] = useState<{key: string, value: string}[]>([
    { key: '', value: '' }
  ]);

  // Add state for about document ID
  const [aboutDocId, setAboutDocId] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handler for additional fields
  const handleAdditionalFieldChange = (index: number, field: 'key' | 'value', value: string) => {
    const updatedFields = [...additionalFields];
    updatedFields[index][field] = value;
    setAdditionalFields(updatedFields);
  };
  
  // Add new field row
  const addFieldRow = () => {
    setAdditionalFields([...additionalFields, { key: '', value: '' }]);
  };
  
  // Remove field row
  const removeFieldRow = (index: number) => {
    const updatedFields = [...additionalFields];
    updatedFields.splice(index, 1);
    setAdditionalFields(updatedFields);
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
      setError(`${err.message}\n${err.stack}`);
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
      setError(`${err.message}\n${err.stack}`);
      console.error('Error listing collections:', err);
    }
  };

  const addTestDocument = async () => {
    try {
      setStatus(`Adding document to ${formData.collection}...`);
      setError(null);
      
      const collRef = collection(db, formData.collection);
      
      // Create document data with main field and additional fields
      const testDoc: Record<string, any> = {
        [formData.field]: formData.value,
        timestamp: new Date().toISOString()
      };
      
      // Add additional fields to document
      additionalFields.forEach(field => {
        if (field.key.trim() !== '') {
          testDoc[field.key] = field.value;
        }
      });
      
      console.log('Document to add:', testDoc);
      
      const docRef = await addDoc(collRef, testDoc);
      
      setResults({
        success: true,
        documentId: docRef.id,
        data: testDoc
      });
      
      setStatus(`Document added successfully to ${formData.collection}`);
    } catch (err: any) {
      setStatus('Error adding document');
      setError(`${err.message}\n${err.stack}`);
      console.error('Error adding document:', err);
    }
  };

  // Try a pre-defined skill document
  const addPredefinedSkill = async () => {
    try {
      setStatus('Adding pre-defined skill document...');
      setError(null);
      
      const skillsRef = collection(db, 'skills');
      
      // Create a properly formatted skill document
      const skillDoc = {
        name: 'Test Skill',
        level: 75, // Numeric value (percentage)
        subtopics: ['Test Subtopic 1', 'Test Subtopic 2'], // Array of strings
        timestamp: new Date().toISOString()
      };
      
      console.log('Skill document to add:', skillDoc);
      
      const docRef = await addDoc(skillsRef, skillDoc);
      
      setResults({
        success: true,
        documentId: docRef.id,
        data: skillDoc
      });
      
      setStatus('Skill document added successfully');
    } catch (err: any) {
      setStatus('Error adding skill document');
      setError(`${err.message}\n${err.stack}`);
      console.error('Error adding skill document:', err);
    }
  };

  // Add a simple pre-defined about document
  const addPredefinedAbout = async () => {
    try {
      setStatus('Adding pre-defined about document...');
      setError(null);
      
      const aboutRef = collection(db, 'about');
      
      // Create a properly formatted about document
      const aboutDoc = {
        title: "About Me",
        bio: "This is a test bio for the About section",
        headline: "Test User",
        email: "test@example.com",
        location: "Test Location",
        timestamp: new Date().toISOString()
      };
      
      console.log('About document to add:', aboutDoc);
      
      const docRef = await addDoc(aboutRef, aboutDoc);
      
      setResults({
        success: true,
        documentId: docRef.id,
        data: aboutDoc
      });
      
      setStatus('About document added successfully');
    } catch (err: any) {
      setStatus('Error adding about document');
      setError(`${err.message}\n${err.stack}`);
      console.error('Error adding about document:', err);
    }
  };

  const testPermissions = async () => {
    try {
      setStatus('Testing Firebase permissions...');
      setError(null);
      
      const result = await testFirebasePermissions();
      setResults(result);
      
      const allSuccessful = result.read.success && result.write.success && result.delete.success;
      
      if (allSuccessful) {
        setStatus('All permissions tests passed successfully');
      } else {
        setStatus('Some permissions tests failed');
        // Construct error message from failed operations
        const errorParts = [];
        if (!result.read.success) errorParts.push(`Read: ${result.read.error}`);
        if (!result.write.success) errorParts.push(`Write: ${result.write.error}`);
        if (!result.delete.success) errorParts.push(`Delete: ${result.delete.error}`);
        
        setError(errorParts.join('\n'));
      }
    } catch (err: any) {
      setStatus('Error testing permissions');
      setError(`${err.message}\n${err.stack}`);
      console.error('Error testing permissions:', err);
    }
  };

  // Function to fix an About document
  const fixAboutDocument = async () => {
    try {
      setStatus('Attempting to fix About document...');
      setError(null);
      
      if (!aboutDocId) {
        setError('Please enter an About document ID first');
        return;
      }
      
      // Create an About document with all required fields
      const aboutData = {
        title: "About Me",
        bio: "This is a fixed bio from the test page",
        headline: "Data Analyst",
        email: "example@example.com",
        location: "Your Location",
        timestamp: new Date().toISOString()
      };
      
      // First try updating with updateDoc
      try {
        const docRef = doc(db, 'about', aboutDocId);
        await updateDoc(docRef, aboutData);
        
        setResults({
          success: true,
          message: 'Successfully updated About document using updateDoc',
          documentId: aboutDocId,
          data: aboutData
        });
        
        setStatus('About document updated successfully');
        
      } catch (updateError) {
        console.error('Error updating with updateDoc:', updateError);
        
        // If update fails, try setDoc
        try {
          console.log('Trying with setDoc instead...');
          const docRef = doc(db, 'about', aboutDocId);
          await setDoc(docRef, aboutData, { merge: true });
          
          setResults({
            success: true,
            message: 'Successfully updated About document using setDoc with merge',
            documentId: aboutDocId,
            data: aboutData
          });
          
          setStatus('About document updated successfully with setDoc');
          
        } catch (setDocError) {
          throw new Error(`Failed with both updateDoc and setDoc: ${setDocError.message}`);
        }
      }
    } catch (err: any) {
      setStatus('Error fixing About document');
      setError(`${err.message}\n${err.stack}`);
      console.error('Error fixing About document:', err);
    }
  };

  // View About documents
  const viewAboutDocuments = async () => {
    try {
      setStatus('Fetching About documents...');
      setError(null);
      
      const aboutRef = collection(db, 'about');
      const snapshot = await getDocs(aboutRef);
      
      const aboutDocs = snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      }));
      
      setResults({
        success: true,
        count: aboutDocs.length,
        documents: aboutDocs
      });
      
      if (aboutDocs.length > 0) {
        // Automatically set the first document ID for convenience
        setAboutDocId(aboutDocs[0].id);
      }
      
      setStatus(`Found ${aboutDocs.length} About documents`);
    } catch (err: any) {
      setStatus('Error fetching About documents');
      setError(`${err.message}\n${err.stack}`);
      console.error('Error fetching About documents:', err);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Firebase Connection Test</h1>
      
      <div className="mb-8 p-4 border rounded bg-gray-50 dark:bg-gray-800">
        <h2 className="text-xl font-semibold mb-4">Test Firebase Connection</h2>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={runConnectionTest}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Run Basic Connection Test
          </button>
          
          <button 
            onClick={listCollections}
            className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Check Collections
          </button>
          
          <button 
            onClick={testPermissions}
            className="mb-4 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
          >
            Test Permissions
          </button>
        </div>
      </div>
      
      <div className="mb-8 p-4 border rounded bg-gray-50 dark:bg-gray-800">
        <h2 className="text-xl font-semibold mb-4">Add Pre-defined Document</h2>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={addPredefinedSkill}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Add Pre-defined Skill Document
          </button>
          
          <button 
            onClick={addPredefinedAbout}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Pre-defined About Document
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          These buttons will add complete documents with all required fields for their respective collections
        </p>
      </div>
      
      <div className="mb-8 p-4 border rounded bg-gray-50 dark:bg-gray-800">
        <h2 className="text-xl font-semibold mb-4">Add Custom Test Document</h2>
        
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
            <label className="block mb-2">Main Field Name</label>
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
          <label className="block mb-2">Main Field Value</label>
          <input
            type="text"
            name="value"
            value={formData.value}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="block">Additional Fields</label>
            <button 
              onClick={addFieldRow}
              className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              + Add Field
            </button>
          </div>
          
          {additionalFields.map((field, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Field name"
                value={field.key}
                onChange={(e) => handleAdditionalFieldChange(index, 'key', e.target.value)}
                className="w-1/2 px-3 py-2 border rounded"
              />
              <input
                type="text"
                placeholder="Field value"
                value={field.value}
                onChange={(e) => handleAdditionalFieldChange(index, 'value', e.target.value)}
                className="w-1/2 px-3 py-2 border rounded"
              />
              {index > 0 && (
                <button 
                  onClick={() => removeFieldRow(index)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        
        <button 
          onClick={addTestDocument}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Add Custom Document
        </button>
      </div>
      
      <div className="mb-8 p-4 border rounded bg-gray-50 dark:bg-gray-800">
        <h2 className="text-xl font-semibold mb-4">Fix About Document</h2>
        <div className="flex flex-wrap gap-4 mb-4">
          <button 
            onClick={viewAboutDocuments}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            View About Documents
          </button>
        </div>
        <div className="mb-4">
          <label className="block mb-2">About Document ID</label>
          <input
            type="text"
            value={aboutDocId}
            onChange={(e) => setAboutDocId(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter the ID of an existing About document"
          />
        </div>
        
        <button 
          onClick={fixAboutDocument}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Fix About Document
        </button>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          This will update an existing About document with correct field formatting
        </p>
      </div>
      
      <div className="p-4 border rounded bg-gray-50 dark:bg-gray-800">
        <h2 className="text-xl font-semibold mb-2">Status</h2>
        <p className="mb-2">{status}</p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded dark:bg-red-800 dark:text-red-100">
            <h3 className="font-bold">Error:</h3>
            <pre className="whitespace-pre-wrap">{error}</pre>
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