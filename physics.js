// Simple physics system with AABB collision detection
const Physics = {
    gravity: -30,
    platforms: [],
    collectibles: [],

    // Check AABB collision between two boxes
    checkAABB(box1, box2) {
        return (
            box1.min.x <= box2.max.x && box1.max.x >= box2.min.x &&
            box1.min.y <= box2.max.y && box1.max.y >= box2.min.y &&
            box1.min.z <= box2.max.z && box1.max.z >= box2.min.z
        );
    },

    // Get bounding box from mesh
    getBoundingBox(mesh) {
        const box = new THREE.Box3().setFromObject(mesh);
        return box;
    },

    // Check if player is on ground and handle platform collisions
    checkGroundCollision(player, platforms) {
        const playerBox = this.getBoundingBox(player.mesh);
        let onGround = false;
        let groundY = -Infinity;

        for (const platform of platforms) {
            const platBox = this.getBoundingBox(platform);

            // Check if player is above platform and falling onto it
            const playerBottom = playerBox.min.y;
            const playerTop = playerBox.max.y;
            const platTop = platBox.max.y;
            const platBottom = platBox.min.y;

            // Check horizontal overlap
            const horizontalOverlap =
                playerBox.min.x < platBox.max.x && playerBox.max.x > platBox.min.x &&
                playerBox.min.z < platBox.max.z && playerBox.max.z > platBox.min.z;

            if (horizontalOverlap) {
                // Landing on top of platform
                if (player.velocity.y <= 0 &&
                    playerBottom <= platTop &&
                    playerBottom >= platTop - 2 &&
                    playerTop > platTop) {

                    if (platTop > groundY) {
                        groundY = platTop;
                        onGround = true;
                    }
                }

                // Hitting platform from below
                if (player.velocity.y > 0 &&
                    playerTop >= platBottom &&
                    playerTop <= platBottom + 1 &&
                    playerBottom < platBottom) {

                    player.velocity.y = 0;
                    player.mesh.position.y = platBottom - player.size / 2 - 0.1;
                }

                // Side collisions
                if (playerBottom < platTop - 0.5 && playerTop > platBottom + 0.5) {
                    // Push player out of platform
                    const overlapX1 = platBox.max.x - playerBox.min.x;
                    const overlapX2 = playerBox.max.x - platBox.min.x;
                    const overlapZ1 = platBox.max.z - playerBox.min.z;
                    const overlapZ2 = playerBox.max.z - platBox.min.z;

                    const minOverlap = Math.min(overlapX1, overlapX2, overlapZ1, overlapZ2);

                    if (minOverlap > 0 && minOverlap < 2) {
                        if (minOverlap === overlapX1) {
                            player.mesh.position.x = platBox.max.x + player.size / 2;
                        } else if (minOverlap === overlapX2) {
                            player.mesh.position.x = platBox.min.x - player.size / 2;
                        } else if (minOverlap === overlapZ1) {
                            player.mesh.position.z = platBox.max.z + player.size / 2;
                        } else if (minOverlap === overlapZ2) {
                            player.mesh.position.z = platBox.min.z - player.size / 2;
                        }
                    }
                }
            }
        }

        if (onGround) {
            player.mesh.position.y = groundY + player.size / 2;
            player.velocity.y = 0;
        }

        return onGround;
    },

    // Check collectible collisions
    checkCollectibles(player, collectibles) {
        const collected = [];
        const playerBox = this.getBoundingBox(player.mesh);

        for (let i = collectibles.length - 1; i >= 0; i--) {
            const collectible = collectibles[i];
            if (!collectible.collected) {
                const collectBox = this.getBoundingBox(collectible.mesh);

                if (this.checkAABB(playerBox, collectBox)) {
                    collectible.collected = true;
                    collected.push(collectible);
                }
            }
        }

        return collected;
    },

    // Apply gravity to player
    applyGravity(player, deltaTime) {
        player.velocity.y += this.gravity * deltaTime;
    },

    // Update player position based on velocity
    updatePosition(player, deltaTime) {
        player.mesh.position.x += player.velocity.x * deltaTime;
        player.mesh.position.y += player.velocity.y * deltaTime;
        player.mesh.position.z += player.velocity.z * deltaTime;

        // Clamp to prevent falling forever
        if (player.mesh.position.y < -50) {
            player.mesh.position.set(0, 5, 0);
            player.velocity.set(0, 0, 0);
        }
    }
};
