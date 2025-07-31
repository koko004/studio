import { getBotById, getBotLogs, getArchivedLogs } from "@/lib/actions/bots";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function BotLogsPage({ params }: { params: { id: string } }) {
    const bot = await getBotById(params.id);

    if (!bot) {
        notFound();
    }

    const [currentLogs, archivedLogs] = await Promise.all([
        getBotLogs(params.id),
        getArchivedLogs(params.id),
    ]);

    async function refreshLogs() {
        'use server';
        revalidatePath(`/bots/${params.id}/logs`);
    }

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline" size="icon">
                        <Link href="/">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold font-headline">Logs: {bot.name}</h1>
                        <p className="text-muted-foreground">Showing real-time and archived logs.</p>
                    </div>
                </div>
                <form action={refreshLogs}>
                    <Button variant="outline">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh Logs
                    </Button>
                </form>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Real-time Logs</CardTitle>
                        <CardDescription>
                        Up-to-the-minute logs from your bot's container.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                    <ScrollArea className="h-96 w-full rounded-md border bg-muted">
                            <pre className="p-4 text-sm font-mono whitespace-pre-wrap">
                                {currentLogs}
                            </pre>
                    </ScrollArea>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Archived Logs</CardTitle>
                        <CardDescription>
                        Historical logs stored in the database.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                    <ScrollArea className="h-96 w-full rounded-md border bg-muted">
                            {archivedLogs.map((log) => (
                                <div key={log.id} className="p-4 border-b">
                                    <p className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</p>
                                    <pre className="text-sm font-mono whitespace-pre-wrap">
                                        {log.log}
                                    </pre>
                                </div>
                            ))}
                    </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
