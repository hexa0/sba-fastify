import { FastifyInstance } from "fastify";

export default async function configRoutes(server: FastifyInstance) {
	server.get("/status/test", async () => {
		return {
			status: "online",
			time: Date.now(),
			engine: "Bun/" + Bun.version,
		};
	});

	server.get("/perms/get", async () => {
		return server.permissions();
	});

	server.get("/perms/raw", async () => {
		return Bun.file("permissions/permissions.json").json();
	});
}
