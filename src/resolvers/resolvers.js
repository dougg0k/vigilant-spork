const { withFilter } = require("graphql-yoga");
const { parse } = require("flatted/cjs");
const { WINE_PROCESSED } = require("../utils/constants");
const imageQueue = require("../utils/imageQueue");
const writeImageToLocal = require("../utils/writeImageToLocal");
const gatherWineInformation = require("../utils/gatherWineInformation");

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
					} catch (err) {
						console.log(err);
					}
				})
			);

			imageQueue.on("completed", async (job, result) => {
				const resultParsed = parse(result);
				console.log("RESULT = ", resultParsed);
				// Process Information from job, gather missing information
				// const wineInfo = await gatherWineInformation("name");

				const wine = {
					name: "",
					grapes: [],
					winery: "",
					year: 0,
					alcohol: 0.0,
					price: 0.0,
					by: "",
					madeIn: "",
					style: "",
					sugarContent: "",
					image: {
						url: "",
						filename: "",
						mimetype: "",
						encoding: ""
					}
				};

				// const wineExists = await db.exists.Wine({
				// 	name: ""
				// });
				// if (!wineExists) {
				// 	await db.mutation.createWine({ data: wine }, "{ id }");
				// }

				// pubsub.publish(WINE_PROCESSED, {
				// 	channelId: channelId,
				// 	uploadImages: wine
				// });
			});

			return [
				{
					id: 1,
					fileName: "filename",
					enconding: "enconding",
					mimeType: "mimeType"
				}
			];
		}
	},
	Query: {
		wines: []
	},
	Subscription: {
		wineProcessed: {
			subscribe: withFilter(
				() => pubsub.asyncIterator(WINE_PROCESSED),
				(payload, args) => payload.channelId === args.channelId
			)
		}
	}
};
