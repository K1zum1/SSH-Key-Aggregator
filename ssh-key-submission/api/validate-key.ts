import { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

const isValidSSHPrivateKey = (key: string): { valid: boolean, error?: string } => {
  const privateKeyPattern = /^-----BEGIN ((EC|PGP|DSA|RSA|OPENSSH) )?PRIVATE KEY-----(.|\n|\r)*?-----END ((EC|PGP|DSA|RSA|OPENSSH) )?PRIVATE KEY-----$/;
  if (!privateKeyPattern.test(key.trim())) {
    return { valid: false, error: 'Invalid SSH private key format.' };
  }
  
  const isPassphraseProtected = key.includes('Proc-Type: 4,ENCRYPTED') && key.includes('DEK-Info');
  if (isPassphraseProtected) {
    return { valid: false, error: 'SSH private key is password-protected.' };
  }

  return { valid: true };
};

const isValidSSHPublicKey = (key: string): { valid: boolean, error?: string } => {
  const publicKeyPattern = /^ssh-(rsa|dss|ed25519|ecdsa-sha2-nistp(256|384|521))\s+[A-Za-z0-9+/=]+\s*(\S+\s*)?$/;
  
  if (!publicKeyPattern.test(key.trim())) {
    return { valid: false, error: 'Invalid SSH public key format.' };
  }

  return { valid: true };
};

const calculateSSHPublicKeyFingerprint = (pubKey: string): string | null => {
  try {
    const keyParts = pubKey.trim().split(' ');
    if (keyParts.length < 2) return null;

    const keyData = Buffer.from(keyParts[1], 'base64');
    
    const hash = crypto.createHash('md5');
    hash.update(keyData);
    const digest = hash.digest('hex');
    const fingerprint = digest.match(/.{2}/g)?.join(':') ?? null;
    
    console.log(`Calculated fingerprint: ${fingerprint}`);
    
    return fingerprint;
  } catch (error) {
    console.error('Error calculating fingerprint:', error);
    return null;
  }
};

export default async function validateKey(req: VercelRequest, res: VercelResponse) {
  const { key } = req.body;

  if (key.startsWith('-----BEGIN')) {
    const result = isValidSSHPrivateKey(key);
    res.status(200).json(result);
  } else {
    const isValid = isValidSSHPublicKey(key);
    if (isValid.valid) {
      const fingerprint = calculateSSHPublicKeyFingerprint(key);
      res.status(200).json(fingerprint);
    } else {
      res.status(200).json(isValid);
    }
  }
}
