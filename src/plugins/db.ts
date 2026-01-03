import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import mongoose from "mongoose";
import { env } from "../app";

const dbPlugin: FastifyPluginAsync = async (server) => {
	try {
		// Listen for connection events for better logging
		mongoose.connection.on("connected", () =>
			server.log.info("MongoDB Connected")
		);

		mongoose.connection.on("error", (err) =>
			server.log.error({ err }, "MongoDB Connection Error")
		);

		// Connect to the database
		await mongoose.connect(env.DATABASE_URL);

		// Decorate the server so you can access mongoose if needed elsewhere
		server.decorate("db", mongoose.connection);
	} catch (error) {
		server.log.error({ err: error }, "Failed to initialize MongoDB");
		process.exit(1);
	}
};

export default fp(dbPlugin);
