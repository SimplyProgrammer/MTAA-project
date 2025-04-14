const router = require("express").Router();
const db = require("../config/db"); // Use the same pool

/**
 * @openapi
 * /seminars:
 *   get:
 *     tags:
 *       - Seminars
 *     summary: Get all seminars
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter seminars by user ID
 *       - in: query
 *         name: subject_id
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter seminars by subject ID
 *     responses:
 *       200:
 *         description: List of seminars
 *       500:
 *         description: Internal server error
 */
router.get("/", async (req, res) => {
	const { user_id, subject_id } = req.query;

	try {
		let result;

		if (user_id) {
			result = await db.query(`
				SELECT s.* FROM Seminars s
				JOIN User_Seminars us ON s.id = us.seminar_id
				WHERE us.user_id = $1
			`, [user_id]);
		} else if (subject_id) {
			result = await db.query(`
				SELECT * FROM Seminars WHERE subject_id = $1
			`, [subject_id]);
		} else {
			result = await db.query(`SELECT * FROM Seminars`);
		}

		res.json(result.rows);
	} catch (err) {
		console.error(err);
		res.status(500).send("Internal server error");
	}
});

/**
 * @openapi
 * /seminars/{id}:
 *   delete:
 *     tags:
 *       - Seminars
 *     summary: Delete a seminar by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Seminar ID to delete
 *     responses:
 *       204:
 *         description: Seminar deleted
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", async (req, res) => {
	const seminarId = req.params.id;

	try {
		await db.query(`DELETE FROM Seminars WHERE id = $1`, [seminarId]);
		res.status(204).send();
	} catch (err) {
		console.error(err);
		res.status(500).send("Internal server error");
	}
});


/**
 * @openapi
 * /seminars:
 *   post:
 *     tags:
 *       - Seminars
 *     summary: Add a new seminar and assign to a user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subject_id
 *               - user_id
 *               - from_time
 *             properties:
 *               subject_id:
 *                 type: integer
 *               user_id:
 *                 type: integer
 *               from_time:
 *                 type: string
 *                 format: date-time
 *               to_time:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Seminar created and linked
 *       500:
 *         description: Internal server error
 */
router.post("/", async (req, res) => {
	const { subject_id, user_id, from_time, to_time } = req.body;

	try {
		const result = await db.query(`
			INSERT INTO Seminars (subject_id, from_time, to_time)
			VALUES ($1, $2, $3)
			RETURNING id
		`, [subject_id, from_time, to_time]);

		const seminarId = result.rows[0].id;

		await db.query(`
			INSERT INTO User_Seminars (user_id, seminar_id)
			VALUES ($1, $2)
		`, [user_id, seminarId]);

		res.status(201).json({ message: "Seminar created and assigned", seminar_id: seminarId });
	} catch (err) {
		console.error(err);
		res.status(500).send("Internal server error");
	}
});

module.exports = router;