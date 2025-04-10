const router = require("express").Router();
const db = require("../config/db"); // Use the same pool

const PAGE_SIZE = process.env.PAGE_SIZE || 20;

/**
 * @openapi
 * /posts:
 *   get:
 *     tags:
 *       - Posts
 *     summary: Get all posts
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
 *       - name: page
 *         in: query
 *         description: Page number for pagination
 *         required: false
 *         schema:
 *           type: integer
 *       - name: search
 *         in: query
 *         description: Search query for title or text
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful responses, respective posts are returned
 *       500:
 *         description: Internal server error
 */
router.get("/", async (req, res) => {
	try {
		var offset = req.query.offset || 0;
		var limit = req.query.limit || PAGE_SIZE;
		if (req.query.page) {
			offset = (req.query.page - 1) * PAGE_SIZE;
		}
		var search = req.query.search || "";

		const result = await db.query(
			`SELECT * FROM posts WHERE title ILIKE $1 OR text ILIKE $1 OFFSET $2 LIMIT $3`,
			[search, offset, limit]
		);
		res.json({ data: result.rows });
	} catch (err) {
		console.error(err);
		res.status(500).send("Internal server error");
	}
});

/**
 * @openapi
 * /posts/{id}:
 *   get:
 *     tags:
 *       - Posts
 *     summary: Get a single specific post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the post
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful responses, respective post is returned
 *       500:
 *         description: Internal server error
 */
router.get("/:id", async (req, res) => {
	try {
		const result = await db.query(
			"SELECT * FROM posts WHERE id = $1", 
			[req.params.id]
		);
		res.json({ data: result.rows[0] });
	} catch (err) {
		console.error(err);
		res.status(500).send("Internal server error");
	}
});

/**
 * @openapi
 * /posts:
 *   post:
 *     tags:
 *       - Posts
 *     summary: Create a new post
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
 *               text:
 *                 type: string
 *               user_id:
 *                 type: integer
 *               image:
 *                 type: string
 *                 nullable: true
 *     responses:	
 *       200:	
 *         description: Successful responses, respective post is returned	
 *       400:	
 *         description: Bad request, missing title or text	
 *       500:	
 *         description: Internal server error
 */
router.post("/", async (req, res) => {
	try {
		const { title, text, user_id, image } = req.body;
		if (!title)
			return res.status(400).send("Missing title");
		if (!text)
			return res.status(400).send("Missing text");

		// TODO: Add image

		const result = await db.query(
			"INSERT INTO posts (title, text, user_id, image) VALUES ($1, $2, $3, $4) RETURNING *",
			[title, text, user_id, image]
		);
		res.json({ data: result.rows[0] });
	} catch (err) {
		console.error(err);
		res.status(500).send("Internal server error");
	}
});

router.put("/:id", async (req, res) => {
	try {
		const { title, text, image } = req.body;
		const result = await db.query(
			"UPDATE posts SET title = $1, text = $2, image = $3 WHERE id = $4 RETURNING *",
			[title, text, image, req.params.id]
		);
		if (!result.rows.length)
			return res.status(404).send("Post not found");

		res.json({ message: "Post updated", data: result.rows[0] });
	} catch (err) {
		console.error(err);
		res.status(500).send("Internal server error");
	}
});

/**
 * @openapi
 * /posts/{id}:
 *   delete:
 *     tags:
 *       - Posts
 *     summary: Delete a specific post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the post
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful responses, deleted post is returned 1 last time...
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", async (req, res) => {
	try {
		const result = await db.query(
			"DELETE FROM posts WHERE id = $1 RETURNING *",
			[req.params.id]
		);
		res.json({ data: result.rows[0] });
	} catch (err) {
		console.error(err);
		res.status(500).send("Internal server error");
	}
});

module.exports = router;