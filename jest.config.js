module.exports = {
  testEnvironment: 'jsdom',
  moduleDirectories: ['node_modules'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  verbose: true,
  transformIgnorePatterns: [
    "/node_modules/",
    "\\.pnp\\.[^\\/]+$"
  ],
  // Ignore Jupyter files to avoid naming collisions
  modulePathIgnorePatterns: [
    "<rootDir>/venv/"
  ]
};
