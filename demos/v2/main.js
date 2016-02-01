/* global SVG */
import hexGrid from '../../src/hex-grid.js';

const hexWidth = 38;
const hexHeight = 44;

const grid = {
  width: 10,
  height: 15,
  orientation: 'pointy-topped',
  layout: 'odd-r'
};

const main = SVG('main');
main.size(hexWidth * (grid.width + 2), hexHeight * (grid.height + 2));

// Pointy top.
//const hex = main.polygon('25,0 75,0 100,50 75,100, 25,100, 0,50').fill('none').stroke({width: 0})

for (let x = 0; x < grid.width; x += 1) {
  for (let y = 0; y < grid.height; y += 1) {
    const hex = main.polygon('0,25 0,75 50,100 100,75 100,25 50,0').fill('none').stroke({width: 4})
    hex.width(38);
    hex.height(44);

    hex.mouseover(function () {
      hex.attr({fill: '#60f'});
    });

    const position = hexGrid.getTilePositionByCoords(grid, x, y);
    hex.dx(10 + hexWidth * position.x);
    hex.dy(10 + hexHeight * position.y * 0.75);
    hex.attr({fill: '#f06'});
  }
}
