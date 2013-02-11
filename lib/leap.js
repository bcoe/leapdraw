if (typeof LeapPlay === 'undefined') {
  LeapPlay = {};
}

(function() {
  function Leap(opts) {
    
    _.extend(this, {
      canvas: null,
      width: 640,
      height: 480,
      fingers: {} // {x, y}
    }, opts);

    this.connect();
    console.log('leap motion connected.')
  }

  Leap.prototype.connect = function() {
    var _this = this;

    // Support both the WebSocket and MozWebSocket objects
    if ((typeof(WebSocket) == 'undefined') &&
        (typeof(MozWebSocket) != 'undefined')) {
      WebSocket = MozWebSocket;
    }

    var ws = new WebSocket("ws://localhost:6437/");

    // On message received
    ws.onmessage = function(event) {
      _this.updateFingers(JSON.parse(event.data));
    };
  };

  Leap.prototype.updateFingers = function(data) {
    var _this = this;

    data.hands.forEach(function(hand) {
      hand.fingers.forEach(function(finger) {
        // if we've seen the finger before
        // update its position.
        if (_this.fingers[finger.id]) {
          var f = _this.fingers[finger.id],
            x2 = _this.normalizeX( finger.tip.position[0] ),
            y2 = _this.normalizeY( finger.tip.position[1] );

          // Draw a line from the old position to the new position.
          _this.canvas.drawLine(f.x, f.y, x2, y2, f.color);

          // Update the position to the new position.
          f.x = x2;
          f.y = y2;
        } else {
          _this.fingers[finger.id] = {
            x: _this.normalizeX( finger.tip.position[0] ),
            y: _this.normalizeY( finger.tip.position[1] ),
            color: 'rgb(' + parseInt(Math.random() * 256) + ', ' + parseInt(Math.random() * 256) + ',' + parseInt(Math.random() * 256) + ')'
          }
        }
      });
    });
  };

  Leap.prototype.normalizeX = function(leapX) {
    return ( 1.0 - ((leapX + 160.0) / 320) ) * this.width;
  }

  Leap.prototype.normalizeY = function(leapY) {
    return (1.0 - (leapY / 380)) * this.height;
  }

  LeapPlay.Leap = Leap;
})();

$(document).ready(function() {
  $('body').append('<canvas id="canvas" width="640" height="480"></canvas>');
  var canvas = new LeapPlay.Canvas({
    canvasElement: document.getElementById("canvas")
  });
  var leap = new LeapPlay.Leap({
    canvas: canvas
  });
});