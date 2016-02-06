/* global SVG */
import hexGrid from '../../src/hex-grid.js';

const hexWidth = 19;
const hexHeight = 22;

const grid = {
  width: 20,
  height: 20,
  orientation: 'pointy-topped',
  layout: 'odd-r',
  shape: 'parallelogram'
};

const main = SVG('main');
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
  }
}

for (let x = 0; x < grid.width; x += 1) {
  for (let y = 0; y < grid.height; y += 1) {
    const hex = main.polygon('0,25 0,75 50,100 100,75 100,25 50,0').fill('none').stroke({width: 4})
    hex.width(hexWidth);
    hex.height(hexHeight);
    hex.attr({id: hexGrid.getTileIdByCoordinates(grid, x, y)});

    const position = hexGrid.getTilePositionByCoords(grid, x, y);
    hex.dx(10 + hexWidth * position.x);
    hex.dy(10 + hexHeight * position.y * 0.75);
    hex.attr({fill: '#f06'});

    hex.mouseover(function () {
      hex.attr({fill: '#60f'});
    });

    hex.click(function () {
      const red = Math.random() * 255;
      const green = Math.random() * 255;
      const blue = Math.random() * 255;
      for (let tileId of hexGrid.getNeighbourIdsByTileId(grid, this.attr('id'))) {
        const neighbour = SVG.get(tileId);
        const colour = `#${toHexString(red)}${toHexString(green)}${toHexString(blue)}`;
        neighbour.attr({fill: colour});
      }
    });
  }
}
