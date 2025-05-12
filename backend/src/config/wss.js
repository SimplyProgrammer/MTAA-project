const WebSocket = require('ws');
var ws = { server: null };

const createWss = (server) => {
	ws.server = new WebSocket.Server({ server });
}
module.exports = { ws, createWss };