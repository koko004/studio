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

export async function getBotById(id: string): Promise<Bot | undefined> {
    const bots = await readBots();
    return bots.find((bot) => bot.id === id);
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

export async function updateBot(prevState: { error: string | undefined }, formData: FormData) {
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const token = formData.get('token') as string;
    const composeContent = formData.get('composeContent') as string;

    if (!id || !name || !composeContent) {
        return { error: 'ID, Name and Compose Content are required.' };
    }

    const bots = await readBots();
    const botIndex = bots.findIndex((b) => b.id === id);

    if (botIndex === -1) {
        return { error: 'Bot not found.' };
    }

    // Preserve original token if not provided
    bots[botIndex] = {
        ...bots[botIndex],
        name,
        composeContent,
        token: token || bots[botIndex].token,
    };

    // MOCK: In a real app, you would:
    // 1. Update the docker-compose.yml and .env files
    // 2. Run `docker-compose up -d --force-recreate` to apply changes
    console.log(`MOCK: Updating bot "${name}"...`);

    await writeBots(bots);

    revalidatePath('/');
    revalidatePath(`/bots/${id}/edit`);
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

export async function getBotLogs(botId: string): Promise<string> {
    const bot = await getBotById(botId);
    if (!bot) {
        return "Bot not found.";
    }
    // MOCK: In a real app, you would run `docker-compose logs` for the bot's service.
    const now = new Date().toISOString();
    return `
[${now}] INFO: Starting bot ${bot.name}...
[${now}] INFO: Bot connected to Telegram API.
[${now}] DEBUG: Polling for new messages.
[${new Date(Date.now() + 2000).toISOString()}] INFO: Received message: /start
[${new Date(Date.now() + 2100).toISOString()}] INFO: Responding to /start command.
[${new Date(Date.now() + 5000).toISOString()}] DEBUG: Polling for new messages.
${bot.status === 'inactive' ? `[${new Date(Date.now() + 6000).toISOString()}] INFO: Bot is shutting down.` : ''}
    `.trim();
}


export async function checkBotApiStatus(botId: string): Promise<{ success: boolean; message: string; }> {
    const bot = await getBotById(botId);
    if (!bot) {
        return { success: false, message: "Bot not found." };
    }

    // MOCK: In a real app, this would make an HTTP request to a health check endpoint on the bot.
    // We'll simulate a response based on the bot's container status.
    if (bot.status !== 'active') {
        return { success: false, message: `Bot "${bot.name}" is not active.` };
    }
    
    // Simulate a random API failure for active bots
    const isSuccess = Math.random() > 0.2; // 80% chance of success
    if (isSuccess) {
        return { success: true, message: `API for "${bot.name}" is responsive (200 OK).` };
    } else {
        return { success: false, message: `API for "${bot.name}" is unresponsive (503 Service Unavailable).` };
    }
}
