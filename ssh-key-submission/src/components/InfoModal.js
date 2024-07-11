import React from 'react';
import '../style/InfoModal.css';

const InfoModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>About This Website</h2>
        <p>This website is intended for users to submit compromised SSH Keys and download other compromised keys in order to be blacklisted.</p><br></br>
        <p>Please be aware that the following data will be collected automatically upon successful submission. These are collected for security measures to ensure proper use</p>
        <ul>
          <li>Compromised Keys</li>
          <li>IP Address</li>
          <li>User Agent</li>
          <li>Submission Time/Date</li>
          <li>Referer Tags</li>
        </ul>
        <button onClick={onClose}>Acknowledge</button>
      </div>
    </div>
  );
};

export default InfoModal;
