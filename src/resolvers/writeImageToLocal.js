const fs = require("fs");
const uuidv4 = require("uuid/v4");

const writeImageToLocal = file => {
	const filePath = `src/uploadedImages/${uuidv4()}_${file.filename}`;
	const { filename, mimetype, encoding, createReadStream } = file;
	return new Promise((resolve, reject) => {
		createReadStream()
			.on("error", err => reject(err))
			.pipe(fs.createWriteStream(filePath))
			.on("finish", () =>
				resolve({ path: filePath, filename, mimetype, encoding })
			);
	});
};

module.exports = writeImageToLocal;
