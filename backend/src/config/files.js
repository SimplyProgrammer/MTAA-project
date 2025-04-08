const multer = require("multer");
const path = require("path");
const stringHash = require("string-hash");
// const fs = require("fs");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, "../../uploads")); // upload directory
	},
	filename: (req, file, cb) => {
		const fileName = stringHash(req.user.email) + "-" + stringHash(file.originalname) + path.extname(file.originalname);

		// const filePath = path.join(__dirname, "../../uploads", fileName);
		// console.log(filePath)
		// if (fs.existsSync(filePath))
		// 	fs.unlinkSync(filePath);
		cb(null, fileName);
	}
})

module.exports = multer({ storage });