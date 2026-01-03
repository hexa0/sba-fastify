import { existsSync, readFileSync, readdirSync } from "fs";
import path from "path";

const PERMS_DIR = path.join(process.cwd(), "permissions");

export async function getResolvedPermissions() {
	const mainPath = path.join(PERMS_DIR, "permissions.json");
	if (!existsSync(mainPath))
		return { error: "Main permissions file missing" };

	const rawData = JSON.parse(readFileSync(mainPath, "utf-8"));

	const resolveValue = (val: any): any => {
		if (Array.isArray(val)) {
			return val.map(resolveValue);
		} else if (typeof val === "object" && val !== null) {
			const newObj: any = {};
			for (const key in val) {
				newObj[key] = resolveValue(val[key]);
			}
			return newObj;
		} else if (typeof val === "string") {
			const rolePath = path.join(PERMS_DIR, "roles", `${val}.json`);
			if (existsSync(rolePath)) {
				try {
					return JSON.parse(readFileSync(rolePath, "utf-8"));
				} catch {
					return val;
				}
			}

			// 2. Check for Icons (.txt)
			const iconPath = path.join(PERMS_DIR, "icons", `${val}.txt`);
			if (existsSync(iconPath)) {
				return readFileSync(iconPath, "utf-8").trim();
			}
		}
		return val;
	};

	return resolveValue(rawData);
}
