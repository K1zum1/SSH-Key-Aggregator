import React, { useState, useEffect } from 'react';
import SSHKeyForm from './components/SSHKeyForm';
import InfoModal from './components/InfoModal';
import { dotStream } from 'ldrs';
import './App.css';

dotStream.register();

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [showModal, setShowModal] = useState(true);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    setShowModal(true);
  }, []);

  const handleFormSubmit = async ({ sshPrivKey, sshPubKey, keyType }) => {
    setIsLoading(true);
    setStatus('Submitting your key');
    try {
      const response = await fetch('/api/add-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ privKey: sshPrivKey, pubKey: sshPubKey, keyType }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit SSH key.');
      }

      const data = await response.json();
      console.log('Submitted SSH key successfully:', data);
      setStatus('Submission successful');
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to submit SSH key.');
      clearError();
      setStatus('');
    } finally {
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  const handleDownloadJSON = async () => {
    try {
      const response = await fetch('/api/generateJSON');
      if (!response.ok) {
        throw new Error('Failed to generate JSON.');
      }
      const data = await response.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'revocation-list.json';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading JSON file:', error);
      setError('Failed to download JSON file.');
      clearError();
    }
  };

  const handleDownloadKRL = async () => {
    try {
      const response = await fetch('/api/generateKrl');
      if (!response.ok) {
        throw new Error('Failed to generate KRL.');
      }
      const blob = await response.blob();
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
      clearError();
    }
  };

  const clearError = () => {
    setTimeout(() => setError(''), 3000);
  };

  return (
    <div>
      <h1 className="titleText" data-text="SSH Key Aggregator">SSH Key Aggregator</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="app-container">
        {showModal && <InfoModal onClose={handleCloseModal} />}
        <SSHKeyForm onSubmit={handleFormSubmit} />
      </div>
      {isLoading && (
        <div className="loading-container">
          <p className="loading-text">Submitting your key</p>
          <l-dot-stream className="loading-dots" size="70" speed="1.75" color="white"></l-dot-stream>
        </div>
      )}
      <div className="button-container">
        <button onClick={handleDownloadJSON} className="appButton">Download JSON</button>
        <button onClick={handleDownloadKRL} className="appButton">Download KRL</button>
      </div>
      <div className="status-message">
        {status && <p>{status}</p>}
      </div>
    </div>
  );
};

export default App;
