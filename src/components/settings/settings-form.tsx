'use client';
import { useTheme } from 'next-themes';
import { Button } from '../ui/button';
import { Moon, Sun } from 'lucide-react';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function SettingsForm() {
    const { setTheme } = useTheme();
    const [autoRefresh, setAutoRefresh] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const savedRefresh = localStorage.getItem('autoRefresh') === 'true';
        setAutoRefresh(savedRefresh);
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (autoRefresh) {
            interval = setInterval(() => {
                router.refresh();
            }, 10000); // 10 seconds
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [autoRefresh, router]);

    const handleRefreshToggle = (checked: boolean) => {
        setAutoRefresh(checked);
        localStorage.setItem('autoRefresh', String(checked));
    };

    return (
        <div className="space-y-6 max-w-md">
            <div className="flex items-center justify-between">
                <Label htmlFor="theme" className="text-base">Theme</Label>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => setTheme('light')}>
                        <Sun className="h-5 w-5" />
                    </Button>
                     <Button variant="outline" size="icon" onClick={() => setTheme('dark')}>
                        <Moon className="h-5 w-5" />
                    </Button>
                </div>
            </div>
            <div className="flex items-center justify-between">
                <div className='space-y-1'>
                    <Label htmlFor="auto-refresh" className="text-base">Auto Refresh</Label>
                    <p className="text-sm text-muted-foreground">Automatically refresh dashboard data every 10 seconds.</p>
                </div>
                <Switch 
                    id="auto-refresh"
                    checked={autoRefresh}
                    onCheckedChange={handleRefreshToggle}
                />
            </div>
        </div>
    )
}
