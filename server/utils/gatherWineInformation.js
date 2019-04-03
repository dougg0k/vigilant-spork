const puppeteer = require("puppeteer");

// https://github.com/GoogleChrome/puppeteer

const gatherWineInformation = async (name, file) => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto("https://www.lcbo.com/webapp/wcs/stores/servlet/en/lcbo", {
		waitUntil: "networkidle2"
	});

	// Go to search box and type name
	// Wait for result and grab first result
	const { filename, encoding } = file;
	const wineInfo = {
		image: {
			filename,
			encoding
		}
	};

	await browser.close();
	return wineInfo;
};

module.exports = gatherWineInformation;
