#!/usr/bin/env python
"""
Test runner script for the Arcade Hub project.
Runs both Python and JavaScript tests.
"""

import os
import sys
import subprocess
import argparse
import unittest
import glob


def run_python_tests(verbose=False):
    """Run all Python tests."""
    print("\n===== Running Python Tests =====")
    
    # Discover and run all Python tests
    loader = unittest.TestLoader()
    start_dir = os.path.join(os.path.dirname(__file__), 'tests/python')
    suite = loader.discover(start_dir, pattern='test_*.py')
    
    runner = unittest.TextTestRunner(verbosity=2 if verbose else 1)
    result = runner.run(suite)
    
    return result.wasSuccessful()


def run_js_tests(verbose=False):
    """Run all JavaScript tests using Jest."""
    print("\n===== Running JavaScript Tests =====")
    
    # Run Jest tests
    cmd = ["npm", "test"]
    if verbose:
        cmd.append("--verbose")
    
    try:
        result = subprocess.run(cmd, check=True)
        return result.returncode == 0
    except subprocess.CalledProcessError:
        return False


def main():
    """Main entry point for the test runner."""
    parser = argparse.ArgumentParser(description="Run tests for the Arcade Hub project")
    parser.add_argument("--python-only", action="store_true", help="Run only Python tests")
    parser.add_argument("--js-only", action="store_true", help="Run only JavaScript tests")
    parser.add_argument("-v", "--verbose", action="store_true", help="Increase output verbosity")
    args = parser.parse_args()
    
    # Track success of all test runs
    success = True
    
    # Run Python tests if requested or if no specific test type is requested
    if args.python_only or (not args.python_only and not args.js_only):
        python_success = run_python_tests(args.verbose)
        success = success and python_success
    
    # Run JavaScript tests if requested or if no specific test type is requested
    if args.js_only or (not args.python_only and not args.js_only):
        js_success = run_js_tests(args.verbose)
        success = success and js_success
    
    # Return appropriate exit code
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
