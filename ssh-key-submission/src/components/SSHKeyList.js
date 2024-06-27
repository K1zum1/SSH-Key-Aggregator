import React from 'react';
import '../style/SSHKeyList.css';

const SSHKeyList = ({ sshKeys }) => {
  return (
    <div>
      <h2>Submitted SSH Keys</h2>
      <ul>
        {sshKeys.map((key, index) => (
          <li key={index}>{key}</li>
        ))}
      </ul>
    </div>
  );
};

export default SSHKeyList;
