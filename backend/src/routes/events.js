const router = require("express").Router();
const db = require("../config/db");

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
		const result = await db.query(
			`INSERT INTO Events (title, subject_id, type, date_till)
			 VALUES ($1, $2, $3, $4)
			 RETURNING *`,
			[title, subject_id, type, date_till]
		);

		res.status(201).json({
			message: "Event created successfully",
			data: result.rows[0],
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
 * /events/{id}:
 *   delete:
 *     tags:
 *       - Events
 *     summary: Delete an event by ID and return the deleted record
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
 *       200:
 *         description: Event deleted successfully with the deleted record returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   description: The deleted event record
 *                   additionalProperties: true
 *       404:
 *         description: Event not found
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
	const eventId = req.params.id;

	try {
		const deletedEvent = await db.query(
			"DELETE FROM Events WHERE id = $1 RETURNING *",
			[eventId]
		);

		if (deletedEvent.rows.length === 0) {
			return res.status(404).json({
				message: "Event not found",
				data: null,
			});
		}

		res.status(200).json({
			message: "Event deleted successfully",
			data: deletedEvent.rows[0],
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
		res.status(200).json({
			message: "Events fetched successfully",
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
