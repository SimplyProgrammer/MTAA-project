const router = require("express").Router();
const { select, update, query } = require("../config/db"); // Use the same pool
const { authorizeFor } = require("../middlewares/authorize");


/**
 * @openapi
 * /users/preferences/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get a user by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the user account to get preferences for
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
 *                     notifications:
 *                       type: boolean
 *                     dark_mode:
 *                       type: boolean
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/preferences/:id", async (req, res) => {
	const userId = req.params.id;

	try {
		const result = await select(`UserPreferences WHERE user_id = $1`, [userId]);

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
 * /users/preferences/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update a user by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the user account to update preferences for
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notifications:
 *                 type: boolean
 *               dark_mode:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                     notifications:
 *                       type: boolean
 *                     dark_mode:
 *                       type: boolean
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put("/preferences/:id", async (req, res) => {
	const userId = req.params.id;
	const { notifications, dark_mode, use_biometrics } = req.body;
	
	try {
		const result = await update(
			"UserPreferences SET notifications = $2, dark_mode = $3, use_biometrics = $4 WHERE user_id = $1",
			[userId, notifications, dark_mode, use_biometrics]
		);

		if (!result.rows.length)
			return res.status(404).send("User not found");

		res.json({ message: "User updated", data: result.rows[0] });
	}
	catch (err) {
		console.error(err);
		res.status(500).send("Internal server error");
	}
})


/**
 * @openapi
 * /users/accounts:
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
router.get("/accounts", async (req, res) => {
	const { role } = req.query;

	let queryText = `SELECT * FROM UserAccounts`;
	const values = [];

	if (role) {
		values.push(role);
		queryText += ` WHERE role = $1`;
	}

	try {
		const result = await query(queryText, values);
		result.rows.forEach(user => {
			user.password = undefined
		})
		res.status(200).json({ data: result.rows });
	} catch (err) {
		console.error(err);
		res.status(500).send("Internal server error");
	}
});


/**
 * @openapi
 * /users/accounts/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update (or deactivate) a user account by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the user account to update
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:	
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               active:
 *                 type: boolean
 *                 default: true
 *               profile_img:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       200:
 *         description: User account updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *                     active:
 *                       type: boolean
 *                     profile_img:
 *                       type: string
 *                       nullable: true
 *                     role:
 *                       type: string
 *       404:
 *         description: User account not found
 *       500:
 *         description: Internal server error
 */
router.put("/accounts/:id", async (req, res) => {
	const userId = req.params.id;

	var { first_name, last_name, profile_img, active } = req.body;

	first_name = first_name?.trim();
	last_name = last_name?.trim();

	active ??= true

	if (!first_name || !last_name)
		return res.status(400).json({ error: "Missing first name or last name" });

	try {
		const result = await update(
			"useraccounts SET first_name = $1, last_name = $2, active = $3 WHERE id = $4",
			[first_name, last_name, profile_img, active, userId]
		);

		if (!result.rows.length)
			return res.status(404).send("User account not found");

		const data = result.rows[0];
		data.password = undefined;
		res.json({ message: "User updated", data });
	}
	catch (err) {
		console.error(err);
		res.status(500).send("Internal server error");
	}
});



module.exports = router;
