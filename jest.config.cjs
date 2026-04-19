module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest"
  },
  globals: {
    "import.meta": { env: {} }
  },
  transformIgnorePatterns: ["node_modules/(?!(your-esm-package)/)"],
  collectCoverageFrom: [
    "src/utils/**/*.{js,jsx}",
    "src/hooks/**/*.{js,jsx}",
    "!src/**/*.test.{js,jsx}"
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 75,
      lines: 75,
      statements: 75
    }
  },
  coverageReporters: ["text", "lcov"]
};
