import { Suspense } from 'react';
import { BotList } from '@/components/dashboard/bot-list';
import { Skeleton } from '@/components/ui/skeleton';
import { getBotsWithStatus } from '@/lib/actions/bots';
import { DashboardCounters } from '@/components/dashboard/dashboard-counters';

export default async function DashboardPage() {
  const bots = await getBotsWithStatus();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
      </div>

      <Suspense fallback={<Skeleton className="h-24 w-full" />}>
        <DashboardCounters bots={bots} />
      </Suspense>

      <div>
        <h2 className="text-2xl font-semibold mb-4 font-headline">Bots</h2>
        <Suspense fallback={<BotListSkeleton />}>
          <BotList bots={bots} />
        </Suspense>
      </div>
    </div>
  );
}

function BotListSkeleton() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
        </div>
    )
}
