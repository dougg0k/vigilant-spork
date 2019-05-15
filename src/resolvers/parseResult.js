const { parse } = require("flatted/cjs");
const { formatTextToAlphaNumeric } = require("../utils/helpers");

const MIN_CONFIDENCE_RATE = 80;

module.exports = result => {
	const resultParsed = parse(result);
	return resultParsed.lines
		.filter(item => Math.floor(item.confidence) > MIN_CONFIDENCE_RATE)
		.map(item => formatTextToAlphaNumeric(item.text))
		.join(" ");
};
