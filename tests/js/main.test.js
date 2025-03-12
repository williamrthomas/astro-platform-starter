/**
 * @jest-environment jsdom
 */

describe('Game Platform Core Functionality', () => {
  // Set up DOM elements before each test
  beforeEach(() => {
    // Create a mock DOM structure
    document.body.innerHTML = `
      <div id="game-container">
        <div id="game-list"></div>
        <div id="game-details"></div>
      </div>
    `;
    
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn()
      },
      writable: true
    });
  });
  
  test('should display game list correctly', () => {
    // Mock game data
    const games = [
      { id: 'game1', title: 'Game 1', category: 'arcade', description: 'Test game 1' },
      { id: 'game2', title: 'Game 2', category: 'puzzle', description: 'Test game 2' }
    ];
    
    // Create a mock function for displaying games
    const displayGames = (gameList, container) => {
      container.innerHTML = '';
      gameList.forEach(game => {
        const gameElement = document.createElement('div');
        gameElement.classList.add('game-card');
        gameElement.setAttribute('data-game-id', game.id);
        gameElement.innerHTML = `<h3>${game.title}</h3><p>${game.description}</p>`;
        container.appendChild(gameElement);
      });
    };
    
    // Call the function
    const container = document.getElementById('game-list');
    displayGames(games, container);
    
    // Assert that the games are displayed correctly
    const gameCards = document.querySelectorAll('.game-card');
    expect(gameCards.length).toBe(2);
    expect(gameCards[0].querySelector('h3').textContent).toBe('Game 1');
    expect(gameCards[1].querySelector('h3').textContent).toBe('Game 2');
  });
  
  test('should filter games by category', () => {
    // Mock game data
    const games = [
      { id: 'game1', title: 'Game 1', category: 'arcade', description: 'Test game 1' },
      { id: 'game2', title: 'Game 2', category: 'puzzle', description: 'Test game 2' },
      { id: 'game3', title: 'Game 3', category: 'arcade', description: 'Test game 3' }
    ];
    
    // Create a mock function for filtering games
    const filterGamesByCategory = (games, category) => {
      if (!category || category === 'all') {
        return games;
      }
      return games.filter(game => game.category === category);
    };
    
    // Test filtering
    const arcadeGames = filterGamesByCategory(games, 'arcade');
    const puzzleGames = filterGamesByCategory(games, 'puzzle');
    const allGames = filterGamesByCategory(games, 'all');
    
    // Assert that filtering works correctly
    expect(arcadeGames.length).toBe(2);
    expect(arcadeGames[0].id).toBe('game1');
    expect(arcadeGames[1].id).toBe('game3');
    
    expect(puzzleGames.length).toBe(1);
    expect(puzzleGames[0].id).toBe('game2');
    
    expect(allGames.length).toBe(3);
  });
  
  test('should save and load high scores', () => {
    // Mock localStorage implementation
    const localStorageMock = {
      store: {},
      getItem: function(key) {
        return this.store[key] || null;
      },
      setItem: function(key, value) {
        this.store[key] = value.toString();
      },
      clear: function() {
        this.store = {};
      }
    };
    
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock
    });
    
    // Create functions for saving and loading high scores
    const saveHighScore = (gameId, score, playerName) => {
      const key = `highscore_${gameId}`;
      const existingScores = JSON.parse(localStorage.getItem(key) || '[]');
      const newScore = {
        score,
        playerName,
        date: new Date().toISOString().split('T')[0]
      };
      
      existingScores.push(newScore);
      existingScores.sort((a, b) => b.score - a.score);
      
      localStorage.setItem(key, JSON.stringify(existingScores.slice(0, 10)));
      return true;
    };
    
    const getHighScores = (gameId) => {
      const key = `highscore_${gameId}`;
      return JSON.parse(localStorage.getItem(key) || '[]');
    };
    
    // Test saving a high score
    saveHighScore('test-game', 1000, 'Player1');
    saveHighScore('test-game', 1500, 'Player2');
    saveHighScore('test-game', 800, 'Player3');
    
    // Test getting high scores
    const scores = getHighScores('test-game');
    
    // Assert that scores are saved and sorted correctly
    expect(scores.length).toBe(3);
    expect(scores[0].score).toBe(1500);
    expect(scores[0].playerName).toBe('Player2');
    expect(scores[1].score).toBe(1000);
    expect(scores[2].score).toBe(800);
  });
});
