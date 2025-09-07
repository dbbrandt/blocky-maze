/**
 * @license
 * Copyright 2012 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Blocks for Maze game.
 * @author blocklygames@neil.fraser.name (Neil Fraser)
 */
'use strict';

goog.provide('Maze.Blocks');

goog.require('Blockly');
goog.require('Blockly.Blocks.procedures');
goog.require('Blockly.JavaScript');
goog.require('Blockly.JavaScript.procedures');
goog.require('Blockly.Extensions');
goog.require('Blockly.FieldDropdown');
goog.require('Blockly.FieldNumber');
goog.require('Blockly.FieldImage');
goog.require('BlocklyGames');


/**
 * Construct custom maze block types.  Called on page load.
 */
Maze.Blocks.init = function() {
  /**
   * Common HSV hue for all movement blocks.
   */
  const MOVEMENT_HUE = 290;

  /**
   * HSV hue for loop block.
   */
  const LOOPS_HUE = 120;

  /**
   * Common HSV hue for all logic blocks.
   */
  const LOGIC_HUE = 210;

  /**
   * Counterclockwise arrow to be appended to left turn option.
   */
  const LEFT_TURN = ' ↺';

  /**
   * Clockwise arrow to be appended to right turn option.
   */
  const RIGHT_TURN = ' ↻';

  const TURN_DIRECTIONS = [
    [BlocklyGames.getMsg('Maze.turnLeft', false), 'turnLeft'],
    [BlocklyGames.getMsg('Maze.turnRight', false), 'turnRight'],
  ];

  const PATH_DIRECTIONS = [
    [BlocklyGames.getMsg('Maze.pathAhead', false), 'isPathForward'],
    [BlocklyGames.getMsg('Maze.pathLeft', false), 'isPathLeft'],
    [BlocklyGames.getMsg('Maze.pathRight', false), 'isPathRight'],
  ];

  const SQUARE_TYPE_OPTIONS = [
    ['Pink', '4'],
    ['Green', '5'],
    ['Star', '6'],
    ['Open', '1'],
  ];

  // Add arrows to turn options after prefix/suffix have been separated.
  Blockly.Extensions.register('maze_turn_arrows',
      function() {
        const options = this.getField('DIR').getOptions();
        options[options.length - 2][0] += LEFT_TURN;
        options[options.length - 1][0] += RIGHT_TURN;
      });

  Blockly.defineBlocksWithJsonArray([
    // Block for moving forward.
    {
      "type": "maze_moveForward",
      "message0": BlocklyGames.getMsg('Maze.moveForward', false),
      "previousStatement": null,
      "nextStatement": null,
      "colour": MOVEMENT_HUE,
      "tooltip": BlocklyGames.getMsg('Maze.moveForwardTooltip', false),
    },

    // Block for turning left or right.
    {
      "type": "maze_turn",
      "message0": "%1",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "DIR",
          "options": TURN_DIRECTIONS,
        },
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": MOVEMENT_HUE,
      "tooltip": BlocklyGames.getMsg('Maze.turnTooltip', false),
      "extensions": ["maze_turn_arrows"],
    },

    // Block for turning left or right only if on a given square type.
    {
      "type": "maze_turnIfOn",
      "message0": "%1 if on %2",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "DIR",
          "options": TURN_DIRECTIONS,
        },
        {
          "type": "field_dropdown",
          "name": "TYPE",
          "options": SQUARE_TYPE_OPTIONS,
        },
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": MOVEMENT_HUE,
      "tooltip": "Turn only if Pegman is on the selected square type.",
      "extensions": ["maze_turn_arrows"],
    },

    // Block for conditional "if there is a path".
    {
      "type": "maze_if",
      "message0": `%1%2${BlocklyGames.getMsg('Maze.doCode', false)}%3`,
      "args0": [
        {
          "type": "field_dropdown",
          "name": "DIR",
          "options": PATH_DIRECTIONS,
        },
        {
          "type": "input_dummy",
        },
        {
          "type": "input_statement",
          "name": "DO",
        },
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": LOGIC_HUE,
      "tooltip": BlocklyGames.getMsg('Maze.ifTooltip', false),
      "extensions": ["maze_turn_arrows"],
    },

    // Block for conditional "if there is a path, else".
    {
      "type": "maze_ifElse",
      "message0": `%1%2${BlocklyGames.getMsg('Maze.doCode', false)}%3${window['BlocklyMsg']['CONTROLS_IF_MSG_ELSE']}%4`,
      "args0": [
        {
          "type": "field_dropdown",
          "name": "DIR",
          "options": PATH_DIRECTIONS,
        },
        {
          "type": "input_dummy",
        },
        {
          "type": "input_statement",
          "name": "DO",
        },
        {
          "type": "input_statement",
          "name": "ELSE",
        },
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": LOGIC_HUE,
      "tooltip": BlocklyGames.getMsg('Maze.ifelseTooltip', false),
      "extensions": ["maze_turn_arrows"],
    },

    // Block for checking if Pegman is on a given square type.
    {
      "type": "maze_isOnSquareType",
      "message0": "is on %1",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "TYPE",
          "options": SQUARE_TYPE_OPTIONS,
        },
      ],
      "output": "Boolean",
      "colour": LOGIC_HUE,
      "tooltip": "Returns true if Pegman is currently on the selected square type.",
    },

    // Block for conditional "if on square type".
    {
      "type": "maze_ifOnSquareType",
      "message0": `if on %1%2${BlocklyGames.getMsg('Maze.doCode', false)}%3`,
      "args0": [
        {
          "type": "field_dropdown",
          "name": "TYPE",
          "options": SQUARE_TYPE_OPTIONS,
        },
        {
          "type": "input_dummy",
        },
        {
          "type": "input_statement",
          "name": "DO",
        },
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": LOGIC_HUE,
      "tooltip": "If Pegman is on the selected square type, do the enclosed blocks.",
    },

    // Block for conditional "if on square type, else".
    {
      "type": "maze_ifElseOnSquareType",
      "message0": `if on %1%2${BlocklyGames.getMsg('Maze.doCode', false)}%3${window['BlocklyMsg']['CONTROLS_IF_MSG_ELSE']}%4`,
      "args0": [
        {
          "type": "field_dropdown",
          "name": "TYPE",
          "options": SQUARE_TYPE_OPTIONS,
        },
        {
          "type": "input_dummy",
        },
        {
          "type": "input_statement",
          "name": "DO",
        },
        {
          "type": "input_statement",
          "name": "ELSE",
        },
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": LOGIC_HUE,
      "tooltip": "If Pegman is on the selected square type, do the first set of blocks, otherwise do the second.",
    },

    // Block for repeat loop.
    {
      "type": "maze_forever",
      "message0": `${BlocklyGames.getMsg('Maze.repeatUntil', false)}%1%2${BlocklyGames.getMsg('Maze.doCode', false)}%3`,
      "args0": [
        {
          "type": "field_image",
          "src": "maze/marker.png",
          "width": 12,
          "height": 16,
        },
        {
          "type": "input_dummy",
        },
        {
          "type": "input_statement",
          "name": "DO",
        }
      ],
      "previousStatement": null,
      "colour": LOOPS_HUE,
      "tooltip": BlocklyGames.getMsg('Maze.whileTooltip', false),
    },
    // Block for repeating until on a selected square type.
    {
      "type": "maze_repeatUntilSquareType",
      "message0": `repeat until on %1%2${BlocklyGames.getMsg('Maze.doCode', false)}%3`,
      "args0": [
        {
          "type": "field_dropdown",
          "name": "TYPE",
          "options": SQUARE_TYPE_OPTIONS,
        },
        {
          "type": "input_dummy",
        },
        {
          "type": "input_statement",
          "name": "DO",
        },
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": LOOPS_HUE,
      "tooltip": "Repeat the enclosed blocks until Pegman is on the selected square type.",
    },
    // Block for repeating until there is a path in a given direction.
    {
      "type": "maze_repeatUntilPath",
      "message0": `repeat until %1%2${BlocklyGames.getMsg('Maze.doCode', false)}%3`,
      "args0": [
        {
          "type": "field_dropdown",
          "name": "DIR",
          "options": PATH_DIRECTIONS,
        },
        {
          "type": "input_dummy",
        },
        {
          "type": "input_statement",
          "name": "DO",
        },
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": LOOPS_HUE,
      "tooltip": "Repeat the enclosed blocks until there is a path in the selected direction.",
      "extensions": ["maze_turn_arrows"],
    },
    // Block for repeating N times (no loop trap).
    {
      "type": "maze_repeatNTimes",
      "message0": `repeat %1 times%2${BlocklyGames.getMsg('Maze.doCode', false)}%3`,
      "args0": [
        {
          "type": "field_number",
          "name": "TIMES",
          "value": 1,
          "min": 1,
          "max": 20,
          "precision": 1
        },
        {
          "type": "input_dummy",
        },
        {
          "type": "input_statement",
          "name": "DO",
        },
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": LOOPS_HUE,
      "tooltip": "Repeat the enclosed blocks the specified number of times.",
    },
  ]);
};


Blockly.JavaScript['maze_moveForward'] = function(block) {
  // Generate JavaScript for moving forward.
  return `moveForward('block_id_${block.id}');\n`;
};

Blockly.JavaScript['maze_turn'] = function(block) {
  // Generate JavaScript for turning left or right.
  return `${block.getFieldValue('DIR')}('block_id_${block.id}');\n`;
};

Blockly.JavaScript['maze_turnIfOn'] = function(block) {
  // Generate JavaScript for conditional turn based on current square type.
  const dir = block.getFieldValue('DIR');
  const type = block.getFieldValue('TYPE');
  const action = `${dir}('block_id_${block.id}')`;
  return `if (isOnSquareType(${type})) {\n  ${action};\n}\n`;
};

Blockly.JavaScript['maze_if'] = function(block) {
  // Generate JavaScript for conditional "if there is a path".
  const argument = `${block.getFieldValue('DIR')}('block_id_${block.id}')`;
  const branch = Blockly.JavaScript.statementToCode(block, 'DO');
  return `if (${argument}) {\n${branch}}\n`;
};

Blockly.JavaScript['maze_ifElse'] = function(block) {
  // Generate JavaScript for conditional "if there is a path, else".
  const argument = `${block.getFieldValue('DIR')}('block_id_${block.id}')`;
  const branch0 = Blockly.JavaScript.statementToCode(block, 'DO');
  const branch1 = Blockly.JavaScript.statementToCode(block, 'ELSE');
  return `if (${argument}) {\n${branch0}} else {\n${branch1}}\n`;
};

Blockly.JavaScript['maze_forever'] = function(block) {
  // Generate JavaScript for repeat loop.
  let branch = Blockly.JavaScript.statementToCode(block, 'DO');
  if (Blockly.JavaScript.INFINITE_LOOP_TRAP) {
    branch = Blockly.JavaScript.INFINITE_LOOP_TRAP.replace(/%1/g,
        `'block_id_${block.id}'`) + branch;
  }
  return `while (notDone()) {\n${branch}}\n`;
};

Blockly.JavaScript['maze_isOnSquareType'] = function(block) {
  // Generate JavaScript for checking Pegman's current square type.
  const type = block.getFieldValue('TYPE');
  return [`isOnSquareType(${type})`, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['maze_ifOnSquareType'] = function(block) {
  // Generate JavaScript for conditional "if on square type".
  const type = block.getFieldValue('TYPE');
  const branch = Blockly.JavaScript.statementToCode(block, 'DO');
  return `if (isOnSquareType(${type})) {\n${branch}}\n`;
};

Blockly.JavaScript['maze_ifElseOnSquareType'] = function(block) {
  // Generate JavaScript for conditional "if on square type, else".
  const type = block.getFieldValue('TYPE');
  const branch0 = Blockly.JavaScript.statementToCode(block, 'DO');
  const branch1 = Blockly.JavaScript.statementToCode(block, 'ELSE');
  return `if (isOnSquareType(${type})) {\n${branch0}} else {\n${branch1}}\n`;
};

Blockly.JavaScript['maze_repeatUntilSquareType'] = function(block) {
  // Generate JavaScript for loop until Pegman is on a selected square type.
  const type = block.getFieldValue('TYPE');
  let branch = Blockly.JavaScript.statementToCode(block, 'DO');
  return `while (!isOnSquareType(${type})) {\n${branch}}\n`;
};

Blockly.JavaScript['maze_repeatUntilPath'] = function(block) {
  // Generate JavaScript for loop until there is a path in the chosen direction.
  const dirFunc = block.getFieldValue('DIR');
  let branch = Blockly.JavaScript.statementToCode(block, 'DO');
  return `while (!${dirFunc}('block_id_${block.id}')) {\n${branch}}\n`;
};

Blockly.JavaScript['maze_repeatNTimes'] = function(block) {
  // Generate JavaScript for repeating N times without using the loop trap.
  const times = Math.max(0, Number(block.getFieldValue('TIMES')) || 0);
  let branch = Blockly.JavaScript.statementToCode(block, 'DO');
  const loopVar = Blockly.JavaScript.nameDB_.getDistinctName(
      'count', Blockly.VARIABLE_CATEGORY_NAME);
  return `for (var ${loopVar} = 0; ${loopVar} < ${times}; ${loopVar}++) {\n${branch}}\n`;
};
