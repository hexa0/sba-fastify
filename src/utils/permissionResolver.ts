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

	const data = JSON.parse(readFileSync(mainPath, "utf-8")) as [PlayerPermsUnprocessed];

	for (let index = 0; index < data.length; index++) {
		const player = data[index];
		
		for (let index = 0; index < player.Perms.length; index++) {
			const key = player.Perms[index];

			const rolePath = path.join(PERMS_DIR, "roles", `${key}.json`);

			if (existsSync(rolePath)) {
				try {
					player.Perms[index] = readFileSync(rolePath, "utf-8");
				} catch {
					
				}
			}
		}

		for (let index = 0; index < player.icons.length; index++) {
			const key = player.icons[index];

			const iconPath = path.join(PERMS_DIR, "icons", `${key}.txt`);

			if (existsSync(iconPath)) {
				try {
					player.icons[index] = readFileSync(iconPath, "utf-8");
				} catch {
					
				}
			}
		}
	}

	return data;
}
