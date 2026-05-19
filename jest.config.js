/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/?(*.)+(spec|test).ts"],
  clearMocks: true,
  collectCoverageFrom: [
    "app.ts",
    "app/**/*.ts",
    "plugins/**/*.ts",
    "lib/**/*.ts",
    "!**/*.d.ts",
  ],
};
