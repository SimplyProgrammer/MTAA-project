const router = require("express").Router();
const { begin, commit, rollback, select, insert, update, remove, query } = require("../config/db"); // Use the same pool

const { checkOwnership, authorizeFor } = require("../middlewares/authorize");
const { getPageInfo, pagination } = require("../config/pagination");

const { ws } = require("../config/wss");

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
router.get("/", /*authorizeFor("*"),*/ async (req, res) => {
	try {
		const { offset, limit, page } = getPageInfo(req.query);

		var search = req.query.search?.trim() || "";

		const result = await (search ? select(
			`posts WHERE title ~ $1 OR text ~ $1 ORDER BY created DESC OFFSET $2 LIMIT $3`,
			[search, offset, limit]
		) : select(
			`posts ORDER BY created DESC OFFSET $1 LIMIT $2`,
			[offset, limit]
		));

		// result.rows.forEach(post => {
		// 	if (checkOwnership(req.user, post))
		// 		post.canEdit = true;
		// });
		// console.log(result.rows);

		res.json({ data: result.rows, ...pagination(page, result.rows, limit) });
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     user_id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                     text:
 *                       type: string
 *                     image:
 *                       type: string
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", authorizeFor("*"), async (req, res) => {
	try {
		const result = await query(
			`SELECT p.id, title, text, image, user_id, created, u.email owner FROM posts p JOIN useraccounts u ON p.user_id = u.id WHERE p.id = $1`,
			[req.params.id]
		);

		if (!result.rows.length)
			return res.status(404).send("Post not found");

		if (checkOwnership(req.user, result.rows[0]))
			result.rows[0].canEdit = true;
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     user_id:
 *                       type: integer
 *                       nullable: true
 *                     title:
 *                       type: string
 *                     text:
 *                       type: string
 *                     image:
 *                       type: string
 *       400:	
 *         description: Bad request, missing title or text	
 *       500:	
 *         description: Internal server error
 */
router.post("/", async (req, res) => {
	try {
		var { title, text, user_id, image } = req.body;
		title = title?.trim();
		text = text?.trim();
		user_id ||= req.user.id;

		if (!title)
			return res.status(400).send("Missing title");
		if (!text)
			return res.status(400).send("Missing text");

		const result = await insert(
			"posts (title, text, user_id, image) VALUES ($1, $2, $3, $4)",
			[title, text, user_id, image]
		);

		res.json({ data: result.rows[0] });
		ws.server.clients.forEach((client) => {
			client.send(JSON.stringify({ type: "postCreated", data: result.rows[0] }));
		})
	} catch (err) {
		console.error(err);
		res.status(500).send("Internal server error");
	}
});

/**
 * @openapi
 * /posts/{id}:
 *   put:
 *     tags:
 *       - Posts
 *     summary: Update a specific post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the post
 *         required: true
 *         schema:
 *           type: integer
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
 *               image:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Successful responses, respective post is returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     user_id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                     text:
 *                       type: string
 *                     image:
 *                       type: string
 *       400:
 *         description: Bad request, missing title or text
 *       403:
 *         description: Operation forbidden (you are not the author)
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", authorizeFor("*"), async (req, res) => {
	try {
		var { title, text, image } = req.body;
		title = title?.trim();
		text = text?.trim();

		if (!title)
			return res.status(400).send("Missing title");
		if (!text)
			return res.status(400).send("Missing text");

		const result = await begin().then(() => update(
			"posts SET title = $1, text = $2, image = $3 WHERE id = $4",
			[title, text, image, req.params.id]
		));
		if (!result.rows.length)
			return res.status(404).send("Post not found");
		if (!checkOwnership(req.user, result.rows[0])) {
			await rollback();
			return res.status(403).send("Operation forbidden!");
		}

		await commit();
		res.json({ message: "Post updated", data: result.rows[0] });
		ws.server.clients.forEach((client) => {
			client.send(JSON.stringify({ type: "postUpdated", data: result.rows[0] }));
		})
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
router.delete("/:id", authorizeFor("*"), async (req, res) => {
	try {
		const result = await begin().then(() => remove(
			"posts WHERE id = $1",
			[req.params.id]
		));
		if (!result.rows.length)
			return res.status(404).send("Post not found");
		if (!checkOwnership(req.user, result.rows[0])) {
			await rollback();
			return res.status(403).send("Operation forbidden!");
		}

		await commit();
		res.json({ data: result.rows[0] });
		ws.server.clients.forEach((client) => {
			client.send(JSON.stringify({ type: "postDeleted", data: result.rows[0] }));
		})
	} catch (err) {
		console.error(err);
		res.status(500).send("Internal server error");
	}
});

module.exports = router;