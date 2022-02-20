import WebSocket from 'ws';

import { Slave } from "./Slave";

export class SlavePool {

    readonly SPLITED_ALPHABET = [
        ['a', 'o9999'],
        ['o9999', 'D9999'],
        ['D9999', 'S9999'],
        ['S9999', '99999']
    ]

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
        this.slaves.push(new Slave(socket));
        socket.on('message', message => {
            const messageContent = message.toString()
            if (messageContent.startsWith('found')) {
                console.log(messageContent)
                this.slaves.forEach(slave => slave.stopSearch());
                this.slaves.forEach(slave => slave.exit());
                this.slaves = [];
                this.dude.send(messageContent);
            }
        });
        if (this.slaves.length === this.nbSlaves) {
            // start bruteforce
            console.log('Start bruteforce');
            this.slaves.forEach((slave, index) => slave.startSearch(this.hash, ...this.getBruteForceRange(index)));
        }
    }

    private getBruteForceRange(slaveIndex: number): [string, string] {
        return [...this.SPLITED_ALPHABET[slaveIndex]] as [string, string];
    }
}