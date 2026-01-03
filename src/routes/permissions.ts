import { FastifyInstance } from "fastify";

export default async function permissionRoutes(server: FastifyInstance) {
	server.get("/perms/get", async () => {
		return server.permissions();
	});

	server.get("/perms/raw", async () => {
		return Bun.file("permissions/permissions.json").json();
	});
}
