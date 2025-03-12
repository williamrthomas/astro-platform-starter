// Import jest-dom additions
require('@testing-library/jest-dom');

// Set up any global test configuration
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
