# Submission details: Pathfinder Lab: A* Maze Solver

- **GitHub repository:** To be created/linked during the deployment phase.
- **Live demo:** To be deployed and verified after all four Week 1 projects are completed.
- **Attachment:** Upload the ZIP archive for this project.
- **Automated tests:** 16 passing tests.

## Implementation remarks (copy/paste)

Created an interactive 2D maze editor and optimal A* pathfinding visualizer. The solver uses Manhattan distance with four-direction movement, a binary-heap priority queue, g-scores, parent pointers, and visited-state tracking to compute shortest paths. Users can draw and erase obstacles, reposition start/goal, load random and unreachable presets, adjust animation speed, and inspect explored states and path length. Added explicit unreachable-goal handling and automated tests comparing A* results with independent BFS across 75 deterministic random mazes.

**Technology:** HTML5, CSS3, Vanilla JavaScript ES6+, Node.js built-in test runner.

## Manual review

Select Challenge maze → Find shortest path; then select Unreachable example and confirm a clear no-path result.

**Do not claim the website is deployed or the assignment is submitted until you have actually verified and submitted it.**
