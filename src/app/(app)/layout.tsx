import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppHeader } from '@/components/layout/app-header';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/40 group/sidebar-wrapper">
        <AppSidebar />
        <div className="flex flex-col flex-1 sm:gap-4 sm:py-4 transition-[margin-left] duration-200 ease-linear sm:ml-[15rem] group-data-[collapsed=true]:sm:ml-[3.5rem]">
          <AppHeader />
          <main className="flex-1 p-4 sm:px-6 sm:py-0 gap-4">
              {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
