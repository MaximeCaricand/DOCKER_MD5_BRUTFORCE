import * as lib from "./lib";
import { Master } from "./lib/Master";

async function start() {
    const master = new Master();
    await master.start(lib.host, lib.port, 2);
    await sleep(1000);
    master.bruteForce('28b662d883b6d76fd96e4ddc5e9ba780');
}

start();


function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}