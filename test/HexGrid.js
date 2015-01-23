// In the tests, we create objects but don't do anything with them:
/*jshint nonew: false */

var assert = require('assert'),
	expect = require('expect.js'),
	HexGrid = require('../src/HexGrid.js');

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

	// TODO: Run for each configuration.
	gridTests('pointy-topped', 'odd-r');
	gridTests('flat-topped', 'odd-q');

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

				for (var dirIdx = 0; dirIdx < dirs.length; dirIdx += 1) {
					var dir1 = dirs[dirIdx][0];
					var dir2 = dirs[dirIdx][1];


					it('should be the same after moving ' + dir1 + ' then ' + dir2, function() {
						var tile = hexGrid.getTileByCoords(5, 5);
						var neighbour = hexGrid.getNeighbourById(tile.id, dir1);
						var originalTile = hexGrid.getNeighbourById(neighbour.id, dir2);

						expect(originalTile).to.eql(tile);
					});

					it('should be the same after moving ' + dir2 + ' then ' + dir1, function() {
						var tile = hexGrid.getTileByCoords(5, 5);
						var neighbour = hexGrid.getNeighbourById(tile.id, dir2);
						var originalTile = hexGrid.getNeighbourById(neighbour.id, dir1);

						expect(originalTile).to.eql(tile);
					});
				}
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
					assert.equal(null, hexGrid.getNeighbourByCoords(1, 9, 'southeast'));
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

				for (var dirIdx = 0; dirIdx < dirs.length; dirIdx += 1) {
					var dir1 = dirs[dirIdx][0];
					var dir2 = dirs[dirIdx][1];


					it('should be the same after moving ' + dir1 + ' then ' + dir2, function() {
						var tile = hexGrid.getTileByCoords(5, 5);
						var neighbour1 = hexGrid.getNeighbourById(
							tile.id,
							dir1
						);

						assert.deepEqual(
							tile,
							hexGrid.getNeighbourById(
								neighbour1.id,
								dir2
							),
							'Did not get original tile after moving ' + dir1 + ' then ' + dir2
						);
					});

					it('should be the same after moving ' + dir2 + ' then ' + dir1, function() {
						var tile = hexGrid.getTileByCoords(5, 5);

						var neighbour2 = hexGrid.getNeighbourById(
							tile.id,
							dir2
						);
						assert.deepEqual(
							tile,
							hexGrid.getNeighbourById(
								neighbour2.id,
								dir1
							),
							'Did not get original tile after moving ' + dir2 + ' then ' + dir1
						);
					});
				}
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

			describe('getPositionByCoords', function() {
				it('should return (1,0.5) for (1,0)', function() {
					expect(hexGrid.getPositionByCoords(1, 0)).to.eql({x: 1, y: 0.5});
				});

				it('should return (0,2) for (0,2)', function() {
					expect(hexGrid.getPositionByCoords(0, 2)).to.eql({x: 0, y: 2});
				});
			});

			describe('getPositionById', function() {
				it('should return (5,5.5) for (5,5)', function() {
					var tile = hexGrid.getTileByCoords(5, 5);
					expect(hexGrid.getPositionById(tile.id)).to.eql({x: 5, y: 5.5});
				});

				it('should return (4,4) for (4,4)', function() {
					var tile = hexGrid.getTileByCoords(4, 4);
					expect(hexGrid.getPositionById(tile.id)).to.eql({x: 4, y: 4});
				});
			});
		});
	}

	// TODO: Run for even-r as well.
	pointyToppedTests('odd-r');

	// TODO: Run for even-q as well.
	flatToppedTests('odd-q');

});
