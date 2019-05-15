function formatTextToAlphaNumeric(data) {
	let formattedData = {};
	const format = text => text.replace(/[^0-9a-z]/gi, "");
	if (typeof data === "string") {
		formattedData = format(data);
	}
	if (typeof data === "object") {
		for (const [key, value] of Object.entries(data)) {
			formattedData[format(key)] = value;
		}
	}
	return formattedData;
}

function capitalize(text = "") {
	return text
		? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
		: null;
}

function formatTextToFloat(text) {
	return text ? parseFloat(text.replace(/[^\d.]/g, "")) : null;
}

module.exports = {
	formatTextToAlphaNumeric,
	capitalize,
	formatTextToFloat
};
