(function() {
  var Util;

  Util = (function() {
    function Util() {}

    Util.formatTime = function(mtime) {
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

    return Util;

  })();

  window.Util = window.Util || Util;

}).call(this);
