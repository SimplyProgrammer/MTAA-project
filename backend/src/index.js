const dotenv = require("dotenv");
const fs = require("fs");
if (fs.existsSync(".env.local")) {
	dotenv.config({ path: ".env.local", override: true });
}
dotenv.config();

const express = require('express');
const app = express();
app.use(express.json());

// Auth
const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

const { verifyToken } = require("./middlewares/auth");
// app.use(verifyToken);

// Routers for other routes will be here

const { query } = require("./config/db"); 

app.get("/", verifyToken, async (req, res) => {
	try {
		const result = await query("SELECT NOW() AS current_time"); // Test db
		res.status(200).send({ message: `Hello, Node.js Backend! Server Time: ${result.rows[0].current_time}`, data: { current_time: result.rows[0].current_time } });
	} catch (err) {
		console.error(err);
		res.status(500).send("Database connection error");
	}
});

// Files
const filesRouter = require("./routes/files");
app.use("/files", verifyToken,filesRouter);

// Posts
const postsRouter = require("./routes/posts");
app.use("/posts", verifyToken, postsRouter);

// Events
const eventsRouter = require("./routes/events");
app.use("/events", verifyToken, eventsRouter);

// Users
const usersRouter = require("./routes/users");
app.use("/users", verifyToken, usersRouter);

// Subjects
const subjectsRouter = require("./routes/subjects");
app.use("/subjects", verifyToken, subjectsRouter);

// Seminars
const seminarsRouter = require("./routes/seminars");
app.use("/seminars", verifyToken, seminarsRouter);

// Lectures
const lecturesRouter = require("./routes/lectures");
app.use("/lectures", verifyToken, lecturesRouter);

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/api-docs.json", (req, res) => {	
	res.json(swaggerSpec);
});

app.use(verifyToken, (req, res, next) => {
	res.status(404).json({
		message: `Route ${req.originalUrl} does not exist`,
	});
});

const PORT = process.env.PORT | 5000, IP = process.env.IP || "localhost";
app.listen(PORT, IP, () => {
	console.log(`Server running on http://${IP}:${PORT}`);
});
