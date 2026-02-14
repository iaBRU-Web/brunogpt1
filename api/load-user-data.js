// api/load-user-data.js
// Simple version - loads from /tmp folder (no database needed!)

import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = '/tmp/bru-gpt5-user-data';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { email } = req.query;
    
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email' });
    }
    
    // Create safe filename from email
    const filename = email.replace(/[^a-zA-Z0-9@.]/g, '_') + '.json';
    const filepath = path.join(DATA_DIR, filename);
    
    try {
      // Try to read the file
      const dataString = await fs.readFile(filepath, 'utf-8');
      const data = JSON.parse(dataString);
      
      return res.status(200).json({ 
        success: true,
        data: data
      });
    } catch (error) {
      // File doesn't exist - that's ok, just return null
      return res.status(200).json({ 
        success: true,
        data: null,
        message: 'No data found for this email'
      });
    }
    
  } catch (error) {
    console.error('Load error:', error);
    return res.status(500).json({ 
      error: 'Failed to load data',
      details: error.message 
    });
  }
}
