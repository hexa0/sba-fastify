import Fastify, { FastifyError } from "fastify";
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
		const readableIssues = error.issues
            .map(i => `• ${i.path.join('.')}: ${i.message}`)
            .join('\n');
			
		return reply.status(400).send({
			success: false,
			error: `Data Validation Error:\n${readableIssues}`,
		});
	}
	

	if (error instanceof Error) {
		const fastifyError = error as FastifyError;
		const statusCode = fastifyError.statusCode || 500;
		server.log.error(error);

		return reply.status(statusCode).send({
            success: false,
            error: `${fastifyError.code}\n${error.message}\nStack Trace:\n${error.stack}`,
        });
	}

	server.log.error(error);
    reply.status(500).send({
        success: false,
        error: `Uncaught Non-Error Exception: ${String(error)}`
    });
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
