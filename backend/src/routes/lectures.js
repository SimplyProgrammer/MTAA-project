const router = require("express").Router();
const db = require("../config/db"); // Use the same pool

/**
 * @openapi
 * /lectures:
 *   get:
 *     tags:
 *       - Lectures
 *     summary: Get all lectures
 *     security:
 *       - bearerAuth: []
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

		res.status(200).json({
			message: "Lectures fetched successfully",
			data: result.rows,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			message: "Internal server error",
			data: null,
		});
	}
});

/**
 * @openapi
 * /lectures/{id}:
 *   delete:
 *     tags:
 *       - Lectures
 *     summary: Delete a lecture by ID and return the deleted record
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the lecture to delete
 *     responses:
 *       200:
 *         description: Lecture deleted successfully with deleted data returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   description: The deleted lecture record
 *                   additionalProperties: true
 *       404:
 *         description: Lecture not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: null
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: null
 */
router.delete("/:id", async (req, res) => {
	const lectureId = req.params.id;

	try {
		const deletedLecture = await db.query(
			"DELETE FROM Lectures WHERE id = $1 RETURNING *",
			[lectureId]
		);

		if (deletedLecture.rows.length === 0) {
			return res.status(404).json({
				message: "Lecture not found",
				data: null,
			});
		}

		res.status(200).json({
			message: "Lecture deleted successfully",
			data: deletedLecture.rows[0],
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			message: "Internal server error",
			data: null,
		});
	}
});

/**
 * @openapi
 * /lectures:
 *   post:
 *     tags:
 *       - Lectures
 *     summary: Add a new lecture and assign to user
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
			RETURNING *
		`, [subject_id, from_time, to_time]);

		const lecture = result.rows[0];

		await db.query(`
			INSERT INTO User_Lectures (user_id, lecture_id)
			VALUES ($1, $2)
		`, [user_id, lecture.id]);

		res.status(201).json({
			message: "Lecture created and assigned",
			data: lecture,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			message: "Internal server error",
			data: null,
		});
	}
});

module.exports = router;