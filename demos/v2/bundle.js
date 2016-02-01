/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _hexGrid = __webpack_require__(2);

	var _hexGrid2 = _interopRequireDefault(_hexGrid);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var hexWidth = 38; /* global SVG */

	var hexHeight = 44;

	var grid = {
	  width: 10,
	  height: 15,
	  orientation: 'pointy-topped',
	  layout: 'odd-r'
	};

	var main = SVG('main');
	main.size(hexWidth * (grid.width + 2), hexHeight * (grid.height + 2));

	// Pointy top.
	//const hex = main.polygon('25,0 75,0 100,50 75,100, 25,100, 0,50').fill('none').stroke({width: 0})

	for (var x = 0; x < grid.width; x += 1) {
	  var _loop = function _loop(y) {
	    var hex = main.polygon('0,25 0,75 50,100 100,75 100,25 50,0').fill('none').stroke({ width: 4 });
	    hex.width(38);
	    hex.height(44);

	    hex.mouseover(function () {
	      hex.attr({ fill: '#60f' });
	    });

	    var position = _hexGrid2.default.getTilePositionByCoords(grid, x, y);
	    hex.dx(10 + hexWidth * position.x);
	    hex.dy(10 + hexHeight * position.y * 0.75);
	    hex.attr({ fill: '#f06' });
	  };

	  for (var y = 0; y < grid.height; y += 1) {
	    _loop(y);
	  }
	}
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFHQSxJQUFNLFdBQVcsRUFBWDs7QUFDTixJQUFNLFlBQVksRUFBWjs7QUFFTixJQUFNLE9BQU87QUFDWCxTQUFPLEVBQVA7QUFDQSxVQUFRLEVBQVI7QUFDQSxlQUFhLGVBQWI7QUFDQSxVQUFRLE9BQVI7Q0FKSTs7QUFPTixJQUFNLE9BQU8sSUFBSSxNQUFKLENBQVA7QUFDTixLQUFLLElBQUwsQ0FBVSxZQUFZLEtBQUssS0FBTCxHQUFhLENBQWIsQ0FBWixFQUE2QixhQUFhLEtBQUssTUFBTCxHQUFjLENBQWQsQ0FBYixDQUF2Qzs7Ozs7QUFLQSxLQUFLLElBQUksSUFBSSxDQUFKLEVBQU8sSUFBSSxLQUFLLEtBQUwsRUFBWSxLQUFLLENBQUwsRUFBUTs2QkFDN0I7QUFDUCxRQUFNLE1BQU0sS0FBSyxPQUFMLENBQWEscUNBQWIsRUFBb0QsSUFBcEQsQ0FBeUQsTUFBekQsRUFBaUUsTUFBakUsQ0FBd0UsRUFBQyxPQUFPLENBQVAsRUFBekUsQ0FBTjtBQUNOLFFBQUksS0FBSixDQUFVLEVBQVY7QUFDQSxRQUFJLE1BQUosQ0FBVyxFQUFYOztBQUVBLFFBQUksU0FBSixDQUFjLFlBQVk7QUFDeEIsVUFBSSxJQUFKLENBQVMsRUFBQyxNQUFNLE1BQU4sRUFBVixFQUR3QjtLQUFaLENBQWQ7O0FBSUEsUUFBTSxXQUFXLGtCQUFRLHVCQUFSLENBQWdDLElBQWhDLEVBQXNDLENBQXRDLEVBQXlDLENBQXpDLENBQVg7QUFDTixRQUFJLEVBQUosQ0FBTyxLQUFLLFdBQVcsU0FBUyxDQUFULENBQXZCO0FBQ0EsUUFBSSxFQUFKLENBQU8sS0FBSyxZQUFZLFNBQVMsQ0FBVCxHQUFhLElBQXpCLENBQVo7QUFDQSxRQUFJLElBQUosQ0FBUyxFQUFDLE1BQU0sTUFBTixFQUFWO0lBYm9DOztBQUN0QyxPQUFLLElBQUksSUFBSSxDQUFKLEVBQU8sSUFBSSxLQUFLLE1BQUwsRUFBYSxLQUFLLENBQUwsRUFBUTtVQUFoQyxHQUFnQztHQUF6QztDQURGIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2pwL0NvZGUvaGV4LWdyaWQvZGVtb3MvdjIiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBnbG9iYWwgU1ZHICovXG5pbXBvcnQgaGV4R3JpZCBmcm9tICcuLi8uLi9zcmMvaGV4LWdyaWQuanMnO1xuXG5jb25zdCBoZXhXaWR0aCA9IDM4O1xuY29uc3QgaGV4SGVpZ2h0ID0gNDQ7XG5cbmNvbnN0IGdyaWQgPSB7XG4gIHdpZHRoOiAxMCxcbiAgaGVpZ2h0OiAxNSxcbiAgb3JpZW50YXRpb246ICdwb2ludHktdG9wcGVkJyxcbiAgbGF5b3V0OiAnb2RkLXInXG59O1xuXG5jb25zdCBtYWluID0gU1ZHKCdtYWluJyk7XG5tYWluLnNpemUoaGV4V2lkdGggKiAoZ3JpZC53aWR0aCArIDIpLCBoZXhIZWlnaHQgKiAoZ3JpZC5oZWlnaHQgKyAyKSk7XG5cbi8vIFBvaW50eSB0b3AuXG4vL2NvbnN0IGhleCA9IG1haW4ucG9seWdvbignMjUsMCA3NSwwIDEwMCw1MCA3NSwxMDAsIDI1LDEwMCwgMCw1MCcpLmZpbGwoJ25vbmUnKS5zdHJva2Uoe3dpZHRoOiAwfSlcblxuZm9yIChsZXQgeCA9IDA7IHggPCBncmlkLndpZHRoOyB4ICs9IDEpIHtcbiAgZm9yIChsZXQgeSA9IDA7IHkgPCBncmlkLmhlaWdodDsgeSArPSAxKSB7XG4gICAgY29uc3QgaGV4ID0gbWFpbi5wb2x5Z29uKCcwLDI1IDAsNzUgNTAsMTAwIDEwMCw3NSAxMDAsMjUgNTAsMCcpLmZpbGwoJ25vbmUnKS5zdHJva2Uoe3dpZHRoOiA0fSlcbiAgICBoZXgud2lkdGgoMzgpO1xuICAgIGhleC5oZWlnaHQoNDQpO1xuXG4gICAgaGV4Lm1vdXNlb3ZlcihmdW5jdGlvbiAoKSB7XG4gICAgICBoZXguYXR0cih7ZmlsbDogJyM2MGYnfSk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBwb3NpdGlvbiA9IGhleEdyaWQuZ2V0VGlsZVBvc2l0aW9uQnlDb29yZHMoZ3JpZCwgeCwgeSk7XG4gICAgaGV4LmR4KDEwICsgaGV4V2lkdGggKiBwb3NpdGlvbi54KTtcbiAgICBoZXguZHkoMTAgKyBoZXhIZWlnaHQgKiBwb3NpdGlvbi55ICogMC43NSk7XG4gICAgaGV4LmF0dHIoe2ZpbGw6ICcjZjA2J30pO1xuICB9XG59XG4iXX0=

/***/ },
/* 2 */
/***/ function(module, exports) {

	// vim: expandtab:ts=2:sw=2

	/**
	 * The valid directions for each orientation.
	 *
	 * The pointy-topped orientation does not have the concept of "north" for
	 * example.
	 */
	var _validDirections = {
	  'flat-topped': ['north', 'northeast', 'southeast', 'south', 'southwest', 'northwest'],
	  'pointy-topped': ['northeast', 'east', 'southeast', 'southwest', 'west', 'northwest']
	};

	/**
	 * The valid layouts for each orientation.
	 */
	var _validLayouts = {
	  'flat-topped': ['odd-q', 'even-q'],
	  'pointy-topped': ['odd-r', 'even-r']
	};

	/**
	 * Memoize the computation of coordinates from tile IDs to reduce costly
	 * regexp.
	 */
	var coordsMap = {};

	/**
	 * Validate that the grid settings.
	 * @param {object} settings The hex grid settings.
	 * @param {boolean} [settings.validate=false] Whether to validate the grid settings.
	 * This can be disabled for performance.
	 * @param {number} settings.width The width of the grid, in hexes.
	 * @param {number} settings.height The height of the grid, in hexes.
	 * @param {string} settings.orientation The orientation of the hexes, either
	 * "flat-topped" or "pointy-topped".
	 * @param {string} settings.layout The layout of the hexes. For flat-topped,
	 * either "odd-q" or "even-q". For pointy-topped, either "odd-r" or "even-r".
	 * @throws Error When the settings are invalid.
	 */
	function validateSettings(settings) {
	  if (typeof settings !== 'object') {
	    throw new Error('settings must be an object. Got ' + typeof settings);
	  }

	  if (typeof settings.width !== 'number') {
	    throw new Error('settings.width must be a number. Got ' + typeof width);
	  }

	  if (typeof settings.height !== 'number') {
	    throw new Error('settings.height must be a number. Got ' + typeof height);
	  }

	  if (_validLayouts[settings.orientation] === undefined) {
	    throw new Error('Invalid orientation: ' + settings.orientation + '. Must be one of: ' + Object.keys(_validLayouts) + '.');
	  }

	  if (_validLayouts[settings.orientation].indexOf(settings.layout) === -1) {
	    throw new Error('Invalid layout for given orientation: ' + settings.layout + '. Must be one of: ' + _validLayouts[settings.orientation] + '.');
	  }
	}

	/**
	 * Returns an array of tileIds.
	 * @param {object} settings The hex grid settings.
	 */
	function getTileIds(settings) {
	  if (settings.validate !== false) {
	    validateSettings(settings);
	  }

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
	 * @param {object} settings The hex grid settings.
	 * @param {number} x The X coordinate.
	 * @param {number} y The Y coordinate.
	 * @return {bool} Whether the coordinate is within the boundaries of the
	 * grid.
	 */
	function isWithinBoundaries(settings, x, y) {
	  if (settings.validate !== false) {
	    validateSettings(settings);
	    if (typeof x !== 'number') {
	      throw new Error('x must be a number. Got ' + typeof x);
	    }
	    if (typeof y !== 'number') {
	      throw new Error('x must be a number. Got ' + typeof y);
	    }
	  }

	  return x <= settings.width - 1 && x >= 0 && y <= settings.height - 1 && y >= 0;
	}

	/**
	 * Gets the tileId given the coordinates.
	 * @param {object} settings The hex grid settings.
	 * @param {number} x The X coordinate.
	 * @param {number} y The Y coordinate.
	 * @return {tile|null} The tile. Null if not a valid coordinate.
	 */
	function getTileIdByCoordinates(settings, x, y) {
	  if (settings.validate !== false) {
	    validateSettings(settings);
	    if (typeof x !== 'number') {
	      throw new Error('x must be a number. Got ' + typeof x);
	    }
	    if (typeof y !== 'number') {
	      throw new Error('x must be a number. Got ' + typeof y);
	    }
	  }

	  if (isWithinBoundaries(settings, x, y) === false) {
	    return null;
	  }

	  return 'tile-' + x.toString() + '-' + y.toString();
	}

	/**
	 * Whether a given direction is valid for this map layout.
	 * @param {object} settings The hex grid settings.
	 * @param {string} direction The direction to check.
	 * @return {bool} Whether the direction is valid.
	 */
	function isValidDirection(settings, direction) {
	  if (settings.validate !== false) {
	    validateSettings(settings);
	    if (typeof direction !== 'string') {
	      throw new Error('direction must be a string. Got ' + typeof direction);
	    }
	  }

	  return _validDirections[settings.orientation].indexOf(direction) >= 0;
	}

	/**
	 * Gets the coordinates of a tile given its ID.
	 * @param {object} settings The hex grid settings.
	 * @param {string} tileId The ID of the tile.
	 * @return {object|null} An object with x and y properties.
	 * @throws Error If the tileId is not valid.
	 */
	function getTileCoordinatesById(settings, tileId) {
	  if (settings.validate !== false) {
	    validateSettings(settings);
	    if (typeof tileId !== 'string') {
	      throw new Error('tileId must be a string. Got ' + typeof tileId);
	    }
	  }

	  // Use the cached version if possible.
	  var coords = coordsMap[tileId];
	  if (coords !== undefined) {
	    return coords;
	  }

	  var match = tileId.match(/tile-(\d+)-(\d+)/);
	  if (match === null || match.length !== 3) {
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
	  if (settings.validate !== false) {
	    validateSettings(settings);
	    if (isValidDirection(settings, dir) === false) {
	      throw new Error('Not a valid direction: ' + dir);
	    }
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
	          if (y % 2 === 1) {
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
	 * @param {string} direction A direction. One of: north, northeast, east,
	 * southeast, south, southwest, west, northwest.
	 * @return {object|null} The neighbouring tile.
	 */
	function getNeighbourIdByTileId(settings, tileId, direction) {
	  if (settings.validate !== false) {
	    validateSettings(settings);
	    if (typeof tileId !== 'string') {
	      throw new Error('tileId must be a string. Got ' + typeof tileId);
	    }
	    if (typeof direction !== 'string') {
	      throw new Error('dir must be a string. Got ' + typeof direction);
	    }
	  }

	  var coords = getTileCoordinatesById(settings, tileId);
	  return getNeighbourTileIdByCoordinates(settings, coords.x, coords.y, direction);
	}

	/**
	 * Gets IDs all neighbours of a tile given the tile's ID.
	 * @param {object} settings The grid settings.
	 * @param {string} tileId The tile's ID.
	 * @return {number[]} The neighbouring tiles' IDs.
	 */
	function getNeighbourIdsByTileId(settings, tileId) {
	  if (settings.validate !== false) {
	    validateSettings(settings);
	  }

	  var coords = getTileCoordinatesById(settings, tileId);
	  return _validDirections[settings.orientation].map(function (dir) {
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
	  if (settings.validate !== false) {
	    validateSettings(settings);
	  }

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
	      throw new Error('getTilePositionByCoords is not implemented for ' + settings.layout + '.');
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
	  var coords = getTileCoordinatesById(settings, tileId);
	  return getTilePositionByCoords(settings, coords.x, coords.y);
	}

	/**
	 * Gets shortest paths from a given starting tile to all other reachable tiles.
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
	 *    tileIds: [tileId1, tileId2, ..., tileIdN],
	 *    cost: 0
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
	  if (settings.validate !== false) {
	    validateSettings(settings);
	    if (typeof tileId !== 'string') {
	      throw new Error('tileId must be a string, got: ' + typeof tileId);
	    }
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
	      if (typeof options.isPathable === 'function' && options.isPathable(neighbourTileId) === false) {
	        return;
	      }

	      var cost = null;
	      if (typeof moveCost === 'function') {
	        cost = moveCost(frontierTileId, neighbourTileId);
	        if (typeof cost !== 'number') {
	          throw new Error('options.moveCost(fromTileId, toTileId) did not return a number.');
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
	  validateSettings: validateSettings,
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

/***/ }
/******/ ]);