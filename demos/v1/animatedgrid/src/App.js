var HexGrid = require('../../../src/hex-grid.js');

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
	if (typeof this.onAnimationComplete === 'function') {
		this.onAnimationComplete.call(null, this);
	}
};

module.exports = App;
