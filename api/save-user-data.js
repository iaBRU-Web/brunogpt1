// api/save-user-data.js
// Simple version - saves to /tmp folder (no database needed!)

import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = '/tmp/bru-gpt5-user-data';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { email, data } = req.body;
    
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email' });
    }
    
    // Create directory if it doesn't exist
    await fs.mkdir(DATA_DIR, { recursive: true });
    
    // Create safe filename from email
    const filename = email.replace(/[^a-zA-Z0-9@.]/g, '_') + '.json';
    const filepath = path.join(DATA_DIR, filename);
    
    // Save data
    await fs.writeFile(filepath, JSON.stringify(data, null, 2));
    
    return res.status(200).json({ 
      success: true,
      message: 'Data saved successfully'
    });
    
  } catch (error) {
    console.error('Save error:', error);
    return res.status(500).json({ 
      error: 'Failed to save data',
      details: error.message 
    });
  }
}
