const { withFilter } = require("graphql-yoga");
const parseResult = require("./parseResult");
const { WINE_PROCESSED } = require("../utils/constants");
const imageQueue = require("./imageQueue");
const writeImageToLocal = require("./writeImageToLocal");
const scrapeWineInformation = require("./scrapeWineInformation");
const { capitalize, formatTextToFloat } = require("../utils/helpers");

module.exports = {
	Mutation: {
		processWine: async (parent, { files, channelId }, { db, pubsub }) => {
			await Promise.all(
				files.map(async file => {
					const uploadedFile = await file;
					try {
						const fileProcessed = await writeImageToLocal(uploadedFile);
						await imageQueue.add(
							{ image: fileProcessed },
							{ removeOnComplete: true, removeOnFail: true }
						);
					} catch (err) {}
				})
			);

			imageQueue.on("completed", async (job, result) => {
				const resultParsed = parseResult(result);
				if (!resultParsed) {
					return {
						message: "Parser was not able to get data from this file"
					};
				}
				const info = await scrapeWineInformation(resultParsed);

				const wine = {
					name: capitalize(resultParsed),
					grapes: [],
					winery: "",
					year: info.Year || 0,
					alcohol: formatTextToFloat(info.AchoholVol) || 0.0,
					price: formatTextToFloat(info.Price) || 0.0,
					by: info.By || "",
					madeIn: info.MadeIn || "",
					style: info.Style || "",
					sugarContent: info.SugarContent || ""
				};

				const wineExists = await db.exists.Wine({
					name: capitalize(resultParsed)
				});
				if (!wineExists) {
					try {
						const created = await db.mutation.createWine(
							{ data: wine },
							"{ id }"
						);
						wine["id"] = created.id;
					} catch (err) {
						console.log(err);
					}
				}

				pubsub.publish(WINE_PROCESSED, {
					channelId,
					data: wine
				});
			});
			return null;
		}
	},
	Query: {
		wines: []
	},
	Subscription: {
		wineProcessed: {
			subscribe: withFilter(
				(parent, args, { pubsub }) => pubsub.asyncIterator(WINE_PROCESSED),
				(payload, args) => payload.channelId === args.channelId
			)
		}
	}
};
