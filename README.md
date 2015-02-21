hex-grid.js
===========
A JavaScript library for working with hexagonal grids.

With inspiration from
[http://www.redblobgames.com/grids/hexagons](http://www.redblobgames.com/grids/hexagons).

Running the tests
-----------------
After installing development dependencies using `npm install` you should be
able to run the tests using:
```
mocha
```

Library
-------
<a name="module_hex-grid"></a>
## hex-grid
Exports a constructor taking an options object.

**Example**  
```js
var HexGrid = require('hex-grid.js');

var TileFactory = function () {
  var _id = 0;
  return {
    newTile: function () {
      var tile = {
        id: _id.toString()
      };

      _id += 1;
      return tile;
    }
  };
};

var tileFactory = new TileFactory();
var hexGrid = new HexGrid({
  width: 20,
  height: 10,
  orientation: 'flat-topped',
  layout: 'odd-q',
  tileFactory: tileFactory
});
```

* [hex-grid](#module_hex-grid)
  * [class: HexGrid](#exp_module_hex-grid--HexGrid) ⏏
    * [new HexGrid(options)](#new_module_hex-grid--HexGrid_new)
    * _instance_
      * [.getWidth()](#module_hex-grid--HexGrid#getWidth) ⇒ <code>number</code>
      * [.getHeight()](#module_hex-grid--HexGrid#getHeight) ⇒ <code>number</code>
      * [.isWithinBoundaries(x, y)](#module_hex-grid--HexGrid#isWithinBoundaries) ⇒ <code>bool</code>
      * [.getTileByCoords(x, y)](#module_hex-grid--HexGrid#getTileByCoords) ⇒ <code>tile</code> \| <code>null</code>
      * [.getTileIterator()](#module_hex-grid--HexGrid#getTileIterator) ⇒ <code>object</code>
      * [.isValidDirection()](#module_hex-grid--HexGrid#isValidDirection) ⇒ <code>bool</code>
      * [.getCoordsById(tileId)](#module_hex-grid--HexGrid#getCoordsById) ⇒ <code>object</code> \| <code>null</code>
      * [.getTileById(tileId)](#module_hex-grid--HexGrid#getTileById) ⇒ <code>object</code> \| <code>null</code>
      * [.getNeighbourByCoords(x, y, dir)](#module_hex-grid--HexGrid#getNeighbourByCoords) ⇒ <code>object</code> \| <code>null</code>
      * [.getNeighbourById(tileId, dir)](#module_hex-grid--HexGrid#getNeighbourById) ⇒ <code>object</code> \| <code>null</code>
      * [.getPositionByCoords(x, y)](#module_hex-grid--HexGrid#getPositionByCoords) ⇒ <code>object</code>
      * [.getPositionById(tileId)](#module_hex-grid--HexGrid#getPositionById) ⇒ <code>object</code>

<a name="exp_module_hex-grid--HexGrid"></a>
### class: HexGrid ⏏
A hexagonal grid.

**See**: [http://redblobgames.com/grids/hexagons](http://redblobgames.com/grids/hexagons) for explanations of
`options.orientation` and `options.layout`.  
<a name="new_module_hex-grid--HexGrid_new"></a>
#### new HexGrid(options)

| Param | Type | Description |
| --- | --- | --- |
| options | <code>array</code> | HexGrid options. |
| [options.width] | <code>number</code> | The width of the map. |
| [options.height] | <code>number</code> | The height of the map. |
| [options.tileFactory] | <code>tileFactory</code> | A tileFactory object. A tileFactory is an object that has a `newTile` function property that when called returns a tile object. The tile objects returned by `tileFactory.newTile()` must have an `id` property which is unique across all tiles generated by the tileFactory. |
| [options.orientation] | <code>string</code> | The orientation of the map. Must be one of: flat-topped, pointy-topped. |
| [options.layout] | <code>string</code> | The layout of the map. Must be one of: odd-q, even-q, odd-r, even-r. |

<a name="module_hex-grid--HexGrid#getWidth"></a>
#### hexGrid.getWidth() ⇒ <code>number</code>
Gets the width of the grid.

**Returns**: <code>number</code> - The width of the grid.  
<a name="module_hex-grid--HexGrid#getHeight"></a>
#### hexGrid.getHeight() ⇒ <code>number</code>
Gets the height of the grid.

**Returns**: <code>number</code> - The height of the grid.  
<a name="module_hex-grid--HexGrid#isWithinBoundaries"></a>
#### hexGrid.isWithinBoundaries(x, y) ⇒ <code>bool</code>
Returns whether a coordinate is within the grid boundaries.

**Returns**: <code>bool</code> - Whether the coordinate is within the boundaries of the
grid.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | The X coordinate. |
| y | <code>number</code> | The Y coordinate. |

<a name="module_hex-grid--HexGrid#getTileByCoords"></a>
#### hexGrid.getTileByCoords(x, y) ⇒ <code>tile</code> \| <code>null</code>
Gets a specific tile by its x and y coordinates.

**Returns**: <code>tile</code> \| <code>null</code> - The tile. Null if not a valid coordinate.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | The X coordinate. |
| y | <code>number</code> | The Y coordinate. |

<a name="module_hex-grid--HexGrid#getTileIterator"></a>
#### hexGrid.getTileIterator() ⇒ <code>object</code>
Returns an iterator with a next() function that iterates through the
tiles in the grid.

**Returns**: <code>object</code> - The iterator object.  
<a name="module_hex-grid--HexGrid#isValidDirection"></a>
#### hexGrid.isValidDirection() ⇒ <code>bool</code>
Whether a given direction is valid for this map layout.

**Returns**: <code>bool</code> - Whether the direction is valid.  
<a name="module_hex-grid--HexGrid#getCoordsById"></a>
#### hexGrid.getCoordsById(tileId) ⇒ <code>object</code> \| <code>null</code>
Gets the coordinates of a tile given its ID.

**Returns**: <code>object</code> \| <code>null</code> - An object with x and y properties.  

| Param | Type | Description |
| --- | --- | --- |
| tileId | <code>string</code> | The ID of the tile. |

<a name="module_hex-grid--HexGrid#getTileById"></a>
#### hexGrid.getTileById(tileId) ⇒ <code>object</code> \| <code>null</code>
Gets a tile given its ID.

**Returns**: <code>object</code> \| <code>null</code> - The tile.  

| Param | Type | Description |
| --- | --- | --- |
| tileId | <code>string</code> | The ID of the tile. |

<a name="module_hex-grid--HexGrid#getNeighbourByCoords"></a>
#### hexGrid.getNeighbourByCoords(x, y, dir) ⇒ <code>object</code> \| <code>null</code>
Gets a tile's neighbour given its coordinates and a direction.

**Returns**: <code>object</code> \| <code>null</code> - The neighbouring tile.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | The X coordinate of the tile. |
| y | <code>number</code> | The Y coordinate of the tile. |
| dir | <code>string</code> | A direction. One of: north, northeast, east, southeast, south, southwest, west, northwest. |

<a name="module_hex-grid--HexGrid#getNeighbourById"></a>
#### hexGrid.getNeighbourById(tileId, dir) ⇒ <code>object</code> \| <code>null</code>
Gets a tile's neighbour given the tile's ID and a direction.

**Returns**: <code>object</code> \| <code>null</code> - The neighbouring tile.  

| Param | Type | Description |
| --- | --- | --- |
| tileId | <code>string</code> | The tile's ID. |
| dir | <code>string</code> | A direction. One of: north, northeast, east, southeast, south, southwest, west, northwest. |

<a name="module_hex-grid--HexGrid#getPositionByCoords"></a>
#### hexGrid.getPositionByCoords(x, y) ⇒ <code>object</code>
Gets the position of a tile by its coordinates. Due to the way
hexagonal grids work, the position of half of the tiles are offset by
0.5.

**Returns**: <code>object</code> - An object with x and y properties.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | The X coordinate of the tile. |
| y | <code>number</code> | The Y coordinate of the tile. |

<a name="module_hex-grid--HexGrid#getPositionById"></a>
#### hexGrid.getPositionById(tileId) ⇒ <code>object</code>
Gets the position of a tile by its ID.

**Returns**: <code>object</code> - An object with x and y properties.  

| Param | Type | Description |
| --- | --- | --- |
| tileId | <code>string</code> | The tile's ID. |


