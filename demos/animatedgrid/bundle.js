require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/james.pickard/Code/hex-map/src/HexGrid.js":[function(require,module,exports){
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

},{}],"/src/App.js":[function(require,module,exports){
var HexGrid = require('../../../src/HexGrid.js');

var TileFactory = function () {
	var _id = 0;
	return {
		newTile: function () {
			var tile = {
				id: _id.toString(),
				type: 'testTile'
			};

			_id += 1;
			return tile;
		},
	};
};

/**
 * Draws tiles by creating DOM elements.
 * @param array options
 * @param object options.parent Parent DOM element.
 */
function DomTileDrawer(options) {
	if (typeof options === 'undefined') {
		throw new Error('must provide an options object');
	}

	if (typeof options.parent !== 'object' ||
		options.parent.hasOwnProperty('childNodes' === false)
	) {
		throw new Error('options.container must be an HTML element');
	}

	if (typeof options.tileSize !== 'number') {
		throw new Error('options.tileSize must be a number');
	}


	this.tileSize = options.tileSize;
	this.parent = options.parent;
}

DomTileDrawer.prototype.createDomTile = function(xPos, yPos) {
	var hexWidth = this.tileSize * 2;
	// 0.866 = (Math.sqrt(3) / 2);
	// 0.7510 = 362 / 482
	var tileHeight = hexWidth * 0.7510;

	var tileDiv = document.createElement('div');
	tileDiv.style.position = 'absolute';
	tileDiv.style.width = hexWidth + 'px';
	tileDiv.style.height = tileHeight + 'px';

	tileDiv.style.left = (xPos * hexWidth * 0.75) + 'px';
	tileDiv.style.top = (yPos * tileHeight) + 'px';

	tileDiv.style.backgroundSize = hexWidth + 'px ' + tileHeight  + 'px';

	this.parent.appendChild(tileDiv);

	return tileDiv;
};

DomTileDrawer.prototype.setTileImage = function(element, imgFilename) {
	if (typeof element !== 'object') {
		throw new Error('element is not an object');
	}

	element.style.backgroundImage = 'url(' + imgFilename + ')';
};

var tileFactory = new TileFactory();

/**
 * @param array options
 * @param object options.container DOM element for the grid.
 * @param object options.tileSize Tile height/width in pixels.
 * @param object options.width Grid width in tiles.
 * @param object options.height Grid height in tiles.
 * @param object options.onAnimationComplete Callback for when animation
 *        completes.
 */
function App(options) {
	if (typeof options === 'undefined') {
		throw new Error('must provide an options object');
	}

	if (typeof options.container !== 'object') {
		throw new Error('options.container must be an HTML element');
	}

	this.container = options.container;

	if (typeof options.tileSize !== 'number') {
		throw new Error('options.tileSize must be a number');
	}

	if (typeof options.width !== 'number') {
		throw new Error('options.width must be a number');
	}

	if (typeof options.height !== 'number') {
		throw new Error('options.height must be a number');
	}

	this.width = options.width;
	this.height = options.height;
	this.tileSize = options.tileSize;
	this.onAnimationComplete = options.onAnimationComplete;

	this.hexGrid = new HexGrid({
		width: options.width,
		height: options.height,
		orientation: 'flat-topped',
		layout: 'odd-q',
		tileFactory: tileFactory
	});

	this.dtd = new DomTileDrawer({
		parent: options.container,
		tileSize: this.tileSize
	});

	var iter = this.hexGrid.getTileIterator();
	var tile = iter.next();
	var tilePos;
	while (tile !== null) {
		tilePos = this.hexGrid.getPositionById(tile.id);
		tile.element = this.dtd.createDomTile(tilePos.x, tilePos.y);
		this.dtd.setTileImage(
			tile.element,
			this.getTileImageByPos(tilePos.x, tilePos.y)
		);
		tile = iter.next();
	}

	this.attachMouseEvents();
	this.animateLeftToRight();
}

App.prototype.getTileImageByPos = function(x, y) {
	// Results in a dark border.
	if (x === 0 || x === this.width - 1 ||
		y === 0 ||
		(y === this.height - 1 && x % 2 === 0) ||
		(y === this.height - 0.5 && x % 2 === 1)
	) {
		return './img/dark-circle.png';
	}

	return './img/light-circle.png';
};

App.prototype.attachMouseEvents = function() {
	var iter = this.hexGrid.getTileIterator();
	var tile = iter.next();
	while (tile !== null) {
		tile.element.onmouseover = function(tile) {
			return function () {
				if (tile.selected !== true) {
					this.dtd.setTileImage(tile.element, './img/dark-circle.png');
				}
			}.bind(this);
		}.bind(this)(tile);

		tile.element.onmouseout = function(tile) {
			return function () {
				if (tile.selected !== true) {
					this.dtd.setTileImage(tile.element, './img/light-circle.png');
				}
			}.bind(this);
		}.bind(this)(tile);

		tile.element.onmousedown = function(tile) {
			return function () {
				tile.selected = true;
				this.dtd.setTileImage(tile.element, './img/red-circle.png');
			}.bind(this);
		}.bind(this)(tile);

		tile = iter.next();
	}
};

App.prototype.animateLeftToRight = function() {
	var iter = this.hexGrid.getTileIterator();
	var tile = iter.next();
	var animationInterval;

	var animate = function() {
		if (tile === null) {
			window.clearInterval(animationInterval);
			this.animationComplete();
			return;
		}

		this.dtd.setTileImage(tile.element, './img/dark-circle.png');
		tile = iter.next();
	}.bind(this);

	animationInterval = window.setInterval(animate, 50);
};

App.prototype.animationComplete = function() {
	console.log('animation complete');

	if (typeof this.onAnimationComplete === 'function') {
		this.onAnimationComplete.call(null, this);
	}
};

module.exports = App;

},{"../../../src/HexGrid.js":"/Users/james.pickard/Code/hex-map/src/HexGrid.js"}]},{},[])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy5udm0vdjAuMTEuMTMvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiLi4vLi4vc3JjL0hleEdyaWQuanMiLCJzcmMvQXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbFRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoKSB7XG5cdHZhciBfd2lkdGggPSBudWxsO1xuXHR2YXIgX2hlaWdodCA9IG51bGw7XG5cdHZhciBfdGlsZXMgPSBudWxsO1xuXHR2YXIgX3RpbGVGYWN0b3J5ID0gbnVsbDtcblx0dmFyIF9vcmllbnRhdGlvbiA9IG51bGw7XG5cdHZhciBfbGF5b3V0ID0gbnVsbDtcblxuXHQvLyBNYXBwaW5nIGZyb20gdGlsZS5pZCB0byB0aWxlSWR4LlxuXHR2YXIgX3RpbGVJZE1hcCA9IG51bGw7XG5cblx0LyoqXG5cdCAqIEEgbWFwcGluZyBmcm9tIHRoZSBtYXAgb3JpZW50YXRpb24gdG8gYW4gYXJyYXkgb2YgdmFsaWQgbmVpZ2hib3VyaW5nXG5cdCAqIGRpcmVjdGlvbnMgZm9yIGEgdGlsZS5cblx0ICogQHNlZSBkZXNpZ24tbm90ZXMudHh0LlxuXHQgKi9cblx0dmFyIF92YWxpZERpcnMgPSB7XG5cdFx0J2ZsYXQtdG9wcGVkJzogWydub3J0aCcsICdub3J0aGVhc3QnLCAnc291dGhlYXN0JywgJ3NvdXRoJywgJ3NvdXRod2VzdCcsXG5cdFx0XHQnbm9ydGh3ZXN0J10sXG5cdFx0J3BvaW50eS10b3BwZWQnOiBbJ25vcnRoZWFzdCcsICdlYXN0JywgJ3NvdXRoZWFzdCcsICdzb3V0aHdlc3QnLCAnd2VzdCcsXG5cdFx0XHQnbm9ydGh3ZXN0J11cblx0fTtcblxuXHQvKipcblx0ICogTWFwcGluZyBmcm9tIG1hcCBvcmllbnRhdGlvbiB0byBhbiBhcnJheSBvZiB2YWxpZCBsYXlvdXRzLlxuXHQgKiBAc2VlIGRlc2lnbi1ub3Rlcy50eHQuXG5cdCAqL1xuXHR2YXIgX3ZhbGlkTGF5b3V0cyA9IHtcblx0XHQnZmxhdC10b3BwZWQnOiBbJ29kZC1xJywgJ2V2ZW4tcSddLFxuXHRcdCdwb2ludHktdG9wcGVkJzogWydvZGQtcicsICdldmVuLXInXVxuXHR9O1xuXG5cdC8qKlxuXHQqIEBwYXJhbSBhcnJheSBvcHRpb25zXG5cdCogQHBhcmFtIG51bWJlciBvcHRpb25zLndpZHRoIFRoZSB3aWR0aCBvZiB0aGUgbWFwLlxuXHQqIEBwYXJhbSBudW1iZXIgb3B0aW9ucy5oZWlnaHQgVGhlIGhlaWdodCBvZiB0aGUgbWFwLlxuXHQqIEBwYXJhbSBUaWxlRmFjdG9yeSBvcHRpb25zLnRpbGVGYWN0b3J5IEEgdGlsZUZhY3Rvcnkgb2JqZWN0LiBAc2VlXG5cdCogICAgICAgIFRpbGVGYWN0b3J5LlxuXHQqIEBwYXJhbSBzdHJpbmcgb3B0aW9ucy5vcmllbnRhdGlvbiBUaGUgb3JpZW50YXRpb24gb2YgdGhlIG1hcC4gTXVzdCBiZSBvbmVcblx0KiAgICAgICAgb2Y6IGZsYXQtdG9wcGVkLCBwb2ludHktdG9wcGVkLlxuXHQqL1xuXHR2YXIgbW9kdWxlID0gZnVuY3Rpb24ob3B0aW9ucykge1xuXHRcdGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignTXVzdCBwcm92aWRlIGFuIG9wdGlvbnMgb2JqZWN0Jyk7XG5cdFx0fVxuXG5cdFx0aWYgKHR5cGVvZiBvcHRpb25zLndpZHRoICE9PSAnbnVtYmVyJykge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdNdXN0IHByb3ZpZGUgYSBudW1iZXIgb3B0aW9ucy53aWR0aCcpO1xuXHRcdH1cblxuXHRcdGlmICh0eXBlb2Ygb3B0aW9ucy5oZWlnaHQgIT09ICdudW1iZXInKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ011c3QgcHJvdmlkZSBhIG51bWJlciBvcHRpb25zLmhlaWdodCcpO1xuXHRcdH1cblxuXHRcdGlmICh0eXBlb2Ygb3B0aW9ucy50aWxlRmFjdG9yeSAhPT0gJ29iamVjdCcpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignTXVzdCBwcm92aWRlIGFuIG9iamVjdCBvcHRpb25zLnRpbGVGYWN0b3J5Jyk7XG5cdFx0fVxuXG5cdFx0aWYgKHR5cGVvZihvcHRpb25zLnRpbGVGYWN0b3J5Lm5ld1RpbGUpICE9PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ09wdGlvbnMuZmlsZUZhY3RvcnkgbXVzdCBpbXBsZW1lbnQgYSBuZXdUaWxlIGZ1bmN0aW9uJyk7XG5cdFx0fVxuXG5cdFx0aWYgKHR5cGVvZiBvcHRpb25zLm9yaWVudGF0aW9uICE9PSAnc3RyaW5nJyB8fFxuXHRcdFx0WydmbGF0LXRvcHBlZCcsICdwb2ludHktdG9wcGVkJ10uaW5kZXhPZihvcHRpb25zLm9yaWVudGF0aW9uKSA9PT0gLTFcblx0XHQpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignTXVzdCBwcm92aWRlIGEgc3RyaW5nIG9wdGlvbnMub3JpZW50YXRpb24gd2hpY2ggaXMnICtcblx0XHRcdFx0XCIgb25lIG9mOiAnZmxhdC10b3BwZWQnLCAncG9pbnR5LXRvcHBlZCdcIik7XG5cdFx0fVxuXG5cdFx0aWYgKHR5cGVvZiBvcHRpb25zLmxheW91dCAhPT0gJ3N0cmluZycgfHxcblx0XHRcdFsnb2RkLXEnLCAnZXZlbi1xJywgJ29kZC1yJyxcblx0XHRcdFx0J2V2ZW4tciddLmluZGV4T2Yob3B0aW9ucy5sYXlvdXQpID09PSAtMVxuXHRcdCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdNdXN0IHByb3ZpZGUgYSBzdHJpbmcgb3B0aW9ucy5sYXlvdXQgd2hpY2ggaXMnICtcblx0XHRcdFx0XCIgb25lIG9mOiAnb2RkLXEnLCAnZXZlbi1xJywgJ29kZC1yJywgJ2V2ZW4tcidcIik7XG5cdFx0fVxuXG5cdFx0aWYgKF92YWxpZExheW91dHNbb3B0aW9ucy5vcmllbnRhdGlvbl0uaW5kZXhPZihvcHRpb25zLmxheW91dCkgPT09IC0xKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgb3B0aW9ucy5sYXlvdXQgZm9yIHRoZSBjaG9zZW4gb3JpZW50YXRpb24uIE11c3QgJytcblx0XHRcdFx0J2JlIG9uZSBvZjogJyArIF92YWxpZExheW91dHNbb3B0aW9ucy5vcmllbnRhdGlvbl0pO1xuXHRcdH1cblxuXHRcdF93aWR0aCA9IG9wdGlvbnMud2lkdGg7XG5cdFx0X2hlaWdodCA9IG9wdGlvbnMuaGVpZ2h0O1xuXHRcdF90aWxlRmFjdG9yeSA9IG9wdGlvbnMudGlsZUZhY3Rvcnk7XG5cdFx0X29yaWVudGF0aW9uID0gb3B0aW9ucy5vcmllbnRhdGlvbjtcblx0XHRfbGF5b3V0ID0gb3B0aW9ucy5sYXlvdXQ7XG5cblx0XHQvLyBJbml0aWFsaXplIGVhY2ggdGlsZSBvbiB0aGUgbWFwLlxuXHRcdF90aWxlSWRNYXAgPSB7fTtcblx0XHRfdGlsZXMgPSBuZXcgQXJyYXkoX3dpZHRoICogX2hlaWdodCk7XG5cdFx0dmFyIG51bVRpbGVzID0gX3RpbGVzLmxlbmd0aDtcblx0XHR2YXIgdGlsZTtcblx0XHRmb3IgKHZhciB0aWxlSWR4ID0gMDsgdGlsZUlkeCA8IG51bVRpbGVzOyB0aWxlSWR4ICs9IDEpIHtcblx0XHRcdHRpbGUgPSBfdGlsZUZhY3RvcnkubmV3VGlsZSgpO1xuXHRcdFx0X3RpbGVzW3RpbGVJZHhdID0gdGlsZTtcblx0XHRcdF90aWxlSWRNYXBbdGlsZS5pZF0gPSB0aWxlSWR4O1xuXHRcdH1cblx0fTtcblxuXHRtb2R1bGUucHJvdG90eXBlLmdldFdpZHRoID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIF93aWR0aDtcblx0fTtcblxuXHRtb2R1bGUucHJvdG90eXBlLmdldEhlaWdodCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBfaGVpZ2h0O1xuXHR9O1xuXG5cdG1vZHVsZS5wcm90b3R5cGUuaXNXaXRoaW5Cb3VuZGFyaWVzID0gZnVuY3Rpb24oeCwgeSkge1xuXHRcdHJldHVybiB4IDw9IF93aWR0aCAtIDEgJiZcblx0XHRcdHggPj0gMCAmJlxuXHRcdFx0eSA8PSBfaGVpZ2h0IC0gMSAmJlxuXHRcdFx0eSA+PSAwO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBHZXRzIGEgc3BlY2lmaWMgdGlsZSBieSBpdHMgeCBhbmQgeSBjb29yZGluYXRlcy5cblx0ICogVE9ETzogVGhpcyBtYXkgbm90IGJlIG5lY2Vzc2FyeSwgQHNlZSBkZXNpZ24tbm90ZXMudHh0LlxuXHQgKiBAcGFyYW0gbnVtYmVyIHggVGhlIHggY29vcmRpbmF0ZS5cblx0ICogQHBhcmFtIG51bWJlciB5IFRoZSB5IGNvb3JkaW5hdGUuXG5cdCAqIEByZXR1cm4ge3RpbGV8bnVsbH0gVGhlIHRpbGUuIE51bGwgaWYgbm90IGEgdmFsaWQgY29vcmRpbmF0ZS5cblx0ICovXG5cdG1vZHVsZS5wcm90b3R5cGUuZ2V0VGlsZUJ5Q29vcmRzID0gZnVuY3Rpb24oeCwgeSkge1xuXHRcdGlmICh0eXBlb2YgeCAhPT0gJ251bWJlcicgfHwgdHlwZW9mIHkgIT09ICdudW1iZXInKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ3ggYW5kIHkgbXVzdCBiZSBpbnRlZ2VycycpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLmlzV2l0aGluQm91bmRhcmllcyh4LCB5KSkge1xuXHRcdFx0cmV0dXJuIF90aWxlc1soeSAqIF93aWR0aCkgKyB4XTtcblx0XHR9XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fTtcblxuXHR2YXIgVGlsZUl0ZXJhdG9yID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHRpbGVJZHggPSAtMDtcblx0XHR0aGlzLm5leHQgPSBmdW5jdGlvbigpIHtcblx0XHRcdGlmICh0aWxlSWR4ID49IF90aWxlcy5sZW5ndGgpIHtcblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHR9XG5cblx0XHRcdHZhciB0aWxlID0gX3RpbGVzW3RpbGVJZHhdO1xuXHRcdFx0dGlsZUlkeCArPSAxO1xuXHRcdFx0cmV0dXJuIHRpbGU7XG5cdFx0fTtcblx0fTtcblxuXHRtb2R1bGUucHJvdG90eXBlLmdldFRpbGVJdGVyYXRvciA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBuZXcgVGlsZUl0ZXJhdG9yKCk7XG5cdH07XG5cblx0bW9kdWxlLnByb3RvdHlwZS5pc1ZhbGlkRGlyZWN0aW9uID0gZnVuY3Rpb24oZGlyKSB7XG5cdFx0aWYgKF92YWxpZERpcnNbX29yaWVudGF0aW9uXS5pbmRleE9mKGRpcikgPT09IC0xKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH07XG5cblx0LyoqXG5cdCAqIEdldHMgdGhlIGNvb3JkaW5hdGVzIG9mIGEgdGlsZSBnaXZlbiBpdHMgSUQuXG5cdCAqIE5vdGUgdGhpcyBpcyB0aWVkIHRvIGdldFRpbGVCeUNvb3Jkcy5cblx0ICovXG5cdG1vZHVsZS5wcm90b3R5cGUuZ2V0Q29vcmRzQnlJZCA9IGZ1bmN0aW9uKHRpbGVJZCkge1xuXHRcdHZhciB0aWxlSWR4ID0gX3RpbGVJZE1hcFt0aWxlSWRdO1xuXHRcdGlmICh0aWxlSWR4ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHR4OiB0aWxlSWR4ICUgX3dpZHRoLFxuXHRcdFx0eTogTWF0aC5mbG9vcih0aWxlSWR4IC8gX3dpZHRoKVxuXHRcdH07XG5cdH07XG5cblx0bW9kdWxlLnByb3RvdHlwZS5nZXRUaWxlQnlJZCA9IGZ1bmN0aW9uKHRpbGVJZCkge1xuXHRcdHZhciB0aWxlSWR4ID0gX3RpbGVJZE1hcFt0aWxlSWRdO1xuXHRcdGlmICh0aWxlSWR4ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignTm90IGEgdmFsaWQgdGlsZUlkJyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIF90aWxlc1t0aWxlSWR4XTtcblx0fTtcblxuXHRtb2R1bGUucHJvdG90eXBlLmdldE5laWdoYm91ckJ5Q29vcmRzID0gZnVuY3Rpb24oeCwgeSwgZGlyKSB7XG5cdFx0aWYgKHRoaXMuaXNWYWxpZERpcmVjdGlvbihkaXIpID09PSBmYWxzZSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdOb3QgYSB2YWxpZCBkaXJlY3Rpb246ICcgKyBkaXIpO1xuXHRcdH1cblxuXHRcdC8vIFRPRE86IEl0IG1pZ2h0IGJlIGdvb2QgdG8gcmVkdWNlIHRoaXMgdXNpbmcgbWF0aHMuXG5cdFx0c3dpdGNoIChfbGF5b3V0KSB7XG5cdFx0Y2FzZSAnb2RkLXEnOlxuXHRcdFx0Ly8gRmxhdC10b3AuXG5cdFx0XHRzd2l0Y2ggKGRpcikge1xuXHRcdFx0Y2FzZSAnbm9ydGgnOlxuXHRcdFx0XHRyZXR1cm4gdGhpcy5nZXRUaWxlQnlDb29yZHMoeCwgeSAtIDEpO1xuXHRcdFx0Y2FzZSAnbm9ydGhlYXN0Jzpcblx0XHRcdFx0aWYgKHggJSAyID09PSAwKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuZ2V0VGlsZUJ5Q29vcmRzKHggKyAxLCB5IC0gMSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoaXMuZ2V0VGlsZUJ5Q29vcmRzKHggKyAxLCB5KTtcblx0XHRcdGNhc2UgJ3NvdXRoZWFzdCc6XG5cdFx0XHRcdGlmICh4ICUgMiA9PT0gMSkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmdldFRpbGVCeUNvb3Jkcyh4ICsgMSwgeSArIDEpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0aGlzLmdldFRpbGVCeUNvb3Jkcyh4ICsgMSwgeSk7XG5cdFx0XHRjYXNlICdzb3V0aCc6XG5cdFx0XHRcdHJldHVybiB0aGlzLmdldFRpbGVCeUNvb3Jkcyh4LCB5ICsgMSk7XG5cdFx0XHRjYXNlICdzb3V0aHdlc3QnOlxuXHRcdFx0XHRpZiAoeCAlIDIgPT09IDEpIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5nZXRUaWxlQnlDb29yZHMoeCAtIDEsIHkgKyAxKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdGhpcy5nZXRUaWxlQnlDb29yZHMoeCAtIDEsIHkpO1xuXHRcdFx0Y2FzZSAnbm9ydGh3ZXN0Jzpcblx0XHRcdFx0aWYgKHggJSAyID09PSAwKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuZ2V0VGlsZUJ5Q29vcmRzKHggLSAxLCB5IC0gMSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoaXMuZ2V0VGlsZUJ5Q29vcmRzKHggLSAxLCB5KTtcblx0XHRcdH1cblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgJ2V2ZW4tcSc6XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ2dldE5laWdoYm91ckJ5Q29vcmRzIG5vdCBpbXBsZW1lbnRlZCBmb3IgZXZlbi1xLicpO1xuXHRcdGNhc2UgJ29kZC1yJzpcblx0XHRcdC8vIFBvaW50eS10b3AuXG5cdFx0XHRzd2l0Y2ggKGRpcikge1xuXHRcdFx0Y2FzZSAnbm9ydGhlYXN0Jzpcblx0XHRcdFx0Ly8gT24gZXZlbiByb3dzLCB4IGRvZXNuJ3QgY2hhbmdlLlxuXHRcdFx0XHRpZiAoeSAlIDIgPT09IDApIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5nZXRUaWxlQnlDb29yZHMoeCwgeSAtIDEpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0aGlzLmdldFRpbGVCeUNvb3Jkcyh4ICsgMSwgeSAtIDEpO1xuXHRcdFx0Y2FzZSAnZWFzdCc6XG5cdFx0XHRcdHJldHVybiB0aGlzLmdldFRpbGVCeUNvb3Jkcyh4ICsgMSwgeSk7XG5cdFx0XHRjYXNlICdzb3V0aGVhc3QnOlxuXHRcdFx0XHQvLyBPbiBldmVuIHJvd3MsIHggZG9lc24ndCBjaGFuZ2UuXG5cdFx0XHRcdGlmICh4ICUgMiA9PT0gMCkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmdldFRpbGVCeUNvb3Jkcyh4LCB5ICsgMSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoaXMuZ2V0VGlsZUJ5Q29vcmRzKHgsIHkgKyAxKTtcblx0XHRcdGNhc2UgJ3NvdXRoJzpcblx0XHRcdFx0cmV0dXJuIHRoaXMuZ2V0VGlsZUJ5Q29vcmRzKHgsIHkgKyAxKTtcblx0XHRcdGNhc2UgJ3NvdXRod2VzdCc6XG5cdFx0XHRcdC8vIE9uIG9kZCByb3dzLCB4IGRvZXNuJ3QgY2hhbmdlLlxuXHRcdFx0XHRpZiAoeSAlIDIgPT09IDEpIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5nZXRUaWxlQnlDb29yZHMoeCwgeSArIDEpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0aGlzLmdldFRpbGVCeUNvb3Jkcyh4IC0gMSwgeSArIDEpO1xuXHRcdFx0Y2FzZSAnd2VzdCc6XG5cdFx0XHRcdHJldHVybiB0aGlzLmdldFRpbGVCeUNvb3Jkcyh4IC0gMSwgeSk7XG5cdFx0XHRjYXNlICdub3J0aHdlc3QnOlxuXHRcdFx0XHQvLyBPbiBldmVuIHJvd3MsIHggZG9lc24ndCBjaGFuZ2UuXG5cdFx0XHRcdGlmICh4ICUgMiA9PT0gMCkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmdldFRpbGVCeUNvb3Jkcyh4LCB5IC0gMSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoaXMuZ2V0VGlsZUJ5Q29vcmRzKHggLSAxLCB5IC0gMSk7XG5cdFx0XHR9XG5cdFx0XHRicmVhaztcblx0XHRjYXNlICdldmVuLXInOlxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdnZXROZWlnaGJvdXJCeUNvb3JkcyBub3QgaW1wbGVtZW50ZWQgZm9yIGV2ZW4tci4nKTtcblx0XHR9XG5cblx0fTtcblxuXHRtb2R1bGUucHJvdG90eXBlLmdldE5laWdoYm91ckJ5SWQgPSBmdW5jdGlvbih0aWxlSWQsIGRpcikge1xuXHRcdHZhciBjb29yZHMgPSB0aGlzLmdldENvb3Jkc0J5SWQodGlsZUlkKTtcblx0XHRyZXR1cm4gdGhpcy5nZXROZWlnaGJvdXJCeUNvb3Jkcyhjb29yZHMueCwgY29vcmRzLnksIGRpcik7XG5cdH07XG5cblx0bW9kdWxlLnByb3RvdHlwZS5nZXRQb3NpdGlvbkJ5Q29vcmRzID0gZnVuY3Rpb24oeCwgeSkge1xuXHRcdHZhciB4UG9zID0geCxcblx0XHRcdHlQb3MgPSB5O1xuXG5cdFx0c3dpdGNoIChfbGF5b3V0KSB7XG5cdFx0Ly8gRmxhdCB0b3AuXG5cdFx0Y2FzZSAnb2RkLXEnOlxuXHRcdFx0aWYgKHggJSAyID09PSAxKSB7XG5cdFx0XHRcdHlQb3MgPSB5ICsgMC41O1xuXHRcdFx0fVxuXHRcdFx0YnJlYWs7XG5cblx0XHQvLyBQb2ludHkgdG9wLlxuXHRcdGNhc2UgJ29kZC1yJzpcblx0XHRcdC8vIE9kZCByb3dzIGFyZSBvZmZzZXQgYnkgaGFsZi5cblx0XHRcdGlmICh5ICUgMiA9PT0gMSkge1xuXHRcdFx0XHR4UG9zID0geCArIDAuNTtcblx0XHRcdH1cblxuXHRcdFx0YnJlYWs7XG5cdFx0ZGVmYXVsdDpcblx0XHRcdHRocm93IG5ldyBFcnJvcihcblx0XHRcdFx0J2dldFBvc2l0aW9uQnlDb29yZHMgaXMgbm90IGltcGxlbWVudGVkIGZvciAnICsgX2xheW91dCArICcuJyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHg6IHhQb3MsXG5cdFx0XHR5OiB5UG9zXG5cdFx0fTtcblx0fTtcblxuXHRtb2R1bGUucHJvdG90eXBlLmdldFBvc2l0aW9uQnlJZCA9IGZ1bmN0aW9uKHRpbGVJZCkge1xuXHRcdHZhciBjb29yZHMgPSB0aGlzLmdldENvb3Jkc0J5SWQodGlsZUlkKTtcblx0XHRyZXR1cm4gdGhpcy5nZXRQb3NpdGlvbkJ5Q29vcmRzKGNvb3Jkcy54LCBjb29yZHMueSk7XG5cdH07XG5cblx0cmV0dXJuIG1vZHVsZTtcbn0pKCk7XG4iLCJ2YXIgSGV4R3JpZCA9IHJlcXVpcmUoJy4uLy4uLy4uL3NyYy9IZXhHcmlkLmpzJyk7XG5cbnZhciBUaWxlRmFjdG9yeSA9IGZ1bmN0aW9uICgpIHtcblx0dmFyIF9pZCA9IDA7XG5cdHJldHVybiB7XG5cdFx0bmV3VGlsZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIHRpbGUgPSB7XG5cdFx0XHRcdGlkOiBfaWQudG9TdHJpbmcoKSxcblx0XHRcdFx0dHlwZTogJ3Rlc3RUaWxlJ1xuXHRcdFx0fTtcblxuXHRcdFx0X2lkICs9IDE7XG5cdFx0XHRyZXR1cm4gdGlsZTtcblx0XHR9LFxuXHR9O1xufTtcblxuLyoqXG4gKiBEcmF3cyB0aWxlcyBieSBjcmVhdGluZyBET00gZWxlbWVudHMuXG4gKiBAcGFyYW0gYXJyYXkgb3B0aW9uc1xuICogQHBhcmFtIG9iamVjdCBvcHRpb25zLnBhcmVudCBQYXJlbnQgRE9NIGVsZW1lbnQuXG4gKi9cbmZ1bmN0aW9uIERvbVRpbGVEcmF3ZXIob3B0aW9ucykge1xuXHRpZiAodHlwZW9mIG9wdGlvbnMgPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdtdXN0IHByb3ZpZGUgYW4gb3B0aW9ucyBvYmplY3QnKTtcblx0fVxuXG5cdGlmICh0eXBlb2Ygb3B0aW9ucy5wYXJlbnQgIT09ICdvYmplY3QnIHx8XG5cdFx0b3B0aW9ucy5wYXJlbnQuaGFzT3duUHJvcGVydHkoJ2NoaWxkTm9kZXMnID09PSBmYWxzZSlcblx0KSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdvcHRpb25zLmNvbnRhaW5lciBtdXN0IGJlIGFuIEhUTUwgZWxlbWVudCcpO1xuXHR9XG5cblx0aWYgKHR5cGVvZiBvcHRpb25zLnRpbGVTaXplICE9PSAnbnVtYmVyJykge1xuXHRcdHRocm93IG5ldyBFcnJvcignb3B0aW9ucy50aWxlU2l6ZSBtdXN0IGJlIGEgbnVtYmVyJyk7XG5cdH1cblxuXG5cdHRoaXMudGlsZVNpemUgPSBvcHRpb25zLnRpbGVTaXplO1xuXHR0aGlzLnBhcmVudCA9IG9wdGlvbnMucGFyZW50O1xufVxuXG5Eb21UaWxlRHJhd2VyLnByb3RvdHlwZS5jcmVhdGVEb21UaWxlID0gZnVuY3Rpb24oeFBvcywgeVBvcykge1xuXHR2YXIgaGV4V2lkdGggPSB0aGlzLnRpbGVTaXplICogMjtcblx0Ly8gMC44NjYgPSAoTWF0aC5zcXJ0KDMpIC8gMik7XG5cdC8vIDAuNzUxMCA9IDM2MiAvIDQ4MlxuXHR2YXIgdGlsZUhlaWdodCA9IGhleFdpZHRoICogMC43NTEwO1xuXG5cdHZhciB0aWxlRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdHRpbGVEaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuXHR0aWxlRGl2LnN0eWxlLndpZHRoID0gaGV4V2lkdGggKyAncHgnO1xuXHR0aWxlRGl2LnN0eWxlLmhlaWdodCA9IHRpbGVIZWlnaHQgKyAncHgnO1xuXG5cdHRpbGVEaXYuc3R5bGUubGVmdCA9ICh4UG9zICogaGV4V2lkdGggKiAwLjc1KSArICdweCc7XG5cdHRpbGVEaXYuc3R5bGUudG9wID0gKHlQb3MgKiB0aWxlSGVpZ2h0KSArICdweCc7XG5cblx0dGlsZURpdi5zdHlsZS5iYWNrZ3JvdW5kU2l6ZSA9IGhleFdpZHRoICsgJ3B4ICcgKyB0aWxlSGVpZ2h0ICArICdweCc7XG5cblx0dGhpcy5wYXJlbnQuYXBwZW5kQ2hpbGQodGlsZURpdik7XG5cblx0cmV0dXJuIHRpbGVEaXY7XG59O1xuXG5Eb21UaWxlRHJhd2VyLnByb3RvdHlwZS5zZXRUaWxlSW1hZ2UgPSBmdW5jdGlvbihlbGVtZW50LCBpbWdGaWxlbmFtZSkge1xuXHRpZiAodHlwZW9mIGVsZW1lbnQgIT09ICdvYmplY3QnKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdlbGVtZW50IGlzIG5vdCBhbiBvYmplY3QnKTtcblx0fVxuXG5cdGVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gJ3VybCgnICsgaW1nRmlsZW5hbWUgKyAnKSc7XG59O1xuXG52YXIgdGlsZUZhY3RvcnkgPSBuZXcgVGlsZUZhY3RvcnkoKTtcblxuLyoqXG4gKiBAcGFyYW0gYXJyYXkgb3B0aW9uc1xuICogQHBhcmFtIG9iamVjdCBvcHRpb25zLmNvbnRhaW5lciBET00gZWxlbWVudCBmb3IgdGhlIGdyaWQuXG4gKiBAcGFyYW0gb2JqZWN0IG9wdGlvbnMudGlsZVNpemUgVGlsZSBoZWlnaHQvd2lkdGggaW4gcGl4ZWxzLlxuICogQHBhcmFtIG9iamVjdCBvcHRpb25zLndpZHRoIEdyaWQgd2lkdGggaW4gdGlsZXMuXG4gKiBAcGFyYW0gb2JqZWN0IG9wdGlvbnMuaGVpZ2h0IEdyaWQgaGVpZ2h0IGluIHRpbGVzLlxuICogQHBhcmFtIG9iamVjdCBvcHRpb25zLm9uQW5pbWF0aW9uQ29tcGxldGUgQ2FsbGJhY2sgZm9yIHdoZW4gYW5pbWF0aW9uXG4gKiAgICAgICAgY29tcGxldGVzLlxuICovXG5mdW5jdGlvbiBBcHAob3B0aW9ucykge1xuXHRpZiAodHlwZW9mIG9wdGlvbnMgPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdtdXN0IHByb3ZpZGUgYW4gb3B0aW9ucyBvYmplY3QnKTtcblx0fVxuXG5cdGlmICh0eXBlb2Ygb3B0aW9ucy5jb250YWluZXIgIT09ICdvYmplY3QnKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdvcHRpb25zLmNvbnRhaW5lciBtdXN0IGJlIGFuIEhUTUwgZWxlbWVudCcpO1xuXHR9XG5cblx0dGhpcy5jb250YWluZXIgPSBvcHRpb25zLmNvbnRhaW5lcjtcblxuXHRpZiAodHlwZW9mIG9wdGlvbnMudGlsZVNpemUgIT09ICdudW1iZXInKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdvcHRpb25zLnRpbGVTaXplIG11c3QgYmUgYSBudW1iZXInKTtcblx0fVxuXG5cdGlmICh0eXBlb2Ygb3B0aW9ucy53aWR0aCAhPT0gJ251bWJlcicpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ29wdGlvbnMud2lkdGggbXVzdCBiZSBhIG51bWJlcicpO1xuXHR9XG5cblx0aWYgKHR5cGVvZiBvcHRpb25zLmhlaWdodCAhPT0gJ251bWJlcicpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ29wdGlvbnMuaGVpZ2h0IG11c3QgYmUgYSBudW1iZXInKTtcblx0fVxuXG5cdHRoaXMud2lkdGggPSBvcHRpb25zLndpZHRoO1xuXHR0aGlzLmhlaWdodCA9IG9wdGlvbnMuaGVpZ2h0O1xuXHR0aGlzLnRpbGVTaXplID0gb3B0aW9ucy50aWxlU2l6ZTtcblx0dGhpcy5vbkFuaW1hdGlvbkNvbXBsZXRlID0gb3B0aW9ucy5vbkFuaW1hdGlvbkNvbXBsZXRlO1xuXG5cdHRoaXMuaGV4R3JpZCA9IG5ldyBIZXhHcmlkKHtcblx0XHR3aWR0aDogb3B0aW9ucy53aWR0aCxcblx0XHRoZWlnaHQ6IG9wdGlvbnMuaGVpZ2h0LFxuXHRcdG9yaWVudGF0aW9uOiAnZmxhdC10b3BwZWQnLFxuXHRcdGxheW91dDogJ29kZC1xJyxcblx0XHR0aWxlRmFjdG9yeTogdGlsZUZhY3Rvcnlcblx0fSk7XG5cblx0dGhpcy5kdGQgPSBuZXcgRG9tVGlsZURyYXdlcih7XG5cdFx0cGFyZW50OiBvcHRpb25zLmNvbnRhaW5lcixcblx0XHR0aWxlU2l6ZTogdGhpcy50aWxlU2l6ZVxuXHR9KTtcblxuXHR2YXIgaXRlciA9IHRoaXMuaGV4R3JpZC5nZXRUaWxlSXRlcmF0b3IoKTtcblx0dmFyIHRpbGUgPSBpdGVyLm5leHQoKTtcblx0dmFyIHRpbGVQb3M7XG5cdHdoaWxlICh0aWxlICE9PSBudWxsKSB7XG5cdFx0dGlsZVBvcyA9IHRoaXMuaGV4R3JpZC5nZXRQb3NpdGlvbkJ5SWQodGlsZS5pZCk7XG5cdFx0dGlsZS5lbGVtZW50ID0gdGhpcy5kdGQuY3JlYXRlRG9tVGlsZSh0aWxlUG9zLngsIHRpbGVQb3MueSk7XG5cdFx0dGhpcy5kdGQuc2V0VGlsZUltYWdlKFxuXHRcdFx0dGlsZS5lbGVtZW50LFxuXHRcdFx0dGhpcy5nZXRUaWxlSW1hZ2VCeVBvcyh0aWxlUG9zLngsIHRpbGVQb3MueSlcblx0XHQpO1xuXHRcdHRpbGUgPSBpdGVyLm5leHQoKTtcblx0fVxuXG5cdHRoaXMuYXR0YWNoTW91c2VFdmVudHMoKTtcblx0dGhpcy5hbmltYXRlTGVmdFRvUmlnaHQoKTtcbn1cblxuQXBwLnByb3RvdHlwZS5nZXRUaWxlSW1hZ2VCeVBvcyA9IGZ1bmN0aW9uKHgsIHkpIHtcblx0Ly8gUmVzdWx0cyBpbiBhIGRhcmsgYm9yZGVyLlxuXHRpZiAoeCA9PT0gMCB8fCB4ID09PSB0aGlzLndpZHRoIC0gMSB8fFxuXHRcdHkgPT09IDAgfHxcblx0XHQoeSA9PT0gdGhpcy5oZWlnaHQgLSAxICYmIHggJSAyID09PSAwKSB8fFxuXHRcdCh5ID09PSB0aGlzLmhlaWdodCAtIDAuNSAmJiB4ICUgMiA9PT0gMSlcblx0KSB7XG5cdFx0cmV0dXJuICcuL2ltZy9kYXJrLWNpcmNsZS5wbmcnO1xuXHR9XG5cblx0cmV0dXJuICcuL2ltZy9saWdodC1jaXJjbGUucG5nJztcbn07XG5cbkFwcC5wcm90b3R5cGUuYXR0YWNoTW91c2VFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0dmFyIGl0ZXIgPSB0aGlzLmhleEdyaWQuZ2V0VGlsZUl0ZXJhdG9yKCk7XG5cdHZhciB0aWxlID0gaXRlci5uZXh0KCk7XG5cdHdoaWxlICh0aWxlICE9PSBudWxsKSB7XG5cdFx0dGlsZS5lbGVtZW50Lm9ubW91c2VvdmVyID0gZnVuY3Rpb24odGlsZSkge1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0aWYgKHRpbGUuc2VsZWN0ZWQgIT09IHRydWUpIHtcblx0XHRcdFx0XHR0aGlzLmR0ZC5zZXRUaWxlSW1hZ2UodGlsZS5lbGVtZW50LCAnLi9pbWcvZGFyay1jaXJjbGUucG5nJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0uYmluZCh0aGlzKTtcblx0XHR9LmJpbmQodGhpcykodGlsZSk7XG5cblx0XHR0aWxlLmVsZW1lbnQub25tb3VzZW91dCA9IGZ1bmN0aW9uKHRpbGUpIHtcblx0XHRcdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGlmICh0aWxlLnNlbGVjdGVkICE9PSB0cnVlKSB7XG5cdFx0XHRcdFx0dGhpcy5kdGQuc2V0VGlsZUltYWdlKHRpbGUuZWxlbWVudCwgJy4vaW1nL2xpZ2h0LWNpcmNsZS5wbmcnKTtcblx0XHRcdFx0fVxuXHRcdFx0fS5iaW5kKHRoaXMpO1xuXHRcdH0uYmluZCh0aGlzKSh0aWxlKTtcblxuXHRcdHRpbGUuZWxlbWVudC5vbm1vdXNlZG93biA9IGZ1bmN0aW9uKHRpbGUpIHtcblx0XHRcdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHRpbGUuc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHR0aGlzLmR0ZC5zZXRUaWxlSW1hZ2UodGlsZS5lbGVtZW50LCAnLi9pbWcvcmVkLWNpcmNsZS5wbmcnKTtcblx0XHRcdH0uYmluZCh0aGlzKTtcblx0XHR9LmJpbmQodGhpcykodGlsZSk7XG5cblx0XHR0aWxlID0gaXRlci5uZXh0KCk7XG5cdH1cbn07XG5cbkFwcC5wcm90b3R5cGUuYW5pbWF0ZUxlZnRUb1JpZ2h0ID0gZnVuY3Rpb24oKSB7XG5cdHZhciBpdGVyID0gdGhpcy5oZXhHcmlkLmdldFRpbGVJdGVyYXRvcigpO1xuXHR2YXIgdGlsZSA9IGl0ZXIubmV4dCgpO1xuXHR2YXIgYW5pbWF0aW9uSW50ZXJ2YWw7XG5cblx0dmFyIGFuaW1hdGUgPSBmdW5jdGlvbigpIHtcblx0XHRpZiAodGlsZSA9PT0gbnVsbCkge1xuXHRcdFx0d2luZG93LmNsZWFySW50ZXJ2YWwoYW5pbWF0aW9uSW50ZXJ2YWwpO1xuXHRcdFx0dGhpcy5hbmltYXRpb25Db21wbGV0ZSgpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuZHRkLnNldFRpbGVJbWFnZSh0aWxlLmVsZW1lbnQsICcuL2ltZy9kYXJrLWNpcmNsZS5wbmcnKTtcblx0XHR0aWxlID0gaXRlci5uZXh0KCk7XG5cdH0uYmluZCh0aGlzKTtcblxuXHRhbmltYXRpb25JbnRlcnZhbCA9IHdpbmRvdy5zZXRJbnRlcnZhbChhbmltYXRlLCA1MCk7XG59O1xuXG5BcHAucHJvdG90eXBlLmFuaW1hdGlvbkNvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG5cdGNvbnNvbGUubG9nKCdhbmltYXRpb24gY29tcGxldGUnKTtcblxuXHRpZiAodHlwZW9mIHRoaXMub25BbmltYXRpb25Db21wbGV0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdHRoaXMub25BbmltYXRpb25Db21wbGV0ZS5jYWxsKG51bGwsIHRoaXMpO1xuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcDtcbiJdfQ==
