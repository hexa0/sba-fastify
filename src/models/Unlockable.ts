import { Schema, model } from "mongoose";

const unlockableSchema = new Schema(
	{
		userId: { type: Number, required: true, index: true },
		unlockedItems: {
			type: [String],
			default: [],
		},
	},
	{ timestamps: true }
);

export const UnlockableData = model("UnlockableData", unlockableSchema);
