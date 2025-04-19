const swaggerJsDoc = require("swagger-jsdoc");

const PORT = process.env.PORT | 5000
const IP = process.env.IP || "localhost"
module.exports = swaggerJsDoc({
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Express API",
			version: "1.0.0",
			description: "BE API docs",
		},
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT", // Optional, just for display
				},
			},
		},
		servers: [/*{ url: `http://localhost:${PORT}` },*/ { url: `http://${IP}:${PORT}/` }],
	},
	apis: ["./src/routes/*.js"],
});