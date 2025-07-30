'use client';
import type { Bot } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Play, Square, Trash2, Bot as BotIcon, Loader2 } from 'lucide-react';
import { startBot, stopBot, deleteBot } from '@/lib/actions/bots';
import { useTransition } from 'react';

export function BotCard({ bot }: { bot: Bot }) {
    const [isPending, startTransition] = useTransition();

    const handleAction = (action: (botId: string) => Promise<void>) => {
        startTransition(() => {
            action(bot.id);
        });
    };

    return (
        <Card className="flex flex-col transition-all hover:shadow-lg hover:shadow-primary/10">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="space-y-1.5">
                        <CardTitle className="flex items-center gap-2">
                            <BotIcon className="h-5 w-5" />
                            {bot.name}
                        </CardTitle>
                        <CardDescription>Bot ID: {bot.id.substring(0, 8)}</CardDescription>
                    </div>
                    <Badge variant={bot.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                        {bot.status}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="text-sm text-muted-foreground">
                    <p className="font-mono bg-muted p-2 rounded-md text-xs truncate">{bot.composeContent.split('\n')[1] || 'No service info'}</p>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                {isPending ? (
                     <Button variant="outline" size="icon" disabled>
                        <Loader2 className="h-4 w-4 animate-spin" />
                    </Button>
                ) : (
                    <>
                    {bot.status !== 'active' && (
                        <Button variant="outline" size="icon" onClick={() => handleAction(startBot)}>
                            <Play className="h-4 w-4" />
                            <span className="sr-only">Start</span>
                        </Button>
                    )}
                    {bot.status === 'active' && (
                         <Button variant="outline" size="icon" onClick={() => handleAction(stopBot)}>
                            <Square className="h-4 w-4" />
                            <span className="sr-only">Stop</span>
                        </Button>
                    )}
                    <Button variant="destructive" size="icon" onClick={() => handleAction(deleteBot)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                    </Button>
                    </>
                )}
            </CardFooter>
        </Card>
    );
}
