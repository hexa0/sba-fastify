import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import mongoose from "mongoose";
import "dotenv/config";
import { env } from "../utils/environment";

const dbPlugin: FastifyPluginAsync = async (server) => {
	try {
		mongoose.connection.on("connected", () =>
			server.log.info("MongoDB Connected")
		);

		mongoose.connection.on("error", (err) =>
			server.log.error({ err }, "MongoDB Connection Error")
		);

		await mongoose.connect(env.DATABASE_URL);

		server.decorate("db", mongoose.connection);
	} catch (error) {
		server.log.error({ err: error }, "Failed to initialize MongoDB");
		process.exit(1);
	}
};

export default fp(dbPlugin);
