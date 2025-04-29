const { sign, verify, decode } = require("jsonwebtoken");

const ACCESS_TOKEN_EXPIRATION_TIME = process.env.ACCESS_TOKEN_EXPIRATION_TIME || "30m";
const ACCESS_TOKEN_REFRESH_COUNT = process.env.ACCESS_TOKEN_REFRESH_COUNT || 48;

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

const newToken = (user) => {
	// console.log(ACCESS_TOKEN_EXPIRATION_TIME)
	return sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION_TIME });
};

exports.genAccessToken = (user) => {
	if (activeSessions[user.id]?.token) {
		// console.log(activeSessions[user.id])
		return activeSessions[user.id].token
	}

	const token = newToken(user);
	activeSessions[user.id] = { token, remainingRefreshes: ACCESS_TOKEN_REFRESH_COUNT }
	// console.log(activeSessions[user.id])
	return token;
};

exports.doRefreshToken = (oldToken) => {
	const user = decode(oldToken, process.env.ACCESS_TOKEN_SECRET)
	if (!user)
		throw "Invalid or expired token"

	const session =	activeSessions[user.id]
	if (!session || session.token != oldToken)
		throw "Invalid or expired token"

	if (session.remainingRefreshes <= 0) {
		activeSessions[user.id] = undefined
		throw "Invalid or expired token"
	}

	const token = newToken({ id: user.id, email: user.email });
	session.token = token
	session.remainingRefreshes--
	// console.log(activeSessions[user.id])
	return token
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