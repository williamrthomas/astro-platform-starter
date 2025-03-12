describe('High Score System', () => {
  let mockLocalStorage;
  
  beforeEach(() => {
    // Create a fresh mock localStorage for each test
    mockLocalStorage = {
      store: {},
      getItem: jest.fn((key) => mockLocalStorage.store[key] || null),
      setItem: jest.fn((key, value) => {
        mockLocalStorage.store[key] = value;
      }),
      removeItem: jest.fn((key) => {
        delete mockLocalStorage.store[key];
      }),
      clear: jest.fn(() => {
        mockLocalStorage.store = {};
      })
    };
    
    // Replace the global localStorage with our mock
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });
  });

  test('should save a new high score', () => {
    const gameId = 'test-game';
    const score = 1000;
    const playerName = 'Player1';
    
    // Save high score
    saveHighScore(gameId, score, playerName);
    
    // Check if localStorage.setItem was called with the right arguments
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
    
    // Get the arguments from the first call
    const key = mockLocalStorage.setItem.mock.calls[0][0];
    const valueStr = mockLocalStorage.setItem.mock.calls[0][1];
    const value = JSON.parse(valueStr);
    
    // Verify the key and value
    expect(key).toBe(`highscore_${gameId}`);
    expect(value).toHaveLength(1);
    expect(value[0].score).toBe(score);
    expect(value[0].playerName).toBe(playerName);
    expect(value[0].date).toBeDefined();
  });

  test('should retrieve high scores', () => {
    const gameId = 'test-game';
    const mockScores = [
      { score: 1000, playerName: 'Player1', date: '2025-03-12' },
      { score: 800, playerName: 'Player2', date: '2025-03-11' }
    ];
    
    // Set up mock data in localStorage
    mockLocalStorage.store[`highscore_${gameId}`] = JSON.stringify(mockScores);
    
    // Retrieve high scores
    const scores = getHighScores(gameId);
    
    // Verify the scores match our mock data
    expect(scores).toEqual(mockScores);
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith(`highscore_${gameId}`);
  });
});

// High score utility functions
function saveHighScore(gameId, score, playerName) {
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
}

function getHighScores(gameId) {
  const key = `highscore_${gameId}`;
  return JSON.parse(localStorage.getItem(key) || '[]');
}
