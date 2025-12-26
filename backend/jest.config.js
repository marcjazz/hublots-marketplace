const { loadEnv } = require("@medusajs/utils")
loadEnv("test", process.cwd())

module.exports = {
  transform: {
    "^.+\\.[jt]s$": [
      "@swc/jest",
      {
        jsc: {
          target: "es2022", // Use a supported target
          parser: { syntax: "typescript", decorators: true },
          transform: {
            hidden: {
              jest: true,
            },
          },
        },
        sourceMaps: "inline",
        module: { type: "commonjs" },
      },
    ],
  },
  transformIgnorePatterns: [
    "/node_modules/(?!@medusajs/test-utils)", // Transform test-utils
  ],
  testEnvironment: "node",
  moduleFileExtensions: ["js", "ts", "json"],
  modulePathIgnorePatterns: ["dist/", "<rootDir>/.medusa/"],
  setupFiles: ["./integration-tests/setup.js"],

  // Add separate configs for different test types if needed
  testMatch: [
    "**/__tests__/**/*.spec.[jt]s",
    "**/integration-tests/http/*.spec.[jt]s",
  ],
}
