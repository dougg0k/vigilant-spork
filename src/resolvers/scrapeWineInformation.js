const puppeteer = require("puppeteer");
const { SCRAPE_URL } = require("../utils/constants");
const { formatTextToAlphaNumeric } = require("../utils/helpers");

async function setupBrowserPage() {
	const browser = await puppeteer.launch({
		headless: true,
		args: ["--start-maximized"]
	});
	const page = await browser.newPage();
	await page.setViewport({ width: 1920, height: 1080 });
	await page.goto(SCRAPE_URL, {
		waitUntil: "networkidle2",
		timeout: 0
	});
	await page.setRequestInterception(true);

	page.on("request", req => {
		if (
			req.resourceType() === "image" ||
			req.resourceType() === "stylesheet" ||
			req.resourceType() === "font"
		) {
			req.abort();
		} else {
			req.continue();
		}
	});
	return { browser, page };
}

const scrapeWineInformation = async name => {
	try {
		const { browser, page } = await setupBrowserPage();

		await page.click("a.choose-language:first-of-type");
		await page.type("#SimpleSearchForm_SearchTerm", name);
		await page.waitFor(4000);
		await page.click("button#search_submit");
		await page.waitForNavigation();
		await page.click(
			"div.productListingWidget ul > li:first-of-type div.product_name > a"
		);
		await page.waitForNavigation();
		const divs = await page.$$("div.product-details-list > div");

		let data = {};
		for (let div of divs) {
			const eval = await page.evaluate(el => {
				const result = {};
				result[el.querySelector("b").innerText] = el.querySelector(
					"span"
				).innerText;
				return result;
			}, div);
			data = Object.assign({}, data, eval);
		}
		data["Price"] = await page.evaluate(
			() => document.querySelector("span.price").innerText
		);

		await browser.close();
		return formatTextToAlphaNumeric(data);
	} catch (err) {
		console.log(err);
	}
};

module.exports = scrapeWineInformation;
