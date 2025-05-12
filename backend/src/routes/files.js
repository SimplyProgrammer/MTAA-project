const router = require("express").Router();
const { upload, getPath } = require("../config/files");

/**
 * @openapi
 * /files:
 *   post:
 *     tags:
 *       - Files
 *     summary: Upload a file
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: fileName
 *         in: query
 *         description: File name to use...
 *         required: false
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

	const data = req.file;
	data.destination = undefined;
	data.path = undefined;
	data.url = "/files/" + data.filename;
	if (req?.query?.fileName)
		data.filename = "_".repeat(Math.random() * 128) + data.filename;
	res.status(200).json({ message: "File uploaded", data });
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
	const filePath = getPath(req.params.filename.replaceAll("_", ""));
	if (filePath)
		return res.download(filePath);

	res.status(404).json({ message: "File not found." });
});

module.exports = router;