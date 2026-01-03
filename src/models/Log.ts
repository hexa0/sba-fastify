import { Schema, model } from "mongoose";

const logSchema = new Schema({
	type: { type: String, required: true }, // 'error', 'admin_shout', 'ban', 'kick'
	executor: { type: String }, // Who did it (if admin action)
	target: { type: String }, // Who it was done to
	content: { type: String, required: true },
	timestamp: { type: Date, default: Date.now },
});

export const Log = model("Log", logSchema);