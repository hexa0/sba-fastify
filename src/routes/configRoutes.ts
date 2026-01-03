import { FastifyInstance } from "fastify";
import { readFileSync } from "fs";
import path from "path";

export default async function configRoutes(server: FastifyInstance) {
	server.get("/perms/get", async (request, reply) => {
		try {
			const data = readFileSync(
				path.join(__dirname, "perms.json"),
				"utf8"
			);
			return JSON.parse(data);
		} catch (err) {
			return reply
				.status(500)
				.send({ error: "Could not load permissions" });
		}
	});
}
