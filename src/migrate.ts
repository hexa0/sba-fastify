import { readdirSync, existsSync, statSync } from "fs";
import path from "path";
import mongoose from "mongoose";
import { UnlockableData } from "./models/Unlockable";
import { Base } from "./models/Base";
import "dotenv/config";

const LEGACY_DB_PATH = "/server/node-servers/stamper-build/alpha/db/";

async function migrate() {
	try {
		console.log(`Starting migration from ${LEGACY_DB_PATH}...`);
		const dbUrl = process.env.DATABASE_URL;
		if (!dbUrl) throw new Error("DATABASE_URL missing in .env");

		await mongoose.connect(dbUrl);
		console.log("Connected to MongoDB");

		const eePath = path.join(LEGACY_DB_PATH, "ee");
		if (existsSync(eePath)) {
			const files = readdirSync(eePath).filter((f) =>
				f.endsWith(".json")
			);
			console.log(`Migrating ${files.length} Unlockable files...`);

			for (const file of files) {
				const filePath = path.join(eePath, file);
				const stats = statSync(filePath);
				const trueCreationDate =
					stats.birthtime > stats.mtime
						? stats.mtime
						: stats.birthtime;
				const userId = parseInt(file.replace(".json", ""));
				const content = await Bun.file(filePath).json();
				const itemsArray = Object.keys(content);

				await UnlockableData.updateOne(
					{ userId },
					{
						$set: {
							unlockedItems: itemsArray;
							createdAt: trueCreationDate,
							updatedAt: stats.mtime,
						},
					},
					{ upsert: true, timestamps: false }
				);
			}
		}

		const basesPath = path.join(LEGACY_DB_PATH, "bases");
		if (existsSync(basesPath)) {
			const userDirs = readdirSync(basesPath);
			console.log(`Migrating bases for ${userDirs.length} users...`);

			for (const userIdStr of userDirs) {
				const userDirPath = path.join(basesPath, userIdStr);
				if (!statSync(userDirPath).isDirectory()) continue;

				const userId = parseInt(userIdStr);
				const baseItems = readdirSync(userDirPath);

				for (const itemName of baseItems) {
					const itemPath = path.join(userDirPath, itemName);
					if (statSync(itemPath).isDirectory()) continue;

					const stats = statSync(itemPath);
					const trueCreationDate =
						stats.birthtime > stats.mtime
							? stats.mtime
							: stats.birthtime;

					const file = Bun.file(itemPath);
					const arrayBuffer = await file.arrayBuffer();
					const buffer = Buffer.from(arrayBuffer);

					await Base.updateOne(
						{ userId, name: itemName },
						{
							$set: {
								content: buffer,
								size: buffer.length,
								createdAt: trueCreationDate,
								updatedAt: stats.mtime,
							},
						},
						{ upsert: true, timestamps: false }
					);
				}
			}
		}

		console.log("Migration finished with preserved timestamps!");
		process.exit(0);
	} catch (err) {
		console.error("Migration failed:", err);
		process.exit(1);
	}
}

migrate();
