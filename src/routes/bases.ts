import { FastifyInstance } from "fastify";
import { Base } from "../models/Base";
import {
	BaseDeleteQuerySchema,
	BaseRenameQuerySchema,
	BaseSaveQuerySchema,
} from "../schemas";

export default async function baseRoutes(server: FastifyInstance) {
	server.post(
		"/base/save",
		{ preHandler: [server.authenticate], config: { rawBody: true } },
		async (request, reply) => {
			const { name } = BaseSaveQuerySchema.parse(request.query);
			const { userId } = request.user as { userId: number };
			const contentBuffer = request.rawBody;

			if (!contentBuffer || contentBuffer.length === 0) {
				return reply.status(400).send({ error: "Empty base content" });
			}

			await Base.updateOne(
				{ userId, name },
				{
					content: contentBuffer,
					size: contentBuffer.length,
					updatedAt: new Date()
				},
				{ upsert: true }
			);

			return { success: true };
		}
	);

	server.get(
		"/base/load",
		{ preHandler: [server.authenticate] },
		async (request, reply) => {
			const { name } = BaseSaveQuerySchema.parse(request.query);
			const { userId } = request.user as { userId: number };

			const base = await Base.findOne({ userId, name });

			if (!base) {
				return reply.status(404).send({ error: "Base not found" });
			}

			return reply
				.type("application/octet-stream")
				.send(base.content);
		}
	);

	server.get(
		"/base/list",
		{ preHandler: [server.authenticate] },
		async (request) => {
			const { userId } = request.user as { userId: number };
			const bases = await Base.find({ userId }).select(
				"name updatedAt createdAt size"
			);
			return bases;
		}
	);

	server.patch(
		"/base/rename",
		{ preHandler: [server.authenticate] },
		async (request, reply) => {
			const { oldName, newName } = BaseRenameQuerySchema.parse(
				request.query
			);
			const { userId } = request.user as { userId: number };

			const exists = await Base.findOne({ userId, name: newName });
			if (exists) {
				return reply
					.status(409)
					.send({ error: "A base with the new name already exists" });
			}

			const result = await Base.findOneAndUpdate(
				{ userId, name: oldName },
				{ $set: { name: newName } },
				{ new: true }
			);

			if (!result) {
				return reply
					.status(404)
					.send({ error: "Original base not found" });
			}

			return { success: true };
		}
	);

	server.delete(
		"/base/delete",
		{ preHandler: [server.authenticate] },
		async (request, reply) => {
			const { name } = BaseDeleteQuerySchema.parse(request.query);
			const { userId } = request.user as { userId: number };

			const result = await Base.findOneAndDelete({ userId, name });

			if (!result) {
				return reply.status(404).send({ error: "Base not found" });
			}

			return { success: true };
		}
	);
}
