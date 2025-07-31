import crypto from 'crypto';
import type { Bot } from '@/lib/types';
import * as db from './db';
import path from 'path';
import fse from 'fs-extra';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

const BOTS_DIR = path.join(process.cwd(), 'src/data/bots');

export function getBotDir(id: string) {
  return path.join(BOTS_DIR, id);
}

export function getBotProjectName(id: string) {
    // Docker Compose uses the directory name for the project name, but with invalid characters removed.
    // We'll mimic this by using a prefix and the bot ID's first 8 characters.
    return `bot-${id.substring(0,8)}`;
}

async function runComposeCommand(botId: string, command: string) {
    const botDir = getBotDir(botId);
    const projectName = getBotProjectName(botId);
    // -p specifies the project name, --project-directory specifies the path to the yml file
    const fullCommand = `docker-compose -p ${projectName} --project-directory ${botDir} ${command}`;
    try {
        const { stdout, stderr } = await execAsync(fullCommand);
        if (stderr) {
            console.warn(`Docker-compose command for ${botId} had stderr: ${stderr}`);
        }
        return stdout;
    } catch (error: any) {
        console.error(`Failed to execute docker-compose command for bot ${botId}: ${error.message}`);
        throw new Error(error.message);
    }
}

// --- Service Functions ---

export async function getBots(): Promise<Bot[]> {
  return await db.getBots();
}

export async function getBotById(id: string): Promise<Bot | undefined> {
  const bots = await db.getBots();
  return bots.find((bot) => bot.id === id);
}

type CreateBotData = Omit<Bot, 'id' | 'status'>;

export async function createBot(botData: CreateBotData): Promise<Bot> {
  const newBot: Bot = {
    id: crypto.randomUUID(),
    name: botData.name,
    token: botData.token, // Store the token temporarily
    composeContent: botData.composeContent,
    status: 'inactive', // Start as inactive
  };

  const botDir = getBotDir(newBot.id);
  await fse.ensureDir(botDir);

  const composePath = path.join(botDir, 'docker-compose.yml');
  const envPath = path.join(botDir, '.env');

  await fse.writeFile(composePath, newBot.composeContent);
  await fse.writeFile(envPath, `BOT_TOKEN=${newBot.token}`);
  
  // Don't store the token in the main DB file for security
  const botToSave = { ...newBot };
  delete (botToSave as any).token;

  const bots = await db.getBots();
  bots.push(botToSave);
  await db.writeBots(bots);

  return newBot;
}

type UpdateBotData = Partial<Omit<Bot, 'id' | 'status'>>;

export async function updateBot(id: string, botData: UpdateBotData): Promise<Bot | undefined> {
    const bots = await db.getBots();
    const botIndex = bots.findIndex((b) => b.id === id);

    if (botIndex === -1) {
        return undefined;
    }
    
    // Update docker-compose.yml and .env if needed
    const botDir = getBotDir(id);
    if (botData.composeContent) {
        await fse.writeFile(path.join(botDir, 'docker-compose.yml'), botData.composeContent);
    }
    if (botData.token) {
        await fse.writeFile(path.join(botDir, '.env'), `BOT_TOKEN=${botData.token}`);
        // The token is write-only, so we don't save it back to the JSON
        delete botData.token;
    }

    const updatedBot = { ...bots[botIndex], ...botData };
    bots[botIndex] = updatedBot;
    await db.writeBots(bots);
    return updatedBot;
}


export async function deleteBot(id: string): Promise<boolean> {
    let bots = await db.getBots();
    const botExists = bots.some((b) => b.id === id);
    if (!botExists) {
        return false;
    }

    const botDir = getBotDir(id);
    const botDirExists = await fse.pathExists(botDir);
    
    if (botDirExists) {
      // Stop and remove containers, volumes, networks and images
      await runComposeCommand(id, 'down -v --rmi all');
      // Delete the bot's directory
      await fse.remove(botDir);
    }

    // Always filter the bot from the database file
    const newBots = bots.filter((b) => b.id !== id);
    await db.writeBots(newBots);
    
    return true;
}

// --- Docker-related functions ---

export async function startBot(id: string): Promise<void> {
    await runComposeCommand(id, 'up -d --force-recreate');
}

export async function stopBot(id: string): Promise<void> {
    await runComposeCommand(id, 'stop');
}

export async function getBotLogs(id: string): Promise<string> {
    return await runComposeCommand(id, 'logs --tail="100"');
}
