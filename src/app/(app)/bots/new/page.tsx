import { DeployForm } from "@/components/bots/deploy-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewBotPage() {
    return (
        <div>
            <div className="mb-6">
                 <h1 className="text-3xl font-bold font-headline">Deploy New Bot</h1>
                 <p className="text-muted-foreground">Provide the details to deploy your new Telegram bot via Docker Compose.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Bot Configuration</CardTitle>
                    <CardDescription>
                        Paste your docker-compose content. The bot token will be available as an environment variable `BOT_TOKEN`.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DeployForm />
                </CardContent>
            </Card>
        </div>
    )
}
