# Testing Framework for Arcade Hub

This directory contains tests for both the JavaScript frontend and Python tools of the Arcade Hub platform.

## Test Structure

- `js/`: JavaScript tests for the frontend components
  - `main.test.js`: Tests for core game platform functionality
  - `highscore.test.js`: Tests for the high score system

- `python/`: Python tests for the development tools
  - `test_game_helper.py`: Tests for the game helper tool
  - `test_game_idea_generator.py`: Tests for the game idea generator

- `setup.js`: Jest setup file with global test configuration

## Running Tests

### All Tests

To run all tests (both JavaScript and Python):

```bash
# Make sure your virtual environment is activated
source venv/bin/activate

# Run all tests
./run_tests.py
```

### JavaScript Tests Only

To run only the JavaScript tests:

```bash
# Run with npm
npm test

# Or use the test runner script
./run_tests.py --js-only
```

### Python Tests Only

To run only the Python tests:

```bash
# Make sure your virtual environment is activated
source venv/bin/activate

# Run Python tests
./run_tests.py --python-only
```

### Verbose Output

For more detailed test output:

```bash
./run_tests.py --verbose
```

## Adding New Tests

### JavaScript Tests

1. Create a new test file in the `tests/js/` directory with a `.test.js` extension
2. Import any necessary modules
3. Write your tests using Jest's testing functions
4. Run the tests to verify they work

Example:

```javascript
// tests/js/example.test.js
describe('Example Test', () => {
  test('should perform a simple test', () => {
    expect(1 + 1).toBe(2);
  });
});
```

### Python Tests

1. Create a new test file in the `tests/python/` directory with a `test_` prefix
2. Import the unittest module and the module you want to test
3. Create a test class that extends unittest.TestCase
4. Write test methods with names starting with `test_`
5. Run the tests to verify they work

Example:

```python
# tests/python/test_example.py
import unittest

class TestExample(unittest.TestCase):
    def test_simple_assertion(self):
        self.assertEqual(1 + 1, 2)

if __name__ == '__main__':
    unittest.main()
```

## Test Coverage

To generate a coverage report for JavaScript tests:

```bash
npm test -- --coverage
```

The coverage report will be available in the `coverage/` directory.
