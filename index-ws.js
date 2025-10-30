const express = require('express');
const server = require('http').createServer();
const app = express();

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

server.on('request', app);
server.listen(3000);

console.log("Server started on port 3000");

process.on('SIGINT', () => {
    wss.clients.forEach(function each(client) {
        client.close();
    });
    server.close();
    shutDown();
});


// Begin websocket setup

const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ server: server });

wss.on('connection', (ws) => {
    const numClients = wss.clients.size;
    console.log("New client connected", numClients);

    wss.broadcast(`Current number of clients: ${numClients}`);

    if (ws.readyState === ws.OPEN) {
        ws.send('Welcome new client!');
    }

    db.run(`INSERT INTO visitors (count, time) VALUES (${numClients}, datetime('now')) `);

    ws.on('close', () => {
        console.log("Client disconnected", numClients);
        wss.broadcast(`Current number of clients: ${numClients}`);
    });
});

wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        client.send(data);
    });
};

// End websocket setup

// Begin DataBase setup
const sqlite = require('sqlite3')
const db = new sqlite.Database(':memory:');

db.serialize(() => {
    db.run(`CREATE TABLE visitors (
        count INTEGER,
        time TEXT
    )
    `)});

function getCount() {
    db.each(`SELECT * FROM visitors`, (err, row) => {
        console.log(row);
    })
}

function shutDown(){
    getCount();
    console.log("Shutting down db");
    db.close();
}