module.exports = {
	apps: [
		{
			name: "stamper-api",
			script: "./src/app.ts",
			interpreter: "bun", // Explicitly use bun
			watch: false, // The internal file watcher handles permissions/
			env: {
				NODE_ENV: "production",
			},
		},
	],
};