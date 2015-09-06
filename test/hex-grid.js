// In the tests, we create objects but don't do anything with them:
/*jshint nonew: false */

var assert = require('assert'),
	expect = require('expect.js'),
	HexGrid = require('../src/hex-grid.js');

describe('HexGrid', function() {
	var TileFactory = function () {
		var _id = 0;
		return {
			'newTile': function () {
				var tile = {
					id: _id.toString(),
					type: 'testTile'
				};

				_id += 1;
				return tile;
			}
		};
	};

	var tileFactory = new TileFactory();

	describe ('HexGrid', function() {
		it('should error for an invalid layout', function() {
			function createGrid() {
				new HexGrid({
					'width': 20,
					'height': 10,
					'orientation': 'flat-topped',
					'layout': 'not-a-real-layout',
					tileFactory: tileFactory
				});
			}

			expect(4).to.equal(4);
			expect(createGrid).to.throwError();
		});

		it('should allow multiple objects', function() {
			var firstGrid = new HexGrid({
				'width': 10,
				'height': 10,
				'orientation': 'flat-topped',
				'layout': 'odd-q',
				tileFactory: tileFactory
			});

			var secondGrid = new HexGrid({
				'width': 20,
				'height': 10,
				'orientation': 'flat-topped',
				'layout': 'odd-q',
				tileFactory: tileFactory
			});

			expect(firstGrid.getWidth()).to.equal(10);
			expect(secondGrid.getWidth()).to.equal(20);

			var thirdGrid = new HexGrid({
				'width': 5,
				'height': 5,
				'orientation': 'flat-topped',
				'layout': 'odd-q',
				tileFactory: tileFactory
			});

			expect(firstGrid.getWidth()).to.equal(10);
			expect(secondGrid.getWidth()).to.equal(20);
			expect(thirdGrid.getWidth()).to.equal(5);
		});
	});

	function gridTests(orientation, layout) {
		describe ('gridTests: ' + orientation + ' ' + layout, function() {
			var hexGrid;

			beforeEach(function() {
				hexGrid = new HexGrid({
					'width': 20,
					'height': 10,
					'orientation': orientation,
					'layout': layout,
					tileFactory: tileFactory
				});
			});

			describe('basic setup', function() {
				it('should instantiate', function() {
					assert.equal(typeof(hexGrid), 'object');
				});

				describe('getWidth', function () {
					it('should return the grid width', function() {
						assert.equal(20, hexGrid.getWidth());
					});
				});

				describe('getHeight', function() {
					it('should return the grid height', function() {
						assert.equal(10, hexGrid.getHeight());
					});
				});
			});

			describe('isWithinBoundaries', function() {
				it('should return false outside boundaries', function() {
					assert.equal(hexGrid.isWithinBoundaries(100, 100), false);
					assert.equal(hexGrid.isWithinBoundaries(20, 0), false);
					assert.equal(hexGrid.isWithinBoundaries(0, 10), false);
					assert.equal(hexGrid.isWithinBoundaries(20, 10), false);
				});

				it('should return true inside boundaries', function() {
					assert.equal(hexGrid.isWithinBoundaries(1, 1), true);
					assert.equal(hexGrid.isWithinBoundaries(19, 0), true);
					assert.equal(hexGrid.isWithinBoundaries(0, 9), true);
					assert.equal(hexGrid.isWithinBoundaries(19, 9), true);
				});
			});

			describe('getTileIterator', function() {
				var iterator;

				beforeEach(function() {
					iterator = hexGrid.getTileIterator();
				});

				it('should return an iterator', function() {
					assert.equal(typeof(iterator), 'object');
				});

				describe('next', function() {
					it('should return a tile', function() {
						var nextTile = iterator.next();
						assert.equal(typeof(nextTile), 'object');
						assert.equal(nextTile.type, 'testTile');
					});

					it('should return 200 tiles', function() {
						var count = 0;
						while (iterator.next() !== null) {
							count += 1;
						}

						assert.equal(count, 200);
					});
				});
			});

			describe('getTileByCoords', function() {
				it('should return null for coords outside the boundaries', function() {
					assert.equal(hexGrid.getTileByCoords(30, 1), null);
				});

				it('should return a tile for coords within the boundaries', function() {
					var tile = hexGrid.getTileByCoords(5, 5);
					assert.equal(typeof(tile), 'object');
					assert.equal(tile.type, 'testTile');
				});

				it('should return a tile that has a string id', function() {
					var tile = hexGrid.getTileByCoords(5, 5);
					assert.equal(typeof(tile.id), 'string');
				});

				it('should return a tile that has a unique id', function() {
					var tile = hexGrid.getTileByCoords(5, 5);
					var tileIterator = hexGrid.getTileIterator();
					var count = 0;
					var checkTile = tileIterator.next();
					while (checkTile !== null) {
						if (checkTile.id === tile.id) {
							count += 1;
						}

						checkTile = tileIterator.next();
					}

					assert.equal(count, 1);
				});
			});

			describe('getCoordsById', function() {
				it('should return null for an invalid ID', function() {
					assert.equal(hexGrid.getCoordsById('not-an-id', null));
				});

				it('should return correct coords for tile x=0 y=0', function() {
					var tile = hexGrid.getTileByCoords(0, 0);
					var coords = hexGrid.getCoordsById(tile.id);
					assert.equal(coords.x, 0);
					assert.equal(coords.y, 0);
				});

				it('should return correct coords for tile x=1 y=0', function() {
					var tile = hexGrid.getTileByCoords(1, 0);
					var coords = hexGrid.getCoordsById(tile.id);
					assert.equal(coords.x, 1);
					assert.equal(coords.y, 0);
				});

				it('should return correct coords for tile x=0 y=1', function() {
					var tile = hexGrid.getTileByCoords(0, 1);
					var coords = hexGrid.getCoordsById(tile.id);
					assert.equal(coords.x, 0);
					assert.equal(coords.y, 1);
				});

				it('should return correct coords for tile x=5 y=5', function() {
					var tile = hexGrid.getTileByCoords(5, 5);
					var coords = hexGrid.getCoordsById(tile.id);
					assert.equal(coords.x, 5);
					assert.equal(coords.y, 5);
				});
			});


			describe('getTileById', function() {
				it('should return a tile', function() {
					var tile = hexGrid.getTileByCoords(5, 5);
					var tile2 = hexGrid.getTileById(tile.id);
					assert.equal(tile, tile2);
				});
			});
		});
	}

	gridTests('pointy-topped', 'odd-r');
	gridTests('pointy-topped', 'even-r');
	gridTests('flat-topped', 'odd-q');
	gridTests('flat-topped', 'even-q');

	function pointyToppedTests(layout) {
		describe('pointy-topped tests: ' + layout, function() {
			var hexGrid;

			beforeEach(function() {
				hexGrid = new HexGrid({
					'width': 20,
					'height': 10,
					'orientation': 'pointy-topped',
					'layout': layout,
					tileFactory: tileFactory
				});
			});

			describe('isValidDir', function() {
				it('should be false for invalid direction', function() {
					expect(hexGrid.isValidDirection('not-a-real-direction'))
						.to.equal(false);

					// Because the orientation is pointy-topped.
					expect(hexGrid.isValidDirection('north')).to.equal(false);
					expect(hexGrid.isValidDirection('south')).to.equal(false);
				});

				it('should be true for valid directions', function() {
					expect(hexGrid.isValidDirection('northwest')).to.equal(true);
					expect(hexGrid.isValidDirection('northeast')).to.equal(true);
					expect(hexGrid.isValidDirection('east')).to.equal(true);
					expect(hexGrid.isValidDirection('southeast')).to.equal(true);
					expect(hexGrid.isValidDirection('southwest')).to.equal(true);
					expect(hexGrid.isValidDirection('west')).to.equal(true);
				});
			});

			describe('getNeighbourByCoords', function() {
				it('should return null when out of bounds', function() {
					// Off the left edge of the grid.
					assert.equal(null, hexGrid.getNeighbourByCoords(0, 0, 'west'));

					// Off the right edge of the grid.
					assert.equal(null, hexGrid.getNeighbourByCoords(19, 0, 'northeast'));

					// Off the bottom of the grid.
					assert.equal(null, hexGrid.getNeighbourByCoords(1, 9, 'southeast'));
				});

				it('should be able to go west from tile (5,5)', function() {
					expect(typeof(hexGrid.getNeighbourByCoords(5, 5, 'west')))
						.to.equal('object');
				});

				it('should be bijective', function() {
					assert.equal(
						hexGrid.getTileByCoords(1, 1),
						hexGrid.getNeighbourByCoords(2, 1, 'west'));

					assert.equal(
						hexGrid.getTileByCoords(2, 2),
						hexGrid.getNeighbourByCoords(1, 2, 'east'));

					var tile = hexGrid.getTileByCoords(5, 5);
					assert.equal(
						tile,
						hexGrid.getNeighbourById(hexGrid.getNeighbourById(tile.id, 'east').id, 'west')
					);
				});

				var dirs = [
					['east', 'west'],
					['southeast', 'northwest'],
					['southwest', 'northeast']
				];

				dirs.forEach(function (dir) {
					var startingTileCoords = [
						{x: 5, y: 5},
						{x: 6, y: 5},
						{x: 5, y: 6},
						{x: 6, y: 6},
					];

					startingTileCoords.forEach(function (coord) {
						it('(from ' + coord.x + ', ' + coord.y + ') should be the same after moving ' +
							dir[0] + ' then ' + dir[1], function() {
							var tile = hexGrid.getTileByCoords(coord.x, coord.y);
							var neighbour = hexGrid.getNeighbourById(tile.id, dir[0]);
							var originalTile = hexGrid.getNeighbourById(neighbour.id, dir[1]);
							expect(originalTile).to.eql(tile);
						});

						it('(from ' + coord.x + ', ' + coord.y + ') should be the same after moving ' +
							dir[1] + ' then ' + dir[0], function() {
							var tile = hexGrid.getTileByCoords(coord.x, coord.y);
							var neighbour = hexGrid.getNeighbourById(tile.id, dir[1]);
							var originalTile = hexGrid.getNeighbourById(neighbour.id, dir[0]);
							expect(originalTile).to.eql(tile);
						});
					});
				});
			});
		});
	}

	function flatToppedTests(layout) {
		describe('flat-topped tests: ' + layout, function() {
			var hexGrid;
			beforeEach(function() {
				hexGrid = new HexGrid({
					'width': 20,
					'height': 10,
					'orientation': 'flat-topped',
					'layout': layout,
					tileFactory: tileFactory
				});
			});

			describe('isValidDir', function() {
				it('should be false for invalid direction', function() {
					assert.equal(hexGrid.isValidDirection('not-a-real-direction'), false);

					// Because the orientation is flat-topped.
					assert.equal(hexGrid.isValidDirection('east'), false);
					assert.equal(hexGrid.isValidDirection('west'), false);
				});

				it('should be true for valid directions', function() {
					assert.equal(hexGrid.isValidDirection('north'), true);
					assert.equal(hexGrid.isValidDirection('northeast'), true);
					assert.equal(hexGrid.isValidDirection('southeast'), true);
					assert.equal(hexGrid.isValidDirection('south'), true);
					assert.equal(hexGrid.isValidDirection('southwest'), true);
					assert.equal(hexGrid.isValidDirection('northwest'), true);
				});
			});

			describe('getNeighbourByCoords', function() {
				it('should return null when out of bounds', function() {
					assert.equal(null, hexGrid.getNeighbourByCoords(0, 0, 'north'));
					assert.equal(null, hexGrid.getNeighbourByCoords(19, 0, 'southeast'));
					assert.equal(null, hexGrid.getNeighbourByCoords(1, 10, 'southeast'));
				});

				it('should be able to go north from tile (5,5)', function() {
					expect(typeof(hexGrid.getNeighbourByCoords(5, 5, 'north')))
						.to.equal('object');
				});

				it('should be bijective', function() {
					assert.equal(
						hexGrid.getTileByCoords(1, 1),
						hexGrid.getNeighbourByCoords(1, 2, 'north'));

					assert.equal(
						hexGrid.getTileByCoords(1, 2),
						hexGrid.getNeighbourByCoords(1, 1, 'south'));

					var tile = hexGrid.getTileByCoords(5, 5);
					assert.equal(
						tile,
						hexGrid.getNeighbourById(hexGrid.getNeighbourById(tile.id, 'south').id, 'north')
					);
				});

				var dirs = [
					['north', 'south'],
					['southeast', 'northwest'],
					['southwest', 'northeast']
				];

				dirs.forEach(function (dir) {
					var startingTileCoords = [
						{x: 5, y: 5},
						{x: 6, y: 5},
						{x: 5, y: 6},
						{x: 6, y: 6},
					];

					startingTileCoords.forEach(function (coord) {
						it('(from ' + coord.x + ', ' + coord.y + ') should be the same after moving ' +
							dir[0] + ' then ' + dir[1], function() {
							var tile = hexGrid.getTileByCoords(coord.x, coord.y);
							var neighbour = hexGrid.getNeighbourById(tile.id, dir[0]);
							var originalTile = hexGrid.getNeighbourById(neighbour.id, dir[1]);
							expect(originalTile).to.eql(tile);
						});

						it('(from ' + coord.x + ', ' + coord.y + ') should be the same after moving ' +
							dir[1] + ' then ' + dir[0], function() {
							var tile = hexGrid.getTileByCoords(coord.x, coord.y);
							var neighbour = hexGrid.getNeighbourById(tile.id, dir[1]);
							var originalTile = hexGrid.getNeighbourById(neighbour.id, dir[0]);

							expect(originalTile).to.eql(tile);
						});
					});
				});
			});

			describe('getNeighbourByCoords', function() {
				it('should throw an error for an invalid direction', function() {
					expect(
						hexGrid.getNeighbourByCoords.bind(null, 10, 3, 'not-a-direction')
					).to.throwError();
				});

				it('should should return a tile for a valid neighbour', function() {
					expect(typeof(hexGrid.getNeighbourByCoords(1, 1, 'south')))
						.to.equal('object');
				});
			});

			describe('getNeighbourById', function() {
				it('should be bijective', function() {
					var firstTile = hexGrid.getTileByCoords(1, 1);
					var secondTile = hexGrid.getNeighbourById(firstTile.id, 'south');
					assert.equal(hexGrid.getNeighbourById(secondTile.id, 'north'), firstTile);
				});
			});
		});
	}

	pointyToppedTests('odd-r');
	pointyToppedTests('even-r');

	flatToppedTests('odd-q');
	flatToppedTests('even-q');

	describe ('flat-topped odd-q', function() {
		var hexGrid;
		beforeEach(function() {
			hexGrid = new HexGrid({
				'width': 20,
				'height': 10,
				'orientation': 'flat-topped',
				'layout': 'odd-q',
				tileFactory: tileFactory
			});
		});

		describe('getPositionByCoords', function() {
			it('should be correct for (0,0)', function() {
				expect(hexGrid.getPositionByCoords(0, 0)).to.eql({x: 0, y: 0});
			});

			it('should be correct for (1,0)', function() {
				expect(hexGrid.getPositionByCoords(1, 0)).to.eql({x: 1, y: 0.5});
			});

			it('should be correct for (1,1)', function() {
				expect(hexGrid.getPositionByCoords(1, 1)).to.eql({x: 1, y: 1.5});
			});

			it('should be correct for (0,1)', function() {
				expect(hexGrid.getPositionByCoords(0, 1)).to.eql({x: 0, y: 1});
			});
		});

		describe('getPositionById', function() {
			it('should be correct for (5,5)', function() {
				var tile = hexGrid.getTileByCoords(5, 5);
				expect(hexGrid.getPositionById(tile.id)).to.eql({x: 5, y: 5.5});
			});

			it('should be correct for (4,4)', function() {
				var tile = hexGrid.getTileByCoords(4, 4);
				expect(hexGrid.getPositionById(tile.id)).to.eql({x: 4, y: 4});
			});
		});
	});

	describe ('flat-topped even-q', function() {
		var hexGrid;
		beforeEach(function() {
			hexGrid = new HexGrid({
				'width': 20,
				'height': 10,
				'orientation': 'flat-topped',
				'layout': 'even-q',
				tileFactory: tileFactory
			});
		});

		describe('getPositionByCoords', function() {
			it('should be correct for (0,0)', function() {
				expect(hexGrid.getPositionByCoords(0, 0)).to.eql({x: 0, y: 0.5});
			});

			it('should be correct for (1,0)', function() {
				expect(hexGrid.getPositionByCoords(1, 0)).to.eql({x: 1, y: 0});
			});

			it('should be correct for (1,1)', function() {
				expect(hexGrid.getPositionByCoords(1, 1)).to.eql({x: 1, y: 1});
			});

			it('should be correct for (0,1)', function() {
				expect(hexGrid.getPositionByCoords(0, 1)).to.eql({x: 0, y: 1.5});
			});
		});

		describe('getPositionById', function() {
			it('should be correct for (3,3)', function() {
				var tile = hexGrid.getTileByCoords(3, 3);
				expect(hexGrid.getPositionById(tile.id)).to.eql({x: 3, y: 3});
			});

			it('should be correct for (4,4)', function() {
				var tile = hexGrid.getTileByCoords(4, 4);
				expect(hexGrid.getPositionById(tile.id)).to.eql({x: 4, y: 4.5});
			});
		});
	});

	describe ('pointy-topped odd-r', function() {
		var hexGrid;
		beforeEach(function() {
			hexGrid = new HexGrid({
				'width': 20,
				'height': 10,
				'orientation': 'pointy-topped',
				'layout': 'odd-r',
				tileFactory: tileFactory
			});
		});

		describe('getPositionByCoords', function() {
			it('should be correct for (0,0)', function() {
				expect(hexGrid.getPositionByCoords(0, 0)).to.eql({x: 0, y: 0});
			});

			it('should be correct for (1,0)', function() {
				expect(hexGrid.getPositionByCoords(1, 0)).to.eql({x: 1, y: 0});
			});

			it('should be correct for (1,1)', function() {
				expect(hexGrid.getPositionByCoords(1, 1)).to.eql({x: 1.5, y: 1});
			});

			it('should be correct for (0,1)', function() {
				expect(hexGrid.getPositionByCoords(0, 1)).to.eql({x: 0.5, y: 1});
			});
		});

		describe('getPositionById', function() {
			it('should be correct for (3,3)', function() {
				var tile = hexGrid.getTileByCoords(3, 3);
				expect(hexGrid.getPositionById(tile.id)).to.eql({x: 3.5, y: 3});
			});

			it('should be correct for (4,4)', function() {
				var tile = hexGrid.getTileByCoords(4, 4);
				expect(hexGrid.getPositionById(tile.id)).to.eql({x: 4, y: 4});
			});
		});
	});

	describe ('pointy-topped even-r', function() {
		var hexGrid;
		beforeEach(function() {
			hexGrid = new HexGrid({
				'width': 20,
				'height': 10,
				'orientation': 'pointy-topped',
				'layout': 'even-r',
				tileFactory: tileFactory
			});
		});

		describe('getPositionByCoords', function() {
			it('should be correct for (0,0)', function() {
				expect(hexGrid.getPositionByCoords(0, 0)).to.eql({x: 0.5, y: 0});
			});

			it('should be correct for (1,0)', function() {
				expect(hexGrid.getPositionByCoords(1, 0)).to.eql({x: 1.5, y: 0});
			});

			it('should be correct for (1,1)', function() {
				expect(hexGrid.getPositionByCoords(1, 1)).to.eql({x: 1, y: 1});
			});

			it('should be correct for (0,1)', function() {
				expect(hexGrid.getPositionByCoords(0, 1)).to.eql({x: 0, y: 1});
			});
		});

		describe('getPositionById', function() {
			it('should be correct for (3,3)', function() {
				var tile = hexGrid.getTileByCoords(3, 3);
				expect(hexGrid.getPositionById(tile.id)).to.eql({x: 3, y: 3});
			});

			it('should be correct for (4,4)', function() {
				var tile = hexGrid.getTileByCoords(4, 4);
				expect(hexGrid.getPositionById(tile.id)).to.eql({x: 4.5, y: 4});
			});
		});
	});

	describe('tiles', function() {
		var hexGrid;
		beforeEach(function () {
			hexGrid = new HexGrid({
				'width': 20,
				'height': 10,
				'orientation': 'pointy-topped',
				'layout': 'even-r',
				tileFactory: tileFactory
			});
		});

		it('should be accessible', function() {
			expect(hexGrid.tiles).to.be.ok();
		});

		it('should return an array of Tiles', function() {
			expect(hexGrid.tiles.length).to.equal(200);
			expect(hexGrid.tiles[0].type).to.equal('testTile');
		});

		it('should return an array of Tiles that can be modified', function() {
			var firstTile = hexGrid.tiles[0];
			firstTile.testProperty = 'test';
			expect(firstTile.testProperty).to.equal('test');
		});
	});

	describe('getNeighboursById', function() {
		var hexGrid;
		beforeEach(function () {
			hexGrid = new HexGrid({
				'width': 5,
				'height': 5,
				'orientation': 'pointy-topped',
				'layout': 'even-r',
				tileFactory: tileFactory
			});
		});

		it('should return an array of 6 tiles for a middle tile', function() {
			var tile = hexGrid.getTileByCoords(1, 1);
			var neighbours = hexGrid.getNeighboursById(tile.id);
			neighbours.forEach(function (neighbour) {
				expect(neighbour.type).to.equal('testTile');
			});

			expect(neighbours.length).to.equal(6);
		});

		it('should return an array of 3 tiles for a corner tile', function() {
			var tile = hexGrid.getTileByCoords(0, 0);
			var neighbours = hexGrid.getNeighboursById(tile.id);
			neighbours.forEach(function (neighbour) {
				expect(neighbour.type).to.equal('testTile');
			});

			expect(neighbours.length).to.equal(3);
		});
	});

	describe('getPathsFromTileId', function() {
		var hexGrid;
		beforeEach(function () {
			hexGrid = new HexGrid({
				'width': 7,
				'height': 7,
				'orientation': 'pointy-topped',
				'layout': 'even-r',
				tileFactory: tileFactory
			});
		});

		it('should return 6 paths when max length is 1', function() {
			var tile = hexGrid.getTileByCoords(5, 5);
			var paths = hexGrid.getShortestPathsFromTileId(
				tile.id,
				{
					maxCost: 1
				}
			);

			expect(Object.keys(paths).length).to.equal(6);
		});

		it('should return 18 paths when max length is 2', function() {
			var tile = hexGrid.getTileByCoords(3, 3);
			var paths = hexGrid.getShortestPathsFromTileId(
				tile.id,
				{
					maxCost: 2
				}
			);
			expect(Object.keys(paths).length).to.equal(18);
		});

		it('should return 17 paths when max cost is 2 and 1 outer tile is not pathable', function() {
			var tile = hexGrid.getTileByCoords(3, 3);
			var unpathableTile = hexGrid.getTileByCoords(5, 3);
			unpathableTile.pathable = false;

			var paths = hexGrid.getShortestPathsFromTileId(
				tile.id,
				{
					maxCost: 2,
					moveCost: function (fromTile, toTile) {
						if (toTile.pathable === false) {
							return Number.POSITIVE_INFINITY;
						}

						return 1;
					}
				}
			);

			expect(Object.keys(paths).length).to.equal(17);
		});

		it('should return 0 paths when max cost is 0', function() {
			var tile = hexGrid.getTileByCoords(5, 5);
			var paths = hexGrid.getShortestPathsFromTileId(
				tile.id,
				{
					maxCost: 0
				}
			);

			expect(Object.keys(paths).length).to.equal(0);
		});
	});
});
