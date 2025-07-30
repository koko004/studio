'use client';
import { Bot, Home, LogOut, PlusCircle, Settings, Tooltip } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/actions/auth';
import { TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

const navItems = [
  { href: '/', icon: Home, label: 'Dashboard' },
  { href: '/bots/new', icon: PlusCircle, label: 'New Bot' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="hidden border-r bg-background sm:flex">
      <SidebarContent className="flex flex-col">
        <SidebarHeader>
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Bot className="h-6 w-6 text-primary" />
            <span className="">Bot Manager</span>
          </Link>
        </SidebarHeader>
        <nav className="flex flex-col gap-2 px-2 mt-8">
            <TooltipProvider>
          {navItems.map((item) => (
            <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8 ${
                        pathname === item.href
                          ? 'bg-accent text-accent-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="sr-only">{item.label}</span>
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          ))}
          </TooltipProvider>
        </nav>
        <SidebarFooter className="mt-auto p-2">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                         <form action={logout} className="w-full">
                            <Button variant="ghost" size="icon" className="w-full" type="submit">
                                <LogOut className="h-5 w-5" />
                                <span className="sr-only">Logout</span>
                            </Button>
                        </form>
                    </TooltipTrigger>
                    <TooltipContent side="right">Logout</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
