

# WebGPU Playground

A creative coding environment for exploring WebGPU graphics programming with premade examples, a code editor, and the ability to save your own creations.

---

## Core Features

### 🎨 Canvas Rendering Area
- Full-screen canvas that renders WebGPU content
- Toggle between **canvas-focused mode** (immersive viewing) and **side-by-side mode** (editor + canvas)
- Real-time performance stats overlay (FPS, GPU info, render time)
- Playback controls: play/pause, reset, and animation speed slider

### 📝 Code Editor
- Syntax-highlighted editor using Monaco Editor (VS Code's engine)
- WGSL shader code editing with proper highlighting
- Live preview - code changes render in real-time
- Error display when shader compilation fails

### 📚 Premade Examples Library
- **Visual Shaders** (3-5 examples): Gradient flows, noise patterns, color cycling, psychedelic effects
- **3D Graphics** (3-5 examples): Rotating cube, sphere with lighting, wireframe geometry
- **Particle Systems** (3-5 examples): Starfield, fire effect, bouncing particles
- Each example includes a title, description, and thumbnail preview
- "Fork" button to copy any example to your saved creations for modification

### 💾 User Creations
- Save custom shaders to localStorage with names
- Gallery view of saved creations with thumbnails
- Load, edit, rename, and delete saved creations
- Export canvas as PNG screenshot

---

## Layout & Navigation

### View Modes
1. **Gallery View** - Browse premade examples and saved creations as cards
2. **Canvas-Focused View** - Large canvas with floating controls, editor slides in from side
3. **Split View** - 50/50 code editor and canvas side-by-side

### Header Bar
- Logo/title
- View mode toggle buttons
- Theme selector dropdown
- "New Creation" button

---

## Theme System

Three toggleable visual themes:
1. **Dark & Technical** - Dark background, monospace fonts, terminal aesthetic, green/cyan accents
2. **Modern & Clean** - Subtle grays, soft shadows, Inter font, minimal design
3. **Colorful & Playful** - Gradient backgrounds, vibrant accent colors, rounded corners, fun animations

Themes persist in localStorage.

---

## Browser Compatibility

- Check for WebGPU support on load
- Display a friendly message for unsupported browsers explaining:
  - What WebGPU is
  - Which browsers support it (Chrome 113+, Edge 113+, Firefox Nightly)
  - Suggestion to update or switch browsers

---

## User Flow

1. **First Visit**: User sees the gallery of premade examples
2. **Explore**: Click an example to view it in canvas-focused mode
3. **Learn**: Toggle to split view to see the code behind the effect
4. **Create**: Fork an example or start from scratch with "New Creation"
5. **Save**: Name and save creation to localStorage
6. **Export**: Download a screenshot of their favorite render

---

## Technical Approach

- WebGPU API for all rendering (no WebGL fallback)
- Monaco Editor for code editing
- localStorage for saving user creations and theme preference
- React state management for UI
- Responsive design for different screen sizes

