const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader?.split(" ")?.[1];
	if (!token)
		return res.sendStatus(401);
	
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) 
			return res.sendStatus(403);
		req.user = user;
		next();
	});
};

var activeRefreshTokens = [];

exports.genAccessToken = (user) => {
	return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "20s" });
};

exports.genRefreshToken = (user, register = true) => {
	const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
	if (register)
	{
		activeRefreshTokens.push(refreshToken);
		if (activeRefreshTokens.length > 50)
			activeRefreshTokens.shift();
	}
	return refreshToken;
};

exports.doRefreshToken = (refreshToken, res) => {
	if (!activeRefreshTokens.includes(refreshToken))
		return res.sendStatus(403);

	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
		if (err)
			return res.sendStatus(403);
		const token = exports.genAccessToken({ accountId: user.accountId, email: user.email });
		res.json({ token });
	});
};

exports.invalidateRefreshToken = (refreshToken) => {
	if (!refreshToken)
		return false
	if (activeRefreshTokens.includes(refreshToken)) {
		activeRefreshTokens = activeRefreshTokens.filter(token => token != refreshToken);
		return true
	}

	return false
};