// In client/src/App.jsx

import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // State to store the message from the server
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // This function will run when the component mounts
    const fetchData = async () => {
      try {
        // Make a request to our backend
        const response = await fetch('http://localhost:5000/');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setMessage(data.message); // Set the message from the server
      } catch (err) {
        setError(err.message);
        setMessage(''); // Clear any old message
      }
    };

    fetchData();
  }, []); // The empty array means this runs only once on mount

  return (
    <>
      <h1>Interview Coach</h1>
      <div className="card">
        <h2>Message from Server:</h2>
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        {!message && !error && <p>Loading...</p>}
      </div>
    </>
  );
}

export default App;