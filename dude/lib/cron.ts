import { WebSocket } from 'ws';

export class CronJob {

    private static instance: CronJob;

    private ws: WebSocket;
    private speed: number;

    constructor() { this.speed = 0 };

    public static getInstance(): CronJob {
        if (!CronJob.instance) {
            CronJob.instance = new CronJob();
        }
        return CronJob.instance;
    }

    public setWs(ws: WebSocket) { this.ws = ws; }
    public setSpeed(speed: number) { this.speed = 0; this.speed = speed }

    private cronjob() {
        (async () => {
            while (this.speed > 0) {
                await new Promise(resolve => setTimeout(resolve, this.speed));
                this.ws.send(this.state.hash);
                console.log(this.state.hash);
            }
        })();
    }
}