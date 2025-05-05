const router = require("express").Router();
const db = require("../config/db");

// GET /evaluations?user_id=...&subject_id=...
// Returns all evaluations matching the given user_id and subject_id
router.get("/", async (req, res) => {
	const { user_id, subject_id } = req.query;
  
	// validate inputs
	if (!user_id || !subject_id) {
	  return res
		.status(400)
		.json({ error: "Both user_id and subject_id are required." });
	}
  
	try {
	  const { rows } = await db.query(
		`SELECT id,
				user_id,
				subject_id,
				title,
				points,
				max_points
		 FROM Evaluations
		 WHERE user_id = $1
		   AND subject_id = $2
		 ORDER BY id`,
		[user_id, subject_id]
	  );
  
	  return res.json(rows);
	} catch (err) {
	  console.error("Error fetching evaluations:", err);
	  return res
		.status(500)
		.json({ error: "An unexpected error occurred." });
	}
  });

module.exports = router;
