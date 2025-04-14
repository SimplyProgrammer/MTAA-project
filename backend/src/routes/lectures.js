const router = require("express").Router();
const db = require("../config/db"); // Use the same pool

/**
 * @openapi
 * /lectures:
 *   get:
 *     tags:
 *       - Lectures
 *     summary: Get all lectures
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter by user ID
 *       - in: query
 *         name: subject_id
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter by subject ID
 *     responses:
 *       200:
 *         description: List of lectures
 *       500:
 *         description: Internal server error
 */
router.get("/", async (req, res) => {
	const { user_id, subject_id } = req.query;

	try {
		let result;

		if (user_id) {
			result = await db.query(`
				SELECT l.* FROM Lectures l
				JOIN User_Lectures ul ON l.id = ul.lecture_id
				WHERE ul.user_id = $1
			`, [user_id]);
		} else if (subject_id) {
			result = await db.query(`SELECT * FROM Lectures WHERE subject_id = $1`, [subject_id]);
		} else {
			result = await db.query(`SELECT * FROM Lectures`);
		}

		res.json(result.rows);
	} catch (err) {
		console.error(err);
		res.status(500).send("Internal server error");
	}
});

/**
 * @openapi
 * /lectures/{id}:
 *   delete:
 *     tags:
 *       - Lectures
 *     summary: Delete a lecture by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the lecture to delete
 *     responses:
 *       204:
 *         description: Lecture deleted
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", async (req, res) => {
	const lectureId = req.params.id;

	try {
		await db.query(`DELETE FROM Lectures WHERE id = $1`, [lectureId]);
		res.status(204).send();
	} catch (err) {
		console.error(err);
		res.status(500).send("Internal server error");
	}
});

/**
 * @openapi
 * /lectures:
 *   post:
 *     tags:
 *       - Lectures
 *     summary: Add a new lecture and assign to user
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
 *               - to_time
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
 *         description: Lecture created and assigned
 *       500:
 *         description: Internal server error
 */
router.post("/", async (req, res) => {
	const { subject_id, user_id, from_time, to_time } = req.body;

	try {
		const result = await db.query(`
			INSERT INTO Lectures (subject_id, from_time, to_time)
			VALUES ($1, $2, $3)
			RETURNING id
		`, [subject_id, from_time, to_time]);

		const lectureId = result.rows[0].id;

		await db.query(`
			INSERT INTO User_Lectures (user_id, lecture_id)
			VALUES ($1, $2)
		`, [user_id, lectureId]);

		res.status(201).json({ message: "Lecture created and assigned", lecture_id: lectureId });
	} catch (err) {
		console.error(err);
		res.status(500).send("Internal server error");
	}
});

module.exports = router;