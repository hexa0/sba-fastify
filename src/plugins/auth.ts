import { FastifyPluginAsync, FastifyRequest, FastifyReply } from "fastify";
import fp from "fastify-plugin";
import { env } from "../app";
import { timingSafeEqual } from "crypto";

declare module "fastify" {
	interface FastifyInstance {
		authenticate: (
			request: FastifyRequest,
			reply: FastifyReply
		) => Promise<void>;
	}
}

const authPlugin: FastifyPluginAsync = async (server) => {
	// 1. A decorator to check JWT on protected routes
	server.decorate(
		"authenticate",
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				await request.jwtVerify();
			} catch (err) {
				reply
					.status(401)
					.send({ error: "Unauthorized: Invalid or expired token" });
			}
		}
	);

	// 2. Helper for Constant-Time Comparison (Prevents timing attacks)
	server.decorate("verifyRobloxKey", (inputKey: string) => {
		const input = Buffer.from(inputKey);
		const actual = Buffer.from(env.ROBLOX_SECRET_KEY);
		if (input.length !== actual.length) return false;
		return timingSafeEqual(input, actual);
	});
};

export default fp(authPlugin);