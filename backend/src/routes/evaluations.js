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

  /**
 * @openapi
 * /evaluations:
 *   post:
 *     tags:
 *       - Evaluations
 *     summary: Create a new evaluation
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               subject_id:
 *                 type: integer
 *               title:
 *                 type: string
 *               points:
 *                 type: number
 *               max_points:
 *                 type: number
 *     responses:
 *       201:
 *         description: Evaluation created
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
router.post("/", async (req, res) => {
  const { user_id, subject_id, title, points, max_points } = req.body;

  if (!user_id || !subject_id || !title || points == null || max_points == null) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const result = await db.query(
      `INSERT INTO Evaluations (user_id, subject_id, title, points, max_points)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [user_id, subject_id, title, points, max_points]
    );
    return res.status(201).json({ message: "Evaluation created.", data: result.rows[0] });
  } catch (err) {
    console.error("Error creating evaluation:", err);
    return res.status(500).json({ error: "An unexpected error occurred." });
  }
});

  /**
 * @openapi
 * /evaluations/{id}:
 *   delete:
 *     tags:
 *       - Evaluations
 *     summary: Delete an evaluation by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the evaluation to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Evaluation deleted
 *       404:
 *         description: Evaluation not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "DELETE FROM Evaluations WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Evaluation not found." });
    }
    return res.json({ message: "Evaluation deleted.", data: result.rows[0] });
  } catch (err) {
    console.error("Error deleting evaluation:", err);
    return res.status(500).json({ error: "An unexpected error occurred." });
  }
});

module.exports = router;
