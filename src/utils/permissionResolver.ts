import { existsSync, readFileSync, readdirSync } from "fs";
import path from "path";

const PERMS_DIR = path.join(process.cwd(), "permissions");

type PlayerPermsUnprocessed = {
	icons: [string];
	Perms: [string];
}

export async function getResolvedPermissions() {
	const mainPath = path.join(PERMS_DIR, "permissions.json");
	if (!existsSync(mainPath))
		return { error: "Main permissions file missing" };

	const data = JSON.parse(readFileSync(mainPath, "utf-8"));

	data.forEach((player: PlayerPermsUnprocessed) => {
		for (let index = 0; index < player.Perms.length; index++) {
			const rolePath = path.join(PERMS_DIR, "roles", `${player.Perms[index]}.json`);

			if (existsSync(rolePath)) {
				try {
					player.Perms[index] = readFileSync(rolePath, "utf-8");
					console.log(`resolved role at ${rolePath}`)
				} catch {
					console.warn(`failed to set role at ${rolePath}`)
				}
			}
			else  {
				console.warn(`role at ${rolePath} is missing`)
			}
		}

		for (let index = 0; index < player.icons.length; index++) {
			const iconPath = path.join(PERMS_DIR, "icons", `${player.icons[index]}.txt`);

			if (existsSync(iconPath)) {
				try {
					player.icons[index] = readFileSync(iconPath, "utf-8");
					console.log(`resolved icon at ${iconPath}`)
				} catch {
					console.warn(`failed to set icon at ${iconPath}`)
				}
			}
			else {
				console.warn(`icon at ${iconPath} is missing`)
			}
		}
	});

	console.log("perm data returned")

	return data;
}
