# Maze Game – Change Summary and Implementation Notes

Below is a concise, developer-focused document that captures how the Maze game works relevant to the star collection feature we added, where to hook logic, and important implications for future changes.

## Core Concepts

- __Tile model (`map`)__  
  - 2D array indexed as `map[y][x]`.  
  - Types in `SquareType` (e.g. `WALL=0`, `OPEN=1`, `START=2`, `FINISH=3`, `PINK=4`, `GREEN=5`, `STAR=6`). See [server/html/maze/src/main.js](cci:7://file:///Users/danielbrandt/LocalProjects/blockly/blockly-games/server/html/maze/src/main.js:0:0-0:0).

- __Coordinates & sizes__  
  - `ROWS`, `COLS` computed from `map`.  
  - `SQUARE_SIZE = 50`.  
  - Visual positions are derived from grid coords by multiplying by `SQUARE_SIZE`.

- __Game state__  
  - `start_`, `finish_`, `pegmanX`, `pegmanY`, `pegmanD` in [main.js](cci:7://file:///Users/danielbrandt/LocalProjects/blockly/blockly-games/server/html/maze/src/main.js:0:0-0:0).  
  - `starTargets` is an array of `{x, y}` for all `STAR` tiles.  
  - `visitedStars` is a `Set` of "x,y" strings marking collected stars.

## Lifecycle & Flow

- __Entry point__  
  - [maze.html](cci:7://file:///Users/danielbrandt/LocalProjects/blockly/blockly-games/server/html/maze.html:0:0-0:0) loads and calls `BlocklyGames.callWhenLoaded(init)` → [init()](cci:1://file:///Users/danielbrandt/LocalProjects/blockly/blockly-games/server/html/maze/src/blocks.js:24:0-277:2) in [server/html/maze/src/main.js](cci:7://file:///Users/danielbrandt/LocalProjects/blockly/blockly-games/server/html/maze/src/main.js:0:0-0:0).

- __Initialization ([init()](cci:1://file:///Users/danielbrandt/LocalProjects/blockly/blockly-games/server/html/maze/src/blocks.js:24:0-277:2))__  
  - Renders UI via [Maze.html.start()](cci:1://file:///Users/danielbrandt/LocalProjects/blockly/blockly-games/server/html/maze/src/html.js:19:0-64:2) (see [server/html/maze/src/html.js](cci:7://file:///Users/danielbrandt/LocalProjects/blockly/blockly-games/server/html/maze/src/html.js:0:0-0:0)).  
  - Calls [drawMap()](cci:1://file:///Users/danielbrandt/LocalProjects/blockly/blockly-games/server/html/maze/src/main.js:309:0-463:1) to build the SVG for the maze.  
  - Scans `map` to set `start_`, `finish_`, populate `starTargets`, and initialize `visitedStars = new Set()`.  
  - Calls [reset(true)](cci:1://file:///Users/danielbrandt/LocalProjects/blockly/blockly-games/server/html/maze/src/main.js:892:0-950:1) to place Pegman and reset visuals.

- __Run/Reset__  
  - [runButtonClick()](cci:1://file:///Users/danielbrandt/LocalProjects/blockly/blockly-games/server/html/maze/src/main.js:952:0-981:1) hides Run, shows Reset, calls [reset(false)](cci:1://file:///Users/danielbrandt/LocalProjects/blockly/blockly-games/server/html/maze/src/main.js:892:0-950:1), then [execute()](cci:1://file:///Users/danielbrandt/LocalProjects/blockly/blockly-games/server/html/maze/src/main.js:1125:0-1200:1).  
  - [resetButtonClick()](cci:1://file:///Users/danielbrandt/LocalProjects/blockly/blockly-games/server/html/maze/src/main.js:1032:0-1047:1) shows Run, hides Reset, calls [reset(false)](cci:1://file:///Users/danielbrandt/LocalProjects/blockly/blockly-games/server/html/maze/src/main.js:892:0-950:1), then [levelHelp()](cci:1://file:///Users/danielbrandt/LocalProjects/blockly/blockly-games/server/html/maze/src/main.js:645:0-825:1).

- __Execution vs Animation__  
  - [execute()](cci:1://file:///Users/danielbrandt/LocalProjects/blockly/blockly-games/server/html/maze/src/main.js:1125:0-1200:1) runs the user’s program with a JS interpreter, building a transcript `log` (movement/turn/look/fail/finish).  
  - After interpretation finishes, [execute()](cci:1://file:///Users/danielbrandt/LocalProjects/blockly/blockly-games/server/html/maze/src/main.js:1125:0-1200:1) calls [reset(false)](cci:1://file:///Users/danielbrandt/LocalProjects/blockly/blockly-games/server/html/maze/src/main.js:892:0-950:1) (critical) and then schedules [animate()](cci:1://file:///Users/danielbrandt/LocalProjects/blockly/blockly-games/server/html/maze/src/main.js:1190:0-1258:1).  
  - [animate()](cci:1://file:///Users/danielbrandt/LocalProjects/blockly/blockly-games/server/html/maze/src/main.js:1190:0-1258:1) replays the `log`, updates `pegmanX/pegmanY/pegmanD` incrementally, and moves Pegman onscreen via [schedule()](cci:1://file:///Users/danielbrandt/LocalProjects/blockly/blockly-games/server/html/maze/src/main.js:1304:0-1330:1).

## Rendering & Stars

- __Board rendering ([drawMap()](cci:1://file:///Users/danielbrandt/LocalProjects/blockly/blockly-games/server/html/maze/src/main.js:309:0-463:1))__  
  - Creates the background, path tiles, and the finish marker in SVG (`#svgMaze`).  
  - For each `STAR` tile, creates an SVG `<polygon>` with ID `star-x-y` (e.g., `star-2-1`) and gold appearance: `fill: #fdd835`, `stroke: #f9a825`, `fill-opacity: 0.95`.

- __Star visual helper ([setStarCollected_(x, y, collected)](cci:1://file:///Users/danielbrandt/LocalProjects/blockly/blockly-games/server/html/maze/src/main.js:1642:0-1662:1))__  
  - Looks up the polygon via ID `star-x-y`.  
  - Sets gold fill/stroke when uncollected; sets white/grey when collected.  
  - This enables direct DOM updates without re-rendering the board.

## Reset Behavior

- __What [reset(first)](cci:1://file:///Users/danielbrandt/LocalProjects/blockly/blockly-games/server/html/maze/src/main.js:892:0-950:1) does__  
  - Clears pending timeouts.  
  - Sets `pegmanX/Y` to `start_`.  
  - Clears `visitedStars`.  
  - Iterates `starTargets` and calls [setStarCollected_(x, y, false)](cci:1://file:///Users/danielbrandt/LocalProjects/blockly/blockly-games/server/html/maze/src/main.js:1642:0-1662:1) to visually reset all stars to gold.  
  - Repositions Pegman and finish markers, hides the look icon.

- __Design decision__  
  - Removed redundant “collect star at start” logic because `START` and `STAR` are mutually exclusive in `map`. This simplifies the reset path.

## Movement & Collection

- __Movement ([move(direction, id)](cci:1://file:///Users/danielbrandt/LocalProjects/blockly/blockly-games/server/html/maze/src/main.js:1532:0-1578:1))__  
  - Performs collision checks via [isPath](cci:1://file:///Users/danielbrandt/LocalProjects/blockly/blockly-games/server/html/maze/src/main.js:1580:0-1613:1).  
  - Updates `pegmanX/pegmanY` immediately during interpretation and pushes an action to `log`.  
  - Previously, we added logic here to:  
    - Mark stars collected: `visitedStars.add("x,y")`.  
    - Update visuals: [setStarCollected_(x, y, true)](cci:1://file:///Users/danielbrandt/LocalProjects/blockly/blockly-games/server/html/maze/src/main.js:1642:0-1662:1).

- __Animation ([animate()](cci:1://file:///Users/danielbrandt/LocalProjects/blockly/blockly-games/server/html/maze/src/main.js:1190:0-1258:1))__  
  - Consumes `log` and moves Pegman onscreen, updating `pegmanX/pegmanY/pegmanD` per action.  
  - Plays win/fail sequences as needed.

- __Completion condition ([notDone()](cci:1://file:///Users/danielbrandt/LocalProjects/blockly/blockly-games/server/html/maze/src/main.js:1664:0-1672:1))__  
  - Returns false (done) only when Pegman reaches `finish_` and all stars have been collected (`visitedStars.size >= starTargets.length`).

## Visual Behavior (Stars)

- __On step__: When Pegman steps onto a `STAR` tile during animation, the star turns white to indicate collection.  
  - Implemented in `animate()` after each movement: check `map[pegmanY][pegmanX] === SquareType.STAR`; if not yet visited, add to `visitedStars` and call `setStarCollected_(pegmanX, pegmanY, true)`.
- __On reset__: `reset()` clears `visitedStars` and iterates `starTargets` to set all stars back to gold via `setStarCollected_(x, y, false)`.
- __DOM targeting__: Star polygons are created with IDs `star-x-y` (e.g., `star-2-1`).

## What We Changed

- __Added star visual feedback__  
  - Implemented [setStarCollected_(x, y, collected)](cci:1://file:///Users/danielbrandt/LocalProjects/blockly/blockly-games/server/html/maze/src/main.js:1642:0-1662:1) to toggle star colors.  
  - Ensured star IDs are stable (`star-x-y`) for direct DOM manipulation.

- __State & reset__  
  - [reset()](cci:1://file:///Users/danielbrandt/LocalProjects/blockly/blockly-games/server/html/maze/src/main.js:892:0-950:1) now clears `visitedStars` and resets all stars to gold.  
  - Removed “starting tile star” special-case logic for clarity.
 
## Implementation Summary (Stars)

- __Logic vs visuals__: Interpretation-time movement (`move()`) can mark stars as visited in `visitedStars`, but the DOM color change only occurs during animation in `animate()` to survive the pre-animation `reset(false)`.
- __Idempotency__: `animate()` guards with a `Set` check so the visual update only fires once per star.
- __Finish condition__: `notDone()` considers the level complete only when Pegman reaches `finish_` and `visitedStars.size >= starTargets.length`.

## Debug Logging (Planned/Where to Add)

- __Creation__: In [drawMap()](cci:1://file:///Users/danielbrandt/LocalProjects/blockly/blockly-games/server/html/maze/src/main.js:309:0-463:1) when creating each star, log coordinates and assigned ID.  
- __Init target collection__: After populating `starTargets` in [init()](cci:1://file:///Users/danielbrandt/LocalProjects/blockly/blockly-games/server/html/maze/src/blocks.js:24:0-277:2), log the array.  
- __Reset__: In [reset()](cci:1://file:///Users/danielbrandt/LocalProjects/blockly/blockly-games/server/html/maze/src/main.js:892:0-950:1), log that `visitedStars` cleared and each star reset.  
- __Move__: Log pre/post `pegmanX/pegmanY`, tile type, and star collection events.  
- __setStarCollected_()__: Log element found/not found and before/after attributes.

These logs help verify coordinate math, element IDs, and confirm if DOM mutations occur as expected.

## How to Run and Test

- __Open the game__: [server/html/maze.html](cci:7://file:///Users/danielbrandt/LocalProjects/blockly/blockly-games/server/html/maze.html:0:0-0:0) in a local web server (avoid `file://` to prevent asset/XHR issues).  
- __Levels with stars__: Level 1 features `STAR` tiles (`SquareType.STAR = 6`).  
- __Console__: Use browser devtools to watch logs while stepping on stars; validate that star polygons exist with IDs like `star-2-1` and that their `fill`/`stroke` update.

## Known Gotchas

- __Coordinate consistency__: Always use the grid (`x`, `y`) to compute IDs and lookups; `map[y][x]` order matters.  
- __Opacity & layering__: If colors change but visuals don’t, check `fill-opacity` and SVG stacking order in `#svgMaze`.

## Files of Interest

- __Main logic__: [server/html/maze/src/main.js](cci:7://file:///Users/danielbrandt/LocalProjects/blockly/blockly-games/server/html/maze/src/main.js:0:0-0:0)  
- __UI/HTML generator__: [server/html/maze/src/html.js](cci:7://file:///Users/danielbrandt/LocalProjects/blockly/blockly-games/server/html/maze/src/html.js:0:0-0:0) ([Maze.html.start()](cci:1://file:///Users/danielbrandt/LocalProjects/blockly/blockly-games/server/html/maze/src/html.js:19:0-64:2))  
- __Blocks__: [server/html/maze/src/blocks.js](cci:7://file:///Users/danielbrandt/LocalProjects/blockly/blockly-games/server/html/maze/src/blocks.js:0:0-0:0)  
- __Entry HTML__: [server/html/maze.html](cci:7://file:///Users/danielbrandt/LocalProjects/blockly/blockly-games/server/html/maze.html:0:0-0:0)

## Status and Next Steps

- __Status__: Star drawing, stable IDs, collection state, and animation-time visual updates are in place.  
- __Next__: Add detailed logging at the noted points to verify end-to-end behavior and aid future debugging.