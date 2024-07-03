// App.js
import React, { useState } from 'react';
import SSHKeyForm from './components/SSHKeyForm';
import { BsCircleFill } from 'react-icons/bs';

import './App.css';

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFormSubmit = async ({ sshPrivKey, sshPubKey }) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/add-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ privKey: sshPrivKey, pubKey: sshPubKey }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit SSH key.');
      }

      const data = await response.json();
      console.log('Submitted SSH key successfully:', data);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to submit SSH key.');
    } finally {
      setTimeout(() => setIsLoading(false), 2000);
    }
  };

  return (
    <div>
      <h1 className='titleText'>SSH Key Submission Form</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <SSHKeyForm onSubmit={handleFormSubmit} />
      {isLoading && (
        <p className="loading-text">
          Submitting your key
          <span className="loading-spinner"><BsCircleFill /></span> 
        </p>
      )}
    </div>
  );
};

export default App;
