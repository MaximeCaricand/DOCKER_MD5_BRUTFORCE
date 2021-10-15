import * as ws from 'ws';
import * as http from 'http';

const port = 30000;
const address = '127.0.0.1'

const server = http.createServer();
const wss = new ws.WebSocketServer({ server });

wss.on('connection', function (client, request) {

    // retrieve the name in the cookies
    var cookies = request.headers.cookie.split(';');
    var wsname = cookies.find((c) => {
        return c.match(/^\s*wsname/) !== null;
    });
    wsname = wsname.split('=')[1];

    // greet the newly connected user
    client.send('Welcome, ' + decodeURIComponent(wsname) + '!');

    // Register a listener on each message of each connection
    client.on('message', function (message) {
        console.log(message);
    });
});

// http sever starts listening on given host and port.
server.listen(port, address, function () {
    const address = server.address() as ws.AddressInfo;
    console.log(`Listening on ${address.address}:${address.port}`);
});

