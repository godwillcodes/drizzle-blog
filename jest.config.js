/** @type {import("jest").Config} */

export default {
  preset: "ts-jest",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFiles: ["<rootDir>/__tests__/jest.setup.ts"],
  testRegex: "__tests__/.*\\.test\\.ts$",
  testEnvironment: "node",
  forceExit: true,
  detectOpenHandles: true,
  verbose: true,
  testTimeout: 10000,
};