import React, { useState, useEffect } from 'react';
import SSHKeyForm from './components/SSHKeyForm';
import { downloadKeys } from './utils/download';

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');



  const handleFormSubmit = async (key) => {
    setIsLoading(true);
    try {
      console.log('Submitting SSH key:', key);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to submit SSH key.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>SSH Key Submission Test</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <SSHKeyForm onSubmit={handleFormSubmit} />
      {/* <button onClick={handleDownload} disabled={isLoading}>Download Keys</button> */}
    </div>
  );
};

export default App;
