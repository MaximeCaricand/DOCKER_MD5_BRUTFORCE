import * as http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { SlavePool } from './SlavePool';
import { exec } from 'child_process';

const DudesPort = 3100;
const SlavesPort = 3200;

const pendingSlavePools: Array<SlavePool> = [];
const inProgessSlavePools: Array<SlavePool> = [];
const replicaPerHash = 4;

(async () => {
    // Websocket setup
    const dudesServer = http.createServer();
    const slavesServer = http.createServer();
    // @ts-ignore
    dudesServer.listen(DudesPort, () => console.log('[DUDE WS] Listening on ' + dudesServer.address().address + ':' + dudesServer.address().port));
    // @ts-ignore
    slavesServer.listen(SlavesPort, () => console.log('[SLAVES WS] Listening on ' + slavesServer.address().address + ':' + slavesServer.address().port));

    const dudesWs = new WebSocketServer({ server: dudesServer });
    const slavesWs = new WebSocketServer({ server: slavesServer });

    dudesWs.on('connection', (dude: WebSocket) => {
        console.log('Hello new dude');
        dude.on('message', message => {
            const hash = message.toString();
            console.log(`New hash ${hash}`);
            pendingSlavePools.push(new SlavePool(replicaPerHash, hash, dude));
            updateSlavesReplicas();
            updateSlavesReplicas();
            updateSlavesReplicas();
            updateSlavesReplicas();
        });
    });

    slavesWs.on('connection', (slave: WebSocket) => {
        console.log('Hello new slave');
        if (pendingSlavePools.length) {
            pendingSlavePools[0].connectSlave(slave);
            if (pendingSlavePools[0].slavesCount === replicaPerHash) {
                inProgessSlavePools.push(pendingSlavePools.shift());
            }
        }
    });

})();

// get the number of current replicas and clear 
function getNbReplicasAndClear(): number {
    let nbReplicas = pendingSlavePools.reduce((acc, slavePool) => acc + slavePool.slavesCount, 0);
    for (let i = 0; i < inProgessSlavePools.length; i++) {
        nbReplicas += inProgessSlavePools[i].slavesCount;
        // if the slavePool doesn't have slaves, the work is done
        if (!inProgessSlavePools[i].slavesCount) {
            inProgessSlavePools.splice(i, 1);
        }
    }
    console.log(`pendingSlavePools length ${pendingSlavePools.length}`);
    console.log(`inProgessSlavePools length ${inProgessSlavePools.length}`);
    return nbReplicas;
}

function updateSlavesReplicas() {
    exec('docker run --network=host servuc/hash_extractor ./hash_extractor s ws://localhost:3200', (error, stdout, stderr) => {
        let message: string;
        if (error) {
            message = `[EXEC] error: ${error.message}`;
        } else if (stderr) {
            message = `[EXEC] stderr: ${stderr}`;
        } else {
            message = `[EXEC] stdout: ${stdout}`
        }
        console.log(message);
    });

    // exec(`docker service scale -d slave=${getNbReplicasAndClear()}`, (error, stdout, stderr) => {
    //     let message: string;
    //     if (error) {
    //         message = `[EXEC] error: ${error.message}`;
    //     } else if (stderr) {
    //         message = `[EXEC] stderr: ${stderr}`;
    //     } else {
    //         message = `[EXEC] stdout: ${stdout}`
    //     }
    //     console.log(message);
    // });
}







