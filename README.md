# Bright Jump

A browser-based 3D platformer designed for visually impaired players, featuring high contrast visuals and audio feedback.

## Features

- **High Contrast Visuals** - Black background with bright neon colors (cyan, yellow, magenta)
- **Large Objects** - Oversized player and platforms for easy visibility
- **Audio Feedback** - Sound effects for movement, jumping, landing, and collecting items
- **Simple Controls** - Keyboard-only input
- **No Installation** - Runs directly in any modern browser

## Play

**[Play online](https://ohylli.github.io/bright-jump/)** - No download required!

Or clone the repo and open `index.html` locally.

**Controls:**
| Key | Action |
|-----|--------|
| W / Arrow Up | Move forward |
| S / Arrow Down | Move backward |
| A / Arrow Left | Move left |
| D / Arrow Right | Move right |
| Space | Jump |
| R | Restart (after winning) |

## Accessibility Design

This game was designed with visual accessibility in mind:

- **Color Choices**: Maximum contrast colors against pure black background
  - Player: Cyan (#00FFFF)
  - Platforms: Yellow (#FFFF00)
  - Collectibles: Magenta (#FF00FF)
  - Boundaries: Orange (#FF8000)

- **Object Size**: All game objects are large and use simple geometric shapes (cubes, spheres)

- **Audio Cues**: Every player action produces a distinct sound
  - Footsteps while walking
  - Rising tone when jumping
  - Thud when landing
  - Chime when collecting items

## Tech Stack

- [Three.js](https://threejs.org/) - 3D rendering
- Web Audio API - Procedural sound generation
- Vanilla JavaScript - No build tools required

## License

MIT
