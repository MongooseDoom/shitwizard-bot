const JVSDisplayOTron = require('jvsdisplayotron');

// Initialize the Display-o-Tron HAT.
const dothat = new JVSDisplayOTron.DOTHAT();

exports.write = function(msg, rgb = [162, 80, 255]){
  dothat.lcd.setContrast(45);
  dothat.backlight.setToRGB(rgb[0], rgb[1], rgb[2]);
  if (Array.isArray(msg)) {
    for (var i = 0; i < msg.length; i++) {
      dothat.lcd.setCursorPosition(0, i);
      dothat.lcd.write(msg[i]);
    }
  } else {
    dothat.lcd.write(msg);
  }
  dothat.kill(false);
};

exports.reset = function(){
  dothat.reset();
};

exports.changeColor = function(red, green, blue){
  dothat.backlight.setToRGB(red, green, blue);
};
