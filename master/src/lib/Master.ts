import { createServer } from 'http';
import { WebSocketServer, AddressInfo, WebSocket } from 'ws';
import { getBruteForceRange, runSlaveImage } from '.';
import { Slave } from './Slave';
import { Server } from 'http'

export class Master {
    server: Server;
    wss: WebSocketServer;
    slaves: Array<Slave>;
    throttling: Array<string>;

    constructor() {
        this.server = createServer();
        this.wss = new WebSocketServer({ server: this.server });
        this.slaves = [];
        this.throttling = [];

        this.wss.on('connection', (client: WebSocket) => {
            this.slaves.push(new Slave(client));
            client.on('message', message => {
                const messageContent = message.toString()
                if (messageContent.startsWith('found')) {
                    console.log(messageContent)
                    this.slaves.forEach(slave => slave.stopSearch());
                    this.throttling.pop();
                }
            });
        });
    }

    async start(host: string, port: number, initialProvisioning: number) {
        await new Promise<void>((resolve) => {
            this.server.listen(port, host, () => {
                const address = this.server.address() as AddressInfo;
                console.log(`Listening on ${address.address}:${address.port}`);
            });
            resolve();
        })
        await this.initialProvisioning(initialProvisioning);
    }

    async bruteForce(word: string) {
        this.throttling.push(word);
        this.slaves.forEach((slave, index) => {
            slave.startSearch(word, ...getBruteForceRange(index, this.slaves.length))
        })
    }

    private initialProvisioning(size: number) {
        const promises: Array<Promise<void>> = [];
        for (let i = 0; i < size; i++) promises.push(runSlaveImage());
        return Promise.all(promises);
    }
}
