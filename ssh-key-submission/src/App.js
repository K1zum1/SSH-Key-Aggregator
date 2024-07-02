import React, { useState, useEffect } from 'react';
import SSHKeyForm from './components/SSHKeyForm';
import { downloadKeys } from './utils/download';

const App = () => {
  const [sshKeys, setSshKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchKeys = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/getKeys'); // Update API endpoint
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSshKeys(data);
      } catch (error) {
        console.error('Error fetching SSH keys:', error);
        setError('Failed to fetch SSH keys.');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchKeys();
  }, []);
  

  const handleFormSubmit = async (key) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/submitKey', { // Update API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(key),
      });
      if (!response.ok) {
        throw new Error('Error');
      }
      const data = await response.json();
      setSshKeys(prevKeys => [...prevKeys, data]);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to submit SSH key.');
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleDownload = () => {
    downloadKeys(sshKeys);
  };

  return (
    <div>
      <h1>SSH Key Submission</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <SSHKeyForm onSubmit={handleFormSubmit} />
      <button onClick={handleDownload} disabled={isLoading}>Download Keys</button>
      {isLoading && <p>Loading...</p>}
    </div>
  );
};

export default App;