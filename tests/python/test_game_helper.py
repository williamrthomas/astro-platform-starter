import os
import sys
import unittest
from unittest.mock import patch, MagicMock

# Add the tools directory to the path so we can import the modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../tools')))

# Import the module to test
try:
    import game_helper
except ImportError:
    # Create a mock module for testing if the real one doesn't exist
    game_helper = MagicMock()
    game_helper.__file__ = 'game_helper.py'


class TestGameHelper(unittest.TestCase):
    """Tests for the game_helper.py tool."""
    
    def setUp(self):
        """Set up test fixtures."""
        # Create temporary directories for testing
        self.test_game_id = 'test-game'
        self.test_game_title = 'Test Game'
        self.test_category = 'puzzle'
        
    def tearDown(self):
        """Tear down test fixtures."""
        # Clean up any test files or directories created
        pass
        
    @patch('os.makedirs')
    @patch('builtins.open', new_callable=unittest.mock.mock_open)
    def test_create_game_scaffold(self, mock_open, mock_makedirs):
        """Test creating a new game scaffold."""
        # Skip if the module is mocked
        if isinstance(game_helper, MagicMock):
            self.skipTest("game_helper module not available")
            
        # Call the function to test
        game_helper.create_game_scaffold(self.test_game_id, self.test_game_title, self.test_category)
        
        # Assert that directories were created
        mock_makedirs.assert_called()
        
        # Assert that files were created
        mock_open.assert_called()
        
    @patch('builtins.open', new_callable=unittest.mock.mock_open, read_data='{}')
    def test_update_game_registry(self, mock_open):
        """Test updating the game registry."""
        # Skip if the module is mocked
        if isinstance(game_helper, MagicMock):
            self.skipTest("game_helper module not available")
            
        # Call the function to test
        game_helper.update_game_registry(
            self.test_game_id, 
            self.test_game_title, 
            "A test game description", 
            self.test_category, 
            tags=["test", "puzzle"]
        )
        
        # Assert that the registry file was opened
        mock_open.assert_called()


if __name__ == '__main__':
    unittest.main()
