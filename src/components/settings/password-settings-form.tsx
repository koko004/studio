'use client';
import { useActionState, useEffect } from 'react';
import { changePassword } from '@/lib/actions/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export function PasswordSettingsForm() {
    const { toast } = useToast();
    const [state, formAction] = useActionState(changePassword, { error: undefined, success: undefined });

    useEffect(() => {
        if (state.error) {
            toast({ title: 'Error', description: state.error, variant: 'destructive' });
        }
        if (state.success) {
            toast({ title: 'Success', description: 'Password changed successfully.' });
        }
    }, [state, toast]);

    return (
        <form action={formAction} className="space-y-4 max-w-md">
            <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" name="newPassword" type="password" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" required />
            </div>
            <Button type="submit">Change Password</Button>
        </form>
    );
}
