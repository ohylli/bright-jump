# 3D Platformer - Accessible Edition

A browser-based 3D platformer designed for visually impaired players with high contrast visuals and audio feedback.

## Tech Stack

- **Three.js** (r128 via CDN) - 3D rendering
- **Web Audio API** - Procedural sound generation
- **Vanilla JavaScript** - No build tools required

## Project Structure

```
index.html   - Entry point, loads all scripts
style.css    - Fullscreen canvas, high-contrast UI
audio.js     - Procedural sound effects (AudioSystem)
physics.js   - Gravity and AABB collision (Physics)
player.js    - Player movement and controls (Player)
world.js     - Platforms and collectibles (World)
game.js      - Main game loop and camera (Game)
```

## Running the Game

Open `index.html` in a browser. No server required for basic functionality, though some browsers may require a local server for module loading.

## Key Design Decisions

### Accessibility
- Black background (#000000) with bright contrasting colors
- Large geometric shapes (player: 2 units, platforms: 5-20 units)
- Audio feedback for all player actions
- Simple controls (WASD/Arrows + Space)

### Color Palette
- Player: Cyan (#00FFFF)
- Platforms: Yellow (#FFFF00)
- Collectibles: Magenta (#FF00FF)
- Boundaries: Orange (#FF8000)

### Architecture
- Global objects (Game, Player, World, Physics, AudioSystem) for simplicity
- No ES modules to avoid CORS issues when opening directly
- MeshBasicMaterial used throughout for maximum color brightness

## Common Tasks

### Adding a Platform
Edit `world.js` `createFloatingPlatforms()` - add to `platformData` array:
```javascript
{ x: 0, y: 5, z: 0, w: 10, h: 2, d: 10 }
```

### Adding a Sound Effect
Edit `audio.js` - add a new method to `AudioSystem` using oscillators or noise buffers.

### Adjusting Physics
Edit `physics.js` - `gravity` constant (-30) or `player.js` - `jumpForce` (15), `moveSpeed` (15).
