var IP = process.env.IP || "localhost";
const PORT = process.env.PORT || 5000;

if (IP.startsWith("$ip")) {
	const os = require('os');
	const interfaces = os.networkInterfaces();
	var addresses = [];
	for (var inter in interfaces) {
		for (var inter2 in interfaces[inter]) {
			var address = interfaces[inter][inter2];
			if (address.family === 'IPv4' && !address.internal) {
				addresses.push(address.address);
			}
		}
	}

	IP = addresses[+IP.substring(3) || 0];
}

module.exports = { IP, PORT };