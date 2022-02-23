import WebSocket from 'ws';

import { Slave } from "./Slave";

export class SlavePool {

    slaves: Array<Slave>;
    nbSlaves: number;
    splittedDictionary: Array<Array<string>>
    hash: string;
    dude: WebSocket;

    constructor(splittedDictionary: Array<Array<string>>, hash: string, dude: WebSocket) {
        this.dude = dude;
        this.hash = hash;
        this.nbSlaves = splittedDictionary.length;
        this.splittedDictionary = splittedDictionary;
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
                this.dude.send(messageContent);
                this.slaves.forEach(slave => slave.exit());
                this.slaves = [];
            }
        });
        if (this.slaves.length === this.nbSlaves) {
            // start bruteforce
            console.log('Start bruteforce');
            this.slaves.forEach((slave, index) => slave.startSearch(this.hash, ...this.getBruteForceRange(index)));
        }
    }

    private getBruteForceRange(slaveIndex: number): [string, string] {
        return [...this.splittedDictionary[slaveIndex]] as [string, string];
    }
}