const router = require("express").Router();
const db = require("../config/db"); // Use the same pool


router.get("/", async (req, res) => {
	try {
		const result = await db.query(`
			SELECT u.id AS user_id, ua.first_name, ua.last_name, ua.email, u.dark_mode
			FROM Users u
			JOIN UserAccounts ua ON u.account_id = ua.id
		`);
		res.json({ data: result.rows });
	} catch (err) {
		console.error(err);
		res.status(500).send("Internal server error");
	}
});

router.get("/:id", async (req, res) => {
	const userId = req.params.id;
	try {
		const result = await db.query(`
			SELECT u.id AS user_id, ua.first_name, ua.last_name, ua.email, u.dark_mode
			FROM Users u
			JOIN UserAccounts ua ON u.account_id = ua.id
			WHERE u.id = $1
		`, [userId]);

		if (result.rows.length === 0) return res.status(404).send("User not found");
		res.json({ data: result.rows[0] });
	} catch (err) {
		console.error(err);
		res.status(500).send("Internal server error");
	}
});

router.delete("/:id", async (req, res) => {
	const userId = req.params.id;

	try {
		await db.query(`DELETE FROM Users WHERE id = $1`, [userId]);

        // TODO: pridať do DB 'ON DELETE CASCADE' ;
        
		res.status(204).send();
	} catch (err) {
		console.error(err);
		res.status(500).send("Internal server error");
	}
});


module.exports = router;
