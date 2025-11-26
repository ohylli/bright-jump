// Main game controller
const Game = {
    scene: null,
    camera: null,
    renderer: null,
    clock: null,
    started: false,
    won: false,

    // Camera settings
    cameraOffset: new THREE.Vector3(0, 12, 20),
    cameraLookOffset: new THREE.Vector3(0, 0, -5),

    init() {
        // Initialize Three.js
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);

        // Set up camera (third-person view)
        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 15, 25);
        this.camera.lookAt(0, 0, 0);

        // Set up renderer
        const canvas = document.getElementById('game-canvas');
        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        // Initialize clock for delta time
        this.clock = new THREE.Clock();

        // Add ambient light (helps with visibility)
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // Initialize game systems
        AudioSystem.init();
        Player.init(this.scene);
        World.init(this.scene);

        // Update UI
        this.updateUI();

        // Handle window resize
        window.addEventListener('resize', () => this.onResize());

        // Start game on click
        const instructions = document.getElementById('instructions');
        instructions.addEventListener('click', () => this.start());

        // Start game on space key
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.started) {
                e.preventDefault();
                this.start();
            }
        });

        // Make Game globally accessible for restart
        window.Game = this;

        // Start render loop
        this.animate();
    },

    start() {
        if (this.started) return;

        this.started = true;
        document.getElementById('instructions').classList.add('hidden');

        // Resume audio context (required by browsers)
        AudioSystem.resume();

        this.clock.start();
    },

    animate() {
        requestAnimationFrame(() => this.animate());

        if (!this.started || this.won) {
            this.renderer.render(this.scene, this.camera);
            return;
        }

        const deltaTime = Math.min(this.clock.getDelta(), 0.1);
        const time = this.clock.getElapsedTime();

        // Update player input
        Player.update(this.camera);

        // Apply physics
        Physics.applyGravity(Player, deltaTime);
        Physics.updatePosition(Player, deltaTime);

        // Check ground collision
        const isGrounded = Physics.checkGroundCollision(Player, World.platforms);
        Player.setGrounded(isGrounded);

        // Check collectible collisions
        const collected = Physics.checkCollectibles(Player, World.collectibles);
        collected.forEach(c => {
            World.removeCollectible(c);
            AudioSystem.playCollect();
            this.updateUI();
        });

        // Check win condition
        if (World.getCollectedCount() === World.totalCollectibles && !this.won) {
            this.win();
        }

        // Update world animations
        World.update(time);

        // Update camera to follow player
        this.updateCamera();

        // Render
        this.renderer.render(this.scene, this.camera);
    },

    updateCamera() {
        // Smooth camera follow
        const targetPosition = new THREE.Vector3()
            .copy(Player.mesh.position)
            .add(this.cameraOffset);

        this.camera.position.lerp(targetPosition, 0.1);

        // Look at player
        const lookTarget = new THREE.Vector3()
            .copy(Player.mesh.position)
            .add(this.cameraLookOffset);

        this.camera.lookAt(lookTarget);
    },

    updateUI() {
        document.getElementById('collected').textContent = World.getCollectedCount();
        document.getElementById('total').textContent = World.totalCollectibles;
    },

    win() {
        this.won = true;
        document.getElementById('win-message').classList.remove('hidden');
        AudioSystem.playWin();
    },

    restart() {
        this.won = false;
        this.started = false;
        document.getElementById('win-message').classList.add('hidden');
        document.getElementById('instructions').classList.remove('hidden');

        // Reset player and world
        Player.reset();
        World.reset(this.scene);

        this.updateUI();
    },

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
};

// Start game when page loads
window.addEventListener('DOMContentLoaded', () => Game.init());
