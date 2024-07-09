# Project Name: SSH Blacklister

## Description

SSH Blacklister is a web application designed to manage the submission and tracking of SSH keys. It allows users to submit SSH private and public keys, ensures their validity, and stores them securely in a PostgreSQL database. This project is useful for administrators and developers who need to track SSH keys, monitor their usage, and ensure compliance with security policies. This is being completed as part of my internship journey at the National Center for Supercomputing Applications

## Features

- **SSH Key Submission**: Users can submit SSH private and public keys via a web form.
- **Key Validation**: The application validates the format of both private and public SSH keys before accepting them.
- **Key Type Extraction**: Automatically identifies the type of SSH key submitted (e.g., RSA, DSA, ECDSA, ED25519).
- **Metadata Tracking**: Logs additional metadata such as IP address, user agent, submission date, and referrer URL.
- **Error Handling**: Provides informative error messages for invalid key submissions.
- **Security**: Rejects passphrase-protected keys to maintain a simple validation process.

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/K1zum1/ssh-blacklister.git
    cd ssh-blacklister
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

4. Run the application locally:
    ```sh
    npm run dev
    ```




