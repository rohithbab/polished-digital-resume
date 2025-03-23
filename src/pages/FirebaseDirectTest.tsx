import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, Timestamp, doc, setDoc } from '@firebase/firestore';

const FirebaseDirectTest = () => {
  const [testResult, setTestResult] = useState<string>('No test run yet');
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [testCollectionName, setTestCollectionName] = useState<string>("firebase_test");
  
  // Test direct writing to Firestore
  const runDirectTest = async () => {
    setLoading(true);
    setTestResult('Running test...');
    
    try {
      console.log('Starting direct Firebase test...');
      
      // 1. Create a test collection reference
      const testCollection = collection(db, testCollectionName);
      console.log(`Test collection reference created: ${testCollectionName}`);
      
      // 2. Create a simple test document
      const testData = {
        message: 'Test message',
        timestamp: Timestamp.now(),
        randomValue: Math.floor(Math.random() * 10000)
      };
      console.log('Test data created:', testData);
      
      // 3. Add the document to Firestore
      console.log('Attempting to add document to Firestore...');
      const docRef = await addDoc(testCollection, testData);
      console.log('Document added with ID:', docRef.id);
      
      // 4. Read back the collection
      console.log('Reading back collection data...');
      fetchDocuments();
      
      setTestResult(`Test successful! Document added with ID: ${docRef.id}`);
    } catch (error) {
      console.error('Firebase test error:', error);
      setTestResult(`Test failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch documents from test collection
  const fetchDocuments = async () => {
    try {
      const testCollection = collection(db, testCollectionName);
      const snapshot = await getDocs(testCollection);
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log(`Found ${docs.length} documents:`, docs);
      setDocuments(docs);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };
  
  // Fetch documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, []);
  
  // Specific test for About collection
  const testAboutCollection = async () => {
    setLoading(true);
    setTestResult('Running About collection test...');
    
    try {
      console.log('Testing About collection...');
      
      // Create a reference to the about collection
      const aboutCollection = collection(db, 'about');
      console.log('About collection reference created');
      
      // Create a test about document
      const testAboutData = {
        title: "Test About Entry",
        bio: "This is a test bio created directly via Firestore " + new Date().toISOString(),
        headline: "Test Headline",
        email: "test@example.com",
        location: "Test Location",
        timestamp: Timestamp.now()
      };
      console.log('Test about data created:', testAboutData);
      
      // Add the document to Firestore
      console.log('Attempting to add document to about collection...');
      const docRef = await addDoc(aboutCollection, testAboutData);
      console.log('About document added with ID:', docRef.id);
      
      // Fetch the about collection
      console.log('Fetching about collection data...');
      const snapshot = await getDocs(aboutCollection);
      const aboutDocs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log(`Found ${aboutDocs.length} about documents:`, aboutDocs);
      setDocuments(aboutDocs);
      setTestCollectionName('about');
      
      setTestResult(`About test successful! Document added with ID: ${docRef.id}`);
    } catch (error) {
      console.error('About test error:', error);
      setTestResult(`About test failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Add a specialized test for updating existing About documents
  const testUpdateAboutDocument = async () => {
    setLoading(true);
    setTestResult('Running About document update test...');
    
    try {
      console.log('STARTING ABOUT DOCUMENT UPDATE TEST...');
      
      // 1. First get all existing About documents
      const aboutCollection = collection(db, 'about');
      const snapshot = await getDocs(aboutCollection);
      const aboutDocs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log(`Found ${aboutDocs.length} existing About documents:`, aboutDocs);
      
      if (aboutDocs.length === 0) {
        // Create a new About document if none exists
        const newAboutData = {
          title: "Test About Entry",
          bio: "Initial bio content " + new Date().toISOString(),
          headline: "Test Headline",
          email: "test@example.com",
          location: "Test Location"
        };
        
        console.log('Creating new About document:', newAboutData);
        const docRef = await addDoc(aboutCollection, newAboutData);
        console.log('Created new About document with ID:', docRef.id);
        
        // Now update it
        const updateData = {
          bio: "UPDATED bio content " + new Date().toISOString()
        };
        
        console.log('Updating new document with data:', updateData);
        await setDoc(doc(db, 'about', docRef.id), updateData, { merge: true });
        console.log('Update completed!');
        
        setTestResult(`Created and updated a new About document with ID: ${docRef.id}`);
      } else {
        // Update an existing document
        const docToUpdate = aboutDocs[0];
        console.log('Updating existing document:', docToUpdate);
        
        const updateData = {
          bio: "UPDATED via direct test " + new Date().toISOString()
        };
        
        console.log('Update data:', updateData);
        await setDoc(doc(db, 'about', docToUpdate.id), updateData, { merge: true });
        console.log('Update successful!');
        
        setTestResult(`Updated existing About document with ID: ${docToUpdate.id}`);
      }
      
      // Refresh the document list
      fetchDocuments();
      setTestCollectionName('about');
      
    } catch (error) {
      console.error('Error in About update test:', error);
      setTestResult(`Test failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="section-container p-8">
      <h1 className="text-3xl font-bold mb-8">Firebase Direct Test</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Test Configuration</h2>
        <div className="flex items-center gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Collection Name:</label>
            <input 
              type="text" 
              value={testCollectionName}
              onChange={(e) => setTestCollectionName(e.target.value)}
              className="p-2 border rounded-md"
            />
          </div>
          
          <button
            onClick={runDirectTest}
            disabled={loading}
            className="px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50"
          >
            {loading ? 'Running Test...' : 'Run Direct Firebase Test'}
          </button>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={testAboutCollection}
            disabled={loading}
            className="px-4 py-2 bg-primary/80 text-white rounded-md disabled:opacity-50"
          >
            Test About Collection
          </button>
          
          <button
            onClick={testUpdateAboutDocument}
            disabled={loading}
            className="px-4 py-2 bg-primary/80 text-white rounded-md disabled:opacity-50"
          >
            Test Update About Document
          </button>
        </div>
      </div>
      
      <div className="mb-8 p-4 border rounded-md bg-secondary/10">
        <h2 className="text-xl font-semibold mb-2">Test Result</h2>
        <pre className="whitespace-pre-wrap">{testResult}</pre>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Documents in Collection</h2>
          <button
            onClick={fetchDocuments}
            className="px-4 py-2 bg-secondary/80 rounded-md"
          >
            Refresh Documents
          </button>
        </div>
        
        <div className="grid gap-4">
          {documents.length === 0 ? (
            <p>No documents found in collection.</p>
          ) : (
            documents.map(doc => (
              <div key={doc.id} className="p-4 border rounded-md">
                <p className="font-semibold">Document ID: {doc.id}</p>
                <pre className="mt-2 text-sm whitespace-pre-wrap">
                  {JSON.stringify(doc, null, 2)}
                </pre>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FirebaseDirectTest; 