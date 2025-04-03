const router = require("express").Router();;
const bcrypt = require("bcrypt");
const db = require("../config/db"); // Use the same pool
const { genAccessToken, genRefreshToken, doRefreshToken, invalidateRefreshToken } = require("../middlewares/auth");

router.post("/signup", async (req, res) => {
	try {
		// console.log(req)
		var { first_name, last_name, email, password } = req.body;
		if (!first_name || !last_name) {
			const names = email.split('@')[0].split('.')
			first_name = names[0]
			last_name = names[1]
		}
		
		first_name = first_name.trim();
		last_name = last_name.trim();
		email = email.trim();
		password = password.trim();
		
		if (!password || !email)
			return res.status(400).json({ error: "Missing email or password" });

		const hashedPassword = await bcrypt.hash(password, 11);
		const result = await db.query(
			`INSERT INTO useraccounts(first_name, last_name, email, "password") VALUES ($1, $2, $3, $4) RETURNING *`,
			[first_name, last_name, email, hashedPassword]
		);

		// console.log(result.rows);
		result.rows[0].password = undefined;
		res.status(201).json({ message: "User registered", data: result.rows[0] });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		const dbUserAccount = await db.query("SELECT * FROM useraccounts WHERE email = $1", [email]);

		if (!dbUserAccount.rows.length || !dbUserAccount.rows[0].active)
			return res.status(401).json({ message: "There is no such account" });

		const passCorrect = await bcrypt.compare(password, dbUserAccount.rows[0].password);
		if (!passCorrect)
			return res.status(401).json({ message: "Invalid credentials" });

		var user = undefined;
		const dbUser = await db.query(`SELECT * FROM users where account_id = $1`, [dbUserAccount.rows[0].id])
		if (!dbUser.rows.length) {
			const result = await db.query(`INSERT INTO users(account_id) VALUES ($1) RETURNING *`, [dbUserAccount.rows[0].id])
			user = result.rows[0]
			user.activated = true
		}
		else
			user = dbUser.rows[0]

		user.account_id = undefined

		const userAccount = dbUserAccount.rows[0]
		userAccount.password = undefined
		userAccount.token = genAccessToken({ accountId: dbUserAccount.rows[0].id, email });
		userAccount.refreshToken = genRefreshToken({ accountId: dbUserAccount.rows[0].id, email });
		userAccount.user = user
		res.json({ message: "Login successful", data: userAccount });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

router.post("/refresh", async (req, res) => {
	const refreshToken = req.body?.refreshToken;
	if (!refreshToken)
		return res.sendStatus(401);
	doRefreshToken(refreshToken, res);
});

router.post("/invalidate", async (req, res) => {
	if (invalidateRefreshToken(req.body?.refreshToken))
		return res.sendStatus(200);
	res.sendStatus(403);
});

module.exports = router;