const multer = require("multer");
const path = require("path");
const stringHash = require("string-hash");
// const fs = require("fs");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, "../../uploads")); // upload directory
	},
	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname), fileName = req?.body?.fileName || file.originalname;
		const realFileName = req.user.accountId + "" + stringHash(req.user.email) + "-" + stringHash(fileName) + ext;

		// const filePath = path.join(__dirname, "../../uploads", fileName);
		// console.log(filePath)
		// if (fs.existsSync(filePath))
		// 	fs.unlinkSync(filePath);
		cb(null, realFileName);
	}
})

module.exports = multer({ storage });