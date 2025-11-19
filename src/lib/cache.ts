/**
 * Simple cache utility with Redis fallback to file-based storage
 * Used for caching NFT metadata and IPFS CIDs
 */

import fs from 'fs';
import path from 'path';

const CACHE_FILE = process.env.CACHE_FILE || path.join(process.cwd(), '.cache', 'farbasenft_cache.json');

// Ensure cache directory exists
function ensureCacheDir() {
  const dir = path.dirname(CACHE_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export default {
  async get(key: string): Promise<any> {
    try {
      ensureCacheDir();
      if (!fs.existsSync(CACHE_FILE)) return null;
      const raw = fs.readFileSync(CACHE_FILE, 'utf8');
      const obj = JSON.parse(raw || '{}');
      return obj[key] ?? null;
    } catch (e) {
      console.error('Cache get error', e);
      return null;
    }
  },

  async set(key: string, value: any): Promise<boolean> {
    try {
      ensureCacheDir();
      let obj: Record<string, any> = {};
      if (fs.existsSync(CACHE_FILE)) {
        obj = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8') || '{}');
      }
      obj[key] = value;
      fs.writeFileSync(CACHE_FILE, JSON.stringify(obj, null, 2));
      return true;
    } catch (e) {
      console.error('Cache set error', e);
      return false;
    }
  },

  async delete(key: string): Promise<boolean> {
    try {
      ensureCacheDir();
      if (!fs.existsSync(CACHE_FILE)) return true;
      const obj = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8') || '{}');
      delete obj[key];
      fs.writeFileSync(CACHE_FILE, JSON.stringify(obj, null, 2));
      return true;
    } catch (e) {
      console.error('Cache delete error', e);
      return false;
    }
  },
};
