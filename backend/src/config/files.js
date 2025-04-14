const multer = require("multer");
const path = require("path");
const stringHash = require("string-hash");
const fs = require("fs");

const FS_PATH = path.join(__dirname, "../../uploads");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, FS_PATH); // upload directory
	},
	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname), fileName = req?.query?.fileName || file.originalname;
		const realFileName = req.user.accountId + "" + stringHash(req.user.email) + "-" + stringHash(fileName) + ext;

		// const filePath = path.join(__dirname, "../../uploads", fileName);
		// console.log(filePath)
		// if (fs.existsSync(filePath))
		// 	fs.unlinkSync(filePath);
		cb(null, realFileName);
	}
})

const getPath = (filename) => {
	const filePath = path.join(FS_PATH, filename);
	if (fs.existsSync(filePath))
		return filePath;
}

module.exports = { FS_PATH, getPath, upload: multer({ storage }) };