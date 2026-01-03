import { FastifyInstance } from "fastify";
import mongoose from "mongoose";

export default async function systemRoutes(server: FastifyInstance) {
	server.get("/status/test", async () => {
		return {
			success: true,
			engine: "Bun/" + Bun.version,
			uptime: Bun.nanoseconds() / 1e9,
			databaseState:
				mongoose.connection.readyState === 1
					? "connected"
					: "disconnected",
		};
	});
}
