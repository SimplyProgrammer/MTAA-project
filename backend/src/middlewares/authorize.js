const { select } = require("../config/db");

const hasRole = async (user, ...roles) => {
	try {
		const result = await select("UserAccounts WHERE id = $1", [user.id]);
		return roles.includes(result.rows[0].role)
	} catch (err) {
		return false;
	}
};

const authorizeFor = (...roles) => async (req, res, next) => {
	try {
		if (!(await hasRole(req.user, ...roles)))
			return res.status(403).send("Access denied!");
		
		next();
	} catch (err) {
		console.error(err);
		res.status(500).send("Internal server error");
	}
};

module.exports = { hasRole, authorizeFor };