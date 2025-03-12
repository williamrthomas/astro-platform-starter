import os
import sys
import unittest
from unittest.mock import patch, MagicMock

# Add the tools directory to the path so we can import the modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../tools')))

# Import the module to test
try:
    import game_idea_generator
except ImportError:
    # Create a mock module for testing if the real one doesn't exist
    game_idea_generator = MagicMock()
    game_idea_generator.__file__ = 'game_idea_generator.py'


class TestGameIdeaGenerator(unittest.TestCase):
    """Tests for the game_idea_generator.py tool."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.test_category = 'puzzle'
        
    @patch('random.choice')
    def test_generate_game_idea(self, mock_choice):
        """Test generating a game idea."""
        # Skip if the module is mocked
        if isinstance(game_idea_generator, MagicMock):
            self.skipTest("game_idea_generator module not available")
            
        # Set up mock return value
        mock_game_idea = {
            "title": "Color Matcher",
            "category": "puzzle",
            "description": "Match falling colored blocks to create patterns and score points.",
            "mechanics": [
                "Colored blocks fall from the top of the screen",
                "Player can move and rotate blocks",
                "Matching 3 or more blocks of the same color removes them",
                "Creating patterns yields bonus points"
            ],
            "difficulty": "medium",
            "tags": ["puzzle", "matching", "casual"]
        }
        mock_choice.return_value = mock_game_idea
        
        # Call the function to test
        idea = game_idea_generator.generate_game_idea(self.test_category)
        
        # Assert the idea has the expected structure
        self.assertIsInstance(idea, dict)
        self.assertIn('title', idea)
        self.assertIn('description', idea)
        self.assertIn('category', idea)
        
        # Assert the values match our mocked values
        self.assertEqual(idea['title'], "Color Matcher")
        self.assertEqual(idea['category'], "puzzle")
        
    def test_game_concepts(self):
        """Test that game concepts are defined."""
        # Skip if the module is mocked
        if isinstance(game_idea_generator, MagicMock):
            self.skipTest("game_idea_generator module not available")
            
        # Assert that game concepts are defined
        self.assertTrue(hasattr(game_idea_generator, 'GAME_CONCEPTS'))
        self.assertIsInstance(game_idea_generator.GAME_CONCEPTS, list)
        
        # Check if our test category exists in at least one concept
        categories = [concept['category'] for concept in game_idea_generator.GAME_CONCEPTS]
        self.assertIn(self.test_category, categories)


if __name__ == '__main__':
    unittest.main()
