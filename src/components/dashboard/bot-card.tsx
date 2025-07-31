'use client';
import type { Bot } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Play, Square, Trash2, Bot as BotIcon, Loader2, CheckCircle, XCircle, Pencil, FileText, Webhook } from 'lucide-react';
import { startBot, stopBot, deleteBot, checkBotApiStatus } from '@/lib/actions/bots';
import { useTransition } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';


export function BotCard({ bot }: { bot: Bot }) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const router = useRouter();

    const handleAction = (action: (botId: string) => Promise<{ success?: boolean; error?: string }>) => {
        startTransition(async () => {
            const result = await action(bot.id);
            if (result?.error) {
                toast({
                    variant: 'destructive',
                    title: 'Action Failed',
                    description: result.error,
                });
            } else if (result?.success) {
                toast({
                    title: 'Action Successful',
                    description: 'The bot action was completed.',
                });
                router.refresh(); // Refresh the current route to re-fetch data
            }
        });
    };
    
    const handleApiCheck = () => {
        startTransition(async () => {
            const result = await checkBotApiStatus(bot.id);
            toast({
                variant: result.success ? 'default' : 'destructive',
                title: `API Status: ${bot.name}`,
                description: result.message,
            })
        });
    }

    const statusConfig = {
        active: {
            label: 'Active',
            className: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
            icon: <CheckCircle className="h-3 w-3" />,
        },
        inactive: {
            label: 'Inactive',
            className: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
            icon: <XCircle className="h-3 w-3" />,
        },
        unknown: {
            label: 'Unknown',
            className: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
            icon: <BotIcon className="h-3 w-3" />,
        }
    };

    const currentStatus = statusConfig[bot.status] || statusConfig.unknown;

    return (
        <Card className="flex flex-col transition-all hover:shadow-lg hover:shadow-primary/10">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="space-y-1.5">
                        <CardTitle className="flex items-center gap-2">
                            <BotIcon className="h-5 w-5" />
                            {bot.name}
                        </CardTitle>
                        <CardDescription>ID: {bot.id.substring(0, 8)}</CardDescription>
                    </div>
                    <Badge variant="outline" className={cn("capitalize gap-1.5 pl-2 pr-2.5 py-1 text-xs border-none", currentStatus.className)}>
                        {currentStatus.icon}
                        {currentStatus.label}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="text-sm text-muted-foreground">
                    <p className="font-mono bg-muted p-2 rounded-md text-xs truncate">{bot.composeContent.split('\n')[2] || 'No service info'}</p>
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
                        <Button variant="outline" size="icon" title="Start" onClick={() => handleAction(startBot)} className="hover:bg-green-100 hover:text-green-800 dark:hover:bg-green-900/50 dark:hover:text-green-300">
                            <Play className="h-4 w-4" />
                            <span className="sr-only">Start</span>
                        </Button>
                    )}
                    {bot.status === 'active' && (
                         <Button variant="outline" size="icon" title="Stop" onClick={() => handleAction(stopBot)} className="hover:bg-red-100 hover:text-red-800 dark:hover:bg-red-900/50 dark:hover:text-red-300">
                            <Square className="h-4 w-4" />
                            <span className="sr-only">Stop</span>
                        </Button>
                    )}
                     <Button asChild variant="outline" size="icon" title="Edit">
                        <Link href={`/bots/${bot.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                        </Link>
                    </Button>
                     <Button asChild variant="outline" size="icon" title="View Logs" className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/50">
                       <Link href={`/bots/${bot.id}/logs`}>
                            <FileText className="h-4 w-4" />
                            <span className="sr-only">View Logs</span>
                        </Link>
                    </Button>
                     <Button variant="outline" size="icon" title="Check API Status" onClick={handleApiCheck} className="text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/50">
                        <Webhook className="h-4 w-4" />
                        <span className="sr-only">Check API Status</span>
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon" title="Delete">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your bot
                            and remove its data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleAction(deleteBot)}>
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    </>
                )}
            </CardFooter>
        </Card>
    );
}
