import { getDockerInfo } from '@/lib/actions/docker';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Server, Image as ImageIcon, Container, CheckCircle2 } from 'lucide-react';

export async function DockerStatus() {
  const info = await getDockerInfo();

  const isOnline = !info.error && info.ServerVersion;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className='space-y-1'>
            <CardTitle className="text-lg font-medium font-headline">Docker Status</CardTitle>
            <CardDescription>{info.OperatingSystem} ({info.Architecture})</CardDescription>
        </div>
        <Badge variant={isOnline ? 'default' : 'destructive'} className="gap-1.5 pl-2 pr-2.5 py-1 text-sm">
            <CheckCircle2 className="h-4 w-4"/>
            {isOnline ? 'Online' : 'Offline'}
        </Badge>
      </CardHeader>
      <CardContent>
        {isOnline ? (
            <>
            <div className="text-3xl font-bold text-primary mt-2">
                v{info.ServerVersion}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-sm text-muted-foreground pt-4 border-t">
                <div className="flex items-center gap-2">
                    <Container className="h-5 w-5" />
                    <span>{info.Containers} Containers ({info.ContainersRunning} running)</span>
                </div>
                <div className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    <span>{info.Images} Images</span>
                </div>
            </div>
            </>
        ) : (
            <div className="mt-4 text-destructive">
                <p>{info.error}</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
