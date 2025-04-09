const router = require("express").Router();
const db = require("../config/db"); // Use the same pool

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

module.exports = router;