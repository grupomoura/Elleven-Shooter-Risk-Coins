class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        // ============================================
        // LOADING SCREEN (ProgressBar)
        // ============================================
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Background for loading screen
        this.add.rectangle(width / 2, height / 2, width, height, 0x000000);

        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Carregando...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        const percentText = this.make.text({
            x: width / 2,
            y: height / 2,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        const assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        assetText.setOrigin(0.5, 0.5);

        this.load.on('progress', function (value) {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0x00ff00, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
        });

        this.load.on('fileprogress', function (file) {
            assetText.setText('Carregando: ' + file.key);
        });

        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
        });

        // ============================================
        // ASSET LOADING
        // ============================================

        // From IntroScreen
        this.load.audio('introMusic', 'assets/intro.mp3');

        // From Example Scene (Main Game)
        this.load.spritesheet('hero', 'assets/spaceship_spritesheet.png', { frameWidth: 80, frameHeight: 80 });
        this.load.image('max_hero', 'assets/max_hero.gif');
        this.load.image('Cannon_bullet', 'assets/cannom_bullet.png');
        this.load.image('enemy1', 'assets/enemy1.png');
        this.load.image('enemy2', 'assets/enemy2.png');
        this.load.image('enemy3', 'assets/enemy3.png'); // Sub-chief enemy (appears from level 2)
        this.load.image('boss1', 'assets/boss1.png');
        this.load.image('background', 'assets/background.jpg');
        this.load.image('background2', 'assets/background02.jpg');
        this.load.image('background3', 'assets/background03.jpg');
        this.load.image('star', 'assets/life.png');
        // New assets for coins and life
        this.load.image('coin1', 'assets/coin1.png');
        this.load.image('coin2', 'assets/coin2.png');
        this.load.image('coin3', 'assets/coin3.png');
        this.load.image('life', 'assets/bitcoin.png');
        // Boss sprites for all 8 levels
        this.load.image('boss2', 'assets/boss2.png');
        this.load.image('boss3', 'assets/boss3.png');
        this.load.image('boss4', 'assets/boss4.png');
        this.load.image('boss5', 'assets/boss5.png');
        this.load.image('boss6', 'assets/boss6.png');
        this.load.image('boss7', 'assets/boss7.png');
        this.load.image('boss8', 'assets/boss8.png');
        // Final boss spritesheet (4x4 grid, 160x160 per frame)
        this.load.spritesheet('finalboss', 'assets/finalboss_spritesheet.png', {
            frameWidth: 160,
            frameHeight: 160
        });
        // Level-based background music
        this.load.audio('level1-3Music', 'assets/level1-3.mp3');
        this.load.audio('level4-6Music', 'assets/level4-6.mp3');
        this.load.audio('level7-8Music', 'assets/level7-8.mp3');
        this.load.audio('finalLevelMusic', 'assets/finallevel.mp3');
        this.load.audio('finalBossMusic', 'assets/finalboss.mp3');
        this.load.audio('boomSound', 'assets/boom.mp3');
        this.load.audio('hitSound', 'assets/hit.mp3');
        this.load.audio('shieldSound', 'assets/shield.mp3');
        this.load.audio('bellSound', 'assets/bell.mp3');
        this.load.audio('lowBellSound', 'assets/low_bell.mp3');
        this.load.audio('alarmSound', 'assets/alarm.mp3');
        this.load.audio('finalyMusic', 'assets/finaly.mp3');
        this.load.audio('cashSound', 'assets/cash_10.mp3');
        this.load.audio('lifeSound', 'assets/life.mp3');
    }

    create() {
        this.scene.start('IntroScreen');
    }
}

class IntroScreen extends Phaser.Scene {
    constructor() {
        super('IntroScreen');
    }
    preload() {
        // Assets are now loaded in PreloadScene
    }
    create() {
        // Stop any previous sounds and play intro music
        this.sound.stopAll();
        this.introMusic = this.sound.add('introMusic', {
            loop: true,
            volume: 0.7
        });
        this.introMusic.play();

        // Get canvas dimensions for responsive positioning
        const width = this.game.config.width;
        const height = this.game.config.height;
        const centerX = width / 2;
        const isMobile = window.isMobile;

        // Add background
        this.add.rectangle(centerX, height / 2, width, height, 0x000000);

        // Add title - responsive font size
        const titleSize = isMobile ? '48px' : '64px';
        this.add.text(centerX, height * 0.12, 'Star Shooter', {
            fontSize: titleSize,
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Add game instructions - different for mobile vs desktop
        const instructionSize = isMobile ? '18px' : '24px';
        const instructions = isMobile ? [
            'Como Jogar:',
            '- Toque e arraste para mover a nave',
            '- O tiro é automático enquanto toca',
            '- Derrote o Chefe para vencer',
            '- Colete estrelas para melhorar sua arma',
            '',
            'Toque na tela para iniciar o jogo'
        ] : [
            'Como Jogar:',
            '- Use as setas ou WASD para se mover',
            '- Derrote o Chefe para vencer',
            '- Colete estrelas para melhorar sua arma',
            '- Estrelas dão mais pontos em níveis mais altos de arma',
            '',
            'Pressione Qualquer Tecla para iniciar o jogo'
        ];

        let yPosition = height * 0.25;
        const lineSpacing = isMobile ? 32 : 40;
        instructions.forEach(line => {
            this.add.text(centerX, yPosition, line, {
                fontSize: instructionSize,
                fill: '#ffffff'
            }).setOrigin(0.5);
            yPosition += lineSpacing;
        });

        // Add achievements button below the instructions
        const buttonSize = isMobile ? '18px' : '24px';
        const achievementsButton = this.add.text(centerX, yPosition + 20, 'Clique aqui para ver as conquistas', {
            fontSize: buttonSize,
            fill: '#ffffff'
        }).setOrigin(0.5).setInteractive();
        achievementsButton.on('pointerdown', () => {
            this.introMusic.stop();
            this.scene.start('AchievementsScreen');
        });

        // Mobile: tap anywhere (except achievements button) to start
        if (isMobile) {
            this.input.on('pointerdown', (pointer) => {
                // Check if the tap was on the achievements button area
                const buttonBounds = achievementsButton.getBounds();
                if (!buttonBounds.contains(pointer.x, pointer.y)) {
                    this.introMusic.stop();
                    this.scene.start('Example');
                }
            });
        } else {
            // Desktop: keyboard to start
            this.input.keyboard.once('keydown', (event) => {
                if (event.key !== ' ') {
                    this.introMusic.stop();
                    this.scene.start('Example');
                }
            });
            this.input.keyboard.once('keydown-SPACE', () => {
                this.introMusic.stop();
                this.scene.start('Example');
            });
        }
    }
}
class Example extends Phaser.Scene {
    constructor() {
        super('Example');
        this.fireDelay = 120; // Increased by 20% from 100 to 120 milliseconds
        this.lastFired = 0;
        this.score = 0; // Initialize the player's score
        this.applyHorizontalVelocity = false; // Flag to control horizontal velocity
        this.heroDestroyed = false; // New flag to track if hero has been destroyed
        this.gameOver = false; // New flag to track if the game is over
        this.starsCollectedWithoutUpgrade = 0; // New counter for Nuts! achievement
        this.hitsTaken = 0; // New counter for Fallen achievement
        this.weaponUpgraded = false; // Initialize weaponUpgraded property
        this.gameStartTime = 0; // New property to track the game start time
        this.enemiesKilled = 0; // Track number of enemies killed
        this.gameplayStarted = false; // New property to track if gameplay has started
        this.enemy2SpeedMultiplier = 1; // New property to track enemy 2 speed multiplier
        this.lastKillTime = 0; // New property to track the time of the last kill
        this.pacifistAchieved = false; // New property to track if the Pacifist achievement has been achieved
        this.enemyBullets = null; // New property for enemy bullets
        this.enemy2BounceBehavior = false; // New property to track if bounce behavior should be active
        this.enemy2AlwaysBounce = false; // New property to track if enemy 2 should always bounce
        this.spawnEnemy2OnEnemy1Destruction = false; // New property to track if we should spawn enemy 2 on enemy 1 destruction
        this.doubleEnemy2Spawn = false; // New property to track if we should spawn two enemy 2 on enemy 1 destruction
        this.boss1Destroyed = false; // New flag to track if enemy 3 has been destroyed
        this.gameWon = false; // New flag to track if the game has been won
        this.starCounter = 0; // New property to track the number of stars collected
        this.starIcons = []; // New property to store the star icon sprites
        this.enemy2SpawnedCount = 0; // New property to track the number of enemy2 spawned from enemy1
        this.boss1Destroyed = false; // New flag to track if enemy 3 has been destroyed
        this.playerHit = false; // New property to track if the player has been hit
        this.weaponUpgraded = false; // New property to track if the player has received any weapon upgrades
        this.upgradeDuringBossFight = false; // New property to track if an upgrade was acquired during boss fight
        this.enemiesKilledDuringBossFight = 0; // New property to track enemies killed during boss fight
        this.starsCollectedBeforeExpire = 0; // New property to track stars collected before any expire
        this.permanentInvulnerability = false; // New property to track permanent invulnerability
        this.lastStarCollectionTime = 0; // New property to track the last star collection time
        this.timeNearTop = 0; // New property to track time spent near the top of the screen
        this.lastUpdateTime = 0; // New property to track the last update time
        this.pacifistTimer = 0; // New property to track time for Pacifist achievement
        this.pacifistTimerText = null; // New property to store the pacifist timer text object
        this.playerLives = 0; // Extra lives counter
        this.currentLevel = 1; // Current level (1 = first boss, 2 = second boss, etc.)
        this.levelTransitioning = false; // Flag to prevent multiple level transition calls
    }
    create() {
        // Initialize game objects and other elements
        // Add pacifist timer text
        this.pacifistTimerText = this.add.text(16, 80, 'Pacifist: 0s', {
            fontSize: '24px',
            fill: '#fff'
        });

        // Add weapon power text
        this.weaponPowerText = this.add.text(16, 50, 'Weapon Power: 1', {
            fontSize: '24px',
            fill: '#fff'
        });

        // ============================================
        // INPUT HANDLER: Logic moved to update() loop for smoother control
        // ============================================
    }
    initTotalKillCount() {
        let totalKills = localStorage.getItem('totalEnemyKills');
        if (totalKills === null) {
            localStorage.setItem('totalEnemyKills', '0');
            return 0;
        }
        return parseInt(totalKills);
    }
    updateTotalKillCount() {
        let totalKills = this.initTotalKillCount();
        totalKills++;
        localStorage.setItem('totalEnemyKills', totalKills.toString());
        return totalKills;
    }
    preload() {
        // Assets are loaded in PreloadScene
    }
    create() {
        // Reset UI elements that need to be recreated on scene restart
        this.weaponPowerText = null;
        this.starIcons = null; // Reset star icons array

        // Reset game state variables on scene start/restart
        this.gameOver = false;
        this.heroDestroyed = false;
        this.gameWon = false;
        this.boss1Destroyed = false;
        this.levelTransitioning = false; // Reset transition flag for fresh start

        // Check if this is a level progression (coming from previous level)
        const isLevelProgression = this.registry.get('levelProgression');

        if (isLevelProgression) {
            // Restore preserved state from previous level
            this.currentLevel = this.registry.get('currentLevel') || 1;
            this.score = this.registry.get('preservedScore') || 0;
            this.playerLives = this.registry.get('preservedLives') || 0;
            this.starCounter = this.registry.get('preservedStarCounter') || 0;
            this.preservedWeaponPower = this.registry.get('preservedWeaponPower') || 1;
            const preservedTransformed = this.registry.get('preservedTransformed') || false;

            // Clear the flag
            this.registry.set('levelProgression', false);

            this.heroTransformed = preservedTransformed;
        } else {
            // Fresh game start
            this.playerLives = 0;
            this.currentLevel = 1;
            this.score = 0;
            this.starCounter = 0;
            this.heroTransformed = false;
        }

        this.enemyKillCount = 0;

        // Set the game start time
        this.gameStartTime = this.time.now;
        // Initialize lastKillTime at the start of the game
        this.lastKillTime = this.time.now;

        // ============================================
        // BACKGROUND CONFIGURATION
        // Levels 1-3: background.jpg (left, center, right positions)
        // Levels 4-6: background02.jpg (left, center, right positions)
        // Levels 7-8: background03.jpg (left, center positions)
        // ============================================
        const BACKGROUND_CONFIG = {
            1: { image: 'background', offsetX: 0 },      // Left section
            2: { image: 'background', offsetX: 400 },    // Center section
            3: { image: 'background', offsetX: 800 },    // Right section
            4: { image: 'background2', offsetX: 0 },      // Left section
            5: { image: 'background2', offsetX: 400 },    // Center section
            6: { image: 'background2', offsetX: 800 },    // Right section
            7: { image: 'background3', offsetX: 0 },      // Left section
            8: { image: 'background3', offsetX: 400 },    // Center section
            9: { image: 'background3', offsetX: 800 }     // Right section - Final Level
        };

        // Get canvas dimensions for positioning
        const gameWidth = this.game.config.width;
        const gameHeight = this.game.config.height;
        const centerX = gameWidth / 2;
        const centerY = gameHeight / 2;

        const bgConfig = BACKGROUND_CONFIG[this.currentLevel] || BACKGROUND_CONFIG[1];
        this.background = this.add.tileSprite(centerX, centerY, gameWidth, gameHeight, bgConfig.image)
            .setOrigin(0.5)
            .setAlpha(0.4);
        // Set initial X offset to show different part of the background
        this.background.tilePositionX = bgConfig.offsetX;
        // ============================================

        // Initialize enemy kill counter
        this.enemyKillCount = 0;
        // Add the hero sprite to the scene
        // Create a white shield underneath the hero
        this.shield = this.add.circle(centerX, centerY, 28, 0xffffff);
        this.shield.setDepth(0); // Set the depth to 0 to ensure it's drawn underneath

        // ============================================
        // HERO SPRITESHEET ANIMATIONS
        // 4x4 grid (16 frames total, 80x80 each)
        // Row 1 (frames 0-3): Idle/default state
        // Row 2 (frames 4-7): Light thrust (moving down)
        // Row 3 (frames 8-11): Medium thrust (stationary)
        // Row 4 (frames 12-15): Maximum thrust (moving up)
        // ============================================

        // Create hero animations if they don't exist
        if (!this.anims.exists('hero_idle')) {
            this.anims.create({
                key: 'hero_idle',
                frames: this.anims.generateFrameNumbers('hero', { start: 0, end: 3 }),
                frameRate: 8,
                repeat: -1
            });
        }

        if (!this.anims.exists('hero_thrust_light')) {
            this.anims.create({
                key: 'hero_thrust_light',
                frames: this.anims.generateFrameNumbers('hero', { start: 4, end: 7 }),
                frameRate: 10,
                repeat: -1
            });
        }

        if (!this.anims.exists('hero_thrust_medium')) {
            this.anims.create({
                key: 'hero_thrust_medium',
                frames: this.anims.generateFrameNumbers('hero', { start: 8, end: 11 }),
                frameRate: 12,
                repeat: -1
            });
        }

        if (!this.anims.exists('hero_thrust_max')) {
            this.anims.create({
                key: 'hero_thrust_max',
                frames: this.anims.generateFrameNumbers('hero', { start: 12, end: 15 }),
                frameRate: 14,
                repeat: -1
            });
        }

        // ============================================
        // FINAL BOSS SPRITESHEET ANIMATIONS
        // 4x4 grid (16 frames total, 160x160 each)
        // Rows 1-2 (frames 0-7): Ship facing down (towards player)
        // Rows 3-4 (frames 8-15): Ship facing up (away from player)
        // For the boss, we use rows 1-2 as they face the player
        // ============================================
        if (!this.anims.exists('finalboss_idle')) {
            this.anims.create({
                key: 'finalboss_idle',
                frames: this.anims.generateFrameNumbers('finalboss', { start: 0, end: 3 }),
                frameRate: 8,
                repeat: -1
            });
        }

        if (!this.anims.exists('finalboss_thrust')) {
            this.anims.create({
                key: 'finalboss_thrust',
                frames: this.anims.generateFrameNumbers('finalboss', { start: 4, end: 7 }),
                frameRate: 10,
                repeat: -1
            });
        }

        // Add the hero sprite to the scene
        // Position hero in lower third of screen for mobile, center for desktop
        const heroStartY = window.isMobile ? gameHeight * 0.75 : centerY;
        this.hero = this.physics.add.sprite(centerX, heroStartY, 'hero');
        this.hero.setCollideWorldBounds(true);
        this.hero.setDepth(1); // Set the depth to 1 to ensure it's drawn above the shield
        this.hero.setScale(0.8); // Adjust scale for proper size (80x80 * 0.8 = 64x64)

        // Start with idle animation
        this.hero.play('hero_thrust_medium');

        // Initialize or restore weapon power
        if (isLevelProgression) {
            this.hero.weaponPower = this.preservedWeaponPower;

            // NOTE: max_hero transformation disabled - always use spritesheet
            // The heroTransformed flag is no longer used for texture changes
        } else {
            this.hero.weaponPower = 1; // Initialize weapon power to 1
        }

        this.hero.shotsFired = 0; // Always reset shot counter
        // Create cursor keys
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasdKeys = this.input.keyboard.addKeys('W,A,S,D');

        // ============================================
        // DESKTOP CONTROL MODE (Keyboard by default)
        // ============================================
        if (!window.isMobile) {
            // Retrieve persisted input mode or default to 'KEYBOARD'
            this.inputMode = this.registry.get('inputMode') || 'KEYBOARD'; // Options: 'KEYBOARD', 'MOUSE'

            const initialColor = this.inputMode === 'KEYBOARD' ? '#00ff00' : '#00ffff';

            // Instruction Text
            this.controlModeText = this.add.text(16, 80, `Controls: ${this.inputMode} (Press C to switch)`, {
                fontSize: '10px',
                fill: initialColor
            });

            // Toggle Listener
            this.input.keyboard.on('keydown-C', () => {
                this.inputMode = this.inputMode === 'KEYBOARD' ? 'MOUSE' : 'KEYBOARD';
                // Persist the new mode
                this.registry.set('inputMode', this.inputMode);

                const color = this.inputMode === 'KEYBOARD' ? '#00ff00' : '#00ffff';
                this.controlModeText.setText(`Controls: ${this.inputMode} (Press C to switch)`);
                this.controlModeText.setColor(color);
                console.log(`Input Mode switched to: ${this.inputMode}`);
            });
        }

        // ============================================

        // ============================================
        // TEMPORARY: Level change shortcuts for testing
        // Press - to go to previous level, + to go to next level
        // TODO: Remove this block before production release
        // ============================================
        this.input.keyboard.on('keydown-MINUS', () => {
            if (this.currentLevel > 1) {
                this.registry.set('currentLevel', this.currentLevel - 1);
                this.registry.set('preservedScore', this.score);
                this.registry.set('preservedWeaponPower', this.hero.weaponPower);
                this.registry.set('preservedLives', this.playerLives);
                this.registry.set('preservedStarCounter', this.starCounter);
                this.registry.set('preservedTransformed', this.heroTransformed);
                this.registry.set('levelProgression', true);
                console.log(`DEBUG: Changing to level ${this.currentLevel - 1}`);
                this.scene.restart();
            } else {
                console.log('DEBUG: Already at level 1');
            }
        });
        this.input.keyboard.on('keydown-PLUS', () => {
            if (this.currentLevel < 9) {
                this.registry.set('currentLevel', this.currentLevel + 1);
                this.registry.set('preservedScore', this.score);
                this.registry.set('preservedWeaponPower', this.hero.weaponPower);
                this.registry.set('preservedLives', this.playerLives);
                this.registry.set('preservedStarCounter', this.starCounter);
                this.registry.set('preservedTransformed', this.heroTransformed);
                this.registry.set('levelProgression', true);
                console.log(`DEBUG: Changing to level ${this.currentLevel + 1}`);
                this.scene.restart();
            } else {
                console.log('DEBUG: Already at max level (9)');
            }
        });
        // ============================================
        // END TEMPORARY BLOCK
        // ============================================

        // Create player bullets group
        this.playerBullets = this.physics.add.group();
        // Create enemy group
        this.enemies = this.physics.add.group();
        // Create an instance of enemy 1
        this.createEnemyOne();
        // Add score text - responsive font size
        const uiFontSize = window.isMobile ? '16px' : '20px';
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: uiFontSize,
            fill: '#fff'
        });
        // Create enemy 2 after 2 seconds
        this.time.delayedCall(2000, this.createEnemyTwo, [], this);
        // Create enemy 1 after 4 seconds
        this.time.delayedCall(4000, this.createEnemyOne, [], this);
        // Create enemy 2 after 6 seconds
        this.time.delayedCall(6000, this.createEnemyTwo, [], this);
        // Create enemy 1 after 8 seconds
        this.time.delayedCall(8000, this.createEnemyOne, [], this);
        // Start creating enemy 1 every 2 seconds after 10 seconds
        this.time.delayedCall(10000, () => {
            this.time.addEvent({
                delay: 2000,
                callback: () => {
                    const enemy1Count = this.enemies.getChildren().filter(enemy => enemy.texture.key === 'enemy1').length;
                    if (enemy1Count < 15) {
                        this.createEnemyOne();
                    }
                },
                callbackScope: this,
                loop: true
            });
        }, [], this);
        // Create enemy 2 after 10 seconds
        this.time.delayedCall(10000, this.createEnemyTwo, [], this);
        // Start creating enemy 2 every 2 seconds after 16 seconds
        this.time.delayedCall(16000, () => {
            this.time.addEvent({
                delay: 2000,
                callback: this.createEnemyTwo,
                callbackScope: this,
                loop: true
            });
        }, [], this);
        // Start creating enemy 1 every 5 seconds after 15 seconds
        this.time.delayedCall(15000, () => {
            this.time.addEvent({
                delay: 5000,
                callback: () => {
                    const enemy1Count = this.enemies.getChildren().filter(enemy => enemy.texture.key === 'enemy1').length;
                    if (enemy1Count < 15) {
                        this.createEnemyOne();
                    }
                },
                callbackScope: this,
                loop: true
            });
        }, [], this);
        // Start creating additional enemy 2 every 3 seconds after 20 seconds
        this.time.delayedCall(20000, () => {
            this.time.addEvent({
                delay: 3000,
                callback: this.createEnemyTwo,
                callbackScope: this,
                loop: true
            });
        }, [], this);
        // Enable horizontal velocity for enemy 2 after 25 seconds
        this.time.delayedCall(25000, () => {
            this.applyHorizontalVelocity = true;
        }, [], this);
        // Double the speed of enemy 2 after 30 seconds
        this.time.delayedCall(30000, () => {
            this.enemy2SpeedMultiplier = 2;
        }, [], this);
        // Create enemy bullets group
        this.enemyBullets = this.physics.add.group();
        // Start enemy one firing after 35 seconds
        this.time.delayedCall(35000, this.startEnemyOneFiring, [], this);
        // Enable enemy 2 bounce behavior after 40 seconds
        this.time.delayedCall(40000, () => {
            this.enemy2BounceBehavior = true;
        }, [], this);
        // Start creating additional enemy 2 every 3 seconds after 45 seconds
        this.time.delayedCall(45000, () => {
            this.time.addEvent({
                delay: 3000,
                callback: this.createEnemyTwo,
                callbackScope: this,
                loop: true
            });
        }, [], this);
        // Start creating additional enemy 1 every 5 seconds after 50 seconds
        this.time.delayedCall(50000, () => {
            this.time.addEvent({
                delay: 5000,
                callback: this.createEnemyOne,
                callbackScope: this,
                loop: true
            });
        }, [], this);

        // ============================================
        // ENEMY3 SPAWN TIMER (Regular enemy - less frequent)
        // Spawns every 8 seconds, starting 40 seconds into the level
        // ============================================
        this.time.delayedCall(40000, () => {
            this.time.addEvent({
                delay: 8000, // Every 8 seconds (less frequent than enemy2's 3 seconds)
                callback: this.createEnemyThreeRegular,
                callbackScope: this,
                loop: true
            });
        }, [], this);
        // ============================================

        // After 75 seconds, enemy 2 will bounce 50% of the time after reaching the edge of the screen
        this.time.delayedCall(75000, () => {
            this.enemy2BounceBehavior = true;
            this.enemy2BounceChance = 0.5; // 50% chance to bounce
        }, [], this);

        // Enable spawning enemy 2 on enemy 1 destruction after 60 seconds
        this.time.delayedCall(60000, () => {
            this.spawnEnemy2OnEnemy1Destruction = true;
        }, [], this);
        // After 80 seconds, increase the number of enemy 2 spawned when enemy 1 is destroyed
        this.time.delayedCall(80000, () => {
            this.doubleEnemy2Spawn = true;
        }, [], this);
        // Create main boss - 150s for normal levels, 300s for Level 9 (final level)
        const bossSpawnTime = this.currentLevel === 9 ? 300000 : 150000;
        this.time.delayedCall(bossSpawnTime, this.createEnemyThree, [], this);

        // ============================================
        // LEVEL 9 TRANSITION EFFECTS
        // Gradual screen darkening + music change before final boss
        // ============================================
        if (this.currentLevel === 9) {
            // 30 seconds before boss, start transition
            const transitionTime = bossSpawnTime - 30000;
            this.time.delayedCall(transitionTime, () => {
                // Create darkening overlay - dynamic dimensions
                const gw = this.game.config.width;
                const gh = this.game.config.height;
                this.finalBossOverlay = this.add.rectangle(gw / 2, gh / 2, gw, gh, 0x000000, 0);
                this.finalBossOverlay.setDepth(999);

                // Gradual darkening over 15 seconds
                this.tweens.add({
                    targets: this.finalBossOverlay,
                    alpha: 0.35,
                    duration: 15000,
                    ease: 'Power1'
                });

                // 15 seconds before boss, change music
                this.time.delayedCall(15000, () => {
                    // Fade out current music
                    this.tweens.add({
                        targets: this.backgroundMusic,
                        volume: 0,
                        duration: 2000,
                        onComplete: () => {
                            this.backgroundMusic.stop();
                            // Start final boss music
                            this.finalBossMusic = this.sound.add('finalBossMusic', {
                                loop: true,
                                volume: 0
                            });
                            this.finalBossMusic.play();
                            // Fade in new music
                            this.tweens.add({
                                targets: this.finalBossMusic,
                                volume: 0.8,
                                duration: 3000
                            });
                        }
                    });
                }, [], this);
            }, [], this);
        }

        // ============================================
        // SUB-BOSS SPAWN TIMER (Level 2+ only)
        // Uses previous level's boss sprite with its attack patterns
        // Spawns ONCE at 100 seconds into the level (middle of the phase)
        // ============================================
        if (this.currentLevel >= 2) {
            // Sub-boss appears once at 100 seconds
            this.time.delayedCall(100000, () => {
                this.createMiniBoss();
            }, [], this);
        }
        // ============================================

        // After 100 seconds, double enemy 1's firing rate


        this.time.delayedCall(100000, () => {
            this.enemy1FireRateMultiplier = 2;
        }, [], this);
        // After 120 seconds, add two additional enemy 2s that spawn every 2 seconds
        this.time.delayedCall(120000, () => {
            this.time.addEvent({
                delay: 2000,
                callback: () => {
                    this.createEnemyTwo();
                    this.createEnemyTwo();
                },
                callbackScope: this,
                loop: true
            });
        }, [], this);
        // After 130 seconds, enable random chance for enemy 1 to stop moving
        this.time.delayedCall(130000, () => {
            this.enemy1RandomStop = true;
        }, [], this);
        // Create a group for power-ups
        this.powerUps = this.physics.add.group();
        // Initialize the weapon power display
        this.updateWeaponPowerDisplay();
        // Add level-based background music
        // Levels 1-3: level1-3.mp3
        // Levels 4-6: level4-6.mp3
        // Levels 7-8: level7-8.mp3
        // Level 9: finallevel.mp3 (final level)
        let musicKey;
        if (this.currentLevel >= 1 && this.currentLevel <= 3) {
            musicKey = 'level1-3Music';
        } else if (this.currentLevel >= 4 && this.currentLevel <= 6) {
            musicKey = 'level4-6Music';
        } else if (this.currentLevel >= 7 && this.currentLevel <= 8) {
            musicKey = 'level7-8Music';
        } else if (this.currentLevel === 9) {
            musicKey = 'finalLevelMusic';
        } else {
            musicKey = 'level7-8Music';
        }

        // Stop any previous music before starting new one
        this.sound.stopAll();
        this.backgroundMusic = this.sound.add(musicKey, {
            loop: true,
            volume: 0.7
        });
        this.backgroundMusic.play();
        // Initialize or recreate star icons - responsive positioning
        const starStartY = window.isMobile ? 90 : 100;
        const starSpacing = window.isMobile ? 30 : 40;
        if (!this.starIcons) {
            this.starIcons = [];
            for (let i = 0; i < 6; i++) {
                const starIcon = this.add.image(20, starStartY + i * starSpacing, 'star').setScale(window.isMobile ? 0.22 : 0.3);
                starIcon.setAlpha(0.3); // Set initial opacity to 30%
                this.starIcons.push(starIcon);
            }
        }
        // Add invisible game timer
        this.gameTimer = 0;
        this.gameTimerText = this.add.text(this.game.config.width - 20, this.game.config.height - 20, '0:00', {
            fontSize: window.isMobile ? '18px' : '24px',
            fill: '#ffffff'
        });
        this.gameTimerText.setOrigin(1, 1);
        this.gameTimerText.setAlpha(0); // Make the timer invisible

        // Add lives display - responsive positioning
        const livesX = this.game.config.width - (window.isMobile ? 50 : 65);
        this.livesIcon = this.add.image(livesX, 16, 'life').setScale(window.isMobile ? 0.3 : 0.4);
        this.livesIcon.setOrigin(1, 0);
        this.livesText = this.add.text(livesX + 5, 16, 'x' + this.playerLives, {
            fontSize: window.isMobile ? '18px' : '24px',
            fill: '#ff6666'
        }).setOrigin(0, 0);

        // Add level indicator - centered
        this.levelText = this.add.text(this.game.config.width / 2, 16, `Level ${this.currentLevel}`, {
            fontSize: window.isMobile ? '20px' : '28px',
            fill: '#ffff00',
            fontStyle: 'bold'
        }).setOrigin(0.5, 0);

    }

    getDifficultyMultiplier() {
        // Returns progressive difficulty multiplier based on current level
        // Using 10% increase per level for balanced difficulty across 8 levels
        // Level 1: 1.0x, Level 2: 1.1x, Level 3: 1.21x, ..., Level 8: ~1.95x
        return Math.pow(1.10, this.currentLevel - 1);
    }

    createExplosion(x, y, enemyType) {
        const explosion = this.add.group();

        // Progressive particle effects based on enemy type
        let particleCount, particleSizeMin, particleSizeMax, spreadArea, duration, color;

        if (enemyType === 'boss1') {
            // Level 1 boss - red
            particleCount = 60;
            particleSizeMin = 9;
            particleSizeMax = 24;
            spreadArea = 300;
            duration = 2400;
            color = 0xff0000; // Red
        } else if (enemyType === 'boss2') {
            // Level 2 boss - orange
            particleCount = 65;
            particleSizeMin = 10;
            particleSizeMax = 26;
            spreadArea = 320;
            duration = 2600;
            color = 0xff6600; // Orange
        } else if (enemyType === 'boss3') {
            // Level 3 boss - yellow
            particleCount = 70;
            particleSizeMin = 11;
            particleSizeMax = 28;
            spreadArea = 340;
            duration = 2800;
            color = 0xffff00; // Yellow
        } else if (enemyType === 'boss4') {
            // Level 4 boss - green
            particleCount = 75;
            particleSizeMin = 12;
            particleSizeMax = 30;
            spreadArea = 360;
            duration = 3000;
            color = 0x00ff00; // Green
        } else if (enemyType === 'boss5') {
            // Level 5 boss - cyan
            particleCount = 80;
            particleSizeMin = 13;
            particleSizeMax = 32;
            spreadArea = 380;
            duration = 3200;
            color = 0x00ffff; // Cyan
        } else if (enemyType === 'boss6') {
            // Level 6 boss - blue
            particleCount = 85;
            particleSizeMin = 14;
            particleSizeMax = 34;
            spreadArea = 400;
            duration = 3400;
            color = 0x0066ff; // Blue
        } else if (enemyType === 'boss7') {
            // Level 7 boss - purple
            particleCount = 90;
            particleSizeMin = 15;
            particleSizeMax = 36;
            spreadArea = 420;
            duration = 3600;
            color = 0x9900ff; // Purple
        } else if (enemyType === 'boss8') {
            // Level 8 boss - magenta (epic final boss)
            particleCount = 100;
            particleSizeMin = 16;
            particleSizeMax = 40;
            spreadArea = 500;
            duration = 4000;
            color = 0xff00ff; // Magenta
        } else if (enemyType === 'finalboss') {
            // Level 9 FINAL BOSS - Epic gold/white explosion
            particleCount = 200;
            particleSizeMin = 20;
            particleSizeMax = 50;
            spreadArea = 700;
            duration = 6000;
            color = 0xffd700; // Gold
        } else if (enemyType === 'enemy3') {
            // Mini-boss - cyan explosion
            particleCount = 40;
            particleSizeMin = 6;
            particleSizeMax = 16;
            spreadArea = 200;
            duration = 1600;
            color = 0x00ffff; // Cyan
        } else {
            // Regular enemies
            particleCount = 20;
            particleSizeMin = 3;
            particleSizeMax = 8;
            spreadArea = 100;
            duration = 800;
            color = 0xff0000; // Red
        }

        for (let i = 0; i < particleCount; i++) {
            const particle = this.add.circle(x, y, Phaser.Math.Between(particleSizeMin, particleSizeMax), color);
            explosion.add(particle);
            this.tweens.add({
                targets: particle,
                x: particle.x + Phaser.Math.Between(-spreadArea, spreadArea),
                y: particle.y + Phaser.Math.Between(-spreadArea, spreadArea),
                alpha: 0,
                duration: duration,
                ease: 'Power2',
                onComplete: () => {
                    explosion.remove(particle, true, true);
                }
            });
        }
    }

    // Helper function to check if an enemy is a boss
    isBossEnemy(enemy) {
        if (!enemy || !enemy.texture) return false;
        const bossKeys = ['boss1', 'boss2', 'boss3', 'boss4', 'boss5', 'boss6', 'boss7', 'boss8', 'finalboss'];
        return bossKeys.includes(enemy.texture.key);
    }

    createEnemyOne() {
        const enemy1Count = this.enemies.getChildren().filter(enemy => enemy.texture.key === 'enemy1').length;
        if (enemy1Count < 15 && !this.boss1Destroyed) {
            const difficulty = this.getDifficultyMultiplier();
            const enemyOne = this.enemies.create(Phaser.Math.Between(0, 800), 0, 'enemy1');
            enemyOne.setScale(0.3); // Restored original scale

            // Apply difficulty scaling to speed
            const baseSpeed = 100;
            enemyOne.setVelocityY(baseSpeed * difficulty);

            // Add random horizontal movement (drift left/right)
            enemyOne.setVelocityX(Phaser.Math.Between(-50, 50));
            // Apply difficulty scaling to health - base 5 HP
            const baseHealth = 5;
            enemyOne.health = Math.floor(baseHealth * difficulty);
            enemyOne.originalX = enemyOne.x; // Store original X for reference

            // Add periodic direction change for more organic movement
            this.time.addEvent({
                delay: Phaser.Math.Between(1000, 3000),
                callback: () => {
                    if (enemyOne.active) {
                        enemyOne.setVelocityX(Phaser.Math.Between(-60, 60));
                    }
                },
                callbackScope: this,
                loop: true
            });

            if (this.time.now >= 35000) { // Only start firing if 35 seconds have passed
                this.scheduleNextEnemyShot(enemyOne);
            }
            // Check if random stop behavior should be applied
            if (this.enemy1RandomStop && Math.random() < 0.5) { // 50% chance to stop
                this.time.delayedCall(3000, () => {
                    if (enemyOne.active) {
                        enemyOne.setVelocityY(0);
                        // Keep horizontal movement when stopped vertically
                    }
                });
            }
        }
    }
    createEnemyTwo(x = null, y = null) {
        if (!this.boss1Destroyed) {
            const difficulty = this.getDifficultyMultiplier();
            const enemyTwo = this.enemies.create(x || Phaser.Math.Between(0, 800), y || 0, 'enemy2');
            enemyTwo.setScale(0.2); // Set the scale to 20% of original size

            // Apply difficulty scaling to speed
            const baseSpeed = this.enemy2SpeedMultiplier ? 140 : 70;
            enemyTwo.setVelocityY(baseSpeed * difficulty);

            if (this.applyHorizontalVelocity) {
                const horizontalVelocity = Phaser.Math.Between(-100, 100) * difficulty;
                enemyTwo.setVelocityX(horizontalVelocity);
            }

            // Apply difficulty scaling to health (minimum 1)
            enemyTwo.health = Math.max(1, Math.floor(2 * difficulty));
            enemyTwo.lastBounceTime = 0; // Add a property to track the last bounce time
            // Make the enemy invincible for a quarter of a second if it's created from an enemy 1 death
            if (x !== null && y !== null) {
                enemyTwo.isInvincible = true;
                enemyTwo.setAlpha(0.5); // Make it semi-transparent to indicate invincibility
                this.time.delayedCall(250, () => {
                    enemyTwo.isInvincible = false;
                    enemyTwo.setAlpha(1); // Restore full opacity
                });
            }
        }
    }

    // ============================================
    // ENEMY3 - Regular enemy (more resistant than enemy2)
    // Appears from early game but with lower frequency
    // Double the resistance of enemy2
    // ============================================
    createEnemyThreeRegular() {
        const enemy3Count = this.enemies.getChildren().filter(enemy => enemy.texture.key === 'enemy3' && enemy.isRegularEnemy3).length;
        if (enemy3Count < 5 && !this.boss1Destroyed) { // Max 5 enemy3 on screen
            const difficulty = this.getDifficultyMultiplier();
            const enemyThree = this.enemies.create(Phaser.Math.Between(0, 800), 0, 'enemy3');
            enemyThree.setScale(0.5); // Slightly larger than enemy2 (0.2)

            // Speed similar to enemy2
            const baseSpeed = 100;
            enemyThree.setVelocityY(baseSpeed * difficulty);
            enemyThree.setVelocityX(Phaser.Math.Between(-50, 50));

            // Double the health of enemy2 (enemy2 base = 2, enemy3 base = 4)
            enemyThree.health = Math.max(2, Math.floor(5 * difficulty));
            enemyThree.isRegularEnemy3 = true; // Flag to identify as regular enemy (not sub-boss)

            // Random horizontal direction changes
            this.time.addEvent({
                delay: Phaser.Math.Between(1500, 4000),
                callback: () => {
                    if (enemyThree.active) {
                        enemyThree.setVelocityX(Phaser.Math.Between(-70, 70));
                    }
                },
                loop: true
            });

            // ============================================
            // ENEMY3 FIRING - Aimed shots at player
            // Fires every 2-3 seconds with 3-way spread
            // ============================================
            const fireRate = Math.max(1500, 2500 - (this.currentLevel * 100)); // Gets faster at higher levels
            this.time.delayedCall(1000, () => { // Start firing after 1 second
                if (enemyThree.active) {
                    this.startEnemy3Firing(enemyThree, fireRate);
                }
            });
        }
    }

    // Enemy3 regular firing pattern
    startEnemy3Firing(enemy, fireRate) {
        if (!enemy.active) return;

        this.time.addEvent({
            delay: fireRate,
            callback: () => {
                if (enemy.active && this.hero && this.hero.active) {
                    // Aimed shot at player
                    const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.hero.x, this.hero.y);
                    const angleDeg = Phaser.Math.RadToDeg(angle);

                    // Fire 3-way spread aimed at player
                    this.createEnemyBullet(enemy.x, enemy.y + 20, angleDeg);
                    this.createEnemyBullet(enemy.x, enemy.y + 20, angleDeg - 20);
                    this.createEnemyBullet(enemy.x, enemy.y + 20, angleDeg + 20);
                }
            },
            loop: true
        });
    }

    // ============================================
    // SUB-BOSS - Uses previous level's boss sprite
    // Appears only from Level 2, spawns at center,
    // more resistant, larger, uses boss attack patterns
    // ============================================
    createMiniBoss() {
        // Only spawn from level 2 onwards
        if (this.currentLevel < 2 || this.boss1Destroyed) {
            return;
        }

        // Check if a sub-boss already exists to avoid multiple spawns
        const existingSubBoss = this.enemies.getChildren().find(e => e.isSubBoss);
        if (existingSubBoss) {
            return;
        }

        // Use previous level's boss as sub-boss sprite
        const previousBossLevel = this.currentLevel - 1;
        const SUB_BOSS_CONFIG = {
            1: { sprite: 'boss1', patterns: 'level1' },
            2: { sprite: 'boss2', patterns: 'level2' },
            3: { sprite: 'boss3', patterns: 'level3' },
            4: { sprite: 'boss4', patterns: 'level4' },
            5: { sprite: 'boss5', patterns: 'level5' },
            6: { sprite: 'boss6', patterns: 'level6' },
            7: { sprite: 'boss7', patterns: 'level7' }
        };

        const config = SUB_BOSS_CONFIG[previousBossLevel];
        if (!config) {
            console.warn(`No sub-boss config for previous level ${previousBossLevel}`);
            return;
        }

        const difficulty = this.getDifficultyMultiplier();
        const screenWidth = this.sys.game.config.width;

        // Spawn at center of the screen using previous boss sprite
        const subBoss = this.enemies.create(screenWidth / 2, -50, config.sprite);

        // ============================================
        // SUB-BOSS CONFIGURATION - Keep current size
        // ============================================
        const SUB_BOSS_STATS = {
            scale: 0.6,          // Same size as current mini-boss
            baseHealth: 50,      // Much more resistant than regular enemies
            speed: 60,           // Slower movement (menacing presence)
            hitDistance: 70,     // Larger hit area
            scoreValue: 250      // Worth more points
        };
        // ============================================

        subBoss.setScale(SUB_BOSS_STATS.scale);
        subBoss.health = Math.floor(SUB_BOSS_STATS.baseHealth * difficulty);
        subBoss.hitDistance = SUB_BOSS_STATS.hitDistance;
        subBoss.scoreValue = SUB_BOSS_STATS.scoreValue;
        subBoss.isSubBoss = true; // Flag to identify as sub-boss
        subBoss.previousBossLevel = previousBossLevel; // Store which boss this represents

        // Slow downward movement
        subBoss.setVelocityY(SUB_BOSS_STATS.speed * difficulty);

        // Add slight horizontal drift
        subBoss.setVelocityX(Phaser.Math.Between(-30, 30));

        // Play alert sound
        this.sound.play('alarmSound', { volume: 0.2 });

        // Stop after reaching middle area and start attack patterns from previous boss
        this.time.delayedCall(2000, () => {
            if (subBoss.active) {
                subBoss.setVelocityY(0);
                // Start horizontal patrol
                subBoss.setVelocityX(80);

                // Start firing using patterns from when this was the main boss
                this.startSubBossAttack(subBoss, previousBossLevel);
            }
        });

        // Reverse direction when hitting screen edges
        this.time.addEvent({
            delay: 100,
            callback: () => {
                if (subBoss.active) {
                    if (subBoss.x <= 100 || subBoss.x >= 700) {
                        subBoss.setVelocityX(-subBoss.body.velocity.x);
                    }
                }
            },
            loop: true
        });

        console.log(`Sub-Boss spawned at level ${this.currentLevel} using ${config.sprite} sprite`);
    }

    // Start sub-boss attack using the patterns from when it was the main boss
    startSubBossAttack(subBoss, bossLevel) {
        if (!subBoss.active) return;

        // Use the same attack patterns as when this was the main boss
        // Fire rate slightly faster for sub-boss (more aggressive)
        const fireRate = 3500;

        if (bossLevel <= 2) {
            // Levels 1-2 boss patterns (simple 3-way spreads)
            this.time.addEvent({
                delay: fireRate,
                callback: () => {
                    if (subBoss.active) {
                        this.enemyThreeFirePattern(subBoss);
                    }
                },
                loop: true
            });
            this.time.addEvent({
                delay: fireRate + 500,
                callback: () => {
                    if (subBoss.active) {
                        this.enemyThreeFirePatternTwo(subBoss);
                    }
                },
                loop: true
            });
        } else if (bossLevel <= 5) {
            // Levels 3-5 boss patterns (more aggressive)
            this.time.addEvent({
                delay: fireRate,
                callback: () => {
                    if (subBoss.active) {
                        this.enemyFourFirePattern(subBoss);
                    }
                },
                loop: true
            });
            this.time.addEvent({
                delay: fireRate + 500,
                callback: () => {
                    if (subBoss.active) {
                        this.enemyFourFirePatternTwo(subBoss);
                    }
                },
                loop: true
            });
        } else {
            // Levels 6-7 boss patterns (most challenging)
            this.time.addEvent({
                delay: fireRate,
                callback: () => {
                    if (subBoss.active) {
                        this.enemyFiveFirePattern(subBoss);
                    }
                },
                loop: true
            });
            this.time.addEvent({
                delay: fireRate + 500,
                callback: () => {
                    if (subBoss.active) {
                        this.enemyFiveFirePatternTwo(subBoss);
                    }
                },
                loop: true
            });
        }
    }

    // Legacy function kept for compatibility - can be removed later
    startMiniBossFiring(miniBoss, fireRate) {
        if (!miniBoss.active) return;
        this.time.addEvent({
            delay: fireRate,
            callback: () => {
                if (miniBoss.active) {
                    this.miniBossFirePattern(miniBoss);
                }
            },
            loop: true
        });
    }

    miniBossFirePattern(enemy) {
        if (!enemy.active) return;

        // Pattern: 5-way spread + aimed shot at player
        const patterns = [
            () => {
                // 5-way spread downward
                for (let angle = 60; angle <= 120; angle += 15) {
                    this.createEnemyBullet(enemy.x, enemy.y + 30, angle);
                }
            },
            () => {
                // Aimed triple shot at player
                if (this.hero && this.hero.active) {
                    const angleToPlayer = Phaser.Math.Angle.Between(
                        enemy.x, enemy.y, this.hero.x, this.hero.y
                    );
                    const angleDeg = Phaser.Math.RadToDeg(angleToPlayer);
                    this.createEnemyBullet(enemy.x, enemy.y + 30, angleDeg);
                    this.createEnemyBullet(enemy.x, enemy.y + 30, angleDeg - 15);
                    this.createEnemyBullet(enemy.x, enemy.y + 30, angleDeg + 15);
                }
            },
            () => {
                // Circular burst (8 directions)
                for (let i = 0; i < 8; i++) {
                    this.createEnemyBullet(enemy.x, enemy.y + 20, i * 45);
                }
            }
        ];

        // Randomly select a pattern
        const pattern = Phaser.Utils.Array.GetRandom(patterns);
        pattern();
    }
    // ============================================
    // END SUB-BOSS SECTION
    // ============================================

    fireBullet() {
        if (this.hero && this.hero.active) {
            if (!this.gameplayStarted) {
                this.gameplayStarted = true;
                this.gameStartTime = this.time.now;
            }
            this.hero.shotsFired++; // Increment shot counter
            // Fire the main bullet
            this.createBullet(this.hero.x, this.hero.y - 30, 0);
            // Check for additional angled bullets at weapon power 2 or higher
            if (this.hero.weaponPower === 2 && this.hero.shotsFired % 4 === 0) {
                // For weapon power 2, fire both left and right at 30° every fourth shot
                this.createBullet(this.hero.x, this.hero.y - 30, -30);
                this.createBullet(this.hero.x, this.hero.y - 30, 30);
            } else if (this.hero.weaponPower >= 3) {
                if (this.hero.shotsFired % 2 === 0) {
                    // For weapon power 3 and above, fire three bullets every other shot
                    this.createBullet(this.hero.x, this.hero.y - 30, -30);
                    this.createBullet(this.hero.x, this.hero.y - 30, 0);
                    this.createBullet(this.hero.x, this.hero.y - 30, 30);
                }
                if (this.hero.weaponPower >= 4 && this.hero.shotsFired % 4 === 0) {
                    // For weapon power 4 and above, fire additional 90° bullets every fourth shot
                    this.createBullet(this.hero.x, this.hero.y - 30, -90);
                    this.createBullet(this.hero.x, this.hero.y - 30, 90);
                }
                if (this.hero.weaponPower >= 5) {
                    // For weapon power 5 and above, fire a backward bullet on every shot
                    this.createBullet(this.hero.x, this.hero.y + 30, 180);
                }
                if (this.hero.weaponPower >= 6 && this.hero.shotsFired % 4 === 0) {
                    // For weapon power 6 and above, fire a bullet towards a random enemy every fourth shot
                    this.fireAtRandomEnemy();
                }
                if (this.hero.weaponPower >= 7 && this.hero.shotsFired % 2 === 0) {
                    // For weapon power 7 and above, fire a bullet towards a random enemy every other shot
                    this.fireAtRandomEnemy();
                }
                if (this.hero.weaponPower >= 8) {
                    // For weapon power 8 or higher, fire additional 60° bullets on every shot
                    this.createBullet(this.hero.x, this.hero.y - 30, -60);
                    this.createBullet(this.hero.x, this.hero.y - 30, 60);
                }
            }
        }
    }
    fireAtRandomEnemy() {
        const activeEnemies = this.enemies.getChildren().filter(enemy => enemy.active);
        if (activeEnemies.length > 0) {
            const randomEnemy = Phaser.Utils.Array.GetRandom(activeEnemies);
            const angle = Phaser.Math.Angle.Between(this.hero.x, this.hero.y, randomEnemy.x, randomEnemy.y);
            this.createBullet(this.hero.x, this.hero.y, Phaser.Math.RadToDeg(angle));
        }
    }
    checkLevelCompletion() {
        // Check if the player has reached a certain score or completed specific objectives
        if (this.score >= 1000) { // Adjust this condition as needed
            this.scene.start('Level4'); // Transition to Level 4
        }
    }
    createBullet(x, y, angle) {
        const bullet = this.playerBullets.create(x, y, 'Cannon_bullet');
        const radians = Phaser.Math.DegToRad(angle);
        const speed = 600;
        bullet.setVelocity(
            Math.sin(radians) * speed,
            -Math.cos(radians) * speed
        );
        bullet.power = 1; // Set a fixed power value of 1 for all bullets
        bullet.setTint(0xffff00);
    }
    update(time, delta) {
        // Update game timer
        this.gameTimer += delta;
        const seconds = Math.floor(this.gameTimer / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        if (this.gameTimerText) {
            this.gameTimerText.setText(`${minutes}:${remainingSeconds.toString().padStart(2, '0')}`);
        }

        // Check for Pacifist achievement
        if (!this.pacifistAchieved && time - this.lastKillTime >= 20000) {
            this.unlockAchievement('pacifist');
            this.pacifistAchieved = true;
        }

        // Scroll the background vertically only (traditional shmup style)
        if (this.background) {
            this.background.tilePositionY -= 1; // Vertical scroll only
        }
        // Update pacifist timer
        if (!this.pacifistAchieved && this.pacifistTimerText) {
            this.pacifistTimer += delta;
            const pacifistSeconds = Math.floor(this.pacifistTimer / 1000);
            if (pacifistSeconds >= 20) {
                this.unlockAchievement('pacifist');
                this.pacifistAchieved = true;
                this.pacifistTimerText.setColor('#00ff00'); // Change color to green when achieved
            }
        }
        // Update weapon power text
        if (this.weaponPowerText && this.hero) {
            this.weaponPowerText.setText(`Weapon Power: ${this.hero.weaponPower}`);
        }
        // Track time spent near the top of the screen
        if (this.hero && this.hero.active && this.hero.y <= 100) {
            this.timeNearTop += time - this.lastUpdateTime;
            if (this.timeNearTop >= 10000 && !this.flyingBlindAchieved) {
                this.unlockAchievement('flyingBlind');
                this.flyingBlindAchieved = true;
            }
        } else {
            this.timeNearTop = 0;
        }
        this.lastUpdateTime = time;
        // Remove any new NON-BOSS enemies if enemy 3 has been destroyed (game won state)
        // But DON'T destroy boss enemies, as they may be the new level's boss
        if (this.boss1Destroyed && this.gameWon) {
            this.enemies.getChildren().forEach(enemy => {
                if (enemy.active && !this.isBossEnemy(enemy)) {
                    enemy.destroy();
                }
            });
        }

        // DEBUG: Track boss every second
        // if (!this.lastBossDebugTime || time - this.lastBossDebugTime > 1000) {
        //     this.lastBossDebugTime = time;
        //     const bosses = this.enemies.getChildren().filter(e => this.isBossEnemy(e));
        //     if (bosses.length > 0) {
        //         bosses.forEach(b => {
        //             console.log(`DEBUG Boss: active=${b.active}, visible=${b.visible}, alpha=${b.alpha}, x=${b.x}, y=${b.y}, texture=${b.texture.key}, depth=${b.depth}`);
        //         });
        //     } else {
        //         console.log(`DEBUG: No bosses in enemies group. boss1Destroyed=${this.boss1Destroyed}, gameWon=${this.gameWon}, currentLevel=${this.currentLevel}`);
        //     }
        // }


        // Handle boss (any type) horizontal movement
        this.enemies.getChildren().forEach((enemy) => {
            if (this.isBossEnemy(enemy)) {
                if (enemy.health <= enemy.maxHealth / 2 && !enemy.isMovingHorizontally) {
                    enemy.isMovingHorizontally = true;
                    enemy.setVelocityX(enemy.horizontalSpeed);
                }
                // Removed world bounds check and velocity reversal
            }
        });
        // Update shield position and visibility
        if (this.hero && this.hero.active && this.shield) {
            this.shield.x = this.hero.x;
            this.shield.y = this.hero.y;
            this.shield.visible = this.hero.isInvincible || this.permanentInvulnerability;
        }
        // Handle enemy bullets
        const gameWidth = this.game.config.width;
        const gameHeight = this.game.config.height;
        this.enemyBullets.getChildren().forEach((bullet) => {
            if (bullet.y > gameHeight || bullet.y < 0 || bullet.x > gameWidth || bullet.x < 0) {
                bullet.destroy();
            }
            if (this.hero && this.hero.active) {
                const dx = this.hero.x - bullet.x;
                const dy = this.hero.y - bullet.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 30 && !this.hero.isInvincible) {
                    this.damageHero();
                    bullet.destroy();
                }
            }
        });
        if (!this.heroDestroyed) {
            if (this.hero && this.hero.active) {
                const speed = 400;
                // Reset velocity
                this.hero.setVelocity(0);

                // Fire bullet continuously
                if (time > this.lastFired) {
                    this.fireBullet();
                    this.lastFired = time + this.fireDelay;
                }

                // --- KEYBOARD CONTROLS (Desktop Only) ---
                if (!window.isMobile && this.inputMode === 'KEYBOARD') {
                    if (this.cursors.left.isDown || this.wasdKeys.A.isDown) {
                        this.hero.setVelocityX(-speed);
                    } else if (this.cursors.right.isDown || this.wasdKeys.D.isDown) {
                        this.hero.setVelocityX(speed);
                    }
                    if (this.cursors.up.isDown || this.wasdKeys.W.isDown) {
                        this.hero.setVelocityY(-speed);
                    } else if (this.cursors.down.isDown || this.wasdKeys.S.isDown) {
                        this.hero.setVelocityY(speed);
                    }
                }

                // --- TOUCH / MOUSE CONTROLS ---
                const pointer = this.input.activePointer;
                const isTouch = pointer.pointerType === 'touch' || window.isMobile;
                const isMouseMode = !window.isMobile && this.inputMode === 'MOUSE';

                if (isTouch) {
                    // Mobile/Touch: Follow finger only if touching
                    if (pointer.isDown) {
                        this.hero.x = Phaser.Math.Clamp(pointer.x, 40, gameWidth - 40);
                        this.hero.y = Phaser.Math.Clamp(pointer.y, 40, gameHeight - 40);
                    }
                } else if (isMouseMode) {
                    // Desktop Mouse Mode: Follow mouse X and Y
                    this.hero.x = Phaser.Math.Clamp(pointer.x, 0, gameWidth);
                    this.hero.y = Phaser.Math.Clamp(pointer.y, 0, gameHeight);
                }
            }
            // ============================================
            // HERO ANIMATION BASED ON MOVEMENT
            // Only apply if not transformed (using spritesheet)
            // ============================================
            if (!this.heroTransformed && this.hero.anims) {
                const velocityY = this.hero.body.velocity.y;
                const velocityX = this.hero.body.velocity.x;

                if (velocityY < -100) {
                    // Moving up fast - maximum thrust
                    if (this.hero.anims.currentAnim?.key !== 'hero_thrust_max') {
                        this.hero.play('hero_thrust_max');
                    }
                } else if (velocityY < 0) {
                    // Moving up slowly - medium thrust
                    if (this.hero.anims.currentAnim?.key !== 'hero_thrust_medium') {
                        this.hero.play('hero_thrust_medium');
                    }
                } else if (velocityY > 100) {
                    // Moving down fast - idle (no thrust)
                    if (this.hero.anims.currentAnim?.key !== 'hero_idle') {
                        this.hero.play('hero_idle');
                    }
                } else if (velocityY > 0) {
                    // Moving down slowly - light thrust
                    if (this.hero.anims.currentAnim?.key !== 'hero_thrust_light') {
                        this.hero.play('hero_thrust_light');
                    }
                } else if (Math.abs(velocityX) > 0) {
                    // Moving horizontally only - medium thrust
                    if (this.hero.anims.currentAnim?.key !== 'hero_thrust_medium') {
                        this.hero.play('hero_thrust_medium');
                    }
                } else {
                    // Stationary - medium thrust (hovering)
                    if (this.hero.anims.currentAnim?.key !== 'hero_thrust_medium') {
                        this.hero.play('hero_thrust_medium');
                    }
                }
            }
            // ============================================
        }

        // Handle boss (any type) horizontal movement
        this.enemies.getChildren().forEach((enemy) => {
            if (this.isBossEnemy(enemy)) {
                if (enemy.health <= enemy.maxHealth / 2 && !enemy.isMovingHorizontally) {
                    enemy.isMovingHorizontally = true;
                    enemy.setVelocityX(-enemy.horizontalSpeed);
                }
                // Removed world bounds check and velocity reversal
            }
        });
        // Check for hero-enemy collisions
        if (this.hero && this.hero.active) {
            this.enemies.getChildren().forEach((enemy) => {
                if (enemy.active) {
                    const dx = this.hero.x - enemy.x;
                    const dy = this.hero.y - enemy.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (!this.hero.isInvincible) {
                        if ((enemy.texture.key === 'enemy1' && distance < 50) ||
                            (enemy.texture.key === 'enemy2' && distance < 20) ||
                            (enemy.texture.key === 'enemy3' && !enemy.isSubBoss && distance < 25)) {
                            this.damageHero();
                        }
                    }
                }
            });
        }
        // Check for bullet-enemy collisions and off-screen enemies
        this.enemies.getChildren().forEach((enemy) => {
            // Protect bosses AND sub-boss from off-screen destruction (they spawn at y=-100 or y=-50)
            // Regular enemy3 is NOT protected (only isSubBoss enemies are protected)
            const isProtectedEnemy = this.isBossEnemy(enemy) || enemy.isSubBoss;
            if (!isProtectedEnemy && (enemy.y > gameHeight || enemy.y < 0 || enemy.x > gameWidth || enemy.x < 0)) {
                if (enemy.texture.key === 'enemy2' && this.enemy2BounceBehavior && Math.random() < (this.enemy2BounceChance || 0.3)) {
                    // Check if enough time has passed since the last bounce
                    if (time - enemy.lastBounceTime >= 500) { // 500 ms cooldown
                        // Bounce logic for enemy 2
                        if (enemy.y > gameHeight || enemy.y < 0) {
                            enemy.setVelocityY(-enemy.body.velocity.y);
                            // Flip sprite vertically when changing vertical direction  
                            enemy.setFlipY(!enemy.flipY);
                        }
                        if (enemy.x > gameWidth || enemy.x < 0) {
                            enemy.setVelocityX(-enemy.body.velocity.x);
                        }
                        // Ensure the enemy stays within bounds
                        enemy.x = Phaser.Math.Clamp(enemy.x, 0, gameWidth);
                        enemy.y = Phaser.Math.Clamp(enemy.y, 0, gameHeight);
                        // Update the last bounce time
                        enemy.lastBounceTime = time;
                    }
                } else {
                    // Destroy both enemy 1 and enemy 2 (when not bouncing) if they go off-screen
                    enemy.destroy();
                }
            }
            this.playerBullets.getChildren().forEach((bullet) => {
                const dx = enemy.x - bullet.x;
                const dy = enemy.y - bullet.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Determine hit distance based on enemy type
                // Use enemy-specific hitDistance if defined (bosses and mini-boss)
                // Otherwise use default values based on texture key
                let hitDistance = enemy.hitDistance || 50; // Default for regular enemies
                if (this.isBossEnemy(enemy) && !enemy.hitDistance) {
                    hitDistance = 110; // Fallback for bosses without hitDistance
                }
                if (distance < hitDistance) {
                    this.createBulletExplosion(bullet.x, bullet.y);
                    bullet.destroy();
                    enemy.health -= 1; // Always decrease enemy health by 1
                    this.playHitSound(); // Play hit sound
                    // Update health bar for any boss (all 8 levels)
                    if (this.isBossEnemy(enemy)) {
                        this.updateboss1HealthBar(enemy);
                    }
                    if (enemy.health <= 0) {
                        const enemyX = enemy.x;
                        const enemyY = enemy.y;
                        const enemyType = enemy.texture.key;
                        // Store flags before destroying enemy
                        const wasSubBoss = enemy.isSubBoss || false;
                        const wasRegularEnemy3 = enemy.isRegularEnemy3 || false;
                        const wasScoreValue = enemy.scoreValue;
                        enemy.destroy();
                        this.createExplosion(enemyX, enemyY, enemyType);
                        this.playExplosionSound(); // Play explosion sound immediately
                        this.enemiesKilled++;
                        this.enemyKillCount++;
                        this.lastKillTime = this.time.now; // Reset the last kill time
                        // Reset pacifist timer
                        if (!this.pacifistAchieved) {
                            this.pacifistTimer = 0;
                        }
                        // Increment the counter for enemies killed during boss fight
                        if (this.enemies.getChildren().some(e => this.isBossEnemy(e))) {
                            this.enemiesKilledDuringBossFight++;
                        }
                        // Update total kill count
                        const totalKills = this.updateTotalKillCount();
                        if (totalKills >= 10000) {
                            this.unlockAchievement('veteran');
                        }
                        this.checkAchievements();
                        if (enemyType === 'enemy1') {
                            this.score += 20;
                        } else if (enemyType === 'enemy2') {
                            this.score += 10;
                        } else if (enemyType === 'enemy3' && wasRegularEnemy3) {
                            // Regular enemy3 (not sub-boss) - worth more than enemy2
                            this.score += 30;
                            // 40% chance to drop a power-up
                            if (Math.random() < 0.4) {
                                this.spawnPowerUp(enemyX, enemyY);
                            }
                        } else if (wasSubBoss) {
                            // Sub-boss scoring and rewards (uses boss sprite but wasSubBoss flag)
                            this.score += wasScoreValue || 150;
                            // Sub-boss has high chance to drop power-up
                            if (Math.random() < 0.8) {
                                this.spawnPowerUp(enemyX, enemyY);
                            }
                            // Play extra explosion for sub-boss
                            this.time.delayedCall(100, this.playExplosionSound, [], this);
                        } else if (this.isBossEnemy({ texture: { key: enemyType } })) {
                            // Main Boss scoring - progressive points based on level
                            this.unlockAchievement('bossKill');
                            // Handle 'finalboss' texture (Level 9) which doesn't have a number suffix
                            const bossLevel = enemyType === 'finalboss' ? 9 : parseInt(enemyType.replace('boss', ''));
                            this.score += 1000 + ((bossLevel - 1) * 250); // 1000, 1250, 1500, ...
                        }
                        this.scoreText.setText('Score: ' + this.score);
                        // Handle MAIN boss destruction (all 8 bosses) - NOT sub-boss
                        // Sub-boss uses boss sprites but should NOT trigger level completion
                        if (this.isBossEnemy({ texture: { key: enemyType } }) && !wasSubBoss) {
                            this.boss1HealthBar.destroy();
                            this.boss1Destroyed = true;
                            this.enemies.clear(true, true);
                            this.enemyBullets.clear(true, true);
                            this.playSeriesOfExplosions();
                            this.time.delayedCall(2000, this.showWinScreen, [], this);
                        } else if (enemyType === 'enemy1' && !this.boss1Destroyed) {
                            // Play explosion sound again after an eighth of a second
                            this.time.delayedCall(125, this.playExplosionSound, [], this);
                            // 60% chance to drop a star
                            if (Math.random() < 0.6) {
                                this.spawnPowerUp(enemyX, enemyY);
                            }
                            // Spawn enemy 2 at enemy 1's location if the condition is met and limit not reached
                            if (this.spawnEnemy2OnEnemy1Destruction && this.enemy2SpawnedCount < 3) {
                                this.createEnemyTwo(enemyX, enemyY);
                                this.enemy2SpawnedCount++;
                                if (this.doubleEnemy2Spawn && this.enemy2SpawnedCount < 3) {
                                    // Spawn a second enemy 2 with a slight offset
                                    this.createEnemyTwo(enemyX + 20, enemyY + 20);
                                    this.enemy2SpawnedCount++;
                                }
                            }
                        }
                    }
                }
            });
        });

        // Check if the game has been won
        if (this.boss1Destroyed && !this.gameWon) {
            // Do nothing here, as we're using the delayed call to show the win screen
        }
        // Check boss's health and adjust bullet variance
        this.enemies.getChildren().forEach((enemy) => {
            if (this.isBossEnemy(enemy) && enemy.health <= enemy.maxHealth * 0.5 && enemy.bulletVariance === 20) {
                enemy.bulletVariance = 10; // Change to 10 degrees (20 degrees total)
            }
        });
        // Remove bullets that are off-screen
        this.playerBullets.getChildren().forEach((bullet) => {
            if (bullet.y < 0) {
                bullet.destroy();
            }
        });
        // Check for collision between hero and power-ups
        this.physics.overlap(this.hero, this.powerUps, this.collectPowerUp, null, this);
        // Check if any power-ups have gone off-screen
        this.powerUps.getChildren().forEach((powerUp) => {
            if (powerUp.y > this.game.config.height) {
                powerUp.destroy();
                this.starsCollectedBeforeExpire = 0; // Reset the counter when a star goes off-screen
                // Update perfectionist counter text
            }
        });
    }
    collectPowerUp(hero, powerUp) {
        if (powerUp.expirationTimer) {
            powerUp.expirationTimer.remove(false);
        }
        if (powerUp.countdownText) {
            powerUp.countdownText.destroy();
        }
        if (powerUp.countdownEvent) {
            powerUp.countdownEvent.remove();
        }
        // Stop any active tweens on the power-up (fade/blink effects)
        this.tweens.killTweensOf(powerUp);

        const dropType = powerUp.dropType || 'upgrade';
        powerUp.destroy();

        // Handle different drop types
        if (dropType === 'coin') {
            // Coin drop - add score only, no weapon upgrade
            const coinScore = 50 + (25 * hero.weaponPower);
            this.score += coinScore;
            this.scoreText.setText('Score: ' + this.score);
            this.sound.play('cashSound', { volume: 0.4 });
            return;
        }

        if (dropType === 'life') {
            // Life drop - add extra life
            this.playerLives++;
            this.livesText.setText('x' + this.playerLives);
            this.sound.play('lifeSound', { volume: 0.5 });
            return;
        }

        // Upgrade drop (original behavior)
        const starScore = 10 * hero.weaponPower;
        this.score += starScore;
        this.scoreText.setText('Score: ' + this.score);
        this.lastStarCollectionTime = this.time.now;
        let weaponLevelIncreased = false;
        this.starsCollectedBeforeExpire++;

        if (hero.weaponPower < 8) {
            this.starCounter++;
            if (hero.weaponPower < 3) {
                this.starsCollectedWithoutUpgrade++;
            }
            if (this.starCounter === 6) {
                hero.weaponPower++;
                weaponLevelIncreased = true;
                this.weaponUpgraded = true;
                if (this.enemies.getChildren().some(enemy => this.isBossEnemy(enemy))) {
                    this.upgradeDuringBossFight = true;
                }
                this.starCounter = 0;
                this.updateWeaponPowerDisplay();

                // NOTE: max_hero transformation DISABLED
                // Ship now always uses spritesheet animations
                // Original code commented out:
                /*
                // Transform ship to max_hero when reaching weapon power 8
                if (hero.weaponPower === 8 && !this.heroTransformed) {
                    this.heroTransformed = true;
    
                    // Create shield transformation effect
                    const shieldCircle = this.add.circle(hero.x, hero.y, 40, 0xffffff, 0.8);
                    shieldCircle.setDepth(10);
    
                    // Animate shield expanding and fading
                    this.tweens.add({
                        targets: shieldCircle,
                        scaleX: 2.0,
                        scaleY: 2.0,
                        alpha: 0,
                        duration: 600,
                        ease: 'Power2',
                        onComplete: () => shieldCircle.destroy()
                    });
    
                    // Transform ship texture and size
                    hero.setTexture('max_hero');
                    hero.setScale(0.1); // User's preferred size
    
                    this.sound.play('shieldSound', { volume: 0.6 });
                }
                */

                if (this.gameplayStarted && this.time.now - this.gameStartTime <= 21000) {
                    this.unlockAchievement('lucky');
                } else if (!this.gameplayStarted) {
                    this.gameStartTime = this.time.now;
                }
            }
        }

        if (weaponLevelIncreased) {
            this.sound.play('lowBellSound', { volume: 0.5 });
        } else {
            this.sound.play('bellSound', { volume: 0.5 });
        }
        this.updateStarIcons();
        this.checkAchievements();
    }
    updateStarIcons() {
        if (this.hero.weaponPower === 8) {
            // Show all star icons as active when at max weapon power
            for (let i = 0; i < 6; i++) {
                this.starIcons[i].setAlpha(1);
            }
        } else {
            // Show star icons based on the star counter
            for (let i = 0; i < 6; i++) {
                this.starIcons[i].setAlpha(i < this.starCounter ? 1 : 0.3);
            }
        }
    }
    // updatePerfectionistCounter method removed
    updateWeaponPowerDisplay() {
        if (this.weaponPowerText) {
            this.weaponPowerText.setText(`Weapon Power: ${this.hero.weaponPower}`);
        } else {
            this.weaponPowerText = this.add.text(16, 50, `Weapon Power: ${this.hero.weaponPower}`, {
                fontSize: '18px',
                fill: '#fff'
            });
        }
    }
    createBulletExplosion(x, y) {
        const explosion = this.add.group();
        for (let i = 0; i < 5; i++) {
            const particle = this.add.circle(x, y, Phaser.Math.Between(1, 3), 0xffff00);
            explosion.add(particle);
            this.tweens.add({
                targets: particle,
                x: particle.x + Phaser.Math.Between(-20, 20),
                y: particle.y + Phaser.Math.Between(-20, 20),
                alpha: 0,
                duration: 300,
                ease: 'Power2',
                onComplete: () => {
                    explosion.remove(particle, true, true);
                }
            });
        }
    }
    damageHero() {
        if (this.hero && this.hero.active && !this.hero.isInvincible && !this.permanentInvulnerability) {
            this.playerHit = true; // Set the playerHit flag to true
            this.hitsTaken++; // Increment the hits taken counter
            // Check for 'Greedy' achievement
            if (this.time.now - this.lastStarCollectionTime < 333) { // 1/3 of a second is 333 milliseconds
                this.unlockAchievement('greedy');
            }
            // Check if any boss is present in the scene
            const bossPresent = this.enemies.getChildren().some(enemy => this.isBossEnemy(enemy));
            if (bossPresent) {
                this.checkAchievements(); // Check achievements
            }
            if (this.hero.weaponPower === 1) {
                this.destroyHero();
            } else {
                this.hero.weaponPower--;

                // Revert to normal hero sprite if weapon power drops below 8
                if (this.hero.weaponPower < 8 && this.heroTransformed) {
                    this.heroTransformed = false;
                    this.hero.setTexture('hero');
                    this.hero.setScale(1.0); // Reset to default scale
                }

                this.updateWeaponPowerDisplay();
                // Make the hero invincible for 1 second
                this.hero.isInvincible = true;
                this.hero.setAlpha(0.5); // Make the hero semi-transparent to indicate invincibility
                this.playShieldSound(); // Play the shield sound when becoming invincible
                this.time.delayedCall(1000, () => {
                    this.hero.isInvincible = false;
                    this.hero.setAlpha(1); // Restore full opacity
                });
            }
            // Reset star count to zero
            this.starCounter = 0;
            this.updateStarIcons();

            // Check for 'Fallen' achievement
            if (this.hitsTaken === 10) {
                this.unlockAchievement('fallen');
            }
        }
    }
    destroyHero() {
        if (this.hero && this.hero.active) {
            const heroX = this.hero.x;
            const heroY = this.hero.y;

            // Check if player has extra lives
            if (this.playerLives > 0) {
                // Use an extra life - respawn
                this.playerLives--;
                this.livesText.setText('x' + this.playerLives);

                // Create explosion effect
                this.createExplosion(heroX, heroY, 'hero');
                this.playExplosionSound();

                // Respawn hero at bottom center with invincibility
                this.hero.x = 400;
                this.hero.y = 500;
                this.hero.weaponPower = 1;
                this.starCounter = 0;
                this.updateWeaponPowerDisplay();
                this.updateStarIcons();

                // Make hero invincible for 3 seconds after respawn
                this.hero.isInvincible = true;
                this.hero.setAlpha(0.5);
                this.playShieldSound();

                this.time.delayedCall(3000, () => {
                    if (this.hero && this.hero.active) {
                        this.hero.isInvincible = false;
                        this.hero.setAlpha(1);
                    }
                });
                return; // Don't show game over
            }

            // No extra lives - game over
            this.createExplosion(heroX, heroY, 'hero');
            this.hero.setActive(false).setVisible(false);
            this.heroDestroyed = true;
            this.gameOver = true;
            this.input.keyboard.enabled = false;
            this.playExplosionSound();

            this.time.delayedCall(1000, () => {
                const gw = this.game.config.width;
                const gh = this.game.config.height;
                const centerX = gw / 2;
                const centerY = gh / 2;
                const isMobile = window.isMobile;

                const overlay = this.add.rectangle(centerX, centerY, gw, gh, 0x000000, 0.7);
                overlay.setDepth(1000);
                this.add.text(centerX, centerY, 'Game Over', {
                    fontSize: isMobile ? '48px' : '64px',
                    fill: '#fff'
                }).setOrigin(0.5).setDepth(1001);
                this.add.text(centerX, centerY + 50, isMobile ? 'Toque para reiniciar' : 'Pressione qualquer tecla para reiniciar', {
                    fontSize: isMobile ? '18px' : '24px',
                    fill: '#fff'
                }).setOrigin(0.5).setDepth(1001);
                this.input.keyboard.enabled = true;

                // Support both keyboard and touch for restart
                this.input.keyboard.once('keydown', () => {
                    this.scene.start('IntroScreen');
                });
                if (isMobile) {
                    this.input.once('pointerdown', () => {
                        this.scene.start('IntroScreen');
                    });
                }
            }, [], this);
        }
    }
    startEnemyOneFiring() {
        this.enemies.getChildren().forEach((enemy) => {
            if (enemy.texture.key === 'enemy1' && enemy.active) {
                this.scheduleNextEnemyShot(enemy);
            }
        });
    }
    scheduleNextEnemyShot(enemy) {
        if (enemy.active && enemy.texture.key === 'enemy1') {
            let delay = Phaser.Math.Between(3000, 10000); // Random delay between 3 and 10 seconds
            if (this.enemy1FireRateMultiplier) {
                delay = Math.floor(delay / this.enemy1FireRateMultiplier);
            }
            this.time.delayedCall(delay, () => {
                this.enemyOneFire(enemy);
                this.scheduleNextEnemyShot(enemy); // Schedule the next shot
            }, [], this);
        }
    }
    enemyOneFire(enemy) {
        if (enemy.active && this.hero && this.hero.active) {
            // Add shake/tremble effect before firing
            const originalX = enemy.x;
            const originalY = enemy.y;
            const shakeDuration = 200;
            const shakeIntensity = 3;

            // Create shake effect using tweens
            this.tweens.add({
                targets: enemy,
                x: originalX + shakeIntensity,
                duration: 25,
                yoyo: true,
                repeat: 3,
                ease: 'Sine.easeInOut',
                onComplete: () => {
                    if (enemy.active && this.hero && this.hero.active) {
                        // Fire bullet from enemy's current position
                        const bullet = this.enemyBullets.create(enemy.x, enemy.y + 30, 'Cannon_bullet');
                        bullet.setTint(0xff0000); // Make enemy bullets red
                        const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.hero.x, this.hero.y);

                        // Apply difficulty scaling to bullet speed
                        const difficulty = this.getDifficultyMultiplier();
                        this.physics.velocityFromRotation(angle, 200 * difficulty, bullet.body.velocity);
                    }
                }
            });
        }
    }
    createEnemyThree() {
        const screenWidth = this.sys.game.config.width;

        // ============================================
        // BOSS CONFIGURATION - Adjust these values for fine-tuning
        // sprite: Texture key for the boss
        // health: Base HP of the boss (10% increase per level)
        // scale: Visual size of the boss sprite
        // hitDistance: Radius in pixels for bullet collision detection
        // isAnimated: Whether the boss uses spritesheet animation
        // ============================================
        const BOSS_CONFIG = {
            1: { sprite: 'boss1', health: 100, scale: 0.7, hitDistance: 100 },
            2: { sprite: 'boss2', health: 110, scale: 0.7, hitDistance: 110 },
            3: { sprite: 'boss3', health: 121, scale: 0.7, hitDistance: 110 },
            4: { sprite: 'boss4', health: 133, scale: 0.65, hitDistance: 105 },
            5: { sprite: 'boss5', health: 146, scale: 0.65, hitDistance: 105 },
            6: { sprite: 'boss6', health: 161, scale: 0.6, hitDistance: 100 },
            7: { sprite: 'boss7', health: 177, scale: 0.6, hitDistance: 100 },
            8: { sprite: 'boss8', health: 195, scale: 0.55, hitDistance: 95 },
            9: { sprite: 'finalboss', health: 300, scale: 1, hitDistance: 120, isAnimated: true }
        };
        // ============================================

        const config = BOSS_CONFIG[this.currentLevel] || BOSS_CONFIG[1];
        const bossSprite = config.sprite;
        const baseHealth = config.health;
        const bossScale = config.scale;

        // Create boss - use sprite for static, spritesheet for animated
        let enemyThree;
        if (config.isAnimated) {
            // Level 9: Animated final boss (clone of hero, 3x larger)
            enemyThree = this.physics.add.sprite(screenWidth / 2, -200, bossSprite);
            this.enemies.add(enemyThree);
            enemyThree.play('finalboss_thrust'); // Start with thrust animation
            enemyThree.isFinalBoss = true; // Mark as final boss for special handling
        } else {
            // Normal levels: Static boss sprite
            enemyThree = this.enemies.create(screenWidth / 2, -100, bossSprite);
        }

        if (!enemyThree) {
            console.error(`Failed to create boss for level ${this.currentLevel}`);
            return;
        }

        // Debug logging
        console.log(`Boss created: Level ${this.currentLevel}, Sprite: ${bossSprite}, Scale: ${bossScale}`);
        console.log(`Boss position: x=${enemyThree.x}, y=${enemyThree.y}`);
        console.log(`Boss texture loaded:`, enemyThree.texture.key);

        enemyThree.setScale(bossScale);

        // Ensure the boss is visible and properly configured
        enemyThree.setVisible(true);
        enemyThree.setAlpha(1);
        enemyThree.setDepth(100); // Make sure it's above other sprites

        // DEBUG: Verify boss still exists after short delay
        this.time.delayedCall(100, () => {
            console.log(`DEBUG 100ms: boss active=${enemyThree.active}, exists in group=${this.enemies.contains(enemyThree)}`);
        });
        this.time.delayedCall(500, () => {
            console.log(`DEBUG 500ms: boss active=${enemyThree.active}, exists in group=${this.enemies.contains(enemyThree)}`);
            if (enemyThree.active) {
                console.log(`DEBUG 500ms: boss x=${enemyThree.x}, y=${enemyThree.y}, visible=${enemyThree.visible}`);
            }
        });

        enemyThree.setVelocityY(100); // Set initial downward velocity
        enemyThree.health = baseHealth;
        enemyThree.maxHealth = baseHealth;
        enemyThree.bossLevel = this.currentLevel; // Store boss level for pattern selection
        enemyThree.hitDistance = config.hitDistance; // Store hitDistance for collision detection
        enemyThree.bulletVariance = 20;
        enemyThree.fireDelay = 1000;
        enemyThree.isMovingHorizontally = false;
        enemyThree.horizontalSpeed = 150;

        // Play the alarm sound when enemy 3 is created
        this.sound.play('alarmSound', {
            volume: 0.3
        });

        // Stop the enemy after 2 seconds and start movement behavior
        this.time.delayedCall(2000, () => {
            if (enemyThree.active) {
                enemyThree.setVelocityY(0);

                // Level 9: Special intelligent movement (like a PvP clone)
                if (this.currentLevel === 9) {
                    // Start AI behavior for final boss
                    this.startFinalBossAI(enemyThree);
                } else {
                    // Normal bosses: slow horizontal movement
                    this.time.delayedCall(500, () => {
                        if (enemyThree.active) {
                            enemyThree.isMovingHorizontally = true;
                            enemyThree.setVelocityX(60);
                        }
                    });
                }
            }
        }, [], this);
        // Create the health bar
        this.boss1HealthBar = this.add.graphics();
        this.updateboss1HealthBar(enemyThree);

        // Start firing patterns based on boss level
        // Levels 1-2: Simple patterns (enemyThree patterns)
        // Levels 3-5: Medium patterns (enemyFour patterns)
        // Levels 6-8: Hard patterns (enemyFive patterns)
        // Fire rate decreases (faster) as level increases
        const baseDelay = Math.max(3000, 6000 - (this.currentLevel * 400)); // 5600ms to 2800ms

        if (this.currentLevel <= 2) {
            // Levels 1-2: Simple 3-way spread patterns
            this.time.delayedCall(baseDelay, () => {
                if (enemyThree.active) this.enemyThreeFirePattern(enemyThree);
            }, [], this);
            this.time.delayedCall(baseDelay + 200, () => {
                if (enemyThree.active) this.enemyThreeFirePatternTwo(enemyThree);
            }, [], this);
            this.time.delayedCall(baseDelay + 400, () => {
                if (enemyThree.active) this.enemyThreeFirePatternThree(enemyThree);
            }, [], this);
            this.time.delayedCall(baseDelay + 600, () => {
                if (enemyThree.active) this.enemyThreeFirePatternFour(enemyThree);
            }, [], this);
        } else if (this.currentLevel <= 5) {
            // Levels 3-5: Medium aggressive patterns
            this.time.delayedCall(baseDelay, () => {
                if (enemyThree.active) this.enemyFourFirePattern(enemyThree);
            }, [], this);
            this.time.delayedCall(baseDelay + 200, () => {
                if (enemyThree.active) this.enemyFourFirePatternTwo(enemyThree);
            }, [], this);
            this.time.delayedCall(baseDelay + 400, () => {
                if (enemyThree.active) this.enemyFourFirePatternThree(enemyThree);
            }, [], this);
            this.time.delayedCall(baseDelay + 600, () => {
                if (enemyThree.active) this.enemyFourFirePatternFour(enemyThree);
            }, [], this);
        } else if (this.currentLevel <= 8) {
            // Levels 6-8: Most challenging patterns
            this.time.delayedCall(baseDelay, () => {
                if (enemyThree.active) this.enemyFiveFirePattern(enemyThree);
            }, [], this);
            this.time.delayedCall(baseDelay + 150, () => {
                if (enemyThree.active) this.enemyFiveFirePatternTwo(enemyThree);
            }, [], this);
            this.time.delayedCall(baseDelay + 300, () => {
                if (enemyThree.active) this.enemyFiveFirePatternThree(enemyThree);
            }, [], this);
            this.time.delayedCall(baseDelay + 450, () => {
                if (enemyThree.active) this.enemyFiveFirePatternFour(enemyThree);
            }, [], this);
            this.time.delayedCall(baseDelay + 600, () => {
                if (enemyThree.active) this.enemyFiveFirePatternFive(enemyThree);
            }, [], this);
        } else if (this.currentLevel === 9) {
            // Level 9: FINAL BOSS - Directed attacks at player (like a PvP clone)
            // Single focused attack pattern with intervals
            this.time.delayedCall(baseDelay, () => {
                if (enemyThree.active) this.finalBossDirectedAttack(enemyThree);
            }, [], this);
        }

        // Set up horizontal movement behavior
        this.time.addEvent({
            delay: 100, // Check every 100ms
            callback: () => {
                if (enemyThree.active && enemyThree.isMovingHorizontally && !enemyThree.hasReversed) {
                    enemyThree.hasReversed = true;
                    this.time.delayedCall(2500, () => {
                        if (enemyThree.active) {
                            this.reverseEnemyThreeDirection(enemyThree);
                            // Set up repeating timer to reverse direction every 5 seconds
                            this.time.addEvent({
                                delay: 5000,
                                callback: () => {
                                    if (enemyThree.active) {
                                        this.reverseEnemyThreeDirection(enemyThree);
                                    }
                                },
                                loop: true
                            });
                        }
                    });
                }
            },
            loop: true
        });
    }

    reverseEnemyThreeDirection(enemy) {
        enemy.setVelocityX(-enemy.body.velocity.x);
    }
    enemyThreeFirePattern(enemy) {
        if (enemy.active) {
            // Fire three bullets: straight down, 45° left, and 45° right
            this.createEnemyBullet(enemy.x, enemy.y, 90); // Straight down
            this.createEnemyBullet(enemy.x, enemy.y, 135); // 45° to the left
            this.createEnemyBullet(enemy.x, enemy.y, 45); // 45° to the right
            // Reset the timer for the next firing
            this.time.delayedCall(5000, () => {
                this.enemyThreeFirePattern(enemy);
            }, [], this);
        }
    }
    enemyThreeFirePatternTwo(enemy) {
        if (enemy.active) {
            // Fire three bullets: straight down, 45° left, and 45° right
            this.createEnemyBullet(enemy.x, enemy.y, 90); // Straight down
            this.createEnemyBullet(enemy.x, enemy.y, 135); // 45° to the left
            this.createEnemyBullet(enemy.x, enemy.y, 45); // 45° to the right
            // Reset the timer for the next firing
            this.time.delayedCall(5000, () => {
                this.enemyThreeFirePatternTwo(enemy);
            }, [], this);
        }
    }
    enemyThreeFirePatternThree(enemy) {
        if (enemy.active) {
            // Fire three bullets: straight down, 45° left, and 45° right
            this.createEnemyBullet(enemy.x, enemy.y, 90); // Straight down
            this.createEnemyBullet(enemy.x, enemy.y, 135); // 45° to the left
            this.createEnemyBullet(enemy.x, enemy.y, 45); // 45° to the right
            // Reset the timer for the next firing
            this.time.delayedCall(5000, () => {
                this.enemyThreeFirePatternThree(enemy);
            }, [], this);
        }
    }
    enemyThreeFirePatternFour(enemy) {
        if (enemy.active) {
            // Fire three bullets: straight down, 45° left, and 45° right
            this.createEnemyBullet(enemy.x, enemy.y, 90); // Straight down
            this.createEnemyBullet(enemy.x, enemy.y, 135); // 45° to the left
            this.createEnemyBullet(enemy.x, enemy.y, 45); // 45° to the right
            // Reset the timer for the next firing
            this.time.delayedCall(5000, () => {
                this.enemyThreeFirePatternFour(enemy);
            }, [], this);
        }
    }
    enemyThreeFirePatternFive(enemy) {
        if (enemy.active) {
            // Fire three bullets: straight down, 45° left, and 45° right
            this.createEnemyBullet(enemy.x, enemy.y, 90); // Straight down
            this.createEnemyBullet(enemy.x, enemy.y, 135); // 45° to the left
            this.createEnemyBullet(enemy.x, enemy.y, 45); // 45° to the right
            // Reset the timer for the next firing
            this.time.delayedCall(5000, () => {
                this.enemyThreeFirePatternFive(enemy);
            }, [], this);
        }
    }
    enemyThreeFirePatternSix(enemy) {
        if (enemy.active) {
            // Fire three bullets: straight down, 45° left, and 45° right
            this.createEnemyBullet(enemy.x, enemy.y, 90); // Straight down
            this.createEnemyBullet(enemy.x, enemy.y, 135); // 45° to the left
            this.createEnemyBullet(enemy.x, enemy.y, 45); // 45° to the right
            // Reset the timer for the next firing
            this.time.delayedCall(5000, () => {
                this.enemyThreeFirePatternSix(enemy);
            }, [], this);
        }
    }

    // LEVEL 2 BOSS (boss2) ATTACK PATTERNS - More aggressive
    enemyFourFirePattern(enemy) {
        if (enemy.active) {
            // 5-bullet spread pattern (more bullets than Level 1)
            this.createEnemyBullet(enemy.x, enemy.y, 60);  // Far right
            this.createEnemyBullet(enemy.x, enemy.y, 75);  // Right
            this.createEnemyBullet(enemy.x, enemy.y, 90);  // Center
            this.createEnemyBullet(enemy.x, enemy.y, 105); // Left
            this.createEnemyBullet(enemy.x, enemy.y, 120); // Far left
            // Faster fire rate (4000ms vs 5000ms)
            this.time.delayedCall(4000, () => {
                this.enemyFourFirePattern(enemy);
            }, [], this);
        }
    }

    enemyFourFirePatternTwo(enemy) {
        if (enemy.active) {
            // 8-way circular burst
            for (let i = 0; i < 8; i++) {
                this.createEnemyBullet(enemy.x, enemy.y, i * 45);
            }
            this.time.delayedCall(4000, () => {
                this.enemyFourFirePatternTwo(enemy);
            }, [], this);
        }
    }

    enemyFourFirePatternThree(enemy) {
        if (enemy.active) {
            // Aimed shot at player with spread
            if (this.hero && this.hero.active) {
                const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.hero.x, this.hero.y);
                const angleDeg = Phaser.Math.RadToDeg(angle);
                this.createEnemyBullet(enemy.x, enemy.y, angleDeg);
                this.createEnemyBullet(enemy.x, enemy.y, angleDeg - 15);
                this.createEnemyBullet(enemy.x, enemy.y, angleDeg + 15);
            }
            this.time.delayedCall(4000, () => {
                this.enemyFourFirePatternThree(enemy);
            }, [], this);
        }
    }

    enemyFourFirePatternFour(enemy) {
        if (enemy.active) {
            // Alternating wave pattern
            if (!enemy.waveDirection) enemy.waveDirection = 0;
            enemy.waveDirection = (enemy.waveDirection + 30) % 360;

            for (let i = 0; i < 3; i++) {
                this.createEnemyBullet(enemy.x, enemy.y, 60 + enemy.waveDirection + (i * 30));
            }

            this.time.delayedCall(4000, () => {
                this.enemyFourFirePatternFour(enemy);
            }, [], this);
        }
    }

    // LEVEL 3 BOSS (boss3) ATTACK PATTERNS - Most challenging
    enemyFiveFirePattern(enemy) {
        if (enemy.active) {
            // Rotating spiral barrage
            if (!enemy.spiralAngle) enemy.spiralAngle = 0;
            enemy.spiralAngle = (enemy.spiralAngle + 20) % 360;

            // Fire 6 bullets in a rotating spiral
            for (let i = 0; i < 6; i++) {
                this.createEnemyBullet(enemy.x, enemy.y, enemy.spiralAngle + (i * 60));
            }

            this.time.delayedCall(3200, () => {
                this.enemyFiveFirePattern(enemy);
            }, [], this);
        }
    }

    enemyFiveFirePatternTwo(enemy) {
        if (enemy.active) {
            // Double spiral - clockwise and counter-clockwise
            if (!enemy.doubleSpiral) enemy.doubleSpiral = 0;
            enemy.doubleSpiral = (enemy.doubleSpiral + 25) % 360;

            // Clockwise spiral
            for (let i = 0; i < 4; i++) {
                this.createEnemyBullet(enemy.x, enemy.y, enemy.doubleSpiral + (i * 90));
            }
            // Counter-clockwise spiral
            for (let i = 0; i < 4; i++) {
                this.createEnemyBullet(enemy.x, enemy.y, 360 - enemy.doubleSpiral + (i * 90));
            }

            this.time.delayedCall(3200, () => {
                this.enemyFiveFirePatternTwo(enemy);
            }, [], this);
        }
    }

    enemyFiveFirePatternThree(enemy) {
        if (enemy.active) {
            // Triple aimed shots at player with wider spread
            if (this.hero && this.hero.active) {
                const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.hero.x, this.hero.y);
                const angleDeg = Phaser.Math.RadToDeg(angle);

                // Fire 5 bullets aimed at player with spread
                for (let i = -2; i <= 2; i++) {
                    this.createEnemyBullet(enemy.x, enemy.y, angleDeg + (i * 10));
                }
            }

            this.time.delayedCall(3200, () => {
                this.enemyFiveFirePatternThree(enemy);
            }, [], this);
        }
    }

    enemyFiveFirePatternFour(enemy) {
        if (enemy.active) {
            // Cross pattern with diagonal sweeps
            if (!enemy.crossAngle) enemy.crossAngle = 0;
            enemy.crossAngle = (enemy.crossAngle + 15) % 90;

            // Main cross (4 directions)
            this.createEnemyBullet(enemy.x, enemy.y, 0 + enemy.crossAngle);
            this.createEnemyBullet(enemy.x, enemy.y, 90 + enemy.crossAngle);
            this.createEnemyBullet(enemy.x, enemy.y, 180 + enemy.crossAngle);
            this.createEnemyBullet(enemy.x, enemy.y, 270 + enemy.crossAngle);

            // Diagonal cross
            this.createEnemyBullet(enemy.x, enemy.y, 45 + enemy.crossAngle);
            this.createEnemyBullet(enemy.x, enemy.y, 135 + enemy.crossAngle);
            this.createEnemyBullet(enemy.x, enemy.y, 225 + enemy.crossAngle);
            this.createEnemyBullet(enemy.x, enemy.y, 315 + enemy.crossAngle);

            this.time.delayedCall(3200, () => {
                this.enemyFiveFirePatternFour(enemy);
            }, [], this);
        }
    }

    enemyFiveFirePatternFive(enemy) {
        if (enemy.active) {
            // Random scatter burst - 12 bullets in random directions
            for (let i = 0; i < 12; i++) {
                const randomAngle = Phaser.Math.Between(0, 360);
                this.createEnemyBullet(enemy.x, enemy.y, randomAngle);
            }

            this.time.delayedCall(3200, () => {
                this.enemyFiveFirePatternFive(enemy);
            }, [], this);
        }
    }

    // ============================================
    // LEVEL 9 FINAL BOSS AI & ATTACK PATTERNS
    // Intelligent movement and directed attacks (PvP clone behavior)
    // ============================================

    // AI behavior for final boss - intelligent movement like a player clone
    startFinalBossAI(enemy) {
        if (!enemy.active) return;

        const screenWidth = this.sys.game.config.width;
        const minY = 80;   // Top limit
        const maxY = 300;  // Center of screen (maximum descent)

        // Initial position
        enemy.targetY = 150;
        enemy.aiState = 'tracking'; // States: tracking, attacking, dodging

        // AI update loop - runs every 100ms
        this.time.addEvent({
            delay: 100,
            callback: () => {
                if (!enemy.active || !this.hero || !this.hero.active) return;

                // ====== HORIZONTAL TRACKING ======
                // Follow player horizontally with slight delay (mirror movement)
                const heroX = this.hero.x;
                const diffX = heroX - enemy.x;

                // Smooth horizontal tracking with speed limit
                const trackingSpeed = 120;
                if (Math.abs(diffX) > 30) {
                    enemy.setVelocityX(diffX > 0 ? trackingSpeed : -trackingSpeed);
                } else {
                    enemy.setVelocityX(diffX * 2); // Slow down when close
                }

                // Keep within screen bounds
                if (enemy.x < 100) enemy.setVelocityX(Math.max(enemy.body.velocity.x, 50));
                if (enemy.x > screenWidth - 100) enemy.setVelocityX(Math.min(enemy.body.velocity.x, -50));

                // ====== VERTICAL MOVEMENT ======
                // Move up and down between top and center
                if (!enemy.verticalDirection) enemy.verticalDirection = 1;

                // Change direction at limits
                if (enemy.y <= minY) {
                    enemy.verticalDirection = 1;
                    enemy.targetY = Phaser.Math.Between(150, maxY);
                } else if (enemy.y >= maxY) {
                    enemy.verticalDirection = -1;
                    enemy.targetY = Phaser.Math.Between(minY, 150);
                }

                // Move towards target Y
                const diffY = enemy.targetY - enemy.y;
                if (Math.abs(diffY) > 20) {
                    enemy.setVelocityY(diffY > 0 ? 60 : -60);
                } else {
                    enemy.setVelocityY(0);
                    // Occasionally change target
                    if (Math.random() < 0.02) {
                        enemy.targetY = Phaser.Math.Between(minY, maxY);
                    }
                }
            },
            loop: true
        });
    }

    // Directed attack - fires at player with controlled intervals
    finalBossDirectedAttack(enemy) {
        if (!enemy.active || !this.hero || !this.hero.active) return;

        // Calculate angle to player
        const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.hero.x, this.hero.y);
        const angleDeg = Phaser.Math.RadToDeg(angle);

        // Fire 3-way spread at player (like hero's weapon)
        this.createEnemyBullet(enemy.x, enemy.y, angleDeg);
        this.createEnemyBullet(enemy.x, enemy.y, angleDeg - 15);
        this.createEnemyBullet(enemy.x, enemy.y, angleDeg + 15);

        // Occasionally fire a tighter burst
        if (Math.random() < 0.3) {
            this.time.delayedCall(200, () => {
                if (enemy.active && this.hero && this.hero.active) {
                    const angle2 = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.hero.x, this.hero.y);
                    const angleDeg2 = Phaser.Math.RadToDeg(angle2);
                    this.createEnemyBullet(enemy.x, enemy.y, angleDeg2);
                    this.createEnemyBullet(enemy.x, enemy.y, angleDeg2 - 8);
                    this.createEnemyBullet(enemy.x, enemy.y, angleDeg2 + 8);
                }
            }, [], this);
        }

        // Repeat attack with interval (800-1200ms for variability)
        const nextAttackDelay = Phaser.Math.Between(800, 1200);
        this.time.delayedCall(nextAttackDelay, () => {
            this.finalBossDirectedAttack(enemy);
        }, [], this);
    }

    createEnemyBullet(x, y, angle) {
        const bullet = this.enemyBullets.create(x, y, 'Cannon_bullet');
        bullet.setTint(0xff0000); // Make enemy bullets red

        // Apply difficulty scaling to bullet speed
        const difficulty = this.getDifficultyMultiplier();
        const speed = 200 * difficulty;

        const radians = Phaser.Math.DegToRad(angle);
        bullet.setVelocity(
            Math.cos(radians) * speed,
            Math.sin(radians) * speed
        );
    }
    updateboss1HealthBar(enemy) {
        if (this.boss1HealthBar) {
            this.boss1HealthBar.clear();
            const gw = this.game.config.width;
            const gh = this.game.config.height;
            // Scale health bar based on screen size
            const barHeight = Math.min(500, gh * 0.7); // 70% of height, max 500
            const barWidth = window.isMobile ? 15 : 20;
            const x = gw - barWidth - 10; // 10px from right edge
            const y = 50; // Y position of the health bar (50 pixels from the top)
            // Draw the background of the health bar
            this.boss1HealthBar.fillStyle(0xff0000);
            this.boss1HealthBar.fillRect(x, y, barWidth, barHeight);
            // Calculate the height of the remaining health
            const healthPercentage = enemy.health / enemy.maxHealth;
            const remainingHealthHeight = barHeight * healthPercentage;
            // Draw the remaining health
            this.boss1HealthBar.fillStyle(0x00ff00);
            this.boss1HealthBar.fillRect(x, y + barHeight - remainingHealthHeight, barWidth, remainingHealthHeight);
        }
    }

    startEnemyFourAttack(enemy) {
        if (enemy.active) {
            // Enhanced diagonal sweep pattern - faster and denser
            // Fire bullets in tighter spread for more challenge
            for (let angle = 30; angle <= 150; angle += 15) { // Changed from 20 to 15 degree spacing
                this.time.delayedCall((angle - 30) * 20, () => { // Faster sweep (20ms vs 30ms)
                    if (enemy.active) {
                        this.createEnemyBullet(enemy.x, enemy.y + 50, angle);
                    }
                });
            }
            // Fire reverse sweep faster
            this.time.delayedCall(400, () => { // Reduced delay from 600ms to 400ms
                for (let angle = 150; angle >= 30; angle -= 15) { // Tighter spacing
                    this.time.delayedCall((150 - angle) * 20, () => { // Faster reverse
                        if (enemy.active) {
                            this.createEnemyBullet(enemy.x, enemy.y + 50, angle);
                        }
                    });
                }
            });
            // Add spiral component for extra challenge
            this.time.delayedCall(800, () => {
                if (enemy.active) {
                    for (let i = 0; i < 8; i++) {
                        this.createEnemyBullet(enemy.x, enemy.y + 50, i * 45);
                    }
                }
            });
            // Repeat pattern faster
            this.time.delayedCall(2000, () => { // Reduced from 2500ms
                this.startEnemyFourAttack(enemy);
            });
        }
    }
    // Third boss - Enemy Five (anemy02.gif)
    createEnemyFive() {
        const screenWidth = this.sys.game.config.width;
        const enemyFive = this.enemies.create(screenWidth / 2, -120, 'boss3');
        if (!enemyFive) {
            console.error('Failed to create enemy 5');
            return;
        }
        enemyFive.setScale(1.0);
        enemyFive.setVelocityY(60);
        enemyFive.health = 235;
        enemyFive.maxHealth = 235;
        enemyFive.boss = true;

        this.sound.play('alarmSound', { volume: 0.4 });

        // Stop and start circular movement after 3 seconds
        this.time.delayedCall(3000, () => {
            if (enemyFive.active) {
                enemyFive.setVelocityY(0);
                // Circular movement pattern
                let angle = 0;
                this.time.addEvent({
                    delay: 50,
                    callback: () => {
                        if (enemyFive.active) {
                            angle += 0.05;
                            const radius = 100;
                            const centerX = screenWidth / 2;
                            const centerY = 150;
                            enemyFive.x = centerX + Math.cos(angle) * radius;
                            enemyFive.y = centerY + Math.sin(angle) * radius * 0.5;
                        }
                    },
                    loop: true
                });
            }
        });

        // Create health bar
        this.boss1HealthBar = this.add.graphics();
        this.updateboss1HealthBar(enemyFive);

        // Attack pattern: Spiral burst (unique pattern)
        this.time.delayedCall(4000, () => {
            this.startEnemyFiveAttack(enemyFive);
        });
    }
    startEnemyFiveAttack(enemy) {
        if (enemy.active) {
            // Enhanced spiral burst pattern - MORE bullets, FASTER rotation
            let burstAngle = 0;
            for (let i = 0; i < 18; i++) { // Increased from 12 to 18 bullets
                this.time.delayedCall(i * 80, () => { // Faster firing (80ms vs 100ms)
                    if (enemy.active) {
                        // Fire bullets with faster rotation angle
                        this.createEnemyBullet(enemy.x, enemy.y + 30, burstAngle + (i * 25)); // Faster spiral
                        this.createEnemyBullet(enemy.x, enemy.y + 30, burstAngle + (i * 25) + 180);
                    }
                });
            }
            // More frequent aimed shots at player
            this.time.delayedCall(1000, () => { // Earlier first aimed shot
                if (enemy.active && this.hero && this.hero.active) {
                    const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.hero.x, this.hero.y);
                    const angleDeg = Phaser.Math.RadToDeg(angle);
                    this.createEnemyBullet(enemy.x, enemy.y + 30, angleDeg);
                    this.createEnemyBullet(enemy.x - 30, enemy.y + 20, angleDeg);
                    this.createEnemyBullet(enemy.x + 30, enemy.y + 20, angleDeg);
                }
            });
            // Second aimed shot
            this.time.delayedCall(1800, () => {
                if (enemy.active && this.hero && this.hero.active) {
                    const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.hero.x, this.hero.y);
                    const angleDeg = Phaser.Math.RadToDeg(angle);
                    // Fire 5-way spread at player
                    for (let offset = -20; offset <= 20; offset += 10) {
                        this.createEnemyBullet(enemy.x, enemy.y + 30, angleDeg + offset);
                    }
                }
            });
            // Repeat pattern faster
            this.time.delayedCall(2500, () => { // Reduced from 3000ms
                this.startEnemyFiveAttack(enemy);
            });
        }
    }
    spawnPowerUp(x, y) {
        // Determine drop type based on probability
        const dropChance = Math.random();

        if (dropChance < 0.05) {
            // 5% chance - Life drop
            this.spawnLife(x, y);
        } else if (dropChance < 0.55) {
            // 50% chance - Coin drop (score only)
            this.spawnCoin(x, y);
        } else {
            // 45% chance - Weapon upgrade (bitcoin)
            const powerUp = this.powerUps.create(x, y, 'star');
            powerUp.setScale(0.5);
            powerUp.setVelocity(Phaser.Math.Between(-150, 150), Phaser.Math.Between(-150, 150));
            powerUp.setCollideWorldBounds(true);
            powerUp.setBounce(1);
            powerUp.dropType = 'upgrade';
            // Start blinking 2 seconds before expiration
            this.time.delayedCall(8000, () => {
                this.startPowerUpBlinking(powerUp);
            });
            powerUp.expirationTimer = this.time.delayedCall(10000, () => {
                this.expirePowerUp(powerUp);
            });
        }
    }
    spawnCoin(x, y) {
        // Randomly select one of the 3 coin types
        const coinTypes = ['coin1', 'coin2', 'coin3'];
        const selectedCoin = Phaser.Utils.Array.GetRandom(coinTypes);

        const coin = this.powerUps.create(x, y, selectedCoin);
        coin.setScale(0.5);
        coin.setVelocity(Phaser.Math.Between(-150, 150), Phaser.Math.Between(-150, 150));
        coin.setCollideWorldBounds(true);
        coin.setBounce(1);
        coin.dropType = 'coin';
        // Start blinking 2 seconds before expiration
        this.time.delayedCall(8000, () => {
            this.startPowerUpBlinking(coin);
        });
        coin.expirationTimer = this.time.delayedCall(10000, () => {
            this.expirePowerUp(coin);
        });
    }
    spawnLife(x, y) {
        const life = this.powerUps.create(x, y, 'life');
        life.setScale(0.5);
        life.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));
        life.setCollideWorldBounds(true);
        life.setBounce(1);
        life.dropType = 'life';
        // Start blinking 3 seconds before expiration (life is valuable!)
        this.time.delayedCall(9000, () => {
            this.startPowerUpBlinking(life);
        });
        life.expirationTimer = this.time.delayedCall(12000, () => {
            this.expirePowerUp(life);
        });
    }
    expirePowerUp(powerUp) {
        if (powerUp.active) {
            // Fade out effect over 1 second before destroying
            this.tweens.add({
                targets: powerUp,
                alpha: 0,
                duration: 1000,
                ease: 'Power2',
                onComplete: () => {
                    if (powerUp.active) {
                        powerUp.destroy();
                        if (powerUp.dropType === 'upgrade') {
                            this.starsCollectedBeforeExpire = 0; // Reset counter only for upgrade stars
                        }
                    }
                }
            });
        }
    }

    // Start blinking effect to warn player before expiration
    startPowerUpBlinking(powerUp) {
        if (powerUp.active && !powerUp.isBlinking) {
            powerUp.isBlinking = true;
            this.tweens.add({
                targets: powerUp,
                alpha: 0.3,
                duration: 200,
                yoyo: true,
                repeat: 5, // Blink 5 times over ~2 seconds
                onComplete: () => {
                    if (powerUp.active) {
                        powerUp.alpha = 1; // Reset alpha before fade out
                    }
                }
            });
        }
    }
    showWinScreen() {
        // Prevent multiple calls during level transition
        if (this.levelTransitioning) {
            return;
        }

        if (!this.gameWon) {
            // Check if there are more levels (9 total)
            if (this.currentLevel < 9) {
                // Set transitioning flag immediately to prevent race conditions
                this.levelTransitioning = true;
                // Properly destroy health bar from previous boss
                if (this.boss1HealthBar) {
                    this.boss1HealthBar.destroy();
                    this.boss1HealthBar = null;
                }

                // Preserve current state for next level
                this.registry.set('currentLevel', this.currentLevel + 1);
                this.registry.set('preservedScore', this.score);
                this.registry.set('preservedWeaponPower', this.hero.weaponPower);
                this.registry.set('preservedLives', this.playerLives);
                this.registry.set('preservedStarCounter', this.starCounter);
                this.registry.set('preservedTransformed', this.heroTransformed);
                this.registry.set('levelProgression', true);

                // Show level transition message - responsive
                const gw = this.game.config.width;
                const gh = this.game.config.height;
                const centerX = gw / 2;
                const centerY = gh / 2;
                const isMobile = window.isMobile;

                const levelText = this.add.text(centerX, centerY, `Level ${this.currentLevel + 1}!`, {
                    fontSize: isMobile ? '48px' : '64px',
                    fill: '#ffff00'
                }).setOrigin(0.5).setDepth(1001);

                const bossText = this.add.text(centerX, centerY + (isMobile ? 45 : 60), 'Preparando Nova Fase!', {
                    fontSize: isMobile ? '20px' : '32px',
                    fill: '#fff'
                }).setOrigin(0.5).setDepth(1001);

                // Restart scene after showing message
                this.time.delayedCall(3000, () => {
                    this.scene.restart();
                });
                return;
            }

            // Final victory - all bosses defeated
            this.gameWon = true;
            this.sound.stopAll();
            this.sound.play('finalyMusic', {
                loop: true,
                volume: 0.7
            });

            const gw = this.game.config.width;
            const gh = this.game.config.height;
            const centerX = gw / 2;
            const centerY = gh / 2;
            const isMobile = window.isMobile;

            // Responsive font sizes
            const titleSize = isMobile ? '36px' : '64px';
            const subtitleSize = isMobile ? '20px' : '32px';
            const textSize = isMobile ? '16px' : '28px';
            const smallTextSize = isMobile ? '14px' : '24px';

            // Responsive vertical spacing
            const lineSpacing = isMobile ? 35 : 60;
            let yPos = centerY - (isMobile ? 80 : 100);

            const overlay = this.add.rectangle(centerX, centerY, gw, gh, 0x000000, 0.7);
            overlay.setDepth(1000);
            this.add.text(centerX, yPos, 'Você Venceu!', {
                fontSize: titleSize,
                fill: '#fff'
            }).setOrigin(0.5).setDepth(1001);
            yPos += lineSpacing;
            this.add.text(centerX, yPos, 'Todos os Chefes Derrotados!', {
                fontSize: subtitleSize,
                fill: '#00ff00'
            }).setOrigin(0.5).setDepth(1001);
            yPos += lineSpacing;
            this.add.text(centerX, yPos, `Sua Pontuação: ${this.score}`, {
                fontSize: textSize,
                fill: '#fff'
            }).setOrigin(0.5).setDepth(1001);
            yPos += lineSpacing;
            if (this.score < 15000) {
                this.add.text(centerX, yPos, 'Consegue superar 15.000 pontos?', {
                    fontSize: smallTextSize,
                    fill: '#ffff00'
                }).setOrigin(0.5).setDepth(1001);
            } else {
                this.add.text(centerX, yPos, 'Você superou 15.000 pontos!!', {
                    fontSize: smallTextSize,
                    fill: '#00ff00'
                }).setOrigin(0.5).setDepth(1001);
            }
            yPos += lineSpacing;
            this.add.text(centerX, yPos, isMobile ? 'Toque para reiniciar' : 'Pressione qualquer tecla para reiniciar', {
                fontSize: smallTextSize,
                fill: '#fff'
            }).setOrigin(0.5).setDepth(1001);

            // Support both keyboard and touch for restart
            this.input.keyboard.once('keydown', () => {
                this.scene.start('IntroScreen');
            });
            if (isMobile) {
                this.input.once('pointerdown', () => {
                    this.scene.start('IntroScreen');
                });
            }
        }
    }

    playExplosionSound() {
        this.sound.play('boomSound', {
            volume: 0.7
        });
    }
    playHitSound() {
        this.sound.play('hitSound', {
            volume: 0.7
        });
    }
    playShieldSound() {
        this.sound.play('shieldSound', {
            volume: 0.7
        });
    }
    playSeriesOfExplosions() {
        for (let i = 0; i < 5; i++) {
            this.time.delayedCall(i * 250, () => {
                this.playExplosionSound();
            });
        }
    }
    checkAchievements() {
        if (this.enemyKillCount === 1) {
            this.unlockAchievement('firstKill');
        }
        if (this.enemyKillCount === 100) {
            this.unlockAchievement('tenKills');
        }
        if (this.hero.weaponPower === 8) {
            this.unlockAchievement('maxPower');
        }
        if (this.hitsTaken === 10) {
            this.unlockAchievement('fallen');
        }
        // Remove the Pacifist check from here as it's now handled in the update method
        // Check for Knucklehead achievement when any boss is created
        if (this.enemies.getChildren().some(enemy => this.isBossEnemy(enemy)) && !this.weaponUpgraded) {
            this.unlockAchievement('knucklehead');
        }
        if (this.boss1Destroyed) {
            this.unlockAchievement('bossKill');
            // Check for Star Dancer achievement
            if (!this.playerHit) {
                this.unlockAchievement('starDancer');
            }
        }
        if (this.score >= 10000) {
            this.unlockAchievement('highScore');
        }
        // Check for Pacifist achievement
        if (!this.pacifistAchieved && this.time.now - this.lastKillTime >= 20000) {
            this.unlockAchievement('pacifist');
            this.pacifistAchieved = true;
        }
        // Check for Bad Cat achievement
        if (this.upgradeDuringBossFight) {
            this.unlockAchievement('badCat');
        }
        // Check for Nuts! achievement
        if (this.starsCollectedWithoutUpgrade >= 30) {
            this.unlockAchievement('nuts');
        }
        // Check for Vindictive achievement
        if (this.enemiesKilledDuringBossFight >= 200) {
            this.unlockAchievement('vindictive');
        }
        // Check for Perfectionist achievement
        if (this.starsCollectedBeforeExpire >= 60) {
            this.unlockAchievement('perfectionist');
        }
        // Check for Veteran achievement
        if (parseInt(localStorage.getItem('totalEnemyKills')) >= 6000) {
            this.unlockAchievement('veteran');
        }
        // Check for Flying Blind achievement
        if (this.timeNearTop >= 5000 && !this.flyingBlindAchieved) {
            this.unlockAchievement('flyingBlind');
            this.flyingBlindAchieved = true;
        }
        // Note: We don't need to check for the 'lucky' achievement here
        // as it's checked in the collectPowerUp method
    }
    unlockAchievement(key) {
        if (!this.gameOver && localStorage.getItem(key) !== 'true') {
            localStorage.setItem(key, 'true');
            console.log(`Conquista desbloqueada: ${key}`);
            // Play the cash sound
            this.sound.play('cashSound', {
                volume: 0.5
            });
            // Display the achievement notification
            this.showAchievementNotification(key);
            // Show an alert for the achievement
            const achievementName = this.getAchievementName(key);
            showToast(`Conquista desbloqueada: ${achievementName}\nParabéns!`);
        }
        // Don't reset lastKillTime for the Pacifist achievement
        if (key !== 'pacifist') {
            this.lastKillTime = this.time.now;
        }
    }
    showAchievementNotification(key) {
        const achievementName = this.getAchievementName(key);
        const gw = this.game.config.width;
        const gh = this.game.config.height;
        const isMobile = window.isMobile;

        const notification = this.add.text(gw / 2, gh - 30, `Conquista desbloqueada: ${achievementName}`, {
            fontSize: isMobile ? '14px' : '24px',
            fill: '#ffff00',
            backgroundColor: '#000000',
            padding: {
                left: isMobile ? 8 : 15,
                right: isMobile ? 8 : 15,
                top: isMobile ? 5 : 10,
                bottom: isMobile ? 5 : 10
            }
        }).setOrigin(0.5, 1);
        notification.setDepth(1000); // Ensure it appears on top of other game elements
        // Fade out and destroy the notification after 3 seconds
        this.tweens.add({
            targets: notification,
            alpha: 0,
            duration: 500,
            delay: 2500,
            onComplete: () => {
                notification.destroy();
            }
        });
    }
    getAchievementName(key) {
        const achievementMap = {
            'firstKill': 'Primeiro kill',
            'tenKills': 'Dizimar',
            'maxPower': 'Arma Suprema',
            'bossKill': 'Matador de Chefes',
            'highScore': 'Pontuação Alta',
            'pacifist': 'Pacifista',
            'lucky': 'Sortudo',
            'starDancer': 'Dançarino Estelar',
            'knucklehead': 'Cabeça-Dura',
            'badCat': 'Gato Mau',
            'nuts': 'Louco!',
            'greedy': 'Ganancioso',
            'flyingBlind': 'Voo Cego'
        };

        return achievementMap[key] || key;
    }
}
class Level4 extends Phaser.Scene {
    constructor() {
        super('Level4');
        this.fireDelay = 120; // Increased by 20% from 100 to 120 milliseconds
        this.lastFired = 0;
        this.score = 0;
        this.heroDestroyed = false;
        this.starCounter = 0;
        this.starIcons = [];
    }
    preload() {
        // Load assets if not already loaded in the main scene
    }
    create() {
        // Set up the level, similar to the main scene
        this.add.text(400, 300, 'Level 4', {
            fontSize: '64px',
            fill: '#fff'
        }).setOrigin(0.5);

        // Initialize the hero with weapon level 3
        this.hero = this.physics.add.sprite(400, 300, 'hero');
        this.hero.setCollideWorldBounds(true);
        this.hero.weaponPower = 3;
        this.hero.shotsFired = 0;
        // Set up other game objects (enemies, bullets, etc.)
        this.playerBullets = this.physics.add.group();
        this.enemies = this.physics.add.group();

        // Set up input
        this.cursors = this.input.keyboard.createCursorKeys();
        // Add score text
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '32px',
            fill: '#fff'
        });
    }
    update(time, delta) {
        if (!this.heroDestroyed) {
            // Handle hero movement
            this.handleHeroMovement();
            // Handle continuous firing
            if (time > this.lastFired) {
                this.fireBullet();
                this.lastFired = time + this.fireDelay;
            }
            // Handle collisions and other game logic
        }
    }
    handleHeroMovement() {
        const speed = 400;
        this.hero.setVelocity(0);
        if (this.cursors.left.isDown) {
            this.hero.setVelocityX(-speed);
        } else if (this.cursors.right.isDown) {
            this.hero.setVelocityX(speed);
        }
        if (this.cursors.up.isDown) {
            this.hero.setVelocityY(-speed);
        } else if (this.cursors.down.isDown) {
            this.hero.setVelocityY(speed);
        }
    }
    fireBullet() {
        if (this.hero && this.hero.active) {
            this.hero.shotsFired++;
            this.createBullet(this.hero.x, this.hero.y - 30, 0);
            if (this.hero.weaponPower >= 3) {
                if (this.hero.shotsFired % 2 === 0) {
                    // For weapon power 3 and above, fire three bullets every other shot
                    this.createBullet(this.hero.x, this.hero.y - 30, -30);
                    this.createBullet(this.hero.x, this.hero.y - 30, 0);
                    this.createBullet(this.hero.x, this.hero.y - 30, 30);
                }
                if (this.hero.weaponPower >= 4 && this.hero.shotsFired % 4 === 0) {
                    // For weapon power 4 and above, fire additional 90° bullets every fourth shot
                    this.createBullet(this.hero.x, this.hero.y - 30, -90);
                    this.createBullet(this.hero.x, this.hero.y - 30, 90);
                }
                if (this.hero.weaponPower >= 5) {
                    // For weapon power 5 and above, fire a backward bullet on every shot
                    this.createBullet(this.hero.x, this.hero.y + 30, 180);
                }
                if (this.hero.weaponPower >= 6 && this.hero.shotsFired % 4 === 0) {
                    // For weapon power 6 and above, fire a bullet towards a random enemy every fourth shot
                    this.fireAtRandomEnemy();
                }
                if (this.hero.weaponPower >= 7 && this.hero.shotsFired % 2 === 0) {
                    // For weapon power 7 and above, fire a bullet towards a random enemy every other shot
                    this.fireAtRandomEnemy();
                }
                if (this.hero.weaponPower >= 8) {
                    // For weapon power 8 or higher, fire additional 60° bullets on every shot
                    this.createBullet(this.hero.x, this.hero.y - 30, -60);
                    this.createBullet(this.hero.x, this.hero.y - 30, 60);
                }
            }
        }
    }
    fireAtRandomEnemy() {
        const activeEnemies = this.enemies.getChildren().filter(enemy => enemy.active);
        if (activeEnemies.length > 0) {
            const randomEnemy = Phaser.Utils.Array.GetRandom(activeEnemies);
            const angle = Phaser.Math.Angle.Between(this.hero.x, this.hero.y, randomEnemy.x, randomEnemy.y);
            this.createBullet(this.hero.x, this.hero.y, Phaser.Math.RadToDeg(angle));
        }
    }
    createBullet(x, y, angle) {
        const bullet = this.playerBullets.create(x, y, 'Cannon_bullet');
        const radians = Phaser.Math.DegToRad(angle);
        const speed = 600;
        bullet.setVelocity(
            Math.sin(radians) * speed,
            -Math.cos(radians) * speed
        );
        bullet.setTint(0xffff00);
    }
}

// ============================================
// MOBILE DETECTION AND DYNAMIC SIZING
// ============================================
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 0);

let gameWidth, gameHeight;

if (isMobile) {
    // Use window size as base for mobile
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Maintain 9:16 aspect ratio (vertical) for mobile
    const aspectRatio = 9 / 16;

    if (screenWidth / screenHeight < aspectRatio) {
        // Screen is narrower than 9:16
        gameWidth = screenWidth;
        gameHeight = screenWidth / aspectRatio;
    } else {
        // Screen is wider than 9:16
        gameHeight = screenHeight;
        gameWidth = screenHeight * aspectRatio;
    }

    // Ensure minimum quality (not less than 360x640)
    gameWidth = Math.max(360, Math.round(gameWidth));
    gameHeight = Math.max(640, Math.round(gameHeight));
} else {
    // Desktop: maintain traditional 800x600
    gameWidth = 800;
    gameHeight = 600;
}

const config = {
    type: Phaser.AUTO,
    width: gameWidth,
    height: gameHeight,
    parent: 'game-container',
    backgroundColor: '#000000',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    input: {
        activePointers: 3, // Support for multiple touch points
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [PreloadScene, IntroScreen, Example]
};

// Export isMobile for use in scenes
window.isMobile = isMobile;

const game = new Phaser.Game(config);
class AchievementsScreen extends Phaser.Scene {
    constructor() {
        super('AchievementsScreen');
    }
    create() {
        const gw = this.game.config.width;
        const gh = this.game.config.height;
        const centerX = gw / 2;
        const isMobile = window.isMobile;

        this.add.rectangle(centerX, gh / 2, gw, gh, 0x000000);

        const backButton = this.add.text(20, 30, 'Voltar', {
            fontSize: isMobile ? '18px' : '24px',
            fill: '#ffffff'
        }).setOrigin(0, 0.5).setInteractive();
        backButton.on('pointerdown', () => {
            this.scene.start('IntroScreen');
        });

        this.add.text(centerX, 30, 'Conquistas', {
            fontSize: isMobile ? '24px' : '36px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        const achievements = [{
            key: 'firstKill',
            name: 'Primeira kill',
            description: 'Destrua seu primeiro inimigo'
        }, {
            key: 'fallen',
            name: 'Caído',
            description: 'Seja atingido 10 vezes durante um nível'
        }, {
            key: 'flyingBlind',
            name: 'Voo Cego',
            description: 'Passe 10 segundos no topo'
        }, {
            key: 'greedy',
            name: 'Ganancioso',
            description: 'Morra em 1/3 de segundo após pegar uma estrela'
        }, {
            key: 'tenKills',
            name: 'Dizimar',
            description: 'Destrua 100 inimigos'
        }, {
            key: 'maxPower',
            name: 'Arma Suprema',
            description: 'Alcance o poder máximo da arma'
        }, {
            key: 'bossKill',
            name: 'Matador de Chefes',
            description: 'Derrote o chefe'
        }, {
            key: 'highScore',
            name: 'Pontuação Alta',
            description: 'Marque mais de 10.000 pontos'
        }, {
            key: 'pacifist',
            name: 'Pacifista',
            description: 'Não mate nada por 20 segundos'
        }, {
            key: 'lucky',
            name: 'Sortudo',
            description: 'Consiga uma melhoria de arma nos primeiros 21 segundos'
        }, {
            key: 'starDancer',
            name: 'Dançarino Estelar',
            description: 'Vença sem ser atingido'
        }, {
            key: 'knucklehead',
            name: 'Cabeça-Dura',
            description: 'Chegue ao chefe sem melhorar'
        }, {
            key: 'badCat',
            name: 'Gato Mau',
            description: 'Adquira uma melhoria durante a luta com o chefe'
        }, {
            key: 'nuts',
            name: 'Louco!',
            description: 'Colete 30 estrelas sem alcançar o nível 3 de melhoria'
        }, {
            key: 'vindictive',
            name: 'Vingativo',
            description: 'Mate 200 inimigos durante a luta com o chefe'
        }, {
            key: 'perfectionist',
            name: 'Perfeccionista',
            description: 'Colete 60 estrelas sem perder nenhuma'
        }, {
            key: 'veteran',
            name: 'Veterano',
            description: 'Mate 6.000 inimigos em todos os jogos'
        }];

        const fontSize = isMobile ? '11px' : '18px';
        const lineHeight = isMobile ? 22 : 30;
        let yPos = 60;

        achievements.forEach(achievement => {
            const achieved = localStorage.getItem(achievement.key) === 'true';
            const color = achieved ? '#00ff00' : '#ff0000';
            const status = achieved ? '✓' : '✗';

            // Mobile: show name + status on one line, description below if space allows
            if (isMobile) {
                this.add.text(15, yPos, `${status} ${achievement.name}`, {
                    fontSize: fontSize,
                    fill: color
                });
            } else {
                this.add.text(50, yPos, `${achievement.name}: ${achievement.description}`, {
                    fontSize: fontSize,
                    fill: color
                });
                this.add.text(gw - 50, yPos, achieved ? 'Achieved' : 'Not Achieved', {
                    fontSize: fontSize,
                    fill: color
                }).setOrigin(1, 0);
            }
            yPos += lineHeight;
        });
    }
}