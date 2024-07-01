import React, { useState, useEffect } from 'react';
import SSHKeyForm from './components/SSHKeyForm';
import { downloadKeys } from './utils/download';

const App = () => {
  const [sshKeys, setSshKeys] = useState([]);

  useEffect(() => {
    fetch('https://ssh-blacklist.vercel.app/api/getKeys')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setSshKeys(data))
      .catch(error => console.error('Error fetching SSH keys:', error));
  }, []);

  const handleFormSubmit = async (key) => {
    try {
      const response = await fetch('https://ssh-blacklist.vercel.app/api/submitKey', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(key),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSshKeys([...sshKeys, data]);
    } catch (error) {
      console.error('Error submitting SSH key:', error);
    }
  };

  const handleDownload = () => {
    downloadKeys(sshKeys);
  };

  const handleClear = () => {
    setSshKeys([]);
  };

  return (
    <div>
      <h1>SSH Key Submission</h1>
      <SSHKeyForm onSubmit={handleFormSubmit} />
      <button onClick={handleDownload}>Download Keys</button>
      <button onClick={handleClear}>Clear Keys</button>
    </div>
  );
};

export default App;
