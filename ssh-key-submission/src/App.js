import React, { useState } from 'react';
import SSHKeyForm from './components/SSHKeyForm';
import './App.css';
import { quantum } from 'ldrs';

quantum.register();

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

  const handleDownloadKRL = async () => {
    try {
      const response = await fetch('/api/generate-krl');
      if (!response.ok) {
        throw new Error('Failed to generate KRL.');
      }
      const data = await response.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'revocation-list.krl';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading KRL file:', error);
      setError('Failed to download KRL file.');
    }
  };

  return (
    <div>
      <h1 className="titleText">SSH Key Submission Form</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <SSHKeyForm onSubmit={handleFormSubmit} />
      {isLoading && (
        <div className="loading-container">
          <p className="loading-text">Submitting your key</p>
          <l-quantum size="35" speed="1.75" color="white"></l-quantum>
        </div>
      )}
      <div className="button-container">
        <button onClick={handleDownloadKRL}>Download KRL</button>
      </div>
    </div>
  );
};

export default App;
