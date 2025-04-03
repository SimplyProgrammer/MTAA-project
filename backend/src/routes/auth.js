const router = require("express").Router();;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db"); // Use the same pool

// Register User
router.post("/register", async (req, res) => {
	try {
		const { username, password } = req.body;
		const hashedPassword = await bcrypt.hash(password, 11);

		const result = await db.query(
			"INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
			[username, hashedPassword]
		);

		console.log(result.rows);
		res.status(201).json({ message: "User registered", user: result.rows[0] });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

module.exports = router;