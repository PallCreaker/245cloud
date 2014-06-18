(function() {
  var Util;

  Util = (function() {
    function Util() {}

    Util.time = function(mtime) {
      var day, hour, min, month, sec, time;
      if (mtime < 24 * 3600 * 1000) {
        time = parseInt(mtime / 1000);
        min = parseInt(time / 60);
        sec = time - min * 60;
        return "" + (Util.zero(min)) + ":" + (Util.zero(sec));
      } else {
        time = new Date(mtime * 1000);
        month = time.getMonth() + 1;
        day = time.getDate();
        hour = time.getHours();
        min = time.getMinutes();
        return "" + (Util.zero(month)) + "/" + (Util.zero(day)) + " " + (Util.zero(hour)) + ":" + (Util.zero(min));
      }
    };

    Util.zero = function(i) {
      if (i < 10) {
        return "0" + i;
      } else {
        return "" + i;
      }
    };

    Util.countDown = function(duration, callback) {
      if (callback == null) {
        callback = 'reload';
      }
      $('title').html(Util.time(duration));
      duration -= 1000;
      if (duration > 1000) {
        if (callback === 'reload') {
          return setTimeout("Util.countDown(" + duration + ")", 1000);
        } else {
          return setTimeout("Util.countDown(" + duration + ", " + callback + ")", 1000);
        }
      } else {
        if (callback === 'reload') {
          return location.reload();
        } else {
          return callback();
        }
      }
    };

    return Util;

  })();

  window.Util = window.Util || Util;

}).call(this);
