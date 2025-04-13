const router = require("express").Router();
const db = require("../config/db"); // Use the same pool

/**
 * @openapi
 * /subjects:
 *   get:
 *     tags:
 *       - Subjects
 *     summary: Get all subjects or filter by user_id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: user_id
 *         in: query
 *         description: Filter subjects assigned to a user
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of subjects
 *       500:
 *         description: Internal server error
 */
router.get("/", async (req, res) => {
	const { user_id } = req.query;

	try {
		const result = user_id
			? await db.query(`
					SELECT s.* FROM Subjects s
					JOIN User_Subjects us ON s.id = us.subject_id
					WHERE us.user_id = $1
				`, [user_id])
			: await db.query("SELECT * FROM Subjects");

		res.status(200).json({ data: result.rows });
	} catch (err) {
		console.error(err);
		res.status(500).send("Internal server error");
	}
});


/**
 * @openapi
 * /subjects:
 *   post:
 *     tags:
 *       - Subjects
 *     summary: Create a new subject and assign it to a user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - user_id
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               user_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Subject created and assigned to user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 subject_id:
 *                   type: integer
 *       500:
 *         description: Internal server error
 */
router.post("/", async (req, res) => {
	const { title, description, user_id } = req.body;

	try {
		// Check if a subject with the same title exists
		let result = await db.query(`
			SELECT id FROM Subjects WHERE title = $1
		`, [title]);

		let subjectId;

		if (result.rows.length > 0) {
			subjectId = result.rows[0].id;
		} else {
			// Insert new subject
			const insertResult = await db.query(`
				INSERT INTO Subjects (title, description)
				VALUES ($1, $2)
				RETURNING id
			`, [title, description]);

			subjectId = insertResult.rows[0].id;
		}

		// Link user to subject if not already linked
		const linkResult = await db.query(`
			SELECT 1 FROM User_Subjects WHERE user_id = $1 AND subject_id = $2
		`, [user_id, subjectId]);

		if (linkResult.rows.length === 0) {
			await db.query(`
				INSERT INTO User_Subjects (user_id, subject_id)
				VALUES ($1, $2)
			`, [user_id, subjectId]);
		}

		res.status(201).json({
			message: "Subject assigned to user",
			subject_id: subjectId,
			was_created: result.rows.length === 0
		});
	} catch (err) {
		console.error(err);
		res.status(500).send("Internal server error");
	}
});


/**
 * @openapi
 * /subjects/{id}:
 *   delete:
 *     tags:
 *       - Subjects
 *     summary: Delete a subject by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Subject ID
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Subject deleted
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", async (req, res) => {
	const subjectId = req.params.id;

	try {
		// First remove relations
		await db.query(`DELETE FROM User_Subjects WHERE subject_id = $1`, [subjectId]);

		// Then delete subject
		await db.query(`DELETE FROM Subjects WHERE id = $1`, [subjectId]);

		res.status(204).send();
	} catch (err) {
		console.error(err);
		res.status(500).send("Internal server error");
	}
});

module.exports = router;