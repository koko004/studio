import { BotCard } from './bot-card';
import { getBotsWithStatus } from '@/lib/actions/bots';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export async function BotList() {
    const bots = await getBotsWithStatus();
    
    if (bots.length === 0) {
        return (
            <div className="text-center py-16 border-2 border-dashed rounded-lg bg-card">
                <h3 className="text-xl font-semibold">No bots deployed yet</h3>
                <p className="text-muted-foreground mt-2">Get started by deploying your first Telegram bot.</p>
                <Button asChild className="mt-4">
                    <Link href="/bots/new"><PlusCircle className="mr-2 h-4 w-4" /> Deploy New Bot</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {bots.map((bot) => (
                <BotCard key={bot.id} bot={bot} />
            ))}
        </div>
    )
}
