import { FastifyInstance } from "fastify";

declare module "fastify" {
	interface FastifyInstance {
		verifyRobloxKey(key: string): boolean;
	}
}

export default async function authRoutes(server: FastifyInstance) {
	server.post("/auth/handshake", async (request, reply) => {
		const { key, userId } = request.body as { key: string; userId: number };
		
		if (!server.verifyRobloxKey(key)) {
			return reply.status(403).send({ error: "Invalid Secret Key" });
		}

		const token = server.jwt.sign({ userId }, { expiresIn: "1h" });

		return { token };
	});
}
