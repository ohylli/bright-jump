// Player controller with keyboard input
const Player = {
    mesh: null,
    velocity: null,
    size: 2,
    moveSpeed: 15,
    jumpForce: 15,
    isGrounded: false,
    wasGrounded: false,
    isMoving: false,

    // Input state
    keys: {
        forward: false,
        backward: false,
        left: false,
        right: false,
        jump: false
    },

    init(scene) {
        // Create large cyan cube for player
        const geometry = new THREE.BoxGeometry(this.size, this.size, this.size);
        const material = new THREE.MeshBasicMaterial({ color: 0x00FFFF });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(0, 5, 0);
        scene.add(this.mesh);

        // Initialize velocity
        this.velocity = new THREE.Vector3(0, 0, 0);

        // Set up keyboard listeners
        this.setupControls();

        return this;
    },

    setupControls() {
        window.addEventListener('keydown', (e) => {
            this.handleKey(e.code, true);
        });

        window.addEventListener('keyup', (e) => {
            this.handleKey(e.code, false);
        });
    },

    handleKey(code, pressed) {
        switch (code) {
            case 'KeyW':
            case 'ArrowUp':
                this.keys.forward = pressed;
                break;
            case 'KeyS':
            case 'ArrowDown':
                this.keys.backward = pressed;
                break;
            case 'KeyA':
            case 'ArrowLeft':
                this.keys.left = pressed;
                break;
            case 'KeyD':
            case 'ArrowRight':
                this.keys.right = pressed;
                break;
            case 'Space':
                this.keys.jump = pressed;
                break;
            case 'KeyR':
                if (pressed && window.Game) {
                    window.Game.restart();
                }
                break;
        }
    },

    update(camera) {
        // Calculate movement direction based on camera orientation
        const direction = new THREE.Vector3();

        // Get camera forward direction (ignore Y component for horizontal movement)
        const cameraDirection = new THREE.Vector3();
        camera.getWorldDirection(cameraDirection);
        cameraDirection.y = 0;
        cameraDirection.normalize();

        // Get camera right direction
        const cameraRight = new THREE.Vector3();
        cameraRight.crossVectors(cameraDirection, new THREE.Vector3(0, 1, 0));
        cameraRight.normalize();

        // Apply input to direction
        if (this.keys.forward) {
            direction.add(cameraDirection);
        }
        if (this.keys.backward) {
            direction.sub(cameraDirection);
        }
        if (this.keys.left) {
            direction.sub(cameraRight);
        }
        if (this.keys.right) {
            direction.add(cameraRight);
        }

        // Normalize and apply speed
        if (direction.length() > 0) {
            direction.normalize();
            this.velocity.x = direction.x * this.moveSpeed;
            this.velocity.z = direction.z * this.moveSpeed;
            this.isMoving = true;

            // Play footstep sound if grounded
            if (this.isGrounded) {
                AudioSystem.playFootstep();
            }
        } else {
            this.velocity.x = 0;
            this.velocity.z = 0;
            this.isMoving = false;
        }

        // Jump
        if (this.keys.jump && this.isGrounded) {
            this.velocity.y = this.jumpForce;
            this.isGrounded = false;
            AudioSystem.playJump();
        }
    },

    setGrounded(grounded) {
        this.wasGrounded = this.isGrounded;
        this.isGrounded = grounded;

        // Play landing sound
        if (this.isGrounded && !this.wasGrounded && this.velocity.y <= 0) {
            AudioSystem.playLand();
        }
    },

    reset() {
        this.mesh.position.set(0, 5, 0);
        this.velocity.set(0, 0, 0);
        this.isGrounded = false;
        this.wasGrounded = false;
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            jump: false
        };
    }
};
