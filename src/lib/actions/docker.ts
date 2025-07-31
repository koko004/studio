'use server';

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function getDockerInfo() {
  try {
    // Get general Docker info
    const { stdout: infoStdout } = await execAsync('docker info --format "{{json .}}"');
    const dockerInfo = JSON.parse(infoStdout);

    // Get container counts separately as `docker info` can be slow/unreliable for this on some systems
    const { stdout: psStdout } = await execAsync('docker ps -a --format "{{.ID}}"');
    const allContainers = psStdout.trim().split('\n').filter(Boolean);
    const { stdout: runningPsStdout } = await execAsync('docker ps --format "{{.ID}}"');
    const runningContainers = runningPsStdout.trim().split('\n').filter(Boolean);

    dockerInfo.Containers = allContainers.length;
    dockerInfo.ContainersRunning = runningContainers.length;
    dockerInfo.ContainersStopped = allContainers.length - runningContainers.length;
    
    return dockerInfo;
  } catch (error) {
    console.error('Failed to get Docker info:', error);
    return { error: 'Could not connect to Docker daemon. Is it running?' };
  }
}

export async function getRunningContainerNames(): Promise<string[]> {
    try {
        const { stdout } = await execAsync(`docker ps --format "{{.Names}}"`);
        // Docker compose v2 uses `-` as a separator, v1 used `_`. We replace `_` with `-` for consistency.
        return stdout.trim().split('\n').filter(Boolean).map(name => name.replace(/_/g, '-'));
    } catch (error) {
        console.error('Failed to get running container names:', error);
        return [];
    }
}

export async function getContainerStatusByProject(projectName: string): Promise<{name: string, isRunning: boolean}[]> {
    try {
        // Use the --project-name filter to get all containers for a specific compose project
        const { stdout } = await execAsync(`docker-compose -p ${projectName} ps --format json`);
        if (!stdout.trim()) {
            return [];
        }
        
        // The output can be a stream of JSON objects, one per line
        const containers = stdout.trim().split('\n').map(line => JSON.parse(line));

        return containers.map(container => ({
            name: container.Name,
            isRunning: container.State === 'running' || container.State === 'up'
        }));
    } catch (error) {
        // This can error if the project doesn't exist (e.g. for old dummy bots), which is fine.
        // console.error(`Failed to get container status for project ${projectName}:`, error);
        return [];
    }
}
