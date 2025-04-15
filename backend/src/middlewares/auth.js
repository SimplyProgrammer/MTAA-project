const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader?.split(" ")?.[1];
	// console.log(req)
	if (!token)
		return res.sendStatus(401);
	
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) 
			return res.sendStatus(401);
		req.user = user;
		next();
	});
};

var activeRefreshTokens = {}; // Ongoing login sessions

exports.genAccessToken = (user) => {
	return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "2h" });
};

exports.genRefreshToken = (user, register = true) => {
	if (activeRefreshTokens[user.id])
		return activeRefreshTokens[user.id]

	const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
	if (register) {
		activeRefreshTokens[user.id] = refreshToken
	}
	return refreshToken;
};

exports.doRefreshToken = (refreshToken, res) => {
	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
		if (err)
			return res.sendStatus(403);
		if (activeRefreshTokens[user.id] != refreshToken)
			return res.sendStatus(403);
		// console.log(activeRefreshTokens[user.id])
		const token = exports.genAccessToken({ id: user.id, email: user.email });
		res.json({ token });
	});
};

exports.invalidateRefreshToken = (refreshToken) => {
	if (!refreshToken)
		return false
	try {
		const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
		if (activeRefreshTokens[user.id] != refreshToken)
			return false

		activeRefreshTokens[user.id] = undefined
		return true
	}
	catch(e) {
		return false
	}
};