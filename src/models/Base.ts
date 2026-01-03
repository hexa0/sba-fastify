import { Schema, model } from "mongoose";

interface IBase {
	userId: number;
	name: string;
	size: number;
	content: Buffer;
	updatedAt: Date;
	createdAt: Date;
}

const baseSchema = new Schema<IBase>(
	{
		userId: { type: Number, required: true, index: true }, // Indexing makes searching fast
		name: { type: String, required: true },
		size: { type: Number, required: true },
		content: { type: Buffer, required: true },
	},
	{ timestamps: true }
);

// Ensure a user can't have two bases with the exact same name
baseSchema.index({ userId: 1, name: 1 }, { unique: true });

export const Base = model<IBase>("Base", baseSchema);
