import React, { useState } from 'react';
import SSHKeyForm from './components/SSHKeyForm';

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
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>SSH Key Submission Form</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <SSHKeyForm onSubmit={handleFormSubmit} />
      {isLoading && <p>Submitting your key</p>}
    </div>
  );
};

export default App;
