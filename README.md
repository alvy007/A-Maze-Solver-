# Pathfinder Lab: A* Maze Solver

Part of **Week 1: Classical AI Foundations, State-Space Search & Problem Solving**. The app is built with **HTML5, CSS3, and Vanilla JavaScript (ES6+)** and uses no paid APIs, backend, or build tools.

## Run locally

From the project folder, use a local server (JavaScript module imports need HTTP):

```bash
python -m http.server 8000
```

Open http://localhost:8000/ in a browser. Alternatively, open **standalone.html** directly from your computer: it bundles styles and JavaScript into one portable file.

## Test

Node.js 18+ is required:

```bash
node --test tests/astar.test.mjs
```

The project includes 16 automated tests.

## Implementation

Created an interactive 2D maze editor and optimal A* pathfinding visualizer. The solver uses Manhattan distance with four-direction movement, a binary-heap priority queue, g-scores, parent pointers, and visited-state tracking to compute shortest paths. Users can draw and erase obstacles, reposition start/goal, load random and unreachable presets, adjust animation speed, and inspect explored states and path length. Added explicit unreachable-goal handling and automated tests comparing A* results with independent BFS across 75 deterministic random mazes.

## Quick manual verification

Select Challenge maze → Find shortest path; then select Unreachable example and confirm a clear no-path result.

## Project structure

- `index.html`: semantic HTML interface
- `styles.css`: responsive UI
- `js/astar.mjs`: pure JavaScript AI algorithm / rule engine
- `js/app.mjs`: DOM controls and interactions
- `tests/astar.test.mjs`: algorithm unit tests
- `standalone.html`: portable, self-contained app for offline review
- `SUBMISSION.md`: copy-ready implementation remark and submission checklist
- `.github/workflows/ci.yml`: automated testing on GitHub pushes

## GitHub repository and GitHub Pages deployment

- **GitHub repository:** https://github.com/alvy007/A-Maze-Solver-
- **Expected live URL after enabling Pages:** https://alvy007.github.io/A-Maze-Solver-/

For one-time deployment, open **Settings → Pages** in this repository. Set **Source** to **Deploy from a branch**, select branch **main** and folder **/(root)**, and click **Save**. Verify the working site before submitting its live URL.


## License

MIT, © 2026 Alvy Rahman Masum.
