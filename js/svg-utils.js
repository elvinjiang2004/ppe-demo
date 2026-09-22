"use strict";

window.SvgUtils = Object.freeze({
  appendSvg: function (parent, name, attributes, text) {
    var node = document.createElementNS("http://www.w3.org/2000/svg", name);
    Object.keys(attributes || {}).forEach(function (key) {
      node.setAttribute(key, String(attributes[key]));
    });
    if (typeof text === "string") {
      node.textContent = text;
    }
    parent.appendChild(node);
    return node;
  },
  formatTick: function (value) {
    return value.toFixed(value === 0 || value === 1 ? 0 : 2);
  },
  paintFieldRaster: function (canvas, size, valueAt, colorFn) {
    canvas.width = size;
    canvas.height = size;
    var context = canvas.getContext("2d");
    if (!context) {
      throw new Error("A two-dimensional canvas context is required.");
    }
    var image = context.createImageData(size, size);
    var data = image.data;
    var pixelX;
    var pixelY;
    for (pixelY = 0; pixelY < size; pixelY += 1) {
      var yValue = 1 - (pixelY + 0.5) / size;
      for (pixelX = 0; pixelX < size; pixelX += 1) {
        var xValue = (pixelX + 0.5) / size;
        var color = colorFn(valueAt(xValue, yValue), pixelX, pixelY);
        var offset = (pixelY * size + pixelX) * 4;
        data[offset] = color[0];
        data[offset + 1] = color[1];
        data[offset + 2] = color[2];
        data[offset + 3] = color.length > 3 ? color[3] : 255;
      }
    }
    context.putImageData(image, 0, 0);
    return canvas;
  },
  createFieldRaster: function (size, valueAt, colorFn) {
    var canvas = document.createElement("canvas");
    window.SvgUtils.paintFieldRaster(canvas, size, valueAt, colorFn);
    return canvas.toDataURL("image/png");
  }
});
