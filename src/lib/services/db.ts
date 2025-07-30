import { promises as fs } from 'fs';
import path from 'path';
import type { Bot } from '@/lib/types';

// This file simulates a basic database using a JSON file.
// In a real application, you would replace these functions
// with calls to a proper database like PostgreSQL, MongoDB, etc.

const dataPath = path.join(process.cwd(), 'src/data');
const botsFilePath = path.join(dataPath, 'bots.json');

async function ensureDataDirExists() {
  try {
    await fs.access(dataPath);
  } catch {
    await fs.mkdir(dataPath, { recursive: true });
  }
}

async function readData<T>(filePath: string): Promise<T[]> {
  await ensureDataDirExists();
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as T[];
  } catch (error) {
    // If the file doesn't exist or is empty, return an empty array
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function writeData<T>(filePath: string, data: T[]): Promise<void> {
  await ensureDataDirExists();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// --- Bot Specific Functions ---

export async function getBots(): Promise<Bot[]> {
    return await readData<Bot>(botsFilePath);
}

export async function writeBots(bots: Bot[]): Promise<void> {
    await writeData<Bot>(botsFilePath, bots);
}
