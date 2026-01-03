module.exports = {
	apps: [
		{
			name: "backend-stamper-build-alpha",
			script: "./src/app.ts",
			interpreter: "bun", // Explicitly use bun
			watch: false, // The internal file watcher handles permissions/
			env: {
				NODE_ENV: "production",
			},
		},
	],
};