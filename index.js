var can = document.querySelector("#canvas");
var ctx = can.getContext("2d");
var w, h, minW;

var config = {
    'audioSens': 10,
    'audioBars': true
}

function normalize(val) {
  if (val < 250) {
    return val;
  }

  return 250;
}

function resize() {
  can.width = w = window.innerWidth;
  can.height = h = window.innerHeight;
  minW = Math.min(w, h);
}

resize();
window.onresize = resize;

ctx.lineWidth = 3;
ctx.shadowBlur = 15;

function wallpaperAudioListener(audioArray) {
    // Clears the rectangle

     ctx.clearRect(0, 0, can.width, can.height);

     if(!config.audioBars){ return; }

     // Render bars along the full width of the canvas
     var numberOfBars = 16.0;
     var barWidth = (Math.round(1.0 / numberOfBars * can.width)) / 2;

     var delta = [];
     var j = 0;
     var k = 0;

     for (var i = 0; i < audioArray.length; ++i) {
         if (j == 7) {
           var height = normalize((can.height * audioArray[i]) / config.audioSens);
           var padding = barWidth/2;

           ctx.fillStyle = 'rgba(255,255,255,0.8)';
           ctx.shadowColor = 'rgba(255,255,255,0.6)';

           ctx.fillRect(barWidth * 2 * k + padding, (can.height / 2) - height, barWidth, height);

           var gradient = ctx.createLinearGradient(0,can.height / 2,0, (can.height / 2) + height);
           gradient.addColorStop(0,"rgba(255,255,255, 0.3)");
           gradient.addColorStop(1,'rgba(255,255,255, 0)');

           ctx.fillStyle = gradient;
           ctx.shadowColor = '';

           ctx.fillRect(barWidth * 2 * k + padding, (can.height / 2), barWidth, height);

           k++;
           j = 0;
         }

         j++;
     }
}

window.wallpaperPropertyListener = {
  applyUserProperties: function(properties) {
    if (properties.sens) {
      config.audioSens = (21 - properties.sens.value);
    }
    config.audioBars = properties.audioBars.value;
  }
};

window.onload = function() {
    window.wallpaperRegisterAudioListener(wallpaperAudioListener);
};
