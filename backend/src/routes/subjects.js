const router = require("express").Router();
const db = require("../config/db");

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

		res.status(200).json({
			message: "Subjects fetched successfully",
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
 *       500:
 *         description: Internal server error
 */
router.post("/", async (req, res) => {
	const { title, description, user_id } = req.body;

	try {
		let result = await db.query(`SELECT * FROM Subjects WHERE title = $1`, [title]);

		let subject;
		let was_created = false;

		if (result.rows.length > 0) {
			subject = result.rows[0];
		} else {
			const insertResult = await db.query(`
				INSERT INTO Subjects (title, description)
				VALUES ($1, $2)
				RETURNING *`, [title, description]);
			subject = insertResult.rows[0];
			was_created = true;
		}

		const linkResult = await db.query(`
			SELECT 1 FROM User_Subjects WHERE user_id = $1 AND subject_id = $2
		`, [user_id, subject.id]);

		if (linkResult.rows.length === 0) {
			await db.query(`
				INSERT INTO User_Subjects (user_id, subject_id)
				VALUES ($1, $2)
			`, [user_id, subject.id]);
		}

		res.status(201).json({
			message: was_created ? "Subject created and assigned to user" : "Subject assigned to user",
			data: {
				...subject,
				was_created,
			},
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
 * /subjects/{id}:
 *   get:
 *     tags:
 *       - Subjects
 *     summary: Get a subject by ID
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
 *       200:
 *         description: Subject found
 *       404:
 *         description: Subject not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", async (req, res) => {
    const subjectId = req.params.id;
    try {
        const result = await db.query("SELECT * FROM Subjects WHERE id = $1", [subjectId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Subject not found", data: null });
        }
        res.status(200).json({ message: "Subject fetched successfully", data: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", data: null });
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
 *       200:
 *         description: Subject deleted
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", async (req, res) => {
	const subjectId = req.params.id;

	try {
		// Step 1: Get all related IDs
		const lectureIds = (await db.query(`SELECT id FROM Lectures WHERE subject_id = $1`, [subjectId])).rows.map(r => r.id);
		const seminarIds = (await db.query(`SELECT id FROM Seminars WHERE subject_id = $1`, [subjectId])).rows.map(r => r.id);
		const eventIds = (await db.query(`SELECT id FROM Events WHERE subject_id = $1`, [subjectId])).rows.map(r => r.id);

		// Step 2: Delete from related user_* tables
		if (lectureIds.length > 0) {
			await db.query(`DELETE FROM User_Lectures WHERE lecture_id = ANY($1::int[])`, [lectureIds]);
		}
		if (seminarIds.length > 0) {
			await db.query(`DELETE FROM User_Seminars WHERE seminar_id = ANY($1::int[])`, [seminarIds]);
		}
		if (eventIds.length > 0) {
			await db.query(`DELETE FROM User_Events WHERE event_id = ANY($1::int[])`, [eventIds]);
		}

		// Step 4: Delete from User_Subjects
		await db.query(`DELETE FROM User_Subjects WHERE subject_id = $1`, [subjectId]);

		// Step 5: Delete from Evaluations
		await db.query(`DELETE FROM Evaluations WHERE subject_id = $1`, [subjectId]);

		// Step 6: Delete lectures, seminars, events
		await db.query(`DELETE FROM Lectures WHERE subject_id = $1`, [subjectId]);
		await db.query(`DELETE FROM Seminars WHERE subject_id = $1`, [subjectId]);
		await db.query(`DELETE FROM Events WHERE subject_id = $1`, [subjectId]);

		// Step 7: Finally, delete the Subject
		await db.query(`DELETE FROM Subjects WHERE id = $1`, [subjectId]);

		res.status(200).json({ message: "Deleted successfully", data: null });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Internal server error", data: null });
	}
});

router.get("/:id/students", async (req, res) => {
    const subjectId = req.params.id;
    try {
        const result = await db.query(
            `SELECT ua.id, ua.first_name, ua.last_name, ua.email, ua.role
             FROM UserAccounts ua
             JOIN User_Subjects us ON ua.id = us.user_id
             WHERE us.subject_id = $1`,
            [subjectId]
        );
        res.status(200).json({
            message: "Students fetched successfully",
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

module.exports = router;
