import crypto from 'crypto';
import type { Bot } from '@/lib/types';
import * as db from './db';

// This service contains the business logic for managing bots.
// It uses the db layer for data persistence.

export async function getBots(): Promise<Bot[]> {
  return await db.getBots();
}

export async function getBotById(id: string): Promise<Bot | undefined> {
  const bots = await db.getBots();
  return bots.find((bot) => bot.id === id);
}

type CreateBotData = Omit<Bot, 'id' | 'status'>;

export async function createBot(botData: CreateBotData): Promise<Bot> {
  const bots = await db.getBots();
  const newBot: Bot = {
    id: crypto.randomUUID(),
    name: botData.name,
    token: botData.token,
    composeContent: botData.composeContent,
    status: 'active', // Default status on creation
  };
  bots.push(newBot);
  await db.writeBots(bots);
  return newBot;
}

type UpdateBotData = Partial<Omit<Bot, 'id'>>;

export async function updateBot(id: string, botData: UpdateBotData): Promise<Bot | undefined> {
    const bots = await db.getBots();
    const botIndex = bots.findIndex((b) => b.id === id);

    if (botIndex === -1) {
        return undefined;
    }

    const updatedBot = { ...bots[botIndex], ...botData };
    bots[botIndex] = updatedBot;
    await db.writeBots(bots);
    return updatedBot;
}


export async function deleteBot(id: string): Promise<boolean> {
    let bots = await db.getBots();
    const initialLength = bots.length;
    bots = bots.filter((b) => b.id !== id);

    if (bots.length < initialLength) {
        await db.writeBots(bots);
        return true; // Deletion was successful
    }
    return false; // Bot not found
}
