const Tesseract = require("tesseract.js");

const options = {
	lang: "ita",
	tessedit_char_whitelist:
		" 0123456789abcdefghijklmnopqrstuvxzABCDEFGHIJKLMNOPQRSTUVXZ`'^~"
};

const imageProcessing = (image, callback) => {
	return Tesseract.recognize(image, options)
		.progress(progress => {
			callback(progress);
		})
		.then(result => result)
		.catch(err => err);
};

module.exports = imageProcessing;
