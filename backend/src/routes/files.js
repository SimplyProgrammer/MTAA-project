const router = require("express").Router();
const path = require("path");
const fs = require("fs");
const upload = require("../config/files");

/**
 * @openapi
 * /files:
 *   post:
 *     tags:
 *       - Files
 *     summary: Upload a file
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *       400:
 *         description: Bad request, no file uploaded
 */
router.post("/", upload.single("file"), (req, res) => {
	if (!req.file)
		return res.status(400).json({ message: "No file uploaded." });

	res.status(200).json({ message: "File uploaded", data: req.file });
});

/**
 * @openapi
 * /files/{filename}:
 *   get:
 *     tags:
 *       - Files
 *     summary: Download a file
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: filename
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File downloaded successfully
 *       404:
 *         description: File not found
 */
router.get("/:filename", (req, res) => {
	const filePath = path.join(__dirname, "../../uploads", req.params.filename);
	if (fs.existsSync(filePath))
		return res.download(filePath);

	res.status(404).json({ message: "File not found." });
});

module.exports = router;