import WebSocket from 'ws';

import { Slave } from "./Slave";

export class SlavePool {

    slaves: Array<Slave>;
    nbSlaves: number;
    hash: string;
    dude: WebSocket;

    constructor(nbSlaves: number, hash: string, dude: WebSocket) {
        this.dude = dude;
        this.hash = hash;
        this.nbSlaves = nbSlaves;
        this.slaves = [];
    }

    get slavesCount() {
        return this.slaves.length;
    }

    connectSlave(socket: WebSocket): void {
        socket.on('message', message => {
            const messageContent = message.toString()
            if (messageContent.startsWith('found')) {
                console.log(messageContent)
                this.slaves.forEach(slave => slave.exit());
                this.dude.send(messageContent);
            }
        });
        this.slaves.push(new Slave(socket));
        if (this.slaves.length === this.nbSlaves) {
            // start bruteforce
            this.slaves.forEach((slave, index) => slave.startSearch(this.hash, ...getBruteForceRange(index)));
            this.slaves = [];
        }
    }
}

export function getBruteForceRange(slaveIndex: number): [string, string] {
    return ['a', '99999999'];
}