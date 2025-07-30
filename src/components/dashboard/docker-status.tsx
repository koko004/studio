import { getDockerInfo } from '@/lib/actions/docker';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Server, Image as ImageIcon, Container, CheckCircle2, HardDrive } from 'lucide-react';

export async function DockerStatus() {
  const info = await getDockerInfo();

  const isOnline = !info.error && info.ServerVersion;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
         <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium font-headline">Docker Status</CardTitle>
            <Badge variant={isOnline ? 'default' : 'destructive'} className="gap-1.5 pl-2 pr-2.5 py-1 text-xs">
                {isOnline ? <CheckCircle2 className="h-3 w-3"/> : null}
                {isOnline ? 'Online' : 'Offline'}
            </Badge>
         </div>
         <CardDescription className="pt-1">{info.OperatingSystem} ({info.Architecture})</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-center">
        {isOnline ? (
            <>
            <div className="text-3xl font-bold text-primary">
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
                 <div className="flex items-center gap-2">
                    <HardDrive className="h-5 w-5" />
                    <span>{info.Driver}</span>
                </div>
            </div>
            </>
        ) : (
            <div className="text-destructive text-center py-4">
                <p>{info.error}</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
