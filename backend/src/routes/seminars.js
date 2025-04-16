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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     additionalProperties: true
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

		res.status(200).json({
			message: "Seminars fetched successfully",
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
 * /seminars/{id}:
 *   delete:
 *     tags:
 *       - Seminars
 *     summary: Delete a seminar by ID and return the deleted record
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
 *       200:
 *         description: Seminar deleted successfully with the deleted record returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   additionalProperties: true
 *       404:
 *         description: Seminar not found
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
	const seminarId = req.params.id;

	try {
		const deletedSeminar = await db.query(
			"DELETE FROM Seminars WHERE id = $1 RETURNING *",
			[seminarId]
		);

		if (deletedSeminar.rows.length === 0) {
			return res.status(404).json({
				message: "Seminar not found",
				data: null,
			});
		}

		res.status(200).json({
			message: "Seminar deleted successfully",
			data: deletedSeminar.rows[0],
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   additionalProperties: true
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
router.post("/", async (req, res) => {
	const { subject_id, user_id, from_time, to_time } = req.body;

	try {
		const result = await db.query(`
			INSERT INTO Seminars (subject_id, from_time, to_time)
			VALUES ($1, $2, $3)
			RETURNING *
		`, [subject_id, from_time, to_time]);

		const seminar = result.rows[0];

		await db.query(`
			INSERT INTO User_Seminars (user_id, seminar_id)
			VALUES ($1, $2)
		`, [user_id, seminar.id]);

		res.status(201).json({
			message: "Seminar created and assigned",
			data: seminar,
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
