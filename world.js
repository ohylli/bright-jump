// World generation - platforms and collectibles
const World = {
    platforms: [],
    collectibles: [],
    totalCollectibles: 0,

    // Color constants for high visibility
    colors: {
        platform: 0xFFFF00,      // Bright yellow
        collectible: 0xFF00FF,   // Bright magenta
        boundary: 0xFF8000       // Bright orange
    },

    init(scene) {
        this.platforms = [];
        this.collectibles = [];
        this.totalCollectibles = 0;

        // Create the world
        this.createStartPlatform(scene);
        this.createFloatingPlatforms(scene);
        this.createBoundaries(scene);

        return this;
    },

    createStartPlatform(scene) {
        // Large starting platform
        const geometry = new THREE.BoxGeometry(20, 2, 20);
        const material = new THREE.MeshBasicMaterial({ color: this.colors.platform });
        const platform = new THREE.Mesh(geometry, material);
        platform.position.set(0, -1, 0);
        scene.add(platform);
        this.platforms.push(platform);
    },

    createFloatingPlatforms(scene) {
        // Define platform positions for exploration
        const platformData = [
            // Inner ring - easy jumps
            { x: 15, y: 2, z: 0, w: 10, h: 2, d: 10 },
            { x: -15, y: 2, z: 0, w: 10, h: 2, d: 10 },
            { x: 0, y: 2, z: 15, w: 10, h: 2, d: 10 },
            { x: 0, y: 2, z: -15, w: 10, h: 2, d: 10 },

            // Diagonal platforms
            { x: 12, y: 4, z: 12, w: 8, h: 2, d: 8 },
            { x: -12, y: 4, z: 12, w: 8, h: 2, d: 8 },
            { x: 12, y: 4, z: -12, w: 8, h: 2, d: 8 },
            { x: -12, y: 4, z: -12, w: 8, h: 2, d: 8 },

            // Outer ring - higher platforms
            { x: 25, y: 6, z: 0, w: 8, h: 2, d: 8 },
            { x: -25, y: 6, z: 0, w: 8, h: 2, d: 8 },
            { x: 0, y: 6, z: 25, w: 8, h: 2, d: 8 },
            { x: 0, y: 6, z: -25, w: 8, h: 2, d: 8 },

            // Tall pillars
            { x: 20, y: 10, z: 20, w: 6, h: 2, d: 6 },
            { x: -20, y: 10, z: 20, w: 6, h: 2, d: 6 },
            { x: 20, y: 10, z: -20, w: 6, h: 2, d: 6 },
            { x: -20, y: 10, z: -20, w: 6, h: 2, d: 6 },

            // Stepping stones
            { x: 30, y: 8, z: 10, w: 5, h: 2, d: 5 },
            { x: -30, y: 8, z: 10, w: 5, h: 2, d: 5 },
            { x: 30, y: 8, z: -10, w: 5, h: 2, d: 5 },
            { x: -30, y: 8, z: -10, w: 5, h: 2, d: 5 },

            // Central tower
            { x: 0, y: 8, z: 0, w: 6, h: 2, d: 6 },
            { x: 0, y: 14, z: 0, w: 5, h: 2, d: 5 },
        ];

        platformData.forEach(p => {
            const geometry = new THREE.BoxGeometry(p.w, p.h, p.d);
            const material = new THREE.MeshBasicMaterial({ color: this.colors.platform });
            const platform = new THREE.Mesh(geometry, material);
            platform.position.set(p.x, p.y, p.z);
            scene.add(platform);
            this.platforms.push(platform);

            // Add collectible on most platforms
            if (Math.random() > 0.2) {
                this.createCollectible(scene, p.x, p.y + 3, p.z);
            }
        });

        // Add extra collectibles
        this.createCollectible(scene, 0, 3, 0); // On start platform
        this.createCollectible(scene, 0, 18, 0); // Top of tower
    },

    createCollectible(scene, x, y, z) {
        const geometry = new THREE.SphereGeometry(1, 16, 16);
        const material = new THREE.MeshBasicMaterial({ color: this.colors.collectible });
        const collectible = new THREE.Mesh(geometry, material);
        collectible.position.set(x, y, z);
        scene.add(collectible);

        const collectibleObj = {
            mesh: collectible,
            collected: false,
            baseY: y,
            phase: Math.random() * Math.PI * 2
        };

        this.collectibles.push(collectibleObj);
        this.totalCollectibles++;
    },

    createBoundaries(scene) {
        const boundaryMaterial = new THREE.MeshBasicMaterial({ color: this.colors.boundary });

        // Create invisible walls to prevent falling off the world
        const wallHeight = 30;
        const worldSize = 50;
        const wallThickness = 2;

        const walls = [
            { x: worldSize, y: wallHeight / 2, z: 0, w: wallThickness, h: wallHeight, d: worldSize * 2 },
            { x: -worldSize, y: wallHeight / 2, z: 0, w: wallThickness, h: wallHeight, d: worldSize * 2 },
            { x: 0, y: wallHeight / 2, z: worldSize, w: worldSize * 2, h: wallHeight, d: wallThickness },
            { x: 0, y: wallHeight / 2, z: -worldSize, w: worldSize * 2, h: wallHeight, d: wallThickness },
        ];

        walls.forEach(w => {
            const geometry = new THREE.BoxGeometry(w.w, w.h, w.d);
            const wall = new THREE.Mesh(geometry, boundaryMaterial);
            wall.position.set(w.x, w.y, w.z);
            scene.add(wall);
            this.platforms.push(wall); // Add to platforms for collision
        });
    },

    update(time) {
        // Animate collectibles - bob up and down and rotate
        this.collectibles.forEach(c => {
            if (!c.collected) {
                c.mesh.rotation.y += 0.03;
                c.mesh.position.y = c.baseY + Math.sin(time * 2 + c.phase) * 0.5;

                // Pulse scale for visibility
                const scale = 1 + Math.sin(time * 3 + c.phase) * 0.15;
                c.mesh.scale.set(scale, scale, scale);
            }
        });
    },

    removeCollectible(collectible) {
        collectible.mesh.visible = false;
    },

    getCollectedCount() {
        return this.collectibles.filter(c => c.collected).length;
    },

    reset(scene) {
        // Remove all objects from scene
        this.platforms.forEach(p => scene.remove(p));
        this.collectibles.forEach(c => scene.remove(c.mesh));

        // Reinitialize
        this.platforms = [];
        this.collectibles = [];
        this.totalCollectibles = 0;

        this.createStartPlatform(scene);
        this.createFloatingPlatforms(scene);
        this.createBoundaries(scene);
    }
};
