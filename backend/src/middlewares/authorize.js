const { query } = require("../config/db");

const hasRole = async (user, ...roles) => {
	try {
		const result = await query("SELECT role FROM UserAccounts WHERE id = $1", [user.id]);
		user.role = result.rows[0].role
		return roles?.[0] == "*" || roles.includes(user.role)
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

const checkOwnership = (user, item) => {
	if (user?.role == "ADMIN")
		return true;
	// console.log(user.id, (item?.user_id || parseInt(item)), user.id == (item?.user_id || parseInt(item)))
	return user.id == (item?.user_id || +item);
}

module.exports = { hasRole, authorizeFor, checkOwnership };