import * as http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { SlavePool } from './SlavePool';
import { exec } from 'child_process';

const DudesPort = 3100;
const SlavesPort = 3200;

const pendingSlavePools: Array<SlavePool> = [];
const inProgessSlavePools: Array<SlavePool> = [];
const replicaPerHash: number = 14;
const hashMaxLength: number = 5;
const splittedDictionary: Array<Array<string>> = getBruteForceRange(replicaPerHash, hashMaxLength);

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
        dude.on('message', message => {
            const hash = message.toString();
            console.log(`New hash ${hash}`);
            pendingSlavePools.push(new SlavePool(splittedDictionary, hash, dude));
            for (let i = 0; i < replicaPerHash; i++) {
                updateSlavesReplicas();
            }
        });
    });

    slavesWs.on('connection', (slave: WebSocket) => {
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
    return nbReplicas;
}

function updateSlavesReplicas() {
    exec(`docker run --network=host itytophile/hash-slave /slave ws://master:3200`, (error, stdout, stderr) => {
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
    // docker run --network=host itytophile/hash-slave /slave ws://localhost:3200
}

function getBruteForceRange(replicaPerHash: number, hashMaxLength: number) {
    const dictionary = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const nbPossibilty: number = Math.pow(dictionary.length, hashMaxLength);
    const nbPossibilityPerSlave: number = Math.round(nbPossibilty / replicaPerHash);
    const results: Array<Array<string>> = [];

    let lastWord = "a";
    for (let i = 0; i < replicaPerHash - 1; i++) {
        const entryIndex = Math.round(((nbPossibilityPerSlave * dictionary.length) / nbPossibilty)) * (i + 1) - 1;
        const newWord = dictionary[entryIndex] + "9999";
        results[i] = [lastWord, newWord];
        lastWord = newWord;
    }
    if (lastWord !== "99999") {
        results[results.length] = [lastWord, "99999"];
    }
    return results;
}