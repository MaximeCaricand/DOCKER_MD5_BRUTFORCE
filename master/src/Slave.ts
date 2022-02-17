import WebSocket from 'ws';

export class Slave {
    name: string;
    client: WebSocket;

    constructor(client: WebSocket) {
        this.name = `Slave-${Date.now()}`;
        this.client = client;
    }

    startSearch(hash: string, begin: string, end: string) {
        console.log(`search ${hash} ${begin} ${end}`);
        this.client.send(`search ${hash} ${begin} ${end}`);
    }

    stopSearch() {
        this.client.send('stop');
    }

    exit() {
        this.client.send('exit');
    }
}