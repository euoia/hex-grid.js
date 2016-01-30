// vim: noexpandtab:ts=2:sw=2
/* eslint-env mocha, es6 */

var
	expect = require('expect.js'),
	hexGrid = require('../src/hex-grid.js');

describe('validateSettings', function() {
  var validSettings;
  beforeEach(function () {
    validSettings = {
      'width': 3,
      'height': 10,
      'orientation': 'flat-topped',
      'layout': 'odd-q'
    };
  });

  it('should not throw for good settings', function() {
    expect(hexGrid.validateSettings.bind(null, validSettings)).to.not.throwError();
  });

  it('should throw for an invalid width', function() {
    validSettings.width = 'bob';
    expect(hexGrid.validateSettings.bind(null, validSettings)).to.throwError();
  });

  it('should throw for an invalid layout', function() {
    validSettings.layout = 'wrong-layout';
    expect(hexGrid.validateSettings.bind(null, validSettings)).to.throwError();
  });
});

describe('getTileIds', function() {
  var validSettings;
  beforeEach(function () {
    validSettings = {
      'width': 3,
      'height': 10,
      'orientation': 'flat-topped',
      'layout': 'odd-q'
    };
  });

  it('should return 30 tile IDs for a 10 by 3 grid', function() {
    validSettings.width = 3;
    validSettings.height = 10;
    expect(hexGrid.getTileIds(validSettings).length).to.equal(30);
  });

  it('should return 625 tile IDs for a 25 by 25 grid', function() {
    validSettings.width = 25;
    validSettings.height = 25;
    expect(hexGrid.getTileIds(validSettings).length).to.equal(625);
  });

  it('should not use the same tile ID twice', function() {
    validSettings.width = 100;
    validSettings.height = 100;
    var tileIds = hexGrid.getTileIds(validSettings);
    var counter = {};
    for (var tileId of tileIds) {
      if (counter[tileId] !== undefined) {
        throw new Error('Duplicate detected!');
      }
      counter[tileId] = true;
    }
  });
});

describe('isWithinBoundaries', function() {
  var grid = {
    'width': 20,
    'height': 10,
    'orientation': 'flat-topped',
    'layout': 'odd-q'
  };

  it('should return false outside boundaries', function() {
    expect(hexGrid.isWithinBoundaries(grid, 100, 100)).to.equal(false);
    expect(hexGrid.isWithinBoundaries(grid, 20, 0)).to.equal(false);
    expect(hexGrid.isWithinBoundaries(grid, 0, 10)).to.equal(false);
    expect(hexGrid.isWithinBoundaries(grid, 20, 10)).to.equal(false);
  });

  it('should return true inside boundaries', function() {
    expect(hexGrid.isWithinBoundaries(grid, 1, 1)).to.equal(true);
    expect(hexGrid.isWithinBoundaries(grid, 19, 0)).to.equal(true);
    expect(hexGrid.isWithinBoundaries(grid, 0, 9)).to.equal(true);
    expect(hexGrid.isWithinBoundaries(grid, 19, 9)).to.equal(true);
  });

  it('should throw if x is not a number', function() {
    expect(hexGrid.isWithinBoundaries.bind(null, grid, '1', 2)).to.throwError();
  });
});

describe('getTileIdByCoordinates', function() {
  var grid = {
    'width': 20,
    'height': 10,
    'orientation': 'flat-topped',
    'layout': 'odd-q'
  };

  it('should return null for coords outside the boundaries', function() {
    expect(hexGrid.getTileIdByCoordinates(grid, 30, 1)).to.equal(null);
  });

  it('should return a tile ID for coordinates within the boundaries', function() {
    var tileId = hexGrid.getTileIdByCoordinates(grid, 5, 5);
    expect(typeof(tileId)).to.equal('string');
  });

  it('should return a tile that has a unique id', function() {
    var tileId = hexGrid.getTileIdByCoordinates(grid, 5, 5);
    var tileIds = hexGrid.getTileIds(grid);
    var count = 0;
    for (var t of tileIds) {
      if (tileId === t) {
        count += 1
      }
    }
    expect(count).to.equal(1);
  });
});

describe('isValidDirection', function() {
  var grid = {
    'width': 20,
    'height': 10,
    'orientation': 'pointy-topped',
    'layout': 'even-r'
  };

  it('should be false for invalid direction (pointy-topped)', function() {
    expect(hexGrid.isValidDirection(grid, 'not-a-real-direction')).to.equal(false);
    expect(hexGrid.isValidDirection(grid, 'north')).to.equal(false);
    expect(hexGrid.isValidDirection(grid, 'south')).to.equal(false);
  });

  it('should be true for valid directions (pointy-topped)', function() {
    expect(hexGrid.isValidDirection(grid, 'northwest')).to.equal(true);
    expect(hexGrid.isValidDirection(grid, 'northeast')).to.equal(true);
    expect(hexGrid.isValidDirection(grid, 'east')).to.equal(true);
    expect(hexGrid.isValidDirection(grid, 'southeast')).to.equal(true);
    expect(hexGrid.isValidDirection(grid, 'southwest')).to.equal(true);
    expect(hexGrid.isValidDirection(grid, 'west')).to.equal(true);
  });

  it('should be false for invalid direction (flat-topped)', function() {
    grid.orientation = 'flat-topped';
    grid.layout = 'odd-q';
    expect(hexGrid.isValidDirection(grid, 'not-a-real-direction')).to.equal(false);
    expect(hexGrid.isValidDirection(grid, 'east')).to.equal(false);
    expect(hexGrid.isValidDirection(grid, 'west')).to.equal(false);
  });

  it('should be true for valid directions (flat-topped)', function() {
    grid.orientation = 'flat-topped';
    grid.layout = 'odd-q';
    expect(hexGrid.isValidDirection(grid, 'north')).to.equal(true);
    expect(hexGrid.isValidDirection(grid, 'northeast')).to.equal(true);
    expect(hexGrid.isValidDirection(grid, 'southeast')).to.equal(true);
    expect(hexGrid.isValidDirection(grid, 'south')).to.equal(true);
    expect(hexGrid.isValidDirection(grid, 'southwest')).to.equal(true);
    expect(hexGrid.isValidDirection(grid, 'northwest')).to.equal(true);
  });
});

describe('getTileCoordinatesById', function() {
  var grid = {
    'width': 20,
    'height': 10,
    'orientation': 'pointy-topped',
    'layout': 'even-r'
  };

  it('should return correct coords for tile x=0 y=0', function() {
    var tileId = hexGrid.getTileIdByCoordinates(grid, 0, 0);
    var coords = hexGrid.getTileCoordinatesById(grid, tileId);
    expect(coords.x).to.equal(0);
    expect(coords.y).to.equal(0);
  });

  it('should return correct coords for tile x=1 y=0', function() {
    var tileId = hexGrid.getTileIdByCoordinates(grid, 1, 0);
    var coords = hexGrid.getTileCoordinatesById(grid, tileId);
    expect(coords.x).to.equal(1);
    expect(coords.y).to.equal(0);
  });

  it('should return correct coords for tile x=0 y=1', function() {
    var tileId = hexGrid.getTileIdByCoordinates(grid, 0, 1);
    var coords = hexGrid.getTileCoordinatesById(grid, tileId);
    expect(coords.x).to.equal(0);
    expect(coords.y).to.equal(1);
  });

  it('should return correct coords for tile x=5 y=5', function() {
    var tileId = hexGrid.getTileIdByCoordinates(grid, 5, 5);
    var coords = hexGrid.getTileCoordinatesById(grid, tileId);
    expect(coords.x).to.equal(5);
    expect(coords.y).to.equal(5);
  });
});

describe('getNeighbourTileIdByCoordinates', function() {
  var grid = {
    'width': 20,
    'height': 10,
    'orientation': 'pointy-topped',
    'layout': 'even-r'
  };

  it('should return null when out of bounds', function() {
    // Off the left edge of the grid.
    expect(hexGrid.getNeighbourTileIdByCoordinates(grid, 0, 0, 'west')).to.equal(null);

    // Off the right edge of the grid.
    expect(hexGrid.getNeighbourTileIdByCoordinates(grid, 19, 0, 'northeast')).to.equal(null);

    // Off the bottom of the grid.
    expect(hexGrid.getNeighbourTileIdByCoordinates(grid, 1, 9, 'southeast')).to.equal(null);
  });

  it('should be able to go west from tile (5,5)', function() {
    expect(typeof(hexGrid.getNeighbourTileIdByCoordinates(grid, 5, 5, 'west')))
      .to.equal('string');
  });

  it('should be bijective', function() {
    expect(hexGrid.getTileIdByCoordinates(grid, 1, 1))
      .to.equal(hexGrid.getNeighbourTileIdByCoordinates(grid, 2, 1, 'west'));

    expect(hexGrid.getTileIdByCoordinates(grid, 2, 2))
      .to.equal(hexGrid.getNeighbourTileIdByCoordinates(grid, 1, 2, 'east'));
  });

  var dirs = [
    ['east', 'west'],
    ['southeast', 'northwest'],
    ['southwest', 'northeast']
  ];

  dirs.forEach(function (dir) {
    var startingTileCoordinates = [
      {x: 5, y: 5},
      {x: 6, y: 5},
      {x: 5, y: 6},
      {x: 6, y: 6}
    ];

    startingTileCoordinates.forEach(function (coord) {
      it('(from ' + coord.x + ', ' + coord.y + ') should be the same after moving ' +
        dir[0] + ' then ' + dir[1], function() {
        var tileId = hexGrid.getTileIdByCoordinates(grid, coord.x, coord.y);
        var neighbourId = hexGrid.getNeighbourIdByTileId(grid, tileId, dir[0]);
        var originalTileId = hexGrid.getNeighbourIdByTileId(grid, neighbourId, dir[1]);
        expect(originalTileId).to.eql(tileId);
      });

      it('(from ' + coord.x + ', ' + coord.y + ') should be the same after moving ' +
        dir[1] + ' then ' + dir[0], function() {
        var tileId = hexGrid.getTileIdByCoordinates(grid, coord.x, coord.y);
        var neighbourId = hexGrid.getNeighbourIdByTileId(grid, tileId, dir[1]);
        var originalTileId = hexGrid.getNeighbourIdByTileId(grid, neighbourId, dir[0]);
        expect(originalTileId).to.equal(tileId);
      });
    });
  });
});


describe('getNeighbourIdsById', function() {
  var grid;
  beforeEach(function () {
    grid = {
      'width': 5,
      'height': 5,
      'orientation': 'pointy-topped',
      'layout': 'even-r'
    };
  });

  it('should return an array of 6 tiles for a middle tile', function() {
    var tileId = hexGrid.getTileIdByCoordinates(grid, 1, 1);
    var neighbourIds = hexGrid.getNeighbourIdsByTileId(grid, tileId);
    expect(neighbourIds.length).to.equal(6);
  });

  it('should return an array of 3 tiles for a corner tile', function() {
    var tileId = hexGrid.getTileIdByCoordinates(grid, 0, 0);
    var neighbourIds = hexGrid.getNeighbourIdsByTileId(grid, tileId);
    expect(neighbourIds.length).to.equal(3);
  });
});

describe('getPathsFromTileId', function() {
  var grid;
  beforeEach(function () {
    grid = {
      'width': 7,
      'height': 7,
      'orientation': 'pointy-topped',
      'layout': 'even-r'
    };
  });

  it('should return 6 paths when max length is 1', function() {
    var tileId = hexGrid.getTileIdByCoordinates(grid, 5, 5);
    var paths = hexGrid.getShortestPathsFromTileId(grid, tileId, {maxCost: 1});
    expect(Object.keys(paths).length).to.equal(6);
  });

  it('should return 18 paths when max length is 2', function() {
    var tileId = hexGrid.getTileIdByCoordinates(grid, 3, 3);
    var paths = hexGrid.getShortestPathsFromTileId(grid, tileId, {maxCost: 2});
    expect(Object.keys(paths).length).to.equal(18);
  });

  it('should return 0 paths when max cost is 0', function() {
    var tileId = hexGrid.getTileIdByCoordinates(grid, 5, 5);
    var paths = hexGrid.getShortestPathsFromTileId(grid, tileId, { maxCost: 0 });
    expect(Object.keys(paths).length).to.equal(0);
  });

  it('should return 17 paths when max cost is 2 and 1 outer tile is not pathable', function() {
    var tileId = hexGrid.getTileIdByCoordinates(grid, 3, 3);
    var unpathableTileId = hexGrid.getTileIdByCoordinates(grid, 5, 3);

    var paths = hexGrid.getShortestPathsFromTileId(
      grid,
      tileId,
      {
        maxCost: 2,
        moveCost: function (fromTileId, toTileId) {
          if (toTileId === unpathableTileId) {
            return Number.POSITIVE_INFINITY;
          }

          return 1;
        }
      }
    );

    expect(Object.keys(paths).length).to.equal(17);
  });
});
