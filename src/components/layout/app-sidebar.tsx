'use client';
import { Bot, Home, LogOut, PlusCircle, Settings } from 'lucide-react';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
        <SidebarHeader className="group-data-[collapsed=true]:justify-center group-data-[collapsed=true]:px-2">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Bot className="h-6 w-6 text-primary" />
            <span className="group-data-[collapsed=true]:hidden">Bot Manager</span>
          </Link>
        </SidebarHeader>
        <nav className="flex flex-col gap-3 px-4 mt-8 group-data-[collapsed=true]:px-2">
            <TooltipProvider>
          {navItems.map((item) => (
            <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all group-data-[collapsed=true]:justify-center group-data-[collapsed=true]:px-2 group-data-[collapsed=true]:py-2 ${
                        pathname === item.href
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="group-data-[collapsed=true]:hidden">{item.label}</span>
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          ))}
          </TooltipProvider>
        </nav>
        <SidebarFooter className="mt-auto p-4 group-data-[collapsed=true]:p-2">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                         <form action={logout} className="w-full">
                            <Button variant="ghost" className="w-full justify-start gap-3 group-data-[collapsed=true]:justify-center group-data-[collapsed=true]:px-2" type="submit">
                                <LogOut className="h-4 w-4" />
                                <span className="group-data-[collapsed=true]:hidden">Logout</span>
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
