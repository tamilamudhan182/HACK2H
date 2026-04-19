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
  testPathIgnorePatterns: ["/node_modules/", "/tests/e2e/"],
  transformIgnorePatterns: ["node_modules/(?!(your-esm-package)/)"],
  collectCoverageFrom: [
    "src/utils/**/*.{js,jsx}",
    "src/hooks/**/*.{js,jsx}",
    "!src/utils/webVitals.js",
    "!src/utils/dataHelpers.js",
    "!src/utils/crypto.js",
    "!src/hooks/index.js",
    "!src/**/*.test.{js,jsx}"
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  coverageReporters: ["text", "lcov"]
};
