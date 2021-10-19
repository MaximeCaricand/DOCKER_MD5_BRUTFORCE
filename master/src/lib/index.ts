import Dockerode from 'dockerode';
import { Slave } from './Slave';

const docker = new Dockerode();

export const port = 30000;
export const host = '127.0.0.1'
export const slaves: Array<Slave> = [];

export async function runSlaveImage() {
    await docker.createContainer({
        Image: 'servuc/hash_extractor:latest',
        Cmd: ['./hash_extractor', 's', `ws://${host}:${port}`],
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Tty: true,
        HostConfig: { NetworkMode: 'host' }
    }).then(container => container.start());
}

export function getBruteForceRange(slaveIndex: number, totalSlave: number): [string, string] {
    return ['a', '99999999'];
}