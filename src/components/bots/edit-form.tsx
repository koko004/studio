'use client';
import { useFormStatus } from 'react-dom';
import { useActionState, useEffect } from 'react';
import { updateBot } from '@/lib/actions/bots';
import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Loader2 } from 'lucide-react';
import type { Bot } from '@/lib/types';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Save Changes
    </Button>
  );
}

export function EditForm({ bot }: { bot: Bot }) {
    const [state, formAction] = useActionState(updateBot, { error: undefined });
    const { toast } = useToast();

    useEffect(() => {
        if (state?.error) {
            toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: state.error,
            });
        }
    }, [state, toast]);

    return (
        <form action={formAction} className="grid gap-6">
            <input type="hidden" name="id" value={bot.id} />
            <div className="grid sm:grid-cols-2 gap-4">
                 <div className="grid gap-2">
                    <Label htmlFor="name">Bot Name</Label>
                    <Input id="name" name="name" defaultValue={bot.name} required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="token">Bot Token</Label>
                    <Input id="token" name="token" type="password" placeholder="Leave blank to keep existing token" />
                     <p className="text-xs text-muted-foreground">The token is write-only for security. Provide a new one to change it.</p>
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
                    defaultValue={bot.composeContent}
                />
            </div>
            
            <div className="flex justify-end">
                <SubmitButton />
            </div>
        </form>
    )
}
