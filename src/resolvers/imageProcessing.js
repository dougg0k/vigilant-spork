const Tesseract = require("tesseract.js");

const { TesseractWorker } = Tesseract;
const worker = new TesseractWorker();

const imageProcessing = (image, callback) => {
	return worker
		.recognize(image, "eng+ita")
		.progress(progress => {
			callback(progress);
		})
		.then(result => result)
		.catch(err => err);
};

module.exports = imageProcessing;
