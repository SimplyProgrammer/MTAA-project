const { sign, verify, decode } = require("jsonwebtoken");

const ACCESS_TOKEN_EXPIRATION_TIME = process.env.ACCESS_TOKEN_EXPIRATION_TIME || "2h";

exports.getTokenFromRequest = (req) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader?.replace("Bearer ", "");
	// console.log(req)
	return token;
};

exports.verifyToken = (req, res, next) => {
	const token = exports.getTokenFromRequest(req);
	if (!token)
		return res.sendStatus(401);
	
	verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) 
			return res.sendStatus(401);
		req.user = user;
		next();
	});
};

var activeSessions = {}; // Ongoing login sessions

const newToken = (user) => sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION_TIME });

exports.genAccessToken = (user) => {
	if (activeSessions[user.id]) {
		// console.log(activeSessions[user.id])
		return activeSessions[user.id].token
	}

	const token = newToken(user);
	activeSessions[user.id] = { token, remainingRefreshes: 3 }
	// console.log(activeSessions[user.id])
	return token;
};

exports.doRefreshToken = (oldToken, res) => {
	const user = decode(oldToken, process.env.ACCESS_TOKEN_SECRET)
	if (!user)
		return res.sendStatus(401);

	const session =	activeSessions[user.id]
	if (!session || session.token != oldToken)
		return res.sendStatus(401);

	if (session.remainingRefreshes <= 0) {
		activeSessions[user.id] = undefined
		return res.sendStatus(401);
	}

	const token = newToken({ id: user.id, email: user.email });
	session.token = token
	session.remainingRefreshes--
	// console.log(activeSessions[user.id])
	res.json({ data: { token } });
};

exports.invalidateToken = (oldToken) => {
	const user = decode(oldToken, process.env.ACCESS_TOKEN_SECRET)
	if (!user)
		return false

	const session =	activeSessions[user.id]
	if (!session || session.token != oldToken)
		return false

	activeSessions[user.id] = undefined
	return true
};