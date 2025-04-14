const router = require("express").Router();
const db = require("../config/db"); // Use the same pool


/**
 * @openapi
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users (filterable by role)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: role
 *         in: query
 *         description: Filter users by role (e.g., "teacher" or "student")
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of users
 *       500:
 *         description: Internal server error
 */
router.get("/", async (req, res) => {
	const { role } = req.query;

	let queryText = `SELECT * FROM Users`;
	const values = [];

	if (role) {
		values.push(role);
		queryText += ` WHERE role = $1`;
	}

	try {
		const result = await db.query(queryText, values);
		res.status(200).json({ data: result.rows });
	} catch (err) {
		console.error(err);
		res.status(500).send("Internal server error");
	}
});


/**
 * @openapi
 * /users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get a user by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the user to retrieve
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", async (req, res) => {
	const userId = req.params.id;

	try {
		const result = await db.query(`
			SELECT * FROM Users WHERE id = $1
		`, [userId]);

		if (result.rows.length === 0) {
			return res.status(404).send("User not found");
		}

		res.status(200).json({ data: result.rows[0] });
	} catch (err) {
		console.error(err);
		res.status(500).send("Internal server error");
	}
});


/**
 * @openapi
 * /users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create a new user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Missing or invalid fields
 *       500:
 *         description: Internal server error
 */
router.post("/", async (req, res) => {
	const { first_name, last_name, email, password, role } = req.body;

	if (!first_name || !last_name || !email || !password || !role) {
		return res.status(400).send("Missing required fields");
	}

	const client = await db.pool.connect();
	try {
		await client.query("BEGIN");

		const accRes = await client.query(`
			INSERT INTO UserAccounts (first_name, last_name, email, password)
			VALUES ($1, $2, $3, $4)
			RETURNING id
		`, [first_name, last_name, email, password]);

		const accountId = accRes.rows[0].id;

		const userRes = await client.query(`
			INSERT INTO Users (account_id, role)
			VALUES ($1, $2)
			RETURNING *
		`, [accountId, role]);

		await client.query("COMMIT");

		res.status(201).json({ data: userRes.rows[0] });
	} catch (err) {
		await client.query("ROLLBACK");
		console.error(err);
		res.status(500).send("Internal server error");
	} finally {
		client.release();
	}
});


/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete a user by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: User deleted
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", async (req, res) => {
	const userId = req.params.id;

	try {
		await db.query(`DELETE FROM Users WHERE id = $1`, [userId]);
		res.status(204).send();
	} catch (err) {
		console.error(err);
		res.status(500).send("Internal server error");
	}
});


module.exports = router;
