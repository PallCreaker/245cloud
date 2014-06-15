// Generated by CoffeeScript 1.7.1
(function() {
  var Util, complete, init, play, start;

  Parse.initialize("8QzCMkUbx7TyEApZjDRlhpLQ2OUj0sQWTnkEExod", "gzlnFfIOoLFQzQ08bU4mxkhAHcSqEok3rox0PBOM");

  localStorage['client_id'] = '2b9312964a1619d99082a76ad2d6d8c6';

  localStorage['sc_id'] = location.hash.replace('#', '');

  $(function() {
    return init();
  });

  window.countDown = function(duration, callback) {
    $('title').html(Util.formatTime(duration));
    duration -= 1000;
    if (duration > 1000) {
      return setTimeout("countDown(" + duration + ", " + callback + ")", 1000);
    } else {
      if (callback === 'reload') {
        return location.reload();
      } else {
        return callback();
      }
    }
  };

  play = function() {
    var url;
    url = "http://api.soundcloud.com/tracks/" + localStorage['sc_id'] + ".json?client_id=" + localStorage['client_id'];
    return $.get(url, function(track) {
      var Workload, artwork, workload, _i, _len, _ref, _results;
      if (localStorage['workloads']) {
        this.workloads = JSON.parse(localStorage['workloads']);
      } else {
        this.workloads = [];
      }
      workload = {
        sc_id: localStorage['sc_id'],
        started: new Date,
        title: track.title,
        artwork_url: track.artwork_url
      };
      countDown(track.duration, complete);
      this.workloads.unshift(workload);
      localStorage['workloads'] = JSON.stringify(this.workloads);
      Workload = Parse.Object.extend("Workload");
      workload = new Workload();
      workload.save(workload).then(function(object) {});
      _ref = this.workloads;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        workload = _ref[_i];
        artwork = '';
        if (workload.artwork_url) {
          artwork = "<img src=\"" + workload.artwork_url + "\" width=100px/>";
        }
        $('#workloads').append("<tr>\n  <td><a href=\"#" + workload.sc_id + "\">" + workload.title + "</a></td>\n  <td>" + artwork + "</td>\n  <td>" + (Util.formatTime(workload.started)) + "</td>\n</tr>");
        _results.push($("#playing").html("<iframe width=\"100%\" height=\"400\" scrolling=\"no\" frameborder=\"no\" src=\"https://w.soundcloud.com/player/?visual=true&url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F" + localStorage['sc_id'] + "&show_artwork=true&client_id=" + localStorage['client_id'] + "&auto_play=true\"></iframe>"));
      }
      return _results;
    });
  };

  complete = function() {
    var $note;
    $note = $('<div></div>').attr('id', 'note');
    $note.html('24分おつかれさまでした！5分間交換ノートが見られます');
    $('#contents').html($note);
    return countDown(5 * 60 * 1000, 'reload');
  };

  init = function() {
    var $body, $item, $start, id, _i, _len, _ref;
    $body = $('body');
    $body.attr('align', 'center');
    $body.html('');
    _ref = ['description', 'contents', 'footer'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      id = _ref[_i];
      $item = $('<div></div>');
      $item.attr('id', id);
      $body.append($item);
    }
    $.get('/proxy?url=https://ruffnote.com/pandeiro245/245cloud/13475/download.json', function(data) {
      return $('#description').html(data.content);
    });
    $.get('/proxy?url=https://ruffnote.com/pandeiro245/245cloud/13477/download.json', function(data) {
      return $('#footer').html(data.content);
    });
    $start = $('<input>').attr('id', 'start').attr('value', '24分集中する').attr('type', 'submit');
    $('#contents').html($start);
    return $('#start').click(function() {
      return start();
    });
  };

  start = function() {
    var $start, Music, query;
    $start = $('<div></div>').attr('id', 'playing');
    $('#contents').html($start);
    Music = Parse.Object.extend("Music");
    query = new Parse.Query(Music);
    return query.find({
      success: function(musics) {
        var n, sc_id;
        n = Math.floor(Math.random() * musics.length);
        sc_id = musics[n].attributes.sc_id;
        localStorage['sc_id'] = sc_id;
        return play();
      }
    });
  };

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
      if (i < 9) {
        return "0" + i;
      } else {
        return "" + i;
      }
    };

    return Util;

  })();

  window.Util = window.Util || Util;

}).call(this);