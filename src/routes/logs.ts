import { FastifyInstance } from "fastify";
import { Log } from "../models/Log";
import { LogSendSchema } from "../schemas";

export default async function logRoutes(server: FastifyInstance) {
	server.post(
		"/log/send",
		{ preHandler: [server.authenticate] },
		async (request, reply) => {
			const { type, contents, adminName } = LogSendSchema.parse(request.body);

			await Log.create({
				type,
				content: contents,
				executor: adminName || "System",
				timestamp: new Date(),
			});

			return { success: true };
		}
	);

	server.get("/log/get", { preHandler: [server.authenticate] }, async () => {
		return await Log.find().sort({ timestamp: -1 }).limit(100);
	});
}
