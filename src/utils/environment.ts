import "dotenv/config";
import z from "zod";

const envSchema = z.object({
	ROBLOX_SECRET_KEY: z.string().min(32),
	JWT_SECRET: z.string().min(32),
	DATABASE_URL: z.string(),
	PORT: z.string().default("3000").transform(Number),
	NODE_ENV: z.enum(["development", "production"]).default("development"),
});

export const env = envSchema.parse(process.env);