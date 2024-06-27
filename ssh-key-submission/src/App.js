import React, { useState, useEffect } from 'react';
import SSHKeyForm from './components/SSHKeyForm';
import SSHKeyList from './components/SSHKeyList';
import { downloadKeys } from './utils/download';
import { saveToLocalStorage, loadFromLocalStorage } from './utils/localStorage';
import './App.css';

const App = () => {
  const [sshKeys, setSshKeys] = useState([]);

  useEffect(() => {
    const storedKeys = loadFromLocalStorage();
    setSshKeys(storedKeys);
  }, []);

  const handleFormSubmit = (key) => {
    const updatedKeys = [...sshKeys, key];
    setSshKeys(updatedKeys);
    saveToLocalStorage(updatedKeys);
  };

  const handleDownload = () => {
    downloadKeys(sshKeys);
  };

  return (
    <div className="centered-content">
    <h1>SSH Key Submission</h1>
    <SSHKeyForm onSubmit={handleFormSubmit} />
    <SSHKeyList sshKeys={sshKeys} />
    {sshKeys.length > 0 && (
      <button onClick={handleDownload}>Download Keys</button>
    )}
  </div>
  );
};

export default App;
