'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import * as botService from '@/lib/services/bot-service';
import type { Bot } from '@/lib/types';
import { getContainerStatusByName } from './docker';


// A simple, non-robust YAML parser to find the container_name
function getContainerNameFromCompose(composeContent: string): string | null {
    const lines = composeContent.split('\n');
    const containerNameLine = lines.find(line => line.trim().startsWith('container_name:'));
    if (containerNameLine) {
        return containerNameLine.split(':')[1].trim();
    }
    return null;
}

// --- Server Actions ---

export async function getBotsWithStatus(): Promise<Bot[]> {
  const bots = await botService.getBots();
  
  const botsWithStatus = await Promise.all(bots.map(async (bot) => {
    const containerName = getContainerNameFromCompose(bot.composeContent);
    
    let isRunning = false;
    if (containerName) {
        isRunning = await getContainerStatusByName(containerName);
    } else {
        // Fallback for bots without an explicit container_name
        // This part of the logic can be improved if needed
        console.warn(`Bot ${bot.id} does not have a container_name defined.`);
    }
    
    return {
      ...bot,
      status: isRunning ? 'active' : 'inactive'
    } as Bot;
  }));

  return botsWithStatus;
}

export async function getBotById(id: string): Promise<Bot | undefined> {
    return botService.getBotById(id);
}

export async function deployBot(prevState: { error: string | undefined, success?: boolean }, formData: FormData) {
  const name = formData.get('name') as string;
  const token = formData.get('token') as string;
  const composeContent = formData.get('composeContent') as string;

  if (!name || !token || !composeContent) {
    return { error: 'All fields are required.' };
  }
  
  try {
    const newBot = await botService.createBot({ name, token, composeContent });
    await botService.startBot(newBot.id);
  } catch (error: any) {
    return { error: `Failed to deploy bot: ${error.message}` };
  }

  console.log('Revalidating path / after deployBot');
  revalidatePath('/');
  return { success: true };
}

export async function updateBot(prevState: { error: string | undefined, success?: boolean }, formData: FormData) {
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const token = formData.get('token') as string;
    const composeContent = formData.get('composeContent') as string;

    if (!id || !name || !composeContent) {
        return { error: 'ID, Name and Compose Content are required.' };
    }

    const bot = await botService.getBotById(id);

    if (!bot) {
        return { error: 'Bot not found.' };
    }

    try {
      await botService.updateBot(id, {
          name,
          composeContent,
          // If a new token is provided, use it. Otherwise, keep the old one.
          token: token || undefined,
      });

      // Restart the bot to apply changes
      await botService.startBot(id);

    } catch (error: any) {
      return { error: `Failed to update bot: ${error.message}` };
    }


    console.log('Revalidating paths / and /bots/[id]/edit after updateBot');
    revalidatePath('/');
    revalidatePath(`/bots/${id}/edit`);
    return { success: true };
}

export async function startBot(botId: string) {
  try {
    await botService.startBot(botId);
  } catch (error: any) {
    console.error(`Failed to start bot ${botId}:`, error.message);
    // Optionally, you could use a toast to show this error to the user
  }
  console.log('Revalidating path / after startBot');
  revalidatePath('/');
}

export async function stopBot(botId: string) {
  try {
    await botService.stopBot(botId);
  } catch (error: any) {
    console.error(`Failed to stop bot ${botId}:`, error.message);
  }
  console.log('Revalidating path / after stopBot');
  revalidatePath('/');
}

export async function deleteBot(botId: string) {
  try {
    await botService.deleteBot(botId);
  } catch(error: any) {
    console.error(`Failed to delete bot ${botId}:`, error.message);
  }
  console.log('Revalidating path / after deleteBot');
  revalidatePath('/');
  return { success: true };
}

export async function getBotLogs(botId: string): Promise<string> {
    const bot = await getBotById(botId);
    if (!bot) {
        return "Bot not found.";
    }
    
    try {
        return await botService.getBotLogs(botId);
    } catch (error: any) {
        return `Failed to retrieve logs: ${error.message}`;
    }
}

export async function getArchivedLogs(botId: string) {
    return botService.getArchivedLogs(botId);
}


export async function checkBotApiStatus(botId: string): Promise<{ success: boolean; message: string; }> {
    const bot = await botService.getBotById(botId);
    if (!bot) {
        return { success: false, message: "Bot not found." };
    }
    
    const botsWithStatus = await getBotsWithStatus();
    const currentBot = botsWithStatus.find(b => b.id === botId);

    if (currentBot?.status !== 'active') {
        return { success: false, message: `Bot "${bot.name}" is not active.` };
    }
    
    // This part remains a mock, as it depends on the specific bot's implementation.
    // A real implementation would ping a health check endpoint on the bot's container.
    const isSuccess = Math.random() > 0.2; // 80% chance of success
    if (isSuccess) {
        return { success: true, message: `API for "${bot.name}" is responsive (200 OK).` };
    } else {
        return { success: false, message: `API for "${bot.name}" is unresponsive (503 Service Unavailable).` };
    }
}
