// Leaflet.EdgeBuffer (https://github.com/TolonUK/Leaflet.EdgeBuffer)
// Vendored: patches GridLayer's tiled pixel bounds so `edgeBufferTiles` extra
// tiles stay loaded beyond the viewport at every update/prune pass, instead
// of a one-off forced load that normal pruning doesn't know about.
(function (factory, window) {
  if (typeof define === 'function' && define.amd) {
    define(['leaflet'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('leaflet'));
  }
  if (typeof window !== 'undefined' && window.L && !window.L.EdgeBuffer) {
    factory(window.L);
  }
}(function (L) {
  L.EdgeBuffer = {
    previousMethods: {
      getTiledPixelBounds: L.GridLayer.prototype._getTiledPixelBounds
    }
  };

  L.GridLayer.include({
    _getTiledPixelBounds: function (center, zoom, tileZoom) {
      var pixelBounds = L.EdgeBuffer.previousMethods.getTiledPixelBounds.call(this, center, zoom, tileZoom);

      var edgeBufferTiles = 1;
      if ((this.options.edgeBufferTiles !== undefined) && (this.options.edgeBufferTiles !== null)) {
        edgeBufferTiles = this.options.edgeBufferTiles;
      }

      if (edgeBufferTiles > 0) {
        var pixelEdgeBuffer = L.GridLayer.prototype.getTileSize.call(this).multiplyBy(edgeBufferTiles);
        pixelBounds = new L.Bounds(pixelBounds.min.subtract(pixelEdgeBuffer), pixelBounds.max.add(pixelEdgeBuffer));
      }
      return pixelBounds;
    }
  });
}, window));
