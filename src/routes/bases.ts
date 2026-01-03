import { FastifyInstance } from "fastify";
import { Base } from "../models/Base";
import { BaseSaveQuerySchema } from "../schemas";

export default async function baseRoutes(server: FastifyInstance) {
	server.post(
		"/base/save",
		{ preHandler: [server.authenticate] },
		async (request, reply) => {
			const { name } = BaseSaveQuerySchema.parse(request.query);
			const { userId } = request.user as { userId: number };
			const contentBuffer = request.body as Buffer;

			if (!contentBuffer || contentBuffer.length === 0) {
				return reply.status(400).send({ error: "Empty base content" });
			}

			await Base.updateOne(
				{ userId, name },
				{ content: contentBuffer.toString("binary") },
				{ upsert: true }
			);

			return { success: true };
		}
	);

	server.get(
		"/base/list",
		{ preHandler: [server.authenticate] },
		async (request) => {
			const { userId } = request.user as { userId: number };
			const bases = await Base.find({ userId }).select("name updatedAt createdAt size");
			return bases;
		}
	);
}
