import { Suspense } from 'react';
import { BotList } from '@/components/dashboard/bot-list';
import { DockerStatus } from '@/components/dashboard/docker-status';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
        <Button asChild>
          <Link href="/bots/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Deploy Bot
          </Link>
        </Button>
      </div>

      <Suspense fallback={<Skeleton className="h-32 w-full" />}>
        <DockerStatus />
      </Suspense>

      <div>
        <h2 className="text-2xl font-semibold mb-4 font-headline">My Bots</h2>
        <Suspense fallback={<BotListSkeleton />}>
          <BotList />
        </Suspense>
      </div>
    </div>
  );
}

function BotListSkeleton() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
        </div>
    )
}
