export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": ["ts-jest", { useESM: true }]
  },
  // Strip .js extension only for relative imports within the project
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1"
  },
  extensionsToTreatAsEsm: [".ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  testMatch: ["<rootDir>/tests/**/*.test.ts"],
  collectCoverageFrom: [
    "<rootDir>/src/core/aplicacion/casos-uso/**/*.ts",
    "!<rootDir>/src/**/*.d.ts"
  ]
};
