module.exports = (function () {
	var _width = null;
	var _height = null;
	var _tiles = null;
	var _tileFactory = null;
	var _orientation = null;
	var _layout = null;

	// Mapping from tile.id to tileIdx.
	var _tileIdMap = null;

	/**
	 * A mapping from the map orientation to an array of valid neighbouring
	 * directions for a tile.
	 * @see design-notes.txt.
	 */
	var _validDirs = {
		'flat-topped': ['north', 'northeast', 'southeast', 'south', 'southwest',
			'northwest'],
		'pointy-topped': ['northeast', 'east', 'southeast', 'southwest', 'west',
			'northwest']
	};

	/**
	 * Mapping from map orientation to an array of valid layouts.
	 * @see design-notes.txt.
	 */
	var _validLayouts = {
		'flat-topped': ['odd-q', 'even-q'],
		'pointy-topped': ['odd-r', 'even-r']
	};

	/**
	* @param array options
	* @param number options.width The width of the map.
	* @param number options.height The height of the map.
	* @param TileFactory options.tileFactory A tileFactory object. @see
	*        TileFactory.
	* @param string options.orientation The orientation of the map. Must be one
	*        of: flat-topped, pointy-topped.
	*/
	var module = function(options) {
		if (typeof options === 'undefined') {
			throw new Error('Must provide an options object');
		}

		if (typeof options.width !== 'number') {
			throw new Error('Must provide a number options.width');
		}

		if (typeof options.height !== 'number') {
			throw new Error('Must provide a number options.height');
		}

		if (typeof options.tileFactory !== 'object') {
			throw new Error('Must provide an object options.tileFactory');
		}

		if (typeof(options.tileFactory.newTile) !== 'function') {
			throw new Error('Options.fileFactory must implement a newTile function');
		}

		if (typeof options.orientation !== 'string' ||
			['flat-topped', 'pointy-topped'].indexOf(options.orientation) === -1
		) {
			throw new Error('Must provide a string options.orientation which is' +
				" one of: 'flat-topped', 'pointy-topped'");
		}

		if (typeof options.layout !== 'string' ||
			['odd-q', 'even-q', 'odd-r',
				'even-r'].indexOf(options.layout) === -1
		) {
			throw new Error('Must provide a string options.layout which is' +
				" one of: 'odd-q', 'even-q', 'odd-r', 'even-r'");
		}

		if (_validLayouts[options.orientation].indexOf(options.layout) === -1) {
			throw new Error('Invalid options.layout for the chosen orientation. Must '+
				'be one of: ' + _validLayouts[options.orientation]);
		}

		_width = options.width;
		_height = options.height;
		_tileFactory = options.tileFactory;
		_orientation = options.orientation;
		_layout = options.layout;

		// Initialize each tile on the map.
		_tileIdMap = {};
		_tiles = new Array(_width * _height);
		var numTiles = _tiles.length;
		var tile;
		for (var tileIdx = 0; tileIdx < numTiles; tileIdx += 1) {
			tile = _tileFactory.newTile();
			_tiles[tileIdx] = tile;
			_tileIdMap[tile.id] = tileIdx;
		}
	};

	module.prototype.getWidth = function() {
		return _width;
	};

	module.prototype.getHeight = function() {
		return _height;
	};

	module.prototype.isWithinBoundaries = function(x, y) {
		return x <= _width - 1 &&
			x >= 0 &&
			y <= _height - 1 &&
			y >= 0;
	};

	/**
	 * Gets a specific tile by its x and y coordinates.
	 * TODO: This may not be necessary, @see design-notes.txt.
	 * @param number x The x coordinate.
	 * @param number y The y coordinate.
	 * @return {tile|null} The tile. Null if not a valid coordinate.
	 */
	module.prototype.getTileByCoords = function(x, y) {
		if (typeof x !== 'number' || typeof y !== 'number') {
			throw new Error('x and y must be integers');
		}

		if (this.isWithinBoundaries(x, y)) {
			return _tiles[(y * _width) + x];
		}

		return null;
	};

	var TileIterator = function() {
		var tileIdx = -0;
		this.next = function() {
			if (tileIdx >= _tiles.length) {
				return null;
			}

			var tile = _tiles[tileIdx];
			tileIdx += 1;
			return tile;
		};
	};

	module.prototype.getTileIterator = function() {
		return new TileIterator();
	};

	module.prototype.isValidDirection = function(dir) {
		if (_validDirs[_orientation].indexOf(dir) === -1) {
			return false;
		}

		return true;
	};

	/**
	 * Gets the coordinates of a tile given its ID.
	 * Note this is tied to getTileByCoords.
	 */
	module.prototype.getCoordsById = function(tileId) {
		var tileIdx = _tileIdMap[tileId];
		if (tileIdx === undefined) {
			return null;
		}

		return {
			x: tileIdx % _width,
			y: Math.floor(tileIdx / _width)
		};
	};

	module.prototype.getTileById = function(tileId) {
		var tileIdx = _tileIdMap[tileId];
		if (tileIdx === undefined) {
			throw new Error('Not a valid tileId');
		}

		return _tiles[tileIdx];
	};

	module.prototype.getNeighbourByCoords = function(x, y, dir) {
		if (this.isValidDirection(dir) === false) {
			throw new Error('Not a valid direction: ' + dir);
		}

		// TODO: It might be good to reduce this using maths.
		switch (_layout) {
		case 'odd-q':
			// Flat-top.
			switch (dir) {
			case 'north':
				return this.getTileByCoords(x, y - 1);
			case 'northeast':
				if (x % 2 === 0) {
					return this.getTileByCoords(x + 1, y - 1);
				}
				return this.getTileByCoords(x + 1, y);
			case 'southeast':
				if (x % 2 === 1) {
					return this.getTileByCoords(x + 1, y + 1);
				}
				return this.getTileByCoords(x + 1, y);
			case 'south':
				return this.getTileByCoords(x, y + 1);
			case 'southwest':
				if (x % 2 === 1) {
					return this.getTileByCoords(x - 1, y + 1);
				}
				return this.getTileByCoords(x - 1, y);
			case 'northwest':
				if (x % 2 === 0) {
					return this.getTileByCoords(x - 1, y - 1);
				}
				return this.getTileByCoords(x - 1, y);
			}
			break;
		case 'even-q':
			throw new Error('getNeighbourByCoords not implemented for even-q.');
		case 'odd-r':
			// Pointy-top.
			switch (dir) {
			case 'northeast':
				// On even rows, x doesn't change.
				if (y % 2 === 0) {
					return this.getTileByCoords(x, y - 1);
				}
				return this.getTileByCoords(x + 1, y - 1);
			case 'east':
				return this.getTileByCoords(x + 1, y);
			case 'southeast':
				// On even rows, x doesn't change.
				if (x % 2 === 0) {
					return this.getTileByCoords(x, y + 1);
				}
				return this.getTileByCoords(x, y + 1);
			case 'south':
				return this.getTileByCoords(x, y + 1);
			case 'southwest':
				// On odd rows, x doesn't change.
				if (y % 2 === 1) {
					return this.getTileByCoords(x, y + 1);
				}
				return this.getTileByCoords(x - 1, y + 1);
			case 'west':
				return this.getTileByCoords(x - 1, y);
			case 'northwest':
				// On even rows, x doesn't change.
				if (x % 2 === 0) {
					return this.getTileByCoords(x, y - 1);
				}
				return this.getTileByCoords(x - 1, y - 1);
			}
			break;
		case 'even-r':
			throw new Error('getNeighbourByCoords not implemented for even-r.');
		}

	};

	module.prototype.getNeighbourById = function(tileId, dir) {
		var coords = this.getCoordsById(tileId);
		return this.getNeighbourByCoords(coords.x, coords.y, dir);
	};

	module.prototype.getPositionByCoords = function(x, y) {
		var xPos = x,
			yPos = y;

		switch (_layout) {
		// Flat top.
		case 'odd-q':
			if (x % 2 === 1) {
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
		default:
			throw new Error(
				'getPositionByCoords is not implemented for ' + _layout + '.');
		}

		return {
			x: xPos,
			y: yPos
		};
	};

	module.prototype.getPositionById = function(tileId) {
		var coords = this.getCoordsById(tileId);
		return this.getPositionByCoords(coords.x, coords.y);
	};

	return module;
})();
