/** @type {import("jest").Config} */
const { defaults: tsjPreset } = require("ts-jest/presets");

module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: tsjPreset.transform,
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFiles: ["<rootDir>/jest.setup.js"], // polyfills TextEncoder/TextDecoder
};
