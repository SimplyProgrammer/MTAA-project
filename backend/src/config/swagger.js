const swaggerJsDoc = require("swagger-jsdoc");

const PORT = process.env.PORT | 5000
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
		servers: [{ url: `http://localhost:${PORT}` }],
	},
	apis: ["./src/routes/*.js"],
});