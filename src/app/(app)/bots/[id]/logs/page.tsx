import { getBotById, getBotLogs } from "@/lib/actions/bots";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function BotLogsPage({ params }: { params: { id: string } }) {
    const bot = await getBotById(params.id);

    if (!bot) {
        notFound();
    }

    const logs = await getBotLogs(params.id);

    return (
        <div>
            <div className="mb-6 flex items-center gap-4">
                 <Button asChild variant="outline" size="icon">
                    <Link href="/">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                 </Button>
                 <div>
                    <h1 className="text-3xl font-bold font-headline">Logs: {bot.name}</h1>
                    <p className="text-muted-foreground">Showing recent logs from the container.</p>
                 </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Container Logs</CardTitle>
                    <CardDescription>
                       Real-time logs from your bot's container will appear here. This is mock data.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                   <ScrollArea className="h-96 w-full rounded-md border bg-muted">
                        <pre className="p-4 text-sm font-mono whitespace-pre-wrap">
                            {logs}
                        </pre>
                   </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}
