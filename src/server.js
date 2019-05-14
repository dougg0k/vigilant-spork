const { GraphQLServer, PubSub } = require("graphql-yoga");
const { Prisma } = require("prisma-binding");
const resolvers = require("./resolvers/resolvers");

const prisma = new Prisma({
	typeDefs: "generated/prisma.graphql",
	endpoint: "http://localhost:4466"
});

const pubsub = new PubSub();

const server = new GraphQLServer({
	typeDefs: "./server/schema.graphql",
	resolvers,
	context: req => ({
		req,
		db: prisma,
		pubsub
	})
});

const options = {
	port: 4000,
	endpoint: "/graphql",
	subscriptions: "/subscriptions",
	playground: "/playground",
	uploads: {
		maxFiles: 100,
		maxFileSize: 10485760 // 10MB
	}
};

server.start(options, ({ port }) =>
	console.log(`Server is running on http://localhost:${port}`)
);
