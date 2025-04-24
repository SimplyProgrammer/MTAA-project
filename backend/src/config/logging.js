const { getTokenFromRequest } = require("../middlewares/auth");
const fs = require("fs");

const logging = (app, logFile) => {
	const morgan = require('morgan');
	morgan.token('req-body', (req, res) => {
		const body = req?.body ?? null
		if (body)
			body.password = "..."
		return JSON.stringify(body)
	})

	const originalSend = app.response.send
	app.response.send = function sendOverWrite(body) {
		originalSend.call(this, body)
		this.__logBody = body
	}

	morgan.token('res-body', (_req, res) => {
		// console.log(res.__logBody, typeof(res.__logBody))
		return typeof(res.__logBody) != 'string' ? JSON.stringify(res.__logBody) : res.__logBody
	})

	morgan.token('remote-address', function (req) {
		const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
		const port = req.socket.remotePort; // Seems to be generating some random number but whatever...
		return `${ip}:${port}`;
	});

	morgan.token('auth-header', function (req) {
		const auth = getTokenFromRequest(req);
		if (!auth) 
			return 'NoAuth';
		return auth;
	});

	var accessLogStream = fs.createWriteStream(logFile, {flags: 'a'})
	return morgan(':date[iso] | :remote-address -> :method :url :status :response-time ms :auth-header	:req-body  ->  :res-body', {stream: accessLogStream})
}

module.exports = {
	logging
}
