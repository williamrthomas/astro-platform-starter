/**
 * Arcade Hub - Main JavaScript
 * Handles high scores, social sharing, and other functionality
 */

document.addEventListener('DOMContentLoaded', () => {
  // Add the game-card class to all game cards for the shine effect
  document.querySelectorAll('.grid > div').forEach(card => {
    card.classList.add('game-card');
  });

  // Initialize animations
  document.querySelectorAll('.grid > div').forEach((card, index) => {
    setTimeout(() => {
      card.classList.add('animate-fade-in');
    }, index * 100); // Stagger the animations
  });
  
  // Fix for search input - add clear button
  const searchInput = document.querySelector('input[x-model="search"]');
  if (searchInput) {
    
    // Clear button for search
    const header = document.querySelector('header');
    if (header) {
      const clearButton = document.createElement('button');
      clearButton.className = 'absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600';
      clearButton.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      `;
      clearButton.style.display = 'none';
      
      // Position the clear button inside the search input container
      const inputContainer = searchInput.parentElement;
      inputContainer.style.position = 'relative';
      inputContainer.appendChild(clearButton);
      
      // Show/hide clear button based on search input
      searchInput.addEventListener('input', function() {
        clearButton.style.display = this.value ? 'block' : 'none';
      });
      
      // Clear search when button is clicked
      clearButton.addEventListener('click', function() {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        this.style.display = 'none';
        searchInput.focus();
      });
    }
  }
});

/**
 * High Score Management
 * Uses localStorage to store and retrieve high scores
 */
const HighScores = {
  /**
   * Save a high score for a specific game
   * @param {string} gameId - The ID of the game
   * @param {string} initials - Player's initials (2-3 characters)
   * @param {number} score - The score achieved
   * @param {number} maxScores - Maximum number of scores to keep (default: 10)
   */
  saveScore: (gameId, initials, score, maxScores = 10) => {
    // Validate inputs
    if (!gameId || !initials || typeof score !== 'number') return false;
    
    // Format initials (uppercase, max 3 chars)
    initials = initials.toUpperCase().substring(0, 3);
    
    // Get existing scores or initialize empty array
    const existingScores = HighScores.getScores(gameId);
    
    // Add new score
    existingScores.push({
      initials,
      score,
      date: new Date().toISOString()
    });
    
    // Sort by score (highest first)
    existingScores.sort((a, b) => b.score - a.score);
    
    // Limit to maxScores
    const limitedScores = existingScores.slice(0, maxScores);
    
    // Save back to localStorage
    localStorage.setItem(`highscores_${gameId}`, JSON.stringify(limitedScores));
    
    return true;
  },
  
  /**
   * Get high scores for a specific game
   * @param {string} gameId - The ID of the game
   * @returns {Array} Array of high score objects
   */
  getScores: (gameId) => {
    if (!gameId) return [];
    
    const scores = localStorage.getItem(`highscores_${gameId}`);
    return scores ? JSON.parse(scores) : [];
  },
  
  /**
   * Check if a score qualifies as a high score
   * @param {string} gameId - The ID of the game
   * @param {number} score - The score to check
   * @param {number} maxScores - Maximum number of scores kept
   * @returns {boolean} True if score qualifies as a high score
   */
  isHighScore: (gameId, score, maxScores = 10) => {
    const scores = HighScores.getScores(gameId);
    
    // If we don't have max scores yet, it's automatically a high score
    if (scores.length < maxScores) return true;
    
    // Otherwise, check if it's higher than the lowest score
    const lowestScore = scores[scores.length - 1]?.score || 0;
    return score > lowestScore;
  },
  
  /**
   * Display a high score input form
   * @param {string} gameId - The ID of the game
   * @param {number} score - The score achieved
   * @param {Function} callback - Function to call after saving (optional)
   */
  showHighScoreForm: (gameId, score, callback) => {
    // Only show if it's a high score
    if (!HighScores.isHighScore(gameId, score)) {
      if (callback) callback();
      return;
    }
    
    // Create modal HTML
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 flex items-center justify-center z-50 highscore-modal';
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
        <h2 class="text-2xl font-bold mb-4 text-center">New High Score!</h2>
        <p class="text-center mb-6">You scored <span class="text-primary font-bold text-xl">${score}</span> points!</p>
        <form id="highscore-form" class="space-y-4">
          <div>
            <label for="initials" class="block text-sm font-medium text-gray-700 mb-1">Enter your initials:</label>
            <input type="text" id="initials" maxlength="3" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-center text-2xl uppercase" required>
          </div>
          <button type="submit" class="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-md transition-colors">
            Save Score
          </button>
        </form>
      </div>
    `;
    
    // Add to DOM
    document.body.appendChild(modal);
    
    // Focus the input
    setTimeout(() => {
      document.getElementById('initials').focus();
    }, 100);
    
    // Handle form submission
    document.getElementById('highscore-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const initials = document.getElementById('initials').value;
      
      if (initials.trim().length > 0) {
        HighScores.saveScore(gameId, initials, score);
        modal.remove();
        if (callback) callback();
      }
    });
  },
  
  /**
   * Display high scores in a modal
   * @param {string} gameId - The ID of the game
   */
  showHighScores: (gameId) => {
    const scores = HighScores.getScores(gameId);
    
    // Create modal HTML
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 flex items-center justify-center z-50 highscore-modal';
    
    let scoresHTML = '';
    if (scores.length === 0) {
      scoresHTML = '<p class="text-center text-gray-500 my-4">No high scores yet. Be the first!</p>';
    } else {
      scoresHTML = `
        <div class="w-full overflow-hidden">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-100">
                <th class="py-2 px-4 text-left">#</th>
                <th class="py-2 px-4 text-left">Initials</th>
                <th class="py-2 px-4 text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              ${scores.map((score, index) => `
                <tr class="${index === 0 ? 'bg-yellow-50' : index % 2 === 0 ? 'bg-gray-50' : ''}">
                  <td class="py-2 px-4">${index + 1}</td>
                  <td class="py-2 px-4 font-bold">${score.initials}</td>
                  <td class="py-2 px-4 text-right">${score.score.toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }
    
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">High Scores</h2>
          <button id="close-highscores" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        ${scoresHTML}
      </div>
    `;
    
    // Add to DOM
    document.body.appendChild(modal);
    
    // Close button handler
    document.getElementById('close-highscores').addEventListener('click', () => {
      modal.remove();
    });
    
    // Close on background click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }
};

/**
 * Social Sharing Functionality
 */
const SocialSharing = {
  /**
   * Share content on social media
   * @param {Object} options - Sharing options
   * @param {string} options.platform - Platform to share on ('twitter', 'facebook', etc.)
   * @param {string} options.url - URL to share (defaults to current URL)
   * @param {string} options.text - Text to share (optional)
   * @param {string} options.hashtags - Comma-separated hashtags (optional, Twitter only)
   */
  share: (options) => {
    const { platform, url = window.location.href, text = '', hashtags = '' } = options;
    
    let shareUrl;
    
    switch (platform.toLowerCase()) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        if (hashtags) shareUrl += `&hashtags=${encodeURIComponent(hashtags)}`;
        break;
        
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
        
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
        
      default:
        // Use Web Share API if available
        if (navigator.share) {
          navigator.share({
            title: document.title,
            text: text,
            url: url
          }).catch(err => console.error('Error sharing:', err));
          return;
        } else {
          console.error('Unsupported sharing platform:', platform);
          return;
        }
    }
    
    // Open share dialog
    window.open(shareUrl, '_blank', 'width=600,height=400');
  },
  
  /**
   * Share a game or high score
   * @param {string} gameId - The ID of the game
   * @param {number} score - The score to share (optional)
   * @param {string} platform - Platform to share on
   */
  shareGame: (gameId, score, platform) => {
    const gameUrl = `${window.location.origin}/games/${gameId}/`;
    const gameTitle = document.querySelector(`[data-game-id="${gameId}"] h2`)?.textContent || 'This awesome game';
    
    let text;
    if (score) {
      text = `I scored ${score} points in ${gameTitle}! Can you beat my score?`;
    } else {
      text = `Check out ${gameTitle} on Arcade Hub!`;
    }
    
    SocialSharing.share({
      platform,
      url: gameUrl,
      text,
      hashtags: 'ArcadeHub,Gaming'
    });
  }
};

// Export objects for use in game files
window.HighScores = HighScores;
window.SocialSharing = SocialSharing;
