import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { watch } from "fs";
import { getResolvedPermissions } from "../utils/permissionResolver";

declare module "fastify" {
	interface FastifyInstance {
		permissions: any;
		refreshPermissions: () => Promise<void>;
	}
}

const permissionsPlugin: FastifyPluginAsync = async (server) => {
	let cachedPerms: any = {};

	server.decorate("refreshPermissions", async () => {
		server.log.info("Reloading permissions from disk...");
		cachedPerms = await getResolvedPermissions();
	});

	await server.refreshPermissions();
	server.decorate("permissions", () => cachedPerms);

	const watcher = watch(
		"./permissions",
		{ recursive: true },
		async (event, filename) => {
			if (filename) {
				server.log.info(`File changed: ${filename}`);
				await server.refreshPermissions();
			}
		}
	);

	server.addHook("onClose", async () => {
		watcher.close();
	});
};

export default fp(permissionsPlugin);
