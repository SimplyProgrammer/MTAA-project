const router = require("express").Router();
const db = require("../config/db"); // Use the same pool

/**
 * @openapi
 * /events:
 *   post:
 *     tags:
 *       - Events
 *     summary: Create a new event
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               subject_id:
 *                 type: integer
 *               type:
 *                 type: string
 *               date_till:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Event created
 *       500:
 *         description: Internal server error
 */
router.post("/", async (req, res) => {
	const { title, subject_id, type, date_till } = req.body;

	try {
		const result = await db.query(`
			INSERT INTO Events (id, title, subject_id, type, date_till)
			VALUES (
				(SELECT COALESCE(MAX(id), 0) + 1 FROM Events),
				$1, $2, $3, $4
			)
			RETURNING *
		`, [title, subject_id, type, date_till]);

		res.status(201).json({ data: result.rows[0] });
	} catch (err) {
		console.error(err);
		res.status(500).send("Internal server error");
	}
});

/**
 * @openapi
 * /events/{id}:
 *   delete:
 *     tags:
 *       - Events
 *     summary: Delete an event by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the event to delete
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Event deleted successfully (No Content)
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", async (req, res) => {
	const eventId = req.params.id;

	try {
		await db.query(`DELETE FROM Events WHERE id = $1`, [eventId]);
		res.status(204).send();
	} catch (err) {
		console.error(err);
		res.status(500).send("Internal server error");
	}
});

/**
 * @openapi
 * /events:
 *   get:
 *     tags:
 *       - Events
 *     summary: Get all events (filterable by subject_id and type)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: offset
 *         in: query
 *         description: Offset for pagination
 *         required: false
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         description: Limit for pagination
 *         required: false
 *         schema:
 *           type: integer
 *       - name: subject_id
 *         in: query
 *         description: Filter events by subject ID
 *         required: false
 *         schema:
 *           type: integer
 *       - name: type
 *         in: query
 *         description: Filter events by type (e.g., "exam", "deadline")
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       subject_id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       type:
 *                         type: string
 *                       date_till:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Internal server error
 */
router.get("/", async (req, res) => {
	const { offset = 0, limit = 50, subject_id, type } = req.query;

	let queryText = `
		SELECT id, subject_id, title, type, date_till
		FROM Events
	`;
	const conditions = [];
	const values = [];

	if (subject_id) {
		values.push(subject_id);
		conditions.push(`subject_id = $${values.length}`);
	}

	if (type) {
		values.push(type);
		conditions.push(`type = $${values.length}`);
	}

	if (conditions.length > 0) {
		queryText += ` WHERE ` + conditions.join(" AND ");
	}

	values.push(offset, limit);
	queryText += ` ORDER BY date_till DESC OFFSET $${values.length - 1} LIMIT $${values.length}`;

	try {
		const result = await db.query(queryText, values);
		res.status(200).json({ data: result.rows });
	} catch (err) {
		console.error(err);
		res.status(500).send("Internal server error");
	}
});

module.exports = router;