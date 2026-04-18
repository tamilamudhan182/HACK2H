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
  transformIgnorePatterns: ["node_modules/(?!(your-esm-package)/)"]
};
