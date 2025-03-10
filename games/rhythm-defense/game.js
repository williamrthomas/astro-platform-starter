// Rhythm Defense Game
// Created: 2025-03-09

// Game configuration
const CONFIG = {
    // Game-specific settings
    gameId: 'rhythm-defense',
    title: 'Rhythm Defense',
    difficulty: 'medium',
    gridWidth: 12,
    gridHeight: 8,
    bpm: 120, // Beats per minute
    initialResources: 100,
    initialWave: 1,
    maxWaves: 10
};

// Tower types
const TOWER_TYPES = {
    BEAM: {
        id: 'beam',
        name: 'Beam Tower',
        cost: 20,
        damage: 10,
        range: 4,
        color: '#3B82F6',
        description: 'Fires a beam in a straight line'
    },
    PULSE: {
        id: 'pulse',
        name: 'Pulse Tower',
        cost: 30,
        damage: 8,
        range: 2,
        color: '#8B5CF6',
        description: 'Damages all enemies in range'
    },
    SHIELD: {
        id: 'shield',
        name: 'Shield Tower',
        cost: 25,
        damage: 0,
        range: 1,
        color: '#10B981',
        description: 'Blocks enemies temporarily'
    },
    BOOST: {
        id: 'boost',
        name: 'Boost Tower',
        cost: 15,
        damage: 0,
        range: 1,
        color: '#F59E0B',
        description: 'Enhances adjacent towers'
    }
};

// Enemy types
const ENEMY_TYPES = {
    RUNNER: {
        id: 'runner',
        name: 'Runner',
        health: 30,
        speed: 2,
        color: '#EF4444'
    },
    TANK: {
        id: 'tank',
        name: 'Tank',
        health: 80,
        speed: 0.8,
        color: '#92400E'
    },
    FLYER: {
        id: 'flyer',
        name: 'Flyer',
        health: 40,
        speed: 1.5,
        color: '#06B6D4'
    }
};

// Game state
let gameState = {
    // Game status
    isRunning: false,
    isPaused: false,
    isGameOver: false,
    
    // Player stats
    score: 0,
    resources: CONFIG.initialResources,
    lives: 10,
    combo: 0,
    
    // Game progress
    currentWave: CONFIG.initialWave,
    waveProgress: 0,
    enemiesRemaining: 0,
    
    // Grid and entities
    grid: [],
    towers: [],
    enemies: [],
    projectiles: [],
    effects: [],
    
    // Rhythm system
    beatMarkers: [],
    nextBeatTime: 0,
    beatInterval: 60000 / CONFIG.bpm, // ms between beats
    
    // Selection
    selectedTowerType: null,
    selectedTower: null,
    selectedCell: null,
    
    // Timing
    lastFrameTime: 0,
    elapsedTime: 0
};

// Canvas and context
let canvas, ctx;

// Audio controller
const AudioController = {
    context: null,
    tracks: {},
    effects: {},
    beatCallbacks: [],
    
    init() {
        // Create audio context
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        
        // Load audio files
        this.loadTrack('background', '/games/rhythm-defense/assets/background.mp3');
        this.loadEffect('tower-activate', '/games/rhythm-defense/assets/activate.mp3');
        this.loadEffect('enemy-hit', '/games/rhythm-defense/assets/hit.mp3');
        this.loadEffect('enemy-defeat', '/games/rhythm-defense/assets/defeat.mp3');
        this.loadEffect('perfect', '/games/rhythm-defense/assets/perfect.mp3');
        this.loadEffect('miss', '/games/rhythm-defense/assets/miss.mp3');
        
        // Set up beat detection
        this.setupBeatDetection();
    },
    
    loadTrack(name, url) {
        // Placeholder for loading audio tracks
        console.log(`Loading track: ${name} from ${url}`);
        // In a real implementation, we would load the audio file
        // For now, we'll simulate with a simple oscillator
        const oscillator = this.context.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, this.context.currentTime);
        
        this.tracks[name] = {
            oscillator,
            play: () => {
                console.log(`Playing track: ${name}`);
                // In a real implementation, we would play the audio file
            },
            stop: () => {
                console.log(`Stopping track: ${name}`);
                // In a real implementation, we would stop the audio file
            }
        };
    },
    
    loadEffect(name, url) {
        // Placeholder for loading sound effects
        console.log(`Loading effect: ${name} from ${url}`);
        // In a real implementation, we would load the audio file
        this.effects[name] = {
            play: () => {
                console.log(`Playing effect: ${name}`);
                // In a real implementation, we would play the sound effect
            }
        };
    },
    
    setupBeatDetection() {
        // Set up beat detection based on BPM
        gameState.beatInterval = 60000 / CONFIG.bpm;
        gameState.nextBeatTime = performance.now() + gameState.beatInterval;
    },
    
    onBeat(callback) {
        this.beatCallbacks.push(callback);
    },
    
    update(currentTime) {
        // Check if it's time for a beat
        if (currentTime >= gameState.nextBeatTime) {
            // Trigger beat
            this.triggerBeat();
            
            // Schedule next beat
            gameState.nextBeatTime += gameState.beatInterval;
        }
    },
    
    triggerBeat() {
        // Call all beat callbacks
        this.beatCallbacks.forEach(callback => callback());
        
        // Create a new beat marker
        RhythmSystem.createBeatMarker();
    },
    
    playEffect(name) {
        if (this.effects[name]) {
            this.effects[name].play();
        }
    }
};

// Grid system
const GridSystem = {
    init() {
        // Initialize grid
        gameState.grid = new Array(CONFIG.gridHeight);
        for (let y = 0; y < CONFIG.gridHeight; y++) {
            gameState.grid[y] = new Array(CONFIG.gridWidth).fill(null);
        }
        
        // Set up path for enemies
        this.setupPath();
    },
    
    setupPath() {
        // Define a path for enemies to follow
        // This would be more complex in a real implementation
        gameState.path = [
            { x: 0, y: 3 },
            { x: 3, y: 3 },
            { x: 3, y: 5 },
            { x: 7, y: 5 },
            { x: 7, y: 2 },
            { x: 11, y: 2 }
        ];
    },
    
    getCellSize() {
        // Calculate cell size based on canvas dimensions
        const cellWidth = canvas.width / CONFIG.gridWidth;
        const cellHeight = canvas.height / CONFIG.gridHeight;
        return { width: cellWidth, height: cellHeight };
    },
    
    getCellAtCoords(x, y) {
        const cellSize = this.getCellSize();
        const gridX = Math.floor(x / cellSize.width);
        const gridY = Math.floor(y / cellSize.height);
        
        // Check if within bounds
        if (gridX >= 0 && gridX < CONFIG.gridWidth && gridY >= 0 && gridY < CONFIG.gridHeight) {
            return { x: gridX, y: gridY };
        }
        
        return null;
    },
    
    isCellOnPath(x, y) {
        // Check if the cell is on the enemy path
        return gameState.path.some(point => point.x === x && point.y === y);
    },
    
    isCellOccupied(x, y) {
        // Check if there's already a tower at this position
        return gameState.grid[y][x] !== null;
    },
    
    placeTower(tower, x, y) {
        // Place tower on the grid
        if (this.isCellOnPath(x, y) || this.isCellOccupied(x, y)) {
            return false;
        }
        
        gameState.grid[y][x] = tower;
        tower.x = x;
        tower.y = y;
        gameState.towers.push(tower);
        
        return true;
    },
    
    removeTower(x, y) {
        // Remove tower from the grid
        if (!this.isCellOccupied(x, y)) {
            return false;
        }
        
        const tower = gameState.grid[y][x];
        gameState.grid[y][x] = null;
        
        // Remove from towers array
        const index = gameState.towers.findIndex(t => t.x === x && t.y === y);
        if (index !== -1) {
            gameState.towers.splice(index, 1);
        }
        
        return true;
    },
    
    render() {
        const cellSize = this.getCellSize();
        
        // Draw grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        
        // Draw vertical lines
        for (let x = 0; x <= CONFIG.gridWidth; x++) {
            ctx.beginPath();
            ctx.moveTo(x * cellSize.width, 0);
            ctx.lineTo(x * cellSize.width, canvas.height);
            ctx.stroke();
        }
        
        // Draw horizontal lines
        for (let y = 0; y <= CONFIG.gridHeight; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * cellSize.height);
            ctx.lineTo(canvas.width, y * cellSize.height);
            ctx.stroke();
        }
        
        // Draw path
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        for (let y = 0; y < CONFIG.gridHeight; y++) {
            for (let x = 0; x < CONFIG.gridWidth; x++) {
                if (this.isCellOnPath(x, y)) {
                    ctx.fillRect(
                        x * cellSize.width,
                        y * cellSize.height,
                        cellSize.width,
                        cellSize.height
                    );
                }
            }
        }
        
        // Highlight selected cell
        if (gameState.selectedCell) {
            const { x, y } = gameState.selectedCell;
            ctx.strokeStyle = '#6366F1';
            ctx.lineWidth = 3;
            ctx.strokeRect(
                x * cellSize.width,
                y * cellSize.height,
                cellSize.width,
                cellSize.height
            );
        }
    }
};

// Tower system
const TowerSystem = {
    createTower(type, x, y) {
        // Check if player has enough resources
        if (gameState.resources < TOWER_TYPES[type].cost) {
            console.log('Not enough resources');
            return null;
        }
        
        // Create tower object
        const tower = {
            type: TOWER_TYPES[type],
            x: x,
            y: y,
            level: 1,
            cooldown: 0,
            lastActivated: 0,
            isActive: false,
            activationKey: null
        };
        
        // Assign activation key based on tower count
        tower.activationKey = (gameState.towers.length % 4) + 1;
        
        // Deduct resources
        gameState.resources -= tower.type.cost;
        
        return tower;
    },
    
    activateTower(tower, timingQuality) {
        // Activate tower with timing multiplier
        tower.isActive = true;
        tower.lastActivated = gameState.elapsedTime;
        
        // Calculate damage multiplier based on timing
        let damageMultiplier = 0;
        switch (timingQuality) {
            case 'perfect':
                damageMultiplier = 2.0;
                AudioController.playEffect('perfect');
                break;
            case 'good':
                damageMultiplier = 1.5;
                AudioController.playEffect('tower-activate');
                break;
            case 'miss':
                damageMultiplier = 0.5;
                AudioController.playEffect('miss');
                break;
        }
        
        // Apply damage to enemies based on tower type
        this.applyTowerEffect(tower, damageMultiplier);
        
        // Update combo
        if (timingQuality === 'perfect' || timingQuality === 'good') {
            gameState.combo++;
        } else {
            gameState.combo = 0;
        }
        
        return true;
    },
    
    applyTowerEffect(tower, multiplier) {
        // Apply tower effect based on type
        switch (tower.type.id) {
            case 'beam':
                // Beam tower: damage in a straight line
                this.applyBeamEffect(tower, multiplier);
                break;
            case 'pulse':
                // Pulse tower: damage in area
                this.applyPulseEffect(tower, multiplier);
                break;
            case 'shield':
                // Shield tower: block enemies
                this.applyShieldEffect(tower, multiplier);
                break;
            case 'boost':
                // Boost tower: enhance nearby towers
                this.applyBoostEffect(tower, multiplier);
                break;
        }
    },
    
    applyBeamEffect(tower, multiplier) {
        // Beam tower: damage in a straight line
        // Find enemies in the path of the beam
        const damage = tower.type.damage * multiplier;
        
        // Create beam effect
        const effect = {
            type: 'beam',
            x: tower.x,
            y: tower.y,
            duration: 500, // ms
            startTime: gameState.elapsedTime,
            color: tower.type.color
        };
        
        gameState.effects.push(effect);
        
        // Apply damage to enemies in the path
        // This is a simplified implementation
        gameState.enemies.forEach(enemy => {
            if (enemy.y === tower.y && enemy.x > tower.x) {
                EnemySystem.damageEnemy(enemy, damage);
            }
        });
    },
    
    applyPulseEffect(tower, multiplier) {
        // Pulse tower: damage in area
        const damage = tower.type.damage * multiplier;
        const range = tower.type.range;
        
        // Create pulse effect
        const effect = {
            type: 'pulse',
            x: tower.x,
            y: tower.y,
            duration: 500, // ms
            startTime: gameState.elapsedTime,
            color: tower.type.color,
            range: range
        };
        
        gameState.effects.push(effect);
        
        // Apply damage to enemies in range
        gameState.enemies.forEach(enemy => {
            const dx = enemy.x - tower.x;
            const dy = enemy.y - tower.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance <= range) {
                EnemySystem.damageEnemy(enemy, damage);
            }
        });
    },
    
    applyShieldEffect(tower, multiplier) {
        // Shield tower: block enemies
        const duration = 2000 * multiplier; // ms
        
        // Create shield effect
        const effect = {
            type: 'shield',
            x: tower.x,
            y: tower.y,
            duration: duration,
            startTime: gameState.elapsedTime,
            color: tower.type.color,
            range: tower.type.range
        };
        
        gameState.effects.push(effect);
        
        // Slow down enemies in range
        gameState.enemies.forEach(enemy => {
            const dx = enemy.x - tower.x;
            const dy = enemy.y - tower.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance <= tower.type.range) {
                enemy.slowed = true;
                enemy.slowDuration = duration;
                enemy.slowStartTime = gameState.elapsedTime;
            }
        });
    },
    
    applyBoostEffect(tower, multiplier) {
        // Boost tower: enhance nearby towers
        const duration = 3000 * multiplier; // ms
        
        // Create boost effect
        const effect = {
            type: 'boost',
            x: tower.x,
            y: tower.y,
            duration: duration,
            startTime: gameState.elapsedTime,
            color: tower.type.color,
            range: tower.type.range
        };
        
        gameState.effects.push(effect);
        
        // Boost adjacent towers
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue;
                
                const nx = tower.x + dx;
                const ny = tower.y + dy;
                
                // Check if within grid bounds
                if (nx >= 0 && nx < CONFIG.gridWidth && ny >= 0 && ny < CONFIG.gridHeight) {
                    const neighborTower = gameState.grid[ny][nx];
                    if (neighborTower) {
                        // Apply boost effect
                        neighborTower.boosted = true;
                        neighborTower.boostDuration = duration;
                        neighborTower.boostStartTime = gameState.elapsedTime;
                    }
                }
            }
        }
    },
    
    update(deltaTime) {
        // Update all towers
        gameState.towers.forEach(tower => {
            // Update tower cooldown
            if (tower.cooldown > 0) {
                tower.cooldown -= deltaTime;
            }
            
            // Update active state
            if (tower.isActive && gameState.elapsedTime - tower.lastActivated > 500) {
                tower.isActive = false;
            }
            
            // Update boost effect
            if (tower.boosted && gameState.elapsedTime - tower.boostStartTime > tower.boostDuration) {
                tower.boosted = false;
            }
        });
        
        // Update effects
        gameState.effects = gameState.effects.filter(effect => {
            return gameState.elapsedTime - effect.startTime < effect.duration;
        });
    },
    
    render() {
        const cellSize = GridSystem.getCellSize();
        
        // Draw effects
        gameState.effects.forEach(effect => {
            const progress = (gameState.elapsedTime - effect.startTime) / effect.duration;
            const alpha = 1 - progress;
            
            switch (effect.type) {
                case 'beam':
                    // Draw beam effect
                    ctx.strokeStyle = `${effect.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
                    ctx.lineWidth = cellSize.height * 0.5 * alpha;
                    ctx.beginPath();
                    ctx.moveTo(
                        (effect.x + 0.5) * cellSize.width,
                        (effect.y + 0.5) * cellSize.height
                    );
                    ctx.lineTo(
                        canvas.width,
                        (effect.y + 0.5) * cellSize.height
                    );
                    ctx.stroke();
                    break;
                    
                case 'pulse':
                    // Draw pulse effect
                    ctx.fillStyle = `${effect.color}${Math.floor(alpha * 100).toString(16).padStart(2, '0')}`;
                    ctx.beginPath();
                    ctx.arc(
                        (effect.x + 0.5) * cellSize.width,
                        (effect.y + 0.5) * cellSize.height,
                        effect.range * cellSize.width * progress,
                        0,
                        Math.PI * 2
                    );
                    ctx.fill();
                    break;
                    
                case 'shield':
                    // Draw shield effect
                    ctx.strokeStyle = `${effect.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.arc(
                        (effect.x + 0.5) * cellSize.width,
                        (effect.y + 0.5) * cellSize.height,
                        effect.range * cellSize.width * 0.8,
                        0,
                        Math.PI * 2
                    );
                    ctx.stroke();
                    break;
                    
                case 'boost':
                    // Draw boost effect
                    ctx.fillStyle = `${effect.color}${Math.floor(alpha * 100).toString(16).padStart(2, '0')}`;
                    for (let dy = -1; dy <= 1; dy++) {
                        for (let dx = -1; dx <= 1; dx++) {
                            if (dx === 0 && dy === 0) continue;
                            
                            const nx = effect.x + dx;
                            const ny = effect.y + dy;
                            
                            // Check if within grid bounds
                            if (nx >= 0 && nx < CONFIG.gridWidth && ny >= 0 && ny < CONFIG.gridHeight) {
                                if (gameState.grid[ny][nx]) {
                                    ctx.fillRect(
                                        nx * cellSize.width,
                                        ny * cellSize.height,
                                        cellSize.width,
                                        cellSize.height
                                    );
                                }
                            }
                        }
                    }
                    break;
            }
        });
        
        // Draw towers
        gameState.towers.forEach(tower => {
            // Draw tower base
            ctx.fillStyle = tower.isActive ? '#ffffff' : '#dddddd';
            ctx.fillRect(
                tower.x * cellSize.width + cellSize.width * 0.1,
                tower.y * cellSize.height + cellSize.height * 0.1,
                cellSize.width * 0.8,
                cellSize.height * 0.8
            );
            
            // Draw tower color
            ctx.fillStyle = tower.type.color;
            ctx.beginPath();
            ctx.arc(
                (tower.x + 0.5) * cellSize.width,
                (tower.y + 0.5) * cellSize.height,
                cellSize.width * 0.3,
                0,
                Math.PI * 2
            );
            ctx.fill();
            
            // Draw activation key
            ctx.fillStyle = '#ffffff';
            ctx.font = `${cellSize.width * 0.4}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(
                tower.activationKey,
                (tower.x + 0.5) * cellSize.width,
                (tower.y + 0.5) * cellSize.height
            );
            
            // Draw boost effect
            if (tower.boosted) {
                ctx.strokeStyle = '#F59E0B';
                ctx.lineWidth = 3;
                ctx.strokeRect(
                    tower.x * cellSize.width + cellSize.width * 0.05,
                    tower.y * cellSize.height + cellSize.height * 0.05,
                    cellSize.width * 0.9,
                    cellSize.height * 0.9
                );
            }
        });
    }
};

// Enemy system
const EnemySystem = {
    spawnEnemy(type, pathIndex = 0) {
        // Create enemy object
        const enemyType = ENEMY_TYPES[type];
        const pathPoint = gameState.path[pathIndex];
        
        const enemy = {
            type: enemyType,
            x: pathPoint.x,
            y: pathPoint.y,
            health: enemyType.health,
            maxHealth: enemyType.health,
            speed: enemyType.speed,
            pathIndex: pathIndex,
            progress: 0,
            slowed: false,
            slowDuration: 0,
            slowStartTime: 0
        };
        
        gameState.enemies.push(enemy);
        return enemy;
    },
    
    damageEnemy(enemy, amount) {
        // Apply damage to enemy
        enemy.health -= amount;
        
        // Play hit sound
        AudioController.playEffect('enemy-hit');
        
        // Check if enemy is defeated
        if (enemy.health <= 0) {
            this.defeatEnemy(enemy);
        }
    },
    
    defeatEnemy(enemy) {
        // Remove enemy from array
        const index = gameState.enemies.indexOf(enemy);
        if (index !== -1) {
            gameState.enemies.splice(index, 1);
        }
        
        // Play defeat sound
        AudioController.playEffect('enemy-defeat');
        
        // Add score
        const baseScore = enemy.type.health;
        const comboMultiplier = 1 + (gameState.combo * 0.1);
        const score = Math.floor(baseScore * comboMultiplier);
        
        gameState.score += score;
        
        // Add resources
        gameState.resources += Math.floor(enemy.type.health / 10);
        
        // Create score popup effect
        const cellSize = GridSystem.getCellSize();
        const effect = {
            type: 'score',
            x: enemy.x,
            y: enemy.y,
            value: score,
            duration: 1000,
            startTime: gameState.elapsedTime
        };
        
        gameState.effects.push(effect);
    },
    
    moveEnemy(enemy, deltaTime) {
        // Calculate actual speed (considering slow effect)
        let actualSpeed = enemy.speed;
        if (enemy.slowed && gameState.elapsedTime - enemy.slowStartTime < enemy.slowDuration) {
            actualSpeed *= 0.5;
        } else {
            enemy.slowed = false;
        }
        
        // Move enemy along path
        const currentPoint = gameState.path[enemy.pathIndex];
        const nextPathIndex = enemy.pathIndex + 1;
        
        // Check if we've reached the end of the path
        if (nextPathIndex >= gameState.path.length) {
            // Enemy reached the end, player loses a life
            gameState.lives--;
            
            // Remove enemy
            const index = gameState.enemies.indexOf(enemy);
            if (index !== -1) {
                gameState.enemies.splice(index, 1);
            }
            
            // Check game over
            if (gameState.lives <= 0) {
                gameState.isGameOver = true;
            }
            
            return;
        }
        
        const nextPoint = gameState.path[nextPathIndex];
        
        // Calculate direction and distance
        const dx = nextPoint.x - currentPoint.x;
        const dy = nextPoint.y - currentPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Update progress along current path segment
        enemy.progress += (actualSpeed * deltaTime) / (distance * 1000);
        
        // Check if we've reached the next point
        if (enemy.progress >= 1) {
            enemy.pathIndex = nextPathIndex;
            enemy.progress = 0;
        } else {
            // Interpolate position
            enemy.x = currentPoint.x + dx * enemy.progress;
            enemy.y = currentPoint.y + dy * enemy.progress;
        }
    },
    
    update(deltaTime) {
        // Update all enemies
        gameState.enemies.forEach(enemy => {
            this.moveEnemy(enemy, deltaTime);
        });
    },
    
    render() {
        const cellSize = GridSystem.getCellSize();
        
        // Draw enemies
        gameState.enemies.forEach(enemy => {
            // Draw enemy body
            ctx.fillStyle = enemy.type.color;
            ctx.beginPath();
            ctx.arc(
                (enemy.x + 0.5) * cellSize.width,
                (enemy.y + 0.5) * cellSize.height,
                cellSize.width * 0.3,
                0,
                Math.PI * 2
            );
            ctx.fill();
            
            // Draw health bar
            const healthPercent = enemy.health / enemy.maxHealth;
            const barWidth = cellSize.width * 0.8;
            const barHeight = cellSize.height * 0.1;
            
            // Background
            ctx.fillStyle = '#555555';
            ctx.fillRect(
                enemy.x * cellSize.width + cellSize.width * 0.1,
                enemy.y * cellSize.height + cellSize.height * 0.8,
                barWidth,
                barHeight
            );
            
            // Health
            ctx.fillStyle = healthPercent > 0.5 ? '#10B981' : healthPercent > 0.2 ? '#F59E0B' : '#EF4444';
            ctx.fillRect(
                enemy.x * cellSize.width + cellSize.width * 0.1,
                enemy.y * cellSize.height + cellSize.height * 0.8,
                barWidth * healthPercent,
                barHeight
            );
            
            // Draw slow effect
            if (enemy.slowed) {
                ctx.strokeStyle = '#06B6D4';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(
                    (enemy.x + 0.5) * cellSize.width,
                    (enemy.y + 0.5) * cellSize.height,
                    cellSize.width * 0.4,
                    0,
                    Math.PI * 2
                );
                ctx.stroke();
            }
        });
        
        // Draw score effects
        gameState.effects.forEach(effect => {
            if (effect.type === 'score') {
                const progress = (gameState.elapsedTime - effect.startTime) / effect.duration;
                const alpha = 1 - progress;
                const offsetY = progress * 30; // Move upward as it fades
                
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.font = `${GridSystem.getCellSize().width * 0.3}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(
                    `+${effect.value}`,
                    (effect.x + 0.5) * cellSize.width,
                    (effect.y + 0.5) * cellSize.height - offsetY
                );
            }
        });
    }
};

// Wave system
const WaveSystem = {
    startWave() {
        // Start a new wave
        gameState.waveInProgress = true;
        gameState.enemiesRemaining = this.getWaveEnemyCount(gameState.currentWave);
        
        // Schedule enemy spawns
        this.scheduleEnemySpawns();
        
        console.log(`Starting wave ${gameState.currentWave}`);
    },
    
    scheduleEnemySpawns() {
        // Schedule enemy spawns based on current wave
        const waveConfig = this.getWaveConfig(gameState.currentWave);
        
        // Clear any existing spawn timers
        if (gameState.spawnTimers) {
            gameState.spawnTimers.forEach(timer => clearTimeout(timer));
        }
        
        gameState.spawnTimers = [];
        
        // Schedule enemy spawns
        waveConfig.enemies.forEach(enemyConfig => {
            const spawnTimer = setTimeout(() => {
                const enemy = EnemySystem.spawnEnemy(enemyConfig.type);
                console.log(`Spawned ${enemy.type.name}`);
            }, enemyConfig.delay);
            
            gameState.spawnTimers.push(spawnTimer);
        });
    },
    
    getWaveConfig(waveNumber) {
        // Generate wave configuration based on wave number
        // This would be more complex in a real implementation
        const enemyCount = this.getWaveEnemyCount(waveNumber);
        const enemies = [];
        
        // Generate enemy configurations
        for (let i = 0; i < enemyCount; i++) {
            const delay = i * 2000; // 2 seconds between spawns
            let type;
            
            // Determine enemy type based on wave number and position in wave
            if (waveNumber >= 3 && i % 5 === 0) {
                // Every 5th enemy is a tank in wave 3+
                type = 'TANK';
            } else if (waveNumber >= 5 && i % 7 === 0) {
                // Every 7th enemy is a flyer in wave 5+
                type = 'FLYER';
            } else {
                // Default to runner
                type = 'RUNNER';
            }
            
            enemies.push({
                type,
                delay
            });
        }
        
        return {
            waveNumber,
            enemies
        };
    },
    
    getWaveEnemyCount(waveNumber) {
        // Calculate number of enemies based on wave number
        return 5 + (waveNumber * 2);
    },
    
    checkWaveComplete() {
        // Check if the current wave is complete
        if (gameState.waveInProgress && gameState.enemies.length === 0 && gameState.enemiesRemaining === 0) {
            this.completeWave();
        }
    },
    
    completeWave() {
        // Complete the current wave
        gameState.waveInProgress = false;
        
        // Award bonus resources
        const waveBonus = gameState.currentWave * 10;
        gameState.resources += waveBonus;
        
        console.log(`Wave ${gameState.currentWave} complete! +${waveBonus} resources`);
        
        // Check if all waves are complete
        if (gameState.currentWave >= CONFIG.maxWaves) {
            // Game complete!
            gameState.isGameOver = true;
            gameState.isVictory = true;
        } else {
            // Prepare for next wave
            gameState.currentWave++;
            
            // Show wave complete message
            UISystem.showWaveComplete();
        }
    },
    
    update() {
        // Update wave state
        if (gameState.waveInProgress) {
            // Check if all enemies are defeated
            this.checkWaveComplete();
        }
    }
};

// Rhythm system
const RhythmSystem = {
    init() {
        // Initialize rhythm system
        gameState.beatMarkers = [];
        gameState.nextBeatTime = performance.now() + gameState.beatInterval;
    },
    
    createBeatMarker() {
        // Create a new beat marker
        const marker = {
            time: gameState.elapsedTime,
            position: 0, // 0 to 1, where 1 is at the activation line
            active: true
        };
        
        gameState.beatMarkers.push(marker);
    },
    
    checkTiming(time) {
        // Find the closest beat marker
        let closestMarker = null;
        let closestDistance = Infinity;
        
        gameState.beatMarkers.forEach(marker => {
            // Calculate marker position (0 to 1)
            const markerTime = marker.time;
            const timeSinceBeat = time - markerTime;
            const position = timeSinceBeat / gameState.beatInterval;
            
            // Update marker position
            marker.position = position;
            
            // Check if marker is active and near the activation line
            if (marker.active && position >= 0.7 && position <= 1.3) {
                const distance = Math.abs(position - 1);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestMarker = marker;
                }
            }
        });
        
        // Determine timing quality
        if (closestMarker) {
            closestMarker.active = false; // Prevent reuse
            
            if (closestDistance <= 0.05) {
                return 'perfect';
            } else if (closestDistance <= 0.1) {
                return 'good';
            } else {
                return 'miss';
            }
        }
        
        return 'miss';
    },
    
    update(deltaTime) {
        // Update beat markers
        gameState.beatMarkers = gameState.beatMarkers.filter(marker => {
            // Remove markers that are too old
            return marker.position <= 1.5;
        });
    },
    
    render() {
        // Draw beat timeline
        const timelineY = canvas.height - 50;
        const timelineWidth = canvas.width * 0.8;
        const timelineX = (canvas.width - timelineWidth) / 2;
        
        // Draw timeline background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(timelineX, timelineY - 2, timelineWidth, 4);
        
        // Draw activation line
        ctx.fillStyle = '#EC4899'; // Secondary color
        ctx.fillRect(timelineX + timelineWidth * 0.8, timelineY - 10, 2, 20);
        
        // Draw beat markers
        gameState.beatMarkers.forEach(marker => {
            const position = marker.position;
            
            // Only draw markers that are approaching
            if (position >= 0 && position <= 1.5) {
                const x = timelineX + timelineWidth * (0.8 - (0.8 - position * 0.8));
                
                // Determine color based on position
                let color;
                if (position > 0.95 && position < 1.05) {
                    // Perfect zone
                    color = '#10B981'; // Green
                } else if (position > 0.9 && position < 1.1) {
                    // Good zone
                    color = '#F59E0B'; // Yellow
                } else {
                    // Miss zone
                    color = '#ffffff'; // White
                }
                
                // Draw marker
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(x, timelineY, 6, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        
        // Draw combo counter
        if (gameState.combo > 0) {
            ctx.fillStyle = '#ffffff';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`Combo: ${gameState.combo}x`, canvas.width / 2, timelineY - 20);
        }
    }
};

// UI System
const UISystem = {
    init() {
        // Initialize UI elements
        this.setupTowerButtons();
        this.setupGameControls();
    },
    
    setupTowerButtons() {
        // Create tower selection buttons
        const towerTypes = Object.keys(TOWER_TYPES);
        const container = document.createElement('div');
        container.className = 'tower-buttons';
        container.style.position = 'absolute';
        container.style.bottom = '60px';
        container.style.left = '10px';
        container.style.display = 'flex';
        container.style.gap = '10px';
        
        towerTypes.forEach(type => {
            const tower = TOWER_TYPES[type];
            const button = document.createElement('button');
            button.className = 'tower-button';
            button.style.width = '60px';
            button.style.height = '60px';
            button.style.backgroundColor = tower.color;
            button.style.border = 'none';
            button.style.borderRadius = '8px';
            button.style.color = 'white';
            button.style.fontWeight = 'bold';
            button.style.cursor = 'pointer';
            button.style.display = 'flex';
            button.style.flexDirection = 'column';
            button.style.justifyContent = 'center';
            button.style.alignItems = 'center';
            
            // Tower name
            const name = document.createElement('div');
            name.textContent = tower.name.split(' ')[0]; // Just the first word
            name.style.fontSize = '12px';
            
            // Tower cost
            const cost = document.createElement('div');
            cost.textContent = `${tower.cost}`;
            cost.style.fontSize = '14px';
            
            button.appendChild(name);
            button.appendChild(cost);
            
            // Add click handler
            button.addEventListener('click', () => {
                gameState.selectedTowerType = type;
                
                // Update button styles
                document.querySelectorAll('.tower-button').forEach(btn => {
                    btn.style.border = 'none';
                });
                button.style.border = '3px solid white';
            });
            
            container.appendChild(button);
        });
        
        document.getElementById('game-container').appendChild(container);
    },
    
    setupGameControls() {
        // Create game control buttons
        const container = document.createElement('div');
        container.className = 'game-controls';
        container.style.position = 'absolute';
        container.style.bottom = '60px';
        container.style.right = '10px';
        container.style.display = 'flex';
        container.style.gap = '10px';
        
        // Start wave button
        const startWaveButton = document.createElement('button');
        startWaveButton.className = 'control-button';
        startWaveButton.textContent = 'Start Wave';
        startWaveButton.style.padding = '10px 20px';
        startWaveButton.style.backgroundColor = '#6366F1';
        startWaveButton.style.border = 'none';
        startWaveButton.style.borderRadius = '8px';
        startWaveButton.style.color = 'white';
        startWaveButton.style.fontWeight = 'bold';
        startWaveButton.style.cursor = 'pointer';
        
        startWaveButton.addEventListener('click', () => {
            if (!gameState.waveInProgress) {
                WaveSystem.startWave();
            }
        });
        
        // Pause button
        const pauseButton = document.createElement('button');
        pauseButton.className = 'control-button';
        pauseButton.textContent = 'Pause';
        pauseButton.style.padding = '10px 20px';
        pauseButton.style.backgroundColor = '#EC4899';
        pauseButton.style.border = 'none';
        pauseButton.style.borderRadius = '8px';
        pauseButton.style.color = 'white';
        pauseButton.style.fontWeight = 'bold';
        pauseButton.style.cursor = 'pointer';
        
        pauseButton.addEventListener('click', () => {
            gameState.isPaused = !gameState.isPaused;
            pauseButton.textContent = gameState.isPaused ? 'Resume' : 'Pause';
        });
        
        container.appendChild(startWaveButton);
        container.appendChild(pauseButton);
        
        document.getElementById('game-container').appendChild(container);
    },
    
    showWaveComplete() {
        // Show wave complete message
        const message = document.createElement('div');
        message.className = 'wave-complete';
        message.style.position = 'absolute';
        message.style.top = '50%';
        message.style.left = '50%';
        message.style.transform = 'translate(-50%, -50%)';
        message.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        message.style.color = 'white';
        message.style.padding = '20px';
        message.style.borderRadius = '10px';
        message.style.textAlign = 'center';
        message.style.zIndex = '100';
        
        message.innerHTML = `
            <h2>Wave ${gameState.currentWave - 1} Complete!</h2>
            <p>Get ready for wave ${gameState.currentWave}</p>
            <button id="next-wave-button">Start Next Wave</button>
        `;
        
        document.getElementById('game-container').appendChild(message);
        
        // Add click handler for next wave button
        document.getElementById('next-wave-button').addEventListener('click', () => {
            message.remove();
            WaveSystem.startWave();
        });
    },
    
    showGameOver(isVictory) {
        // Show game over message
        const message = document.createElement('div');
        message.className = 'game-over';
        message.style.position = 'absolute';
        message.style.top = '50%';
        message.style.left = '50%';
        message.style.transform = 'translate(-50%, -50%)';
        message.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        message.style.color = 'white';
        message.style.padding = '20px';
        message.style.borderRadius = '10px';
        message.style.textAlign = 'center';
        message.style.zIndex = '100';
        
        if (isVictory) {
            message.innerHTML = `
                <h2>Victory!</h2>
                <p>You've completed all waves!</p>
                <p>Final Score: ${gameState.score}</p>
                <button id="restart-button">Play Again</button>
            `;
        } else {
            message.innerHTML = `
                <h2>Game Over</h2>
                <p>You were defeated at wave ${gameState.currentWave}</p>
                <p>Final Score: ${gameState.score}</p>
                <button id="restart-button">Try Again</button>
            `;
        }
        
        document.getElementById('game-container').appendChild(message);
        
        // Add click handler for restart button
        document.getElementById('restart-button').addEventListener('click', () => {
            message.remove();
            initGame();
        });
        
        // Check high score
        checkHighScore(gameState.score);
    },
    
    updateHUD() {
        // Update HUD elements
        document.getElementById('resources').textContent = gameState.resources;
        document.getElementById('score').textContent = gameState.score;
        document.getElementById('wave').textContent = `${gameState.currentWave}/${CONFIG.maxWaves}`;
        document.getElementById('lives').textContent = gameState.lives;
    },
    
    render() {
        // Draw HUD
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, 40);
        
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        
        // Resources
        ctx.fillText(`Resources: ${gameState.resources}`, 10, 20);
        
        // Wave
        ctx.textAlign = 'center';
        ctx.fillText(`Wave: ${gameState.currentWave}/${CONFIG.maxWaves}`, canvas.width / 2, 20);
        
        // Score
        ctx.textAlign = 'right';
        ctx.fillText(`Score: ${gameState.score}`, canvas.width - 10, 20);
        
        // Lives
        ctx.fillText(`Lives: ${gameState.lives}`, canvas.width - 150, 20);
        
        // Selected tower info
        if (gameState.selectedTowerType) {
            const tower = TOWER_TYPES[gameState.selectedTowerType];
            
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(10, canvas.height - 40, 200, 30);
            
            ctx.fillStyle = tower.color;
            ctx.textAlign = 'left';
            ctx.fillText(`${tower.name} (${tower.cost})`, 20, canvas.height - 25);
        }
    }
};

// Input handling
function handleInput(event) {
    // Handle keyboard input
    if (gameState.isGameOver || gameState.isPaused) return;
    
    const key = event.key;
    
    // Tower activation keys (1-4)
    if (key >= '1' && key <= '4') {
        const keyNum = parseInt(key);
        
        // Find tower with this activation key
        const tower = gameState.towers.find(t => t.activationKey === keyNum);
        
        if (tower) {
            // Check timing
            const timingQuality = RhythmSystem.checkTiming(gameState.elapsedTime);
            
            // Activate tower
            TowerSystem.activateTower(tower, timingQuality);
        }
    }
}

// Mouse handling
function handleMouseMove(event) {
    // Handle mouse movement
    if (gameState.isGameOver || gameState.isPaused) return;
    
    // Get mouse position relative to canvas
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    // Get cell at mouse position
    const cell = GridSystem.getCellAtCoords(mouseX, mouseY);
    
    // Update selected cell
    gameState.selectedCell = cell;
}

function handleMouseClick(event) {
    // Handle mouse clicks
    if (gameState.isGameOver || gameState.isPaused) return;
    
    // Get mouse position relative to canvas
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    // Get cell at mouse position
    const cell = GridSystem.getCellAtCoords(mouseX, mouseY);
    
    // Check if a tower type is selected
    if (gameState.selectedTowerType && cell) {
        // Try to place tower
        const tower = TowerSystem.createTower(gameState.selectedTowerType, cell.x, cell.y);
        
        if (tower) {
            GridSystem.placeTower(tower, cell.x, cell.y);
        }
    }
}

// Game initialization
function initGame() {
    console.log('Initializing Rhythm Defense...');
    
    // Get canvas and context
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 800;
    canvas.height = 500;
    
    // Reset game state
    gameState = {
        // Game status
        isRunning: true,
        isPaused: false,
        isGameOver: false,
        
        // Player stats
        score: 0,
        resources: CONFIG.initialResources,
        lives: 10,
        combo: 0,
        
        // Game progress
        currentWave: CONFIG.initialWave,
        waveProgress: 0,
        enemiesRemaining: 0,
        waveInProgress: false,
        
        // Grid and entities
        grid: [],
        towers: [],
        enemies: [],
        projectiles: [],
        effects: [],
        
        // Rhythm system
        beatMarkers: [],
        nextBeatTime: 0,
        beatInterval: 60000 / CONFIG.bpm, // ms between beats
        
        // Selection
        selectedTowerType: null,
        selectedTower: null,
        selectedCell: null,
        
        // Timing
        lastFrameTime: 0,
        elapsedTime: 0
    };
    
    // Initialize systems
    GridSystem.init();
    AudioController.init();
    RhythmSystem.init();
    UISystem.init();
    
    // Add event listeners
    document.addEventListener('keydown', handleInput);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleMouseClick);
    
    // Create HUD elements
    createHUD();
    
    // Start game loop
    gameState.lastFrameTime = performance.now();
    requestAnimationFrame(gameLoop);
}

// Create HUD elements
function createHUD() {
    // Create HUD container
    const hud = document.createElement('div');
    hud.id = 'hud';
    hud.style.position = 'absolute';
    hud.style.top = '0';
    hud.style.left = '0';
    hud.style.width = '100%';
    hud.style.padding = '10px';
    hud.style.boxSizing = 'border-box';
    hud.style.display = 'flex';
    hud.style.justifyContent = 'space-between';
    hud.style.color = 'white';
    hud.style.fontFamily = 'Arial, sans-serif';
    hud.style.textShadow = '1px 1px 2px black';
    
    // Resources
    const resources = document.createElement('div');
    resources.innerHTML = `Resources: <span id="resources">${gameState.resources}</span>`;
    
    // Wave
    const wave = document.createElement('div');
    wave.innerHTML = `Wave: <span id="wave">${gameState.currentWave}/${CONFIG.maxWaves}</span>`;
    
    // Score
    const score = document.createElement('div');
    score.innerHTML = `Score: <span id="score">${gameState.score}</span>`;
    
    // Lives
    const lives = document.createElement('div');
    lives.innerHTML = `Lives: <span id="lives">${gameState.lives}</span>`;
    
    // Add elements to HUD
    hud.appendChild(resources);
    hud.appendChild(wave);
    hud.appendChild(score);
    hud.appendChild(lives);
    
    // Add HUD to game container
    document.getElementById('game-container').appendChild(hud);
}

// Main game loop
function gameLoop(timestamp) {
    // Calculate delta time
    const deltaTime = timestamp - gameState.lastFrameTime;
    gameState.lastFrameTime = timestamp;
    
    // Update elapsed time
    gameState.elapsedTime += deltaTime;
    
    // Check if game is running
    if (gameState.isRunning && !gameState.isPaused) {
        // Update game state
        update(deltaTime);
    }
    
    // Render game
    render();
    
    // Check game over
    if (gameState.isGameOver) {
        UISystem.showGameOver(gameState.isVictory);
        return;
    }
    
    // Continue game loop
    requestAnimationFrame(gameLoop);
}

// Update game state
function update(deltaTime) {
    // Update audio controller
    AudioController.update(gameState.elapsedTime);
    
    // Update systems
    RhythmSystem.update(deltaTime);
    TowerSystem.update(deltaTime);
    EnemySystem.update(deltaTime);
    WaveSystem.update();
    
    // Update HUD
    UISystem.updateHUD();
}

// Render game
function render() {
    // Clear canvas
    ctx.fillStyle = '#111827'; // Dark background
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Render systems
    GridSystem.render();
    TowerSystem.render();
    EnemySystem.render();
    RhythmSystem.render();
    UISystem.render();
}

// High score integration
function checkHighScore(score) {
    if (HighScores.isHighScore(CONFIG.gameId, score)) {
        HighScores.showHighScoreForm(CONFIG.gameId, score);
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'game-canvas';
    canvas.width = 800;
    canvas.height = 500;
    canvas.style.display = 'block';
    canvas.style.margin = '0 auto';
    canvas.style.backgroundColor = '#111827';
    
    // Add canvas to game container
    document.getElementById('game-container').appendChild(canvas);
    
    // Initialize game
    initGame();
    
    // Add game instructions
    const instructions = document.querySelector('.controls-info');
    instructions.innerHTML = `
        <h2>How to Play</h2>
        <p>1. Click on the grid to place towers (select tower type from the buttons below)</p>
        <p>2. Press the number keys (1-4) to activate towers when the beat markers align with the activation line</p>
        <p>3. Perfect timing gives 2x damage, good timing gives 1.5x damage</p>
        <p>4. Build a combo by hitting consecutive beats with good or perfect timing</p>
        <p>5. Defend against all 10 waves to win!</p>
    `;
});
