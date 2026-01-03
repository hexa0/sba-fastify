import { FastifyInstance } from "fastify";

export default async function systemRoutes(server: FastifyInstance) {
	server.get("/status/test", async () => {
		return {
			status: "online",
			time: Date.now(),
			engine: "Bun/" + Bun.version,
		};
	});
}
