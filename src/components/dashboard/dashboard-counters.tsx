import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, CheckCircle, XCircle, List } from 'lucide-react';
import { getDockerInfo } from '@/lib/actions/docker';
import type { Bot as BotType } from '@/lib/types';

export async function DashboardCounters({ bots }: { bots: BotType[] }) {
  const dockerInfo = await getDockerInfo();
  const activeBots = bots.filter(b => b.status === 'active').length;
  const inactiveBots = bots.filter(b => b.status === 'inactive').length;
  const totalBots = bots.length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Bots</CardTitle>
          <List className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalBots}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Bots</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeBots}</div>
        </CardContent>
      </Card>
       <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inactive Bots</CardTitle>
          <XCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inactiveBots}</div>
        </CardContent>
      </Card>
       <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Running Containers</CardTitle>
          <Bot className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dockerInfo.ContainersRunning}/{dockerInfo.Containers}</div>
           <p className="text-xs text-muted-foreground">
            From Docker
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
