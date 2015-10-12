/**
 * A mapping from the map orientation to an array of valid neighbouring
 * directions for a tile.
 */
var _validDirs = {
	'flat-topped': [
		'north',
		'northeast',
		'southeast',
		'south',
		'southwest',
		'northwest'
	],
	'pointy-topped': [
		'northeast',
		'east',
		'southeast',
		'southwest',
		'west',
		'northwest'
	]
};

/**
 * Mapping from map orientation to an array of valid layouts.
 */
var _validLayouts = {
	'flat-topped': ['odd-q', 'even-q'],
	'pointy-topped': ['odd-r', 'even-r']
};

// Memoize a map from tileId to coordinates.
var coordsMap = {};

/**
 * Exports an object with functions that are useful for working with hexagonal grids.
 * @typicalname HexGrid
 */
function validateSettings(settings) {
  if (settings.validate !== true) {
    return;
  }

  if (_validDirs[settings.orientation] === undefined) {
    throw new Error('Invalid orientation: ' + settings.orientation +
      '. Must be one of: ' + Object.keys(_validDirs) + '.');
  }

  if (_validLayouts[settings.orientation].indexOf(settings.layout) === -1) {
    throw new Error('Invalid layout for given orientation: ' + settings.layout +
      '. Must be one of: ' + _validLayouts[settings.orientation] + '.');
  }

  if (typeof settings.width !== 'number') {
    throw new Error('settings.width must be a number.');
  }

  if (typeof settings.height !== 'number') {
    throw new Error('settings.height must be a number.');
  }
}

/**
 * Returns an array of tileIds.
 */
function getTileIds(settings) {
  validateSettings(settings);

  var tileIds = [];
  for (var x = 0; x < settings.width; x += 1) {
    for (var y = 0; y < settings.height; y += 1) {
      tileIds.push(getTileIdByCoordinates(settings, x, y));
    }
  }

  return tileIds;
}

/**
 * Returns whether a coordinate is within the grid boundaries.
 * @param {object} settings The grid settings.
 * @param {number} x The X coordinate.
 * @param {number} y The Y coordinate.
 * @return {bool} Whether the coordinate is within the boundaries of the
 * grid.
 */
function isWithinBoundaries(settings, x, y) {
  return x <= settings.width - 1 &&
    x >= 0 &&
    y <= settings.height - 1 &&
    y >= 0;
}

/**
 * Gets the tileId given the coordinates.
 * @param {object} settings The grid settings.
 * @param {number} x The X coordinate.
 * @param {number} y The Y coordinate.
 * @return {tile|null} The tile. Null if not a valid coordinate.
 */
function getTileIdByCoordinates(settings, x, y) {
  validateSettings(settings);

  if (typeof x !== 'number' || typeof y !== 'number') {
    throw new Error('x and y must be integers');
  }

  if (isWithinBoundaries(settings, x, y) === false) {
    return null;
  }

  return 'tile-' + x.toString() + '-' + y.toString();
}

/**
 * Whether a given direction is valid for this map layout.
 * @param {object} settings The grid settings.
 * @return {bool} Whether the direction is valid.
 */
function isValidDirection(settings, dir) {
  validateSettings(settings);

  if (_validDirs[settings.orientation].indexOf(dir) === -1) {
    return false;
  }

  return true;
}

/**
 * Gets the coordinates of a tile given its ID.
 * @param {string} tileId The ID of the tile.
 * @return {object|null} An object with x and y properties.
 * @throws Error If the tileId is not valid.
 */
function getTileCoordinatesById(tileId) {
  // Memoize this for performance.
  var coords = coordsMap[tileId];
  if (coords !== undefined) {
    return coords;
  }

  var match = tileId.match(/tile-(\d+)-(\d+)/);
  if (match.length !== 3) {
    throw new Error('Unrecognized tileId format: ' + tileId);
  }

  coords = coordsMap[tileId] = {
    x: parseInt(match[1], 10),
    y: parseInt(match[2], 10)
  };

  return coords;
}

/**
 * Gets a tile's neighbour given its coordinates and a direction.
 * @param {object} settings The grid settings.
 * @param {number} x The X coordinate of the tile.
 * @param {number} y The Y coordinate of the tile.
 * @param {string} dir A direction. One of: north, northeast, east,
 * southeast, south, southwest, west, northwest.
 * @return {object|null} The neighbouring tile.
 */
function getNeighbourTileIdByCoordinates(settings, x, y, dir) {
  validateSettings(settings);

  if (isValidDirection(settings, dir) === false) {
    throw new Error('Not a valid direction: ' + dir);
  }

  // TODO: It might be good to reduce this using maths.
  switch (settings.layout) {
  case 'odd-q':
    // Flat-top.
    switch (dir) {
    case 'north':
      return getTileIdByCoordinates(settings, x, y - 1);
    case 'northeast':
      if (x % 2 === 0) {
        return getTileIdByCoordinates(settings, x + 1, y - 1);
      }
      return getTileIdByCoordinates(settings, x + 1, y);
    case 'southeast':
      if (x % 2 === 1) {
        return getTileIdByCoordinates(settings, x + 1, y + 1);
      }
      return getTileIdByCoordinates(settings, x + 1, y);
    case 'south':
      return getTileIdByCoordinates(settings, x, y + 1);
    case 'southwest':
      if (x % 2 === 1) {
        return getTileIdByCoordinates(settings, x - 1, y + 1);
      }
      return getTileIdByCoordinates(settings, x - 1, y);
    case 'northwest':
      if (x % 2 === 0) {
        return getTileIdByCoordinates(settings, x - 1, y - 1);
      }
      return getTileIdByCoordinates(settings, x - 1, y);
    }
    break;
  case 'even-q':
    // Flat-top.
    switch (dir) {
    case 'north':
      return getTileIdByCoordinates(settings, x, y - 1);
    case 'northeast':
      // On even col Idx, y does not change.
      if (x % 2 === 0) {
        return getTileIdByCoordinates(settings, x + 1, y);
      }
      return getTileIdByCoordinates(settings, x + 1, y - 1);
    case 'southeast':
      // On odd col Idx, y does not change.
      if (x % 2 === 1) {
        return getTileIdByCoordinates(settings, x + 1, y);
      }
      return getTileIdByCoordinates(settings, x + 1, y + 1);
    case 'south':
      return getTileIdByCoordinates(settings, x, y + 1);
    case 'southwest':
      // On odd col Idx, y does not change.
      if (x % 2 === 1) {
        return getTileIdByCoordinates(settings, x - 1, y);
      }
      return getTileIdByCoordinates(settings, x - 1, y + 1);
    case 'northwest':
      // On even col Idx, y does not change.
      if (x % 2 === 0) {
        return getTileIdByCoordinates(settings, x - 1, y);
      }
      return getTileIdByCoordinates(settings, x - 1, y - 1);
    }
    break;
  case 'odd-r':
    // Pointy-top.
    switch (dir) {
    case 'northeast':
      // On even rows, x doesn't change.
      if (y % 2 === 0) {
        return getTileIdByCoordinates(settings, x, y - 1);
      }
      return getTileIdByCoordinates(settings, x + 1, y - 1);
    case 'east':
      return getTileIdByCoordinates(settings, x + 1, y);
    case 'southeast':
      // On even rows, x doesn't change.
      if (y % 2 === 0) {
        return getTileIdByCoordinates(settings, x, y + 1);
      }
      return getTileIdByCoordinates(settings, x + 1, y + 1);
    case 'south':
      return getTileIdByCoordinates(settings, x, y + 1);
    case 'southwest':
      // On odd rows, x doesn't change.
      if (y % 2 === 1) {
        return getTileIdByCoordinates(settings, x, y + 1);
      }
      return getTileIdByCoordinates(settings, x - 1, y + 1);
    case 'west':
      return getTileIdByCoordinates(settings, x - 1, y);
    case 'northwest':
      // On odd rows, x doesn't change.
      if (y % 2 === 1) {
        return getTileIdByCoordinates(settings, x, y - 1);
      }
      return getTileIdByCoordinates(settings, x - 1, y - 1);
    }
    break;
  case 'even-r':
    // Pointy-top.
    switch (dir) {
    case 'northeast':
      // On odd rows, x doesn't change.
      if (y % 2 === 1) {
        return getTileIdByCoordinates(settings, x, y - 1);
      }
      return getTileIdByCoordinates(settings, x + 1, y - 1);
    case 'east':
      return getTileIdByCoordinates(settings, x + 1, y);
    case 'southeast':
      // On odd rows, x doesn't change.
      if (y %  2 === 1) {
        return getTileIdByCoordinates(settings, x, y + 1);
      }
      return getTileIdByCoordinates(settings, x + 1, y + 1);
    case 'south':
      return getTileIdByCoordinates(settings, x, y + 1);
    case 'southwest':
      // On even rows, x doesn't change.
      if (y % 2 === 0) {
        return getTileIdByCoordinates(settings, x, y + 1);
      }
      return getTileIdByCoordinates(settings, x - 1, y + 1);
    case 'west':
      return getTileIdByCoordinates(settings, x - 1, y);
    case 'northwest':
      // On even rows, x doesn't change.
      if (y % 2 === 0) {
        return getTileIdByCoordinates(settings, x, y - 1);
      }
      return getTileIdByCoordinates(settings, x - 1, y - 1);
    }
    break;
  }
}

/**
 * Gets a tile's neighbour given the tile's ID and a direction.
 * @param {object} settings The grid settings.
 * @param {string} tileId The tile's ID.
 * @param {string} dir A direction. One of: north, northeast, east,
 * southeast, south, southwest, west, northwest.
 * @return {object|null} The neighbouring tile.
 */
function getNeighbourIdByTileId(settings, tileId, dir) {
  validateSettings(settings);

  var coords = getTileCoordinatesById(settings, tileId);
  if (coords === null) {
    throw new Error('Invalid tileId: ' + tileId);
  }

  return getNeighbourTileIdByCoordinates(settings, coords.x, coords.y, dir);
}

/**
 * Gets all neighbours of a tile given the tile's ID.
 * @param {object} settings The grid settings.
 * @param {string} tileId The tile's ID.
 * @return {object[]} The neighbouring tiles.
 */
function getNeighbourIdsByTileId(settings, tileId) {
  validateSettings(settings);

  var coords = getTileCoordinatesById(tileId);
  return _validDirs[settings.orientation].map(function (dir) {
    return getNeighbourTileIdByCoordinates(settings, coords.x, coords.y, dir);
  }).filter(function (tile) {
    return tile !== null;
  });
}

/**
 * Gets the position of a tile by its coordinates. Due to the way
 * hexagonal grids work, the position of half of the tiles are offset by
 * 0.5.
 * @param {number} x The X coordinate of the tile.
 * @param {number} y The Y coordinate of the tile.
 * @return {object} An object with x and y properties.
 */
function getTilePositionByCoords(settings, x, y) {
  validateSettings(settings);

  if (typeof x !== 'number' || typeof y !== 'number') {
    throw new Error('x and y must be integers');
  }

  var xPos = x,
    yPos = y;

  switch (settings.layout) {
  // Flat top.
  case 'odd-q':
    // Odd columns are offset by half.
    if (x % 2 === 1) {
      yPos = y + 0.5;
    }
    break;

  case 'even-q':
    // Even columns are offset by half.
    if (x % 2 === 0) {
      yPos = y + 0.5;
    }
    break;

  // Pointy top.
  case 'odd-r':
    // Odd rows are offset by half.
    if (y % 2 === 1) {
      xPos = x + 0.5;
    }

    break;

  case 'even-r':
    // Even rows are offset by half.
    if (y % 2 === 0) {
      xPos = x + 0.5;
    }

    break;
  default:
    throw new Error(
      'getTilePositionByCoords is not implemented for ' + settings.layout + '.');
  }

  return {
    x: xPos,
    y: yPos
  };
}

/**
 * Gets the position of a tile by its ID.
 * @param {object} settings The grid settings.
 * @param {string} tileId The tile's ID.
 * @return {object} An object with x and y properties.
 */
function getTilePositionById(settings, tileId) {
  var coords = getTileCoordinatesById(tileId);
  return getTilePositionByCoords(settings, coords.x, coords.y);
}

/**
 * Gets all shortest paths from a given starting tile.
 *
 * @param {object} settings The grid settings.
 * @param {string} tileId The tile's ID.
 * @param {object} options An options object.
 * @param {number} options.maxCost The maximum allowed cost of a path,
 * or POSITIVE_INFINITY if not specified. If specified, a pathCost function
 * must be provided.
 * @param {number|function} options.moveCost The cost of moving from one tile
 * to another. If a function is provided, it is called like
 * `options.pathCost(fromTileId, toTileId)` and it should return the cost of
 * moving from fromTile to toTile. Defaults to 1.
 * @param {function} options.isPathable An optional function which says
 * whether a tile is pathable. It is called like `options.pathable(tileId)`
 * and should return either true or false.
 * @return {object} An object where the keys are the final tileId in a path
 * and the values are Path objects. The Path object looks like this:
 * {
 *		 tileIds: [tileId1, tileId2, ..., tileIdN],
 *		 cost: 0
 * }
 *
 * The tileIds are the tile IDs traversed in order, including the starting
 * and final tile.
 *
 * The cost it the total cost of traversing the path. The cost of each step
 * of the path is determined by calling options.pathCost(fromTile, toTile),
 * or 0 if options.pathCost is not supplied.
 *
 * The zero-length path from a tile to itself is not returned.
 */
function getShortestPathsFromTileId(settings, tileId, options) {
  validateSettings(settings);

  if (typeof(tileId) !== 'string') {
    throw new Error('tileId must be a string, got: ' + typeof tileId);
  }

  options = options || {};
  var maxPathCost = options.maxCost;
  if (maxPathCost === undefined) {
    maxPathCost = Number.POSITIVE_INFINITY;
  }

  var moveCost = options.moveCost;
  if (moveCost === undefined) {
    moveCost = 1;
  }

  // Start with the input tile as the frontier tile and explore from there.
  var frontierTileIds = [tileId];

  // For each tile, record the previous tile.
  var from = {};
  from[tileId] = null;

  // For each destination tile store a Path object.
  var path = {};

  while (frontierTileIds.length) {
    var frontierTileId = frontierTileIds.shift();
    if (path[frontierTileId] === undefined) {
      path[frontierTileId] = {
        tileIds: [frontierTileId],
        cost: 0
      };
    }

    getNeighbourIdsByTileId(settings, frontierTileId).forEach(function (neighbourTileId) {
      // Path is too costly.
      if (path[frontierTileId].cost > maxPathCost) {
        return;
      }

      // Already found a path to tile.id. Breadth-first search
      // guarantees it is shorter.
      if (from[neighbourTileId] !== undefined) {
        return;
      }

      // Tile is not pathable.
      if (typeof(options.isPathable) === 'function' &&
        options.isPathable(neighbourTileId) === false
      ) {
        return;
      }

      var cost = null;
      if (typeof moveCost === 'function') {
        cost = moveCost(frontierTileId, neighbourTileId);
        if (typeof cost !== 'number') {
          throw new Error(
            'options.moveCost(fromTileId, toTileId) did not return a number.'
          );
        }
      } else {
        cost = moveCost;
      }

      var pathCost = path[frontierTileId].cost + cost;
      if (pathCost > maxPathCost) {
        return;
      }

      from[neighbourTileId] = frontierTileId;
      path[neighbourTileId] = {
        cost: pathCost,
        tileIds: path[frontierTileId].tileIds.concat([neighbourTileId])
      };

      frontierTileIds.push(neighbourTileId);
    });
  }

  // Exclude the 0 length path.
  delete path[tileId];

  return path;
}

module.exports = {
  getTileIds: getTileIds,
  isWithinBoundaries: isWithinBoundaries,
  getTileIdByCoordinates: getTileIdByCoordinates,
  isValidDirection: isValidDirection,
  getTileCoordinatesById: getTileCoordinatesById,
  getNeighbourTileIdByCoordinates: getNeighbourTileIdByCoordinates,
  getNeighbourIdByTileId: getNeighbourIdByTileId,
  getNeighbourIdsByTileId: getNeighbourIdsByTileId,
  getTilePositionByCoords: getTilePositionByCoords,
  getTilePositionById: getTilePositionById,
  getShortestPathsFromTileId: getShortestPathsFromTileId
};
