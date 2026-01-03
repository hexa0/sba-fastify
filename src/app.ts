import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import "dotenv/config";
import { z, ZodError } from "zod";
import authPlugin from "./plugins/auth";
import authRoutes from "./routes/auth";
import dbPlugin from "./plugins/db";
import baseRoutes from "./routes/bases";
import permissionRoutes from "./routes/permissions";
import unlockableRoutes from "./routes/unlockables";
import logRoutes from "./routes/logs";
import permissionsPlugin from "./plugins/permissions";
import systemRoutes from "./routes/system";
import { env } from "./utils/environment";

const server = Fastify({ logger: true });

server.register(fastifyJwt, { secret: env.JWT_SECRET });
server.register(dbPlugin);
server.register(authPlugin);
server.register(permissionsPlugin);
server.register(authRoutes);
server.register(permissionRoutes);
server.register(baseRoutes);
server.register(unlockableRoutes);
server.register(logRoutes);
server.register(systemRoutes);

server.setErrorHandler((error, request, reply) => {
	if (error instanceof ZodError) {
		return reply.status(400).send({
			success: false,
			error: `Data Validation Error\n${JSON.stringify(error.issues.map((i) => ({
				path: i.path,
				message: i.message,
			}))), null, 4}`,
		});
	}

	reply.status(500).send({ success: false, error: error });
});

server.addContentTypeParser(
	"application/octet-stream",
	{ parseAs: "buffer" },
	(request, body, done) => {
		done(null, body);
	}
);

const start = async () => {
	try {
		await server.listen({ port: env.PORT, host: "0.0.0.0" });
		console.log(`Server listening on port ${env.PORT}`);
	} catch (err) {
		server.log.error(err);
		process.exit(1);
	}
};

start();
