if (typeof LeapPlay === 'undefined') {
  LeapPlay = {};
}

(function() {
  function Canvas(opts) {
    _.extend(this, {
      canvasElement: null,
      lineWidth: 2
    }, opts);

    this.context = this.canvasElement.getContext("2d");
    this.context.lineWidth = this.lineWidth;

    console.log("canvas initialized.")
  }

  Canvas.prototype.drawLine = function(x1, y1, x2, y2, color) {
    this.context.beginPath();
    this.context.strokeStyle = color;
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.stroke();
  };

  LeapPlay.Canvas = Canvas;
})();