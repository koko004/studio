'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import type { Bot } from '@/lib/types';

// In a real app, this would be a database. For this demo, we use a simple JSON file.
// In a containerized environment, you'd mount a volume to persist this file.
const botsFilePath = path.join(process.cwd(), 'src/data/bots.json');

// MOCKED functions for file-based storage
async function readBots(): Promise<Bot[]> {
  try {
    const data = await fs.readFile(botsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return []; // If file doesn't exist, return empty array
  }
}

async function writeBots(bots: Bot[]): Promise<void> {
  await fs.writeFile(botsFilePath, JSON.stringify(bots, null, 2), 'utf-8');
}

// --- Server Actions ---

export async function getBotsWithStatus(): Promise<Bot[]> {
  // In a real app, you would query Docker for the status of each bot.
  // Here we just return the status from our mock data file.
  return await readBots();
}

export async function deployBot(prevState: { error: string | undefined }, formData: FormData) {
  const name = formData.get('name') as string;
  const token = formData.get('token') as string;
  const composeContent = formData.get('composeContent') as string;

  if (!name || !token || !composeContent) {
    return { error: 'All fields are required.' };
  }

  const bots = await readBots();
  const newBot: Bot = {
    id: crypto.randomUUID(),
    name,
    token, // In a real app, you'd store this securely (e.g., in a secret manager)
    composeContent,
    status: 'active', // Assume it starts successfully
  };

  // MOCK: In a real app, you would:
  // 1. Create a directory for the bot
  // 2. Save the docker-compose.yml file
  // 3. Create a .env file with the BOT_TOKEN
  // 4. Run `docker-compose up -d`
  console.log(`MOCK: Deploying bot "${name}"...`);

  bots.push(newBot);
  await writeBots(bots);

  revalidatePath('/');
  redirect('/');
}

export async function startBot(botId: string) {
  const bots = await readBots();
  const bot = bots.find((b) => b.id === botId);
  if (bot) {
    // MOCK: Run `docker-compose start`
    console.log(`MOCK: Starting bot "${bot.name}"...`);
    bot.status = 'active';
    await writeBots(bots);
    revalidatePath('/');
  }
}

export async function stopBot(botId: string) {
  const bots = await readBots();
  const bot = bots.find((b) => b.id === botId);
  if (bot) {
    // MOCK: Run `docker-compose stop`
    console.log(`MOCK: Stopping bot "${bot.name}"...`);
    bot.status = 'inactive';
    await writeBots(bots);
    revalidatePath('/');
  }
}

export async function deleteBot(botId: string) {
  let bots = await readBots();
  const bot = bots.find((b) => b.id === botId);
  if (bot) {
    // MOCK: Run `docker-compose down -v` and delete files
    console.log(`MOCK: Deleting bot "${bot.name}"...`);
    bots = bots.filter((b) => b.id !== botId);
    await writeBots(bots);
    revalidatePath('/');
  }
}
