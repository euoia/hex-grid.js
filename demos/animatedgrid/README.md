smallgrid
=========
This is a little demo of a small grid made using HexGrid.js.

To build bundle.js
------------------
Using browserify:
```
browserify -r ./src/App.js -o bundle.js
```

Using browserify with source maps:
```
browserify -r ./src/App.js -d -o bundle.js
```

For continuous building:
```
watchify -r ./src/App.js -o bundle.js
```

For continuous building with source maps:
```
watchify -r ./src/App.js -d -o bundle.js
```
