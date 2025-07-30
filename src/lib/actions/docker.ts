'use server';

// This is a mocked function. In a real application, you would use
// `child_process` to execute `docker info` and parse the output.
export async function getDockerInfo() {
  try {
    // MOCK: const { stdout } = await execAsync('docker info --format "{{json .}}"');
    // MOCK: return JSON.parse(stdout);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return {
      ServerVersion: '25.0.3',
      Containers: 12,
      ContainersRunning: 8,
      ContainersPaused: 0,
      ContainersStopped: 4,
      Images: 34,
      OperatingSystem: 'Docker Desktop',
      Architecture: 'aarch64',
      Driver: 'overlay2'
    };
  } catch (error) {
    console.error('MOCK: Failed to get Docker info:', error);
    return { error: 'Could not connect to Docker daemon.' };
  }
}
