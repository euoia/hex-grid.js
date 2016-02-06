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

	var hexWidth = 19; /* global SVG */

	var hexHeight = 22;

	var grid = {
	  width: 20,
	  height: 20,
	  orientation: 'pointy-topped',
	  layout: 'odd-r',
	  shape: 'parallelogram'
	};

	var main = SVG('main');
	main.size(hexWidth * (grid.width * 1.8), hexHeight * (grid.height + 2));

	// Pointy top.
	//const hex = main.polygon('25,0 75,0 100,50 75,100, 25,100, 0,50').fill('none').stroke({width: 0})

	function toHexString(num) {
	  return String('0' + num.toString(16)).slice(-2);
	}

	function fromHex(str) {
	  return {
	    red: parseInt(str.substr(1, 2), 16),
	    green: parseInt(str.substr(3, 2), 16),
	    blue: parseInt(str.substr(5, 2), 16)
	  };
	}

	for (var x = 0; x < grid.width; x += 1) {
	  var _loop = function _loop(y) {
	    var hex = main.polygon('0,25 0,75 50,100 100,75 100,25 50,0').fill('none').stroke({ width: 4 });
	    hex.width(hexWidth);
	    hex.height(hexHeight);
	    hex.attr({ id: _hexGrid2.default.getTileIdByCoordinates(grid, x, y) });

	    var position = _hexGrid2.default.getTilePositionByCoords(grid, x, y);
	    hex.dx(10 + hexWidth * position.x);
	    hex.dy(10 + hexHeight * position.y * 0.75);
	    hex.attr({ fill: '#f06' });

	    hex.mouseover(function () {
	      hex.attr({ fill: '#60f' });
	    });

	    hex.click(function () {
	      var red = Math.random() * 255;
	      var green = Math.random() * 255;
	      var blue = Math.random() * 255;
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = _hexGrid2.default.getNeighbourIdsByTileId(grid, this.attr('id'))[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var tileId = _step.value;

	          var neighbour = SVG.get(tileId);
	          var colour = '#' + toHexString(red) + toHexString(green) + toHexString(blue);
	          neighbour.attr({ fill: colour });
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	    });
	  };

	  for (var y = 0; y < grid.height; y += 1) {
	    _loop(y);
	  }
	}
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFHQSxJQUFNLFdBQVcsRUFBWDs7QUFDTixJQUFNLFlBQVksRUFBWjs7QUFFTixJQUFNLE9BQU87QUFDWCxTQUFPLEVBQVA7QUFDQSxVQUFRLEVBQVI7QUFDQSxlQUFhLGVBQWI7QUFDQSxVQUFRLE9BQVI7QUFDQSxTQUFPLGVBQVA7Q0FMSTs7QUFRTixJQUFNLE9BQU8sSUFBSSxNQUFKLENBQVA7QUFDTixLQUFLLElBQUwsQ0FBVSxZQUFZLEtBQUssS0FBTCxHQUFhLEdBQWIsQ0FBWixFQUErQixhQUFhLEtBQUssTUFBTCxHQUFjLENBQWQsQ0FBYixDQUF6Qzs7Ozs7QUFLQSxTQUFTLFdBQVQsQ0FBcUIsR0FBckIsRUFBMEI7QUFDeEIsU0FBTyxPQUFPLE1BQU0sSUFBSSxRQUFKLENBQWEsRUFBYixDQUFOLENBQVAsQ0FBK0IsS0FBL0IsQ0FBcUMsQ0FBQyxDQUFELENBQTVDLENBRHdCO0NBQTFCOztBQUlBLFNBQVMsT0FBVCxDQUFpQixHQUFqQixFQUFzQjtBQUNwQixTQUFPO0FBQ0wsU0FBSyxTQUFTLElBQUksTUFBSixDQUFXLENBQVgsRUFBYyxDQUFkLENBQVQsRUFBMkIsRUFBM0IsQ0FBTDtBQUNBLFdBQU8sU0FBUyxJQUFJLE1BQUosQ0FBVyxDQUFYLEVBQWMsQ0FBZCxDQUFULEVBQTJCLEVBQTNCLENBQVA7QUFDQSxVQUFNLFNBQVMsSUFBSSxNQUFKLENBQVcsQ0FBWCxFQUFjLENBQWQsQ0FBVCxFQUEyQixFQUEzQixDQUFOO0dBSEYsQ0FEb0I7Q0FBdEI7O0FBUUEsS0FBSyxJQUFJLElBQUksQ0FBSixFQUFPLElBQUksS0FBSyxLQUFMLEVBQVksS0FBSyxDQUFMLEVBQVE7NkJBQzdCO0FBQ1AsUUFBTSxNQUFNLEtBQUssT0FBTCxDQUFhLHFDQUFiLEVBQW9ELElBQXBELENBQXlELE1BQXpELEVBQWlFLE1BQWpFLENBQXdFLEVBQUMsT0FBTyxDQUFQLEVBQXpFLENBQU47QUFDTixRQUFJLEtBQUosQ0FBVSxRQUFWO0FBQ0EsUUFBSSxNQUFKLENBQVcsU0FBWDtBQUNBLFFBQUksSUFBSixDQUFTLEVBQUMsSUFBSSxrQkFBUSxzQkFBUixDQUErQixJQUEvQixFQUFxQyxDQUFyQyxFQUF3QyxDQUF4QyxDQUFKLEVBQVY7O0FBRUEsUUFBTSxXQUFXLGtCQUFRLHVCQUFSLENBQWdDLElBQWhDLEVBQXNDLENBQXRDLEVBQXlDLENBQXpDLENBQVg7QUFDTixRQUFJLEVBQUosQ0FBTyxLQUFLLFdBQVcsU0FBUyxDQUFULENBQXZCO0FBQ0EsUUFBSSxFQUFKLENBQU8sS0FBSyxZQUFZLFNBQVMsQ0FBVCxHQUFhLElBQXpCLENBQVo7QUFDQSxRQUFJLElBQUosQ0FBUyxFQUFDLE1BQU0sTUFBTixFQUFWOztBQUVBLFFBQUksU0FBSixDQUFjLFlBQVk7QUFDeEIsVUFBSSxJQUFKLENBQVMsRUFBQyxNQUFNLE1BQU4sRUFBVixFQUR3QjtLQUFaLENBQWQ7O0FBSUEsUUFBSSxLQUFKLENBQVUsWUFBWTtBQUNwQixVQUFNLE1BQU0sS0FBSyxNQUFMLEtBQWdCLEdBQWhCLENBRFE7QUFFcEIsVUFBTSxRQUFRLEtBQUssTUFBTCxLQUFnQixHQUFoQixDQUZNO0FBR3BCLFVBQU0sT0FBTyxLQUFLLE1BQUwsS0FBZ0IsR0FBaEIsQ0FITzs7Ozs7O0FBSXBCLDZCQUFtQixrQkFBUSx1QkFBUixDQUFnQyxJQUFoQyxFQUFzQyxLQUFLLElBQUwsQ0FBVSxJQUFWLENBQXRDLDJCQUFuQixvR0FBMkU7Y0FBbEUscUJBQWtFOztBQUN6RSxjQUFNLFlBQVksSUFBSSxHQUFKLENBQVEsTUFBUixDQUFaLENBRG1FO0FBRXpFLGNBQU0sZUFBYSxZQUFZLEdBQVosSUFBbUIsWUFBWSxLQUFaLElBQXFCLFlBQVksSUFBWixDQUFyRCxDQUZtRTtBQUd6RSxvQkFBVSxJQUFWLENBQWUsRUFBQyxNQUFNLE1BQU4sRUFBaEIsRUFIeUU7U0FBM0U7Ozs7Ozs7Ozs7Ozs7O09BSm9CO0tBQVosQ0FBVjtJQWhCb0M7O0FBQ3RDLE9BQUssSUFBSSxJQUFJLENBQUosRUFBTyxJQUFJLEtBQUssTUFBTCxFQUFhLEtBQUssQ0FBTCxFQUFRO1VBQWhDLEdBQWdDO0dBQXpDO0NBREYiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvanAvQ29kZS9oZXgtZ3JpZC9kZW1vcy92MiIsInNvdXJjZXNDb250ZW50IjpbIi8qIGdsb2JhbCBTVkcgKi9cbmltcG9ydCBoZXhHcmlkIGZyb20gJy4uLy4uL3NyYy9oZXgtZ3JpZC5qcyc7XG5cbmNvbnN0IGhleFdpZHRoID0gMTk7XG5jb25zdCBoZXhIZWlnaHQgPSAyMjtcblxuY29uc3QgZ3JpZCA9IHtcbiAgd2lkdGg6IDIwLFxuICBoZWlnaHQ6IDIwLFxuICBvcmllbnRhdGlvbjogJ3BvaW50eS10b3BwZWQnLFxuICBsYXlvdXQ6ICdvZGQtcicsXG4gIHNoYXBlOiAncGFyYWxsZWxvZ3JhbSdcbn07XG5cbmNvbnN0IG1haW4gPSBTVkcoJ21haW4nKTtcbm1haW4uc2l6ZShoZXhXaWR0aCAqIChncmlkLndpZHRoICogMS44KSwgaGV4SGVpZ2h0ICogKGdyaWQuaGVpZ2h0ICsgMikpO1xuXG4vLyBQb2ludHkgdG9wLlxuLy9jb25zdCBoZXggPSBtYWluLnBvbHlnb24oJzI1LDAgNzUsMCAxMDAsNTAgNzUsMTAwLCAyNSwxMDAsIDAsNTAnKS5maWxsKCdub25lJykuc3Ryb2tlKHt3aWR0aDogMH0pXG5cbmZ1bmN0aW9uIHRvSGV4U3RyaW5nKG51bSkge1xuICByZXR1cm4gU3RyaW5nKCcwJyArIG51bS50b1N0cmluZygxNikpLnNsaWNlKC0yKTtcbn1cblxuZnVuY3Rpb24gZnJvbUhleChzdHIpIHtcbiAgcmV0dXJuIHtcbiAgICByZWQ6IHBhcnNlSW50KHN0ci5zdWJzdHIoMSwgMiksIDE2KSxcbiAgICBncmVlbjogcGFyc2VJbnQoc3RyLnN1YnN0cigzLCAyKSwgMTYpLFxuICAgIGJsdWU6IHBhcnNlSW50KHN0ci5zdWJzdHIoNSwgMiksIDE2KVxuICB9XG59XG5cbmZvciAobGV0IHggPSAwOyB4IDwgZ3JpZC53aWR0aDsgeCArPSAxKSB7XG4gIGZvciAobGV0IHkgPSAwOyB5IDwgZ3JpZC5oZWlnaHQ7IHkgKz0gMSkge1xuICAgIGNvbnN0IGhleCA9IG1haW4ucG9seWdvbignMCwyNSAwLDc1IDUwLDEwMCAxMDAsNzUgMTAwLDI1IDUwLDAnKS5maWxsKCdub25lJykuc3Ryb2tlKHt3aWR0aDogNH0pXG4gICAgaGV4LndpZHRoKGhleFdpZHRoKTtcbiAgICBoZXguaGVpZ2h0KGhleEhlaWdodCk7XG4gICAgaGV4LmF0dHIoe2lkOiBoZXhHcmlkLmdldFRpbGVJZEJ5Q29vcmRpbmF0ZXMoZ3JpZCwgeCwgeSl9KTtcblxuICAgIGNvbnN0IHBvc2l0aW9uID0gaGV4R3JpZC5nZXRUaWxlUG9zaXRpb25CeUNvb3JkcyhncmlkLCB4LCB5KTtcbiAgICBoZXguZHgoMTAgKyBoZXhXaWR0aCAqIHBvc2l0aW9uLngpO1xuICAgIGhleC5keSgxMCArIGhleEhlaWdodCAqIHBvc2l0aW9uLnkgKiAwLjc1KTtcbiAgICBoZXguYXR0cih7ZmlsbDogJyNmMDYnfSk7XG5cbiAgICBoZXgubW91c2VvdmVyKGZ1bmN0aW9uICgpIHtcbiAgICAgIGhleC5hdHRyKHtmaWxsOiAnIzYwZid9KTtcbiAgICB9KTtcblxuICAgIGhleC5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCByZWQgPSBNYXRoLnJhbmRvbSgpICogMjU1O1xuICAgICAgY29uc3QgZ3JlZW4gPSBNYXRoLnJhbmRvbSgpICogMjU1O1xuICAgICAgY29uc3QgYmx1ZSA9IE1hdGgucmFuZG9tKCkgKiAyNTU7XG4gICAgICBmb3IgKGxldCB0aWxlSWQgb2YgaGV4R3JpZC5nZXROZWlnaGJvdXJJZHNCeVRpbGVJZChncmlkLCB0aGlzLmF0dHIoJ2lkJykpKSB7XG4gICAgICAgIGNvbnN0IG5laWdoYm91ciA9IFNWRy5nZXQodGlsZUlkKTtcbiAgICAgICAgY29uc3QgY29sb3VyID0gYCMke3RvSGV4U3RyaW5nKHJlZCl9JHt0b0hleFN0cmluZyhncmVlbil9JHt0b0hleFN0cmluZyhibHVlKX1gO1xuICAgICAgICBuZWlnaGJvdXIuYXR0cih7ZmlsbDogY29sb3VyfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==

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

	var _validShapes = ['rectangle', 'parallelogram'];

	/**
	 * Memoize the computation of coordinates from tile IDs to reduce costly
	 * regexp.
	 */
	var coordsMap = {};

	/**
	 * Validate that the grid settings.
	 * @param {object} settings The hex grid settings.
	 * @param {number} settings.width The width of the grid, in hexes.
	 * @param {number} settings.height The height of the grid, in hexes.
	 * @param {string} settings.orientation The orientation of the hexes, either
	 * "flat-topped" or "pointy-topped".
	 * @param {string} settings.layout The layout of the hexes. For flat-topped,
	 * either "odd-q" or "even-q". For pointy-topped, either "odd-r" or "even-r".
	 * @param {string} [settings.shape=rectangle] The shape of the hex grid. Should
	 * be either "rectangle" or "parallelogram".
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

	  if (settings.shape && _validShapes.indexOf(settings.shape) === -1) {
	    throw new Error('Invalid shape. Must be one of: ' + _validShapes);
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

	  var rowIsEven = y % 2 === 0;
	  var colIsEven = x % 2 === 0;

	  var xOffset = 0;
	  if (settings.orientation === 'flat-topped' || settings.layout === 'odd-r' && rowIsEven === false && (dir === 'northeast' || dir === 'southeast') || settings.layout === 'odd-r' && rowIsEven === true && (dir === 'northwest' || dir === 'southwest') || settings.layout === 'even-r' && rowIsEven === true && (dir === 'northeast' || dir === 'southeast') || settings.layout === 'even-r' && rowIsEven === false && (dir === 'northwest' || dir === 'southwest')) {
	    xOffset = 1;
	  }

	  var yOffset = 0;
	  if (settings.orientation === 'pointy-topped' || settings.layout === 'odd-q' && colIsEven === false && (dir === 'northeast' || dir === 'southeast') || settings.layout === 'odd-q' && colIsEven === true && (dir === 'northwest' || dir === 'southwest') || settings.layout === 'even-q' && colIsEven === true && (dir === 'northeast' || dir === 'southeast') || settings.layout === 'even-q' && colIsEven === false && (dir === 'northwest' || dir === 'southwest')) {
	    yOffset = 1;
	  }

	  var xP = 0;
	  if (settings.shape && settings.shape === 'parallelogram') {
	    if (rowIsEven) {
	      if (dir === 'north' || dir === 'northwest' || dir === 'northeast') {
	        xP = 1;
	      } else {
	        xP = 0;
	      }
	    } else {
	      if (dir === 'south' || dir === 'southwest' || dir === 'southeast') {
	        xP = -1;
	      }
	    }
	  }

	  var offsets = {
	    'north': { x: 0, y: -1 },
	    'east': { x: +1, y: 0 },
	    'south': { x: 0, y: +1 },
	    'west': { x: -1, y: 0 },
	    'northeast': { x: xOffset + xP, y: yOffset * -1 },
	    'southeast': { x: xOffset + xP, y: yOffset },
	    'southwest': { x: xOffset * -1 + xP, y: yOffset },
	    'northwest': { x: xOffset * -1 + xP, y: yOffset * -1 }
	  };

	  var offset = offsets[dir];
	  return getTileIdByCoordinates(settings, x + offset.x, y + offset.y);
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

	  var xOffset = 0,
	      yOffset = 0;

	  switch (settings.layout) {
	    // Flat top.
	    case 'odd-q':
	      // Odd columns are offset by half.
	      if (x % 2 === 1) {
	        yOffset += 0.5;
	      }
	      break;

	    case 'even-q':
	      // Even columns are offset by half.
	      if (x % 2 === 0) {
	        yOffset += 0.5;
	      }
	      break;

	    // Pointy top.
	    case 'odd-r':
	      // Odd rows are offset by half.
	      if (y % 2 === 1) {
	        xOffset += 0.5;
	      }

	      break;

	    case 'even-r':
	      // Even rows are offset by half.
	      if (y % 2 === 0) {
	        xOffset += 0.5;
	      }

	      break;
	    default:
	      throw new Error('getTilePositionByCoords is not implemented for ' + settings.layout + '.');
	  }

	  if (settings.shape && settings.shape === 'parallelogram') {
	    xOffset += Math.floor(y / 2);
	  }

	  return {
	    x: x + xOffset,
	    y: y + yOffset
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

	    getNeighbourIdsByTileId(settings, frontierTileId).forEach(function expandSearch(neighbourTileId) {
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