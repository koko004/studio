'use client';
import { useFormStatus } from 'react-dom';
import { useActionState, useEffect } from 'react';
import { deployBot } from '@/lib/actions/bots';
import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Loader2 } from 'lucide-react';

const DUMMY_COMPOSE_CONTENT = `version: '3.8'
services:
  my-bot:
    image: user/telegram-bot:latest
    restart: unless-stopped
    environment:
      - BOT_TOKEN=\${BOT_TOKEN}
    # Add any other necessary configurations
`;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Deploy Bot
    </Button>
  );
}

export function DeployForm() {
    const [state, formAction] = useActionState(deployBot, { error: undefined });
    const { toast } = useToast();

    useEffect(() => {
        if (state?.error) {
            toast({
                variant: 'destructive',
                title: 'Deployment Failed',
                description: state.error,
            });
        }
    }, [state, toast]);

    return (
        <form action={formAction} className="grid gap-6">
            <div className="grid sm:grid-cols-2 gap-4">
                 <div className="grid gap-2">
                    <Label htmlFor="name">Bot Name</Label>
                    <Input id="name" name="name" placeholder="My Awesome Bot" required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="token">Bot Token</Label>
                    <Input id="token" name="token" type="password" placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11" required />
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="composeContent">Docker Compose Content</Label>
                <Textarea 
                    id="composeContent" 
                    name="composeContent" 
                    placeholder="Paste your docker-compose.yml content here" 
                    required 
                    rows={12}
                    className="font-mono text-xs"
                    defaultValue={DUMMY_COMPOSE_CONTENT}
                />
            </div>
            
            <div className="flex justify-end">
                <SubmitButton />
            </div>
        </form>
    )
}
