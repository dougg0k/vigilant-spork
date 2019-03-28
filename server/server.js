const { GraphQLServer } = require("graphql-yoga");
const { Prisma } = require("prisma-binding");

const prisma = new Prisma({
	typeDefs: "generated/prisma.graphql",
	endpoint: "http://localhost:4466"
});

const server = new GraphQLServer({
	typeDefs: "./server/schema.graphql",
	resolvers: () => {},
	context: req => ({
		...req,
		db: prisma
	})
});

server.start(() => console.log("Server is running on http://localhost:4000"));
