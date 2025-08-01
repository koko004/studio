'use client';
import Link from 'next/link';
import { Bot, Home, LogOut, PlusCircle, Settings, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { logout } from '@/lib/actions/auth';

const navItems = [
  { href: '/', icon: Home, label: 'Dashboard' },
  { href: '/bots/new', icon: PlusCircle, label: 'New Bot' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <Bot className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">Bot Manager</span>
            </Link>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
            <form action={logout} className="w-full">
                <button className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground w-full" type="submit">
                    <LogOut className="h-5 w-5" />
                    Logout
                </button>
            </form>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
