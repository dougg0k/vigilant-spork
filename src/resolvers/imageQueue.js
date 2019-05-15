const Queue = require("bull");
const { stringify } = require("flatted/cjs");
const imageProcessing = require("./imageProcessing");

const imageQueue = new Queue("image", "redis");

imageQueue.process(1, async (job, done) => {
	try {
		const result = await imageProcessing(job.data.image.path, progress => {
			job.progress(progress);
		});
		done(null, stringify(result));
	} catch (err) {
		done(err);
	}
});

module.exports = imageQueue;
