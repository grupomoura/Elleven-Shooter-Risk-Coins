class IntroScreen extends Phaser.Scene {
    constructor() {
        super('IntroScreen');
    }
    create() {
        // Add background
        this.add.rectangle(400, 300, 800, 600, 0x000000);
        // Add title
        this.add.text(400, 100, 'Elleven Star Shooter', {
            fontSize: '64px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        // Add game instructions
        const instructions = [
            'Como Jogar:',
            '- Use as setas ou WASD para se mover',
            '- Derrote o Chefe para vencer',
            '- Colete estrelas para melhorar sua arma',
            '- Estrelas dão mais pontos em níveis mais altos de arma',
            '',
            'Pressione Qualquer Tecla para iniciar o jogo'
        ];

        let yPosition = 200;
        instructions.forEach(line => {
            this.add.text(400, yPosition, line, {
                fontSize: '24px',
                fill: '#ffffff'
            }).setOrigin(0.5);
            yPosition += 40;
        });

        // Add achievements button below the instructions
        const achievementsButton = this.add.text(400, yPosition + 20, 'Clique aqui para ver as conquistas', {
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5).setInteractive();
        achievementsButton.on('pointerdown', () => {
            this.scene.start('AchievementsScreen');
        });
        // Add key listener for any key to start the game
        this.input.keyboard.once('keydown', (event) => {
            // Prevent the space key from starting the game twice
            if (event.key !== ' ') {
                this.scene.start('Example');
            }
        });
        // Add specific listener for the space key
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('Example');
        });
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
        this.enemy3Destroyed = false; // New flag to track if enemy 3 has been destroyed
        this.gameWon = false; // New flag to track if the game has been won
        this.starCounter = 0; // New property to track the number of stars collected
        this.starIcons = []; // New property to store the star icon sprites
        this.enemy2SpawnedCount = 0; // New property to track the number of enemy2 spawned from enemy1
        this.enemy3Destroyed = false; // New flag to track if enemy 3 has been destroyed
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
        // Add mouse control
        this.input.on('pointermove', (pointer) => {
            if (this.hero && this.hero.active) {
                this.hero.x = Phaser.Math.Clamp(pointer.x, 0, this.game.config.width);
            }
        });

        // Add click to restart
        this.input.on('pointerdown', () => {
            if (this.gameOver) {
                this.scene.restart();
            }
        });
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
        this.load.image('hero', 'assets/hero.png');
        this.load.image('Cannon_bullet', 'assets/cannom_bullet.png');
        this.load.image('enemy1', 'assets/enemy1.png');
        this.load.image('enemy2', 'assets/enemy2.png');
        this.load.image('enemy3', 'assets/enemy3.png');
        this.load.image('background', 'assets/background.jpg');
        this.load.image('star', 'assets/bitcoin.png');
        // New assets for coins and life
        this.load.image('coin1', 'assets/coin1.png');
        this.load.image('coin2', 'assets/coin2.png');
        this.load.image('coin3', 'assets/coin3.png');
        this.load.image('life', 'assets/life.png');
        // New boss sprites (GIF as sprite)
        this.load.image('enemy4', 'assets/anemy01.gif');
        this.load.image('enemy5', 'assets/anemy02.gif');
        this.load.audio('backgroundMusic', 'assets/goa.mp3');
        this.load.audio('boomSound', 'assets/boom.mp3');
        this.load.audio('hitSound', 'assets/hit.mp3');
        this.load.audio('shieldSound', 'assets/shield.mp3');
        this.load.audio('bellSound', 'assets/bell.mp3');
        this.load.audio('lowBellSound', 'assets/low_bell.mp3');
        this.load.audio('alarmSound', 'assets/alarm.mp3');
        this.load.audio('brassBandMusic', 'assets/BrassBand.mp3');
        this.load.audio('cashSound', 'assets/cash_10.mp3');
    }
    create() {
        // Reset game state variables on scene start/restart
        this.gameOver = false;
        this.heroDestroyed = false;
        this.gameWon = false;
        this.enemy3Destroyed = false;
        this.playerLives = 0;
        this.currentLevel = 1;
        this.score = 0;
        this.enemyKillCount = 0;
        this.starCounter = 0;

        // Set the game start time
        this.gameStartTime = this.time.now;
        // Initialize lastKillTime at the start of the game
        this.lastKillTime = this.time.now;
        // Create a tiling sprite for the scrolling background
        this.background = this.add.tileSprite(400, 300, 800, 600, 'background')
            .setOrigin(0.5)
            .setAlpha(0.3);
        // Initialize enemy kill counter
        this.enemyKillCount = 0;
        // Add the hero sprite to the scene
        // Create a white shield underneath the hero
        this.shield = this.add.circle(400, 300, 28, 0xffffff);
        this.shield.setDepth(0); // Set the depth to 0 to ensure it's drawn underneath
        // Add the hero sprite to the scene
        this.hero = this.physics.add.sprite(400, 300, 'hero');
        this.hero.setCollideWorldBounds(true);
        this.hero.setDepth(1); // Set the depth to 1 to ensure it's drawn above the shield
        this.hero.weaponPower = 1; // Initialize weapon power to 1
        this.hero.shotsFired = 0; // Initialize shot counter
        // Create cursor keys
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasdKeys = this.input.keyboard.addKeys('W,A,S,D');

        // Set up key combination for Shift + Y
        this.input.keyboard.on('keydown-Y', (event) => {
            if (event.shiftKey) {
                this.permanentInvulnerability = !this.permanentInvulnerability;
                console.log(`Permanent invulnerability ${this.permanentInvulnerability ? 'activated' : 'deactivated'}`);
            }
        });
        // Create player bullets group
        this.playerBullets = this.physics.add.group();
        // Create enemy group
        this.enemies = this.physics.add.group();
        // Create an instance of enemy 1
        this.createEnemyOne();
        // Add score text
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '32px',
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
        // Create a single enemy 3 (boss) after 150 seconds
        this.time.delayedCall(150000, this.createEnemyThree, [], this);
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
        // Add background music
        this.backgroundMusic = this.sound.add('backgroundMusic', {
            loop: true,
            volume: 0.7
        });
        this.backgroundMusic.play();
        // Initialize star icons
        for (let i = 0; i < 6; i++) {
            const starIcon = this.add.image(30, 100 + i * 40, 'star').setScale(0.3);
            starIcon.setAlpha(0.3); // Set initial opacity to 30%
            this.starIcons.push(starIcon);
        }
        // Add invisible game timer
        this.gameTimer = 0;
        this.gameTimerText = this.add.text(780, 580, '0:00', {
            fontSize: '24px',
            fill: '#ffffff'
        });
        this.gameTimerText.setOrigin(1, 1);
        this.gameTimerText.setAlpha(0); // Make the timer invisible

        // Add lives display
        this.livesIcon = this.add.image(760, 16, 'life').setScale(0.4);
        this.livesIcon.setOrigin(1, 0);
        this.livesText = this.add.text(770, 16, 'x' + this.playerLives, {
            fontSize: '24px',
            fill: '#ff6666'
        }).setOrigin(0, 0);

    }
    createExplosion(x, y, enemyType) {
        const explosion = this.add.group();
        const particleCount = enemyType === 'enemy3' ? 60 : 20; // Triple particles for enemy 3
        const particleSizeMin = enemyType === 'enemy3' ? 9 : 3; // Triple min size for enemy 3
        const particleSizeMax = enemyType === 'enemy3' ? 24 : 8; // Triple max size for enemy 3
        const spreadArea = enemyType === 'enemy3' ? 300 : 100; // Triple spread area for enemy 3
        const duration = enemyType === 'enemy3' ? 2400 : 800; // Triple duration for enemy 3
        for (let i = 0; i < particleCount; i++) {
            const particle = this.add.circle(x, y, Phaser.Math.Between(particleSizeMin, particleSizeMax), 0xff0000);
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
    createEnemyOne() {
        const enemy1Count = this.enemies.getChildren().filter(enemy => enemy.texture.key === 'enemy1').length;
        if (enemy1Count < 15 && !this.enemy3Destroyed) {
            const enemyOne = this.enemies.create(Phaser.Math.Between(0, 800), 0, 'enemy1');
            enemyOne.setScale(0.3); // Set the scale to 50% of original size
            enemyOne.setVelocityY(100);
            // Add random horizontal movement (drift left/right)
            enemyOne.setVelocityX(Phaser.Math.Between(-50, 50));
            enemyOne.health = 5; // Set the health value of the enemy to 5
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
        if (!this.enemy3Destroyed) {
            const enemyTwo = this.enemies.create(x || Phaser.Math.Between(0, 800), y || 0, 'enemy2');
            enemyTwo.setScale(0.2); // Set the scale to 20% of original size
            enemyTwo.setVelocityY(150 * this.enemy2SpeedMultiplier); // Apply speed multiplier
            if (this.applyHorizontalVelocity) {
                const horizontalVelocity = Phaser.Math.Between(-100, 100) * this.enemy2SpeedMultiplier;
                enemyTwo.setVelocityX(horizontalVelocity);
            }
            enemyTwo.health = 2; // Changed health from 7 to 2
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

        // Scroll the background
        if (this.background) {
            this.background.tilePositionY -= 1; // Adjust this value to change scroll speed
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
        // Remove any new enemies if enemy 3 has been destroyed
        if (this.enemy3Destroyed) {
            this.enemies.getChildren().forEach(enemy => {
                if (enemy.active) {
                    enemy.destroy();
                }
            });
        }
        // Handle Enemy 3 horizontal movement
        this.enemies.getChildren().forEach((enemy) => {
            if (enemy.texture.key === 'enemy3') {
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
        this.enemyBullets.getChildren().forEach((bullet) => {
            if (bullet.y > 600 || bullet.y < 0 || bullet.x > 800 || bullet.x < 0) {
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
                const speed = 400; // Doubled the speed from 200 to 400
                // Reset velocity
                this.hero.setVelocity(0);
                // Fire bullet continuously
                if (time > this.lastFired) {
                    this.fireBullet();
                    this.lastFired = time + this.fireDelay;
                }
                // Horizontal movement
                if (this.cursors.left.isDown || this.wasdKeys.A.isDown) {
                    this.hero.setVelocityX(-speed);
                } else if (this.cursors.right.isDown || this.wasdKeys.D.isDown) {
                    this.hero.setVelocityX(speed);
                }
                // Vertical movement
                if (this.cursors.up.isDown || this.wasdKeys.W.isDown) {
                    this.hero.setVelocityY(-speed);
                } else if (this.cursors.down.isDown || this.wasdKeys.S.isDown) {
                    this.hero.setVelocityY(speed);
                }
            }

            // Handle Enemy 3 horizontal movement
            this.enemies.getChildren().forEach((enemy) => {
                if (enemy.texture.key === 'enemy3') {
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
                                (enemy.texture.key === 'enemy2' && distance < 20)) {
                                this.damageHero();
                            }
                        }
                    }
                });
            }
            // Check for bullet-enemy collisions and off-screen enemies
            this.enemies.getChildren().forEach((enemy) => {
                if (enemy.texture.key !== 'enemy3' && (enemy.y > 600 || enemy.y < 0 || enemy.x > 800 || enemy.x < 0)) {
                    if (enemy.texture.key === 'enemy2' && this.enemy2BounceBehavior && Math.random() < (this.enemy2BounceChance || 0.3)) {
                        // Check if enough time has passed since the last bounce
                        if (time - enemy.lastBounceTime >= 500) { // 500 ms cooldown
                            // Bounce logic for enemy 2
                            if (enemy.y > 600 || enemy.y < 0) {
                                enemy.setVelocityY(-enemy.body.velocity.y);
                            }
                            if (enemy.x > 800 || enemy.x < 0) {
                                enemy.setVelocityX(-enemy.body.velocity.x);
                            }
                            // Ensure the enemy stays within bounds
                            enemy.x = Phaser.Math.Clamp(enemy.x, 0, 800);
                            enemy.y = Phaser.Math.Clamp(enemy.y, 0, 600);
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
                    let hitDistance = 50;
                    if (enemy.texture.key === 'enemy3' || enemy.texture.key === 'enemy4' || enemy.texture.key === 'enemy5') {
                        hitDistance = 110; // Use 110 pixels for bosses
                    }
                    if (distance < hitDistance) {
                        this.createBulletExplosion(bullet.x, bullet.y);
                        bullet.destroy();
                        enemy.health -= 1; // Always decrease enemy health by 1
                        this.playHitSound(); // Play hit sound
                        // Update health bar for any boss
                        if (enemy.texture.key === 'enemy3' || enemy.texture.key === 'enemy4' || enemy.texture.key === 'enemy5') {
                            this.updateEnemy3HealthBar(enemy);
                        }
                        if (enemy.health <= 0) {
                            const enemyX = enemy.x;
                            const enemyY = enemy.y;
                            const enemyType = enemy.texture.key;
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
                            if (this.enemies.getChildren().some(e => e.texture.key === 'enemy3')) {
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
                            } else if (enemyType === 'enemy3') {
                                this.unlockAchievement('bossKill');
                                this.score += 1000;
                            } else if (enemyType === 'enemy4') {
                                this.score += 1500;
                            } else if (enemyType === 'enemy5') {
                                this.unlockAchievement('bossKill');
                                this.score += 2000;
                            }
                            this.scoreText.setText('Score: ' + this.score);
                            // Handle boss destruction
                            if (enemyType === 'enemy3' || enemyType === 'enemy4' || enemyType === 'enemy5') {
                                this.enemy3HealthBar.destroy();
                                this.enemy3Destroyed = true;
                                this.enemies.clear(true, true);
                                this.enemyBullets.clear(true, true);
                                this.playSeriesOfExplosions();
                                this.time.delayedCall(2000, this.showWinScreen, [], this);
                            } else if (enemyType === 'enemy1' && !this.enemy3Destroyed) {
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
        }

        // Check if the game has been won
        if (this.enemy3Destroyed && !this.gameWon) {
            // Do nothing here, as we're using the delayed call to show the win screen
        }
        // Check enemy 3's health and adjust bullet variance
        this.enemies.getChildren().forEach((enemy) => {
            if (enemy.texture.key === 'enemy3' && enemy.health <= 80 && enemy.bulletVariance === 20) {
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
            if (powerUp.y > 600) {
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
            this.sound.play('shieldSound', { volume: 0.6 });
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
                if (this.enemies.getChildren().some(enemy => enemy.texture.key === 'enemy3')) {
                    this.upgradeDuringBossFight = true;
                }
                this.starCounter = 0;
                this.updateWeaponPowerDisplay();
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
                fontSize: '24px',
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
            // Check if the boss (enemy 3) is present in the scene
            const bossPresent = this.enemies.getChildren().some(enemy => enemy.texture.key === 'enemy3');
            if (bossPresent) {
                this.checkAchievements(); // Check achievements
            }
            if (this.hero.weaponPower === 1) {
                this.destroyHero();
            } else {
                this.hero.weaponPower--;
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
                const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);
                overlay.setDepth(1000);
                this.add.text(400, 300, 'Game Over', {
                    fontSize: '64px',
                    fill: '#fff'
                }).setOrigin(0.5).setDepth(1001);
                this.add.text(400, 350, 'Pressione qualquer tecla para reiniciar', {
                    fontSize: '24px',
                    fill: '#fff'
                }).setOrigin(0.5).setDepth(1001);
                this.input.keyboard.enabled = true;
                this.input.keyboard.once('keydown', () => {
                    this.scene.start('IntroScreen');
                });
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
                        this.physics.velocityFromRotation(angle, 200, bullet.body.velocity);
                    }
                }
            });
        }
    }
    createEnemyThree() {
        const screenWidth = this.sys.game.config.width;
        const enemyThree = this.enemies.create(screenWidth / 2, -100, 'enemy3');
        if (!enemyThree) {
            console.error('Failed to create enemy 3');
            return;
        }
        enemyThree.setScale(1.2);
        enemyThree.setVelocityY(100); // Set initial downward velocity
        enemyThree.health = 150;
        enemyThree.maxHealth = 150;
        enemyThree.bulletVariance = 20;
        enemyThree.fireDelay = 1000;
        enemyThree.isMovingHorizontally = false;
        enemyThree.horizontalSpeed = 150;

        // Play the alarm sound when enemy 3 is created
        this.sound.play('alarmSound', {
            volume: 0.3
        });

        // Stop the enemy after 2 seconds and start slow horizontal movement
        this.time.delayedCall(2000, () => {
            if (enemyThree.active) {
                enemyThree.setVelocityY(0);
                // Start slow horizontal movement immediately after stopping
                this.time.delayedCall(500, () => {
                    if (enemyThree.active) {
                        enemyThree.isMovingHorizontally = true;
                        enemyThree.setVelocityX(60); // Slow horizontal movement
                    }
                });
            }
        }, [], this);
        // Create the health bar
        this.enemy3HealthBar = this.add.graphics();
        this.updateEnemy3HealthBar(enemyThree);
        // Start the first firing pattern timer after 5 seconds
        this.time.delayedCall(5000, () => {
            if (enemyThree.active) {
                this.enemyThreeFirePattern(enemyThree);
            }
        }, [], this);
        // Start the second firing pattern timer after 5.2 seconds
        this.time.delayedCall(5200, () => {
            if (enemyThree.active) {
                this.enemyThreeFirePatternTwo(enemyThree);
            }
        }, [], this);
        // Start the third firing pattern timer after 5.4 seconds
        this.time.delayedCall(5400, () => {
            if (enemyThree.active) {
                this.enemyThreeFirePatternThree(enemyThree);
            }
        }, [], this);
        // Start the fourth firing pattern timer after 5.6 seconds
        this.time.delayedCall(5600, () => {
            if (enemyThree.active) {
                this.enemyThreeFirePatternFour(enemyThree);
            }
        }, [], this);
        // Start the fifth firing pattern timer after 5.8 seconds
        this.time.delayedCall(5800, () => {
            if (enemyThree.active) {
                this.enemyThreeFirePatternFive(enemyThree);
            }
        }, [], this);
        // Start the sixth firing pattern timer after 6 seconds
        this.time.delayedCall(6000, () => {
            if (enemyThree.active) {
                this.enemyThreeFirePatternSix(enemyThree);
            }
        }, [], this);
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
    createEnemyBullet(x, y, angle) {
        const bullet = this.enemyBullets.create(x, y, 'Cannon_bullet');
        bullet.setTint(0xff0000); // Make enemy bullets red
        const speed = 200;
        const radians = Phaser.Math.DegToRad(angle);
        bullet.setVelocity(
            Math.cos(radians) * speed,
            Math.sin(radians) * speed
        );
    }
    updateEnemy3HealthBar(enemy) {
        if (this.enemy3HealthBar) {
            this.enemy3HealthBar.clear();
            const barHeight = 500; // Height of the health bar
            const barWidth = 20; // Width of the health bar
            const x = 780; // X position of the health bar (right side of the screen)
            const y = 50; // Y position of the health bar (50 pixels from the top)
            // Draw the background of the health bar
            this.enemy3HealthBar.fillStyle(0xff0000);
            this.enemy3HealthBar.fillRect(x, y, barWidth, barHeight);
            // Calculate the height of the remaining health
            const healthPercentage = enemy.health / enemy.maxHealth;
            const remainingHealthHeight = barHeight * healthPercentage;
            // Draw the remaining health
            this.enemy3HealthBar.fillStyle(0x00ff00);
            this.enemy3HealthBar.fillRect(x, y + barHeight - remainingHealthHeight, barWidth, remainingHealthHeight);
        }
    }
    // Second boss - Enemy Four (anemy01.gif)
    createEnemyFour() {
        const screenWidth = this.sys.game.config.width;
        const enemyFour = this.enemies.create(screenWidth / 2, -100, 'enemy4');
        if (!enemyFour) {
            console.error('Failed to create enemy 4');
            return;
        }
        enemyFour.setScale(0.8);
        enemyFour.setVelocityY(80);
        enemyFour.health = 188;
        enemyFour.maxHealth = 188;
        enemyFour.boss = true;

        this.sound.play('alarmSound', { volume: 0.3 });

        // Stop and start zigzag movement after 2.5 seconds
        this.time.delayedCall(2500, () => {
            if (enemyFour.active) {
                enemyFour.setVelocityY(0);
                enemyFour.setVelocityX(80);

                // Zigzag pattern - reverse direction every 2 seconds
                this.time.addEvent({
                    delay: 2000,
                    callback: () => {
                        if (enemyFour.active) {
                            enemyFour.setVelocityX(-enemyFour.body.velocity.x);
                        }
                    },
                    loop: true
                });
            }
        });

        // Create health bar
        this.enemy3HealthBar = this.add.graphics();
        this.updateEnemy3HealthBar(enemyFour);

        // Attack pattern 1: Diagonal sweep (different from enemy3)
        this.time.delayedCall(3000, () => {
            this.startEnemyFourAttack(enemyFour);
        });
    }
    startEnemyFourAttack(enemy) {
        if (enemy.active) {
            // Fire diagonal sweep pattern
            for (let angle = 30; angle <= 150; angle += 20) {
                this.time.delayedCall((angle - 30) * 30, () => {
                    if (enemy.active) {
                        this.createEnemyBullet(enemy.x, enemy.y + 50, angle);
                    }
                });
            }
            // Fire reverse sweep
            this.time.delayedCall(600, () => {
                for (let angle = 150; angle >= 30; angle -= 20) {
                    this.time.delayedCall((150 - angle) * 30, () => {
                        if (enemy.active) {
                            this.createEnemyBullet(enemy.x, enemy.y + 50, angle);
                        }
                    });
                }
            });
            // Repeat pattern
            this.time.delayedCall(2500, () => {
                this.startEnemyFourAttack(enemy);
            });
        }
    }
    // Third boss - Enemy Five (anemy02.gif)
    createEnemyFive() {
        const screenWidth = this.sys.game.config.width;
        const enemyFive = this.enemies.create(screenWidth / 2, -120, 'enemy5');
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
        this.enemy3HealthBar = this.add.graphics();
        this.updateEnemy3HealthBar(enemyFive);

        // Attack pattern: Spiral burst (unique pattern)
        this.time.delayedCall(4000, () => {
            this.startEnemyFiveAttack(enemyFive);
        });
    }
    startEnemyFiveAttack(enemy) {
        if (enemy.active) {
            // Spiral burst pattern - fires bullets in expanding spiral
            let burstAngle = 0;
            for (let i = 0; i < 12; i++) {
                this.time.delayedCall(i * 100, () => {
                    if (enemy.active) {
                        this.createEnemyBullet(enemy.x, enemy.y + 30, burstAngle + (i * 30));
                        this.createEnemyBullet(enemy.x, enemy.y + 30, burstAngle + (i * 30) + 180);
                    }
                });
            }
            // Aimed shot at player
            this.time.delayedCall(1500, () => {
                if (enemy.active && this.hero && this.hero.active) {
                    const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.hero.x, this.hero.y);
                    const angleDeg = Phaser.Math.RadToDeg(angle);
                    this.createEnemyBullet(enemy.x, enemy.y + 30, angleDeg);
                    this.createEnemyBullet(enemy.x - 30, enemy.y + 20, angleDeg);
                    this.createEnemyBullet(enemy.x + 30, enemy.y + 20, angleDeg);
                }
            });
            // Repeat pattern
            this.time.delayedCall(3000, () => {
                this.startEnemyFiveAttack(enemy);
            });
        }
    }
    spawnPowerUp(x, y) {
        // Determine drop type based on probability
        const dropChance = Math.random();

        if (dropChance < 0.10) {
            // 10% chance - Life drop
            this.spawnLife(x, y);
        } else if (dropChance < 0.25) {
            // 15% chance - Coin drop (score only)
            this.spawnCoin(x, y);
        } else {
            // 75% chance - Weapon upgrade (bitcoin)
            const powerUp = this.powerUps.create(x, y, 'star');
            powerUp.setScale(0.5);
            powerUp.setVelocity(Phaser.Math.Between(-150, 150), Phaser.Math.Between(-150, 150));
            powerUp.setCollideWorldBounds(true);
            powerUp.setBounce(1);
            powerUp.dropType = 'upgrade';
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
        life.expirationTimer = this.time.delayedCall(12000, () => {
            this.expirePowerUp(life);
        });
    }
    expirePowerUp(powerUp) {
        if (powerUp.active) {
            powerUp.destroy();
            if (powerUp.dropType === 'upgrade') {
                this.starsCollectedBeforeExpire = 0; // Reset counter only for upgrade stars
            }
        }
    }
    showWinScreen() {
        if (!this.gameWon) {
            // Check if there are more levels
            if (this.currentLevel < 3) {
                // Advance to next level
                this.currentLevel++;
                this.enemy3Destroyed = false; // Reset for next boss

                // Show level transition message
                const levelText = this.add.text(400, 300, `Level ${this.currentLevel}!`, {
                    fontSize: '64px',
                    fill: '#ffff00'
                }).setOrigin(0.5).setDepth(1001);

                this.add.text(400, 360, 'Novo Chefe Chegando!', {
                    fontSize: '32px',
                    fill: '#fff'
                }).setOrigin(0.5).setDepth(1001);

                // Fade out and spawn next boss
                this.time.delayedCall(2000, () => {
                    levelText.destroy();
                    if (this.currentLevel === 2) {
                        this.createEnemyFour();
                    } else if (this.currentLevel === 3) {
                        this.createEnemyFive();
                    }
                });
                return;
            }

            // Final victory - all bosses defeated
            this.gameWon = true;
            this.sound.stopAll();
            this.sound.play('brassBandMusic', {
                loop: true,
                volume: 0.7
            });
            const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);
            overlay.setDepth(1000);
            this.add.text(400, 280, 'Você Venceu!', {
                fontSize: '64px',
                fill: '#fff'
            }).setOrigin(0.5).setDepth(1001);
            this.add.text(400, 340, 'Todos os Chefes Derrotados!', {
                fontSize: '32px',
                fill: '#00ff00'
            }).setOrigin(0.5).setDepth(1001);
            this.add.text(400, 400, `Sua Pontuação: ${this.score}`, {
                fontSize: '28px',
                fill: '#fff'
            }).setOrigin(0.5).setDepth(1001);
            if (this.score < 15000) {
                this.add.text(400, 450, 'Consegue superar 15.000 pontos?', {
                    fontSize: '24px',
                    fill: '#ffff00'
                }).setOrigin(0.5).setDepth(1001);
            } else {
                this.add.text(400, 450, 'Você superou 15.000 pontos!!', {
                    fontSize: '24px',
                    fill: '#00ff00'
                }).setOrigin(0.5).setDepth(1001);
            }
            this.add.text(400, 500, 'Pressione qualquer tecla para reiniciar', {
                fontSize: '24px',
                fill: '#fff'
            }).setOrigin(0.5).setDepth(1001);
            this.input.keyboard.once('keydown', () => {
                this.scene.start('IntroScreen');
            });
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
        // Check for Knucklehead achievement when the boss (enemy 3) is created
        if (this.enemies.getChildren().some(enemy => enemy.texture.key === 'enemy3') && !this.weaponUpgraded) {
            this.unlockAchievement('knucklehead');
        }
        if (this.enemy3Destroyed) {
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
        const notification = this.add.text(400, 550, `Conquista desbloqueada: ${achievementName}`, {
            fontSize: '24px',
            fill: '#ffff00',
            backgroundColor: '#000000',
            padding: {
                left: 15,
                right: 15,
                top: 10,
                bottom: 10
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
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#000000',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600,
        min: {
            width: 400,
            height: 300
        },
        max: {
            width: 1600,
            height: 1200
        }
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [IntroScreen, Example]
};

const game = new Phaser.Game(config);
class AchievementsScreen extends Phaser.Scene {
    constructor() {
        super('AchievementsScreen');
    }
    create() {
        this.add.rectangle(400, 300, 800, 600, 0x000000);

        const backButton = this.add.text(50, 40, 'Back', {
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0, 0.5).setInteractive();
        backButton.on('pointerdown', () => {
            this.scene.start('IntroScreen');
        });

        this.add.text(400, 40, 'Achievements', {
            fontSize: '36px',
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

        let yPos = 80; // Changed from 90 to 80
        achievements.forEach(achievement => {
            const achieved = localStorage.getItem(achievement.key) === 'true';
            const color = achieved ? '#00ff00' : '#ff0000';
            const status = achieved ? 'Achieved' : 'Not Achieved';
            this.add.text(50, yPos, `${achievement.name}: ${achievement.description}`, {
                fontSize: '18px',
                fill: color
            });
            this.add.text(750, yPos, status, {
                fontSize: '18px',
                fill: color
            }).setOrigin(1, 0);
            yPos += 30;
        });
    }
}