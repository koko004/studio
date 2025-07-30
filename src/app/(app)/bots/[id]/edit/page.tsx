import { getBotById } from "@/lib/actions/bots";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EditForm } from "@/components/bots/edit-form";

export default async function EditBotPage({ params }: { params: { id: string } }) {
    const bot = await getBotById(params.id);

    if (!bot) {
        notFound();
    }

    return (
        <div>
            <div className="mb-6">
                 <h1 className="text-3xl font-bold font-headline">Edit Bot: {bot.name}</h1>
                 <p className="text-muted-foreground">Modify the configuration for your Telegram bot.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Bot Configuration</CardTitle>
                    <CardDescription>
                        Update the bot name and docker-compose content.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <EditForm bot={bot} />
                </CardContent>
            </Card>
        </div>
    )
}
