import { FastifyInstance } from "fastify";
import { UnlockableData } from "../models/Unlockable";
import { UnlockableSetSchema } from "../schemas";

export default async function unlockableRoutes(server: FastifyInstance) {
	server.get(
		"/unlockables/get",
		{ preHandler: [server.authenticate] },
		async (request) => {
			const { userId } = request.user as { userId: number };
			const data = await UnlockableData.findOne({ userId: userId });

			if (!data || !data.unlockedItems) {
				return [];
			}

			return data.unlockedItems;
		}
	);

	server.post(
		"/unlockables/set",
		{ preHandler: [server.authenticate] },
		async (request) => {
			const { userId } = request.user as { userId: number };
			const { name } = UnlockableSetSchema.parse(request.body);

			await UnlockableData.findOneAndUpdate(
				{ userId },
				{ $addToSet: { unlockedItems: name } },
				{ upsert: true }
			);

			return { success: true };
		}
	);
}
