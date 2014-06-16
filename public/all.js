// Generated by CoffeeScript 1.7.1
(function() {
  var Util, complete, init, play, start;

  Parse.initialize("8QzCMkUbx7TyEApZjDRlhpLQ2OUj0sQWTnkEExod", "gzlnFfIOoLFQzQ08bU4mxkhAHcSqEok3rox0PBOM");

  localStorage['client_id'] = '2b9312964a1619d99082a76ad2d6d8c6';

  if (location.origin.match(/dev/)) {
    localStorage['is_dev'] = true;
  }

  $(function() {
    return init();
  });

  window.countDown = function(duration, callback) {
    if (callback == null) {
      callback = 'reload';
    }
    $('title').html(Util.formatTime(duration));
    duration -= 1000;
    if (duration > 1000) {
      if (callback === 'reload') {
        return setTimeout("countDown(" + duration + ")", 1000);
      } else {
        return setTimeout("countDown(" + duration + ", " + callback + ")", 1000);
      }
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
      var Workload, ap, artwork, workload, _i, _len, _ref, _results;
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
      if (localStorage['is_dev']) {
        countDown(3000, complete);
      } else {
        countDown(track.duration, complete);
      }
      this.workloads.unshift(workload);
      localStorage['workloads'] = JSON.stringify(this.workloads);
      Workload = Parse.Object.extend("Workload");
      workload = new Workload();
      workload.set('sc_id', parseInt(localStorage['sc_id']));
      workload.save(null, {
        error: function(workload, error) {
          return console.log(error);
        }
      });
      _ref = this.workloads;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        workload = _ref[_i];
        artwork = '';
        if (workload.artwork_url) {
          artwork = "<img src=\"" + workload.artwork_url + "\" width=100px/>";
        }
        $('#workloads').append("<tr>\n  <td><a href=\"#" + workload.sc_id + "\">" + workload.title + "</a></td>\n  <td>" + artwork + "</td>\n  <td>" + (Util.formatTime(workload.started)) + "</td>\n</tr>");
        ap = localStorage['is_dev'] ? 'false' : 'true';
        _results.push($("#playing").html("<iframe width=\"100%\" height=\"400\" scrolling=\"no\" frameborder=\"no\" src=\"https://w.soundcloud.com/player/?visual=true&url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F" + localStorage['sc_id'] + "&show_artwork=true&client_id=" + localStorage['client_id'] + "&auto_play=" + ap + "\"></iframe>"));
      }
      return _results;
    });
  };

  complete = function() {
    var $note, $recents, Comment, query;
    $note = $('<div></div>').attr('id', 'note');
    $note.html('24分おつかれさまでした！5分間交換ノートが見られます');
    $recents = $('<div></div>').attr('class', 'recents');
    $note.append($recents);
    Comment = Parse.Object.extend("Comment");
    query = new Parse.Query(Comment);
    query.find({
      success: function(comments) {
        var $comment, c, hour, min, t, _i, _len;
        console.log(comments);
        $comment = $('<input />').attr('id', 'comment');
        $('#note').append($comment);
        $('#comment').keypress(function(e) {
          var body;
          if (e.which === 13) {
            body = $('#comment').val();
            return window.comment(body);
          }
        });
        for (_i = 0, _len = comments.length; _i < _len; _i++) {
          c = comments[_i];
          t = new Date(c.createdAt);
          hour = t.getHours();
          min = t.getMinutes();
          $recents.prepend("" + hour + "時" + min + "分");
          if (c.attributes.twitter_image) {
            $recents.prepend("<img src='" + c.attributes.twitter_image + "' />");
          }
          $recents.prepend(c.attributes.body);
          $recents.prepend('<br />');
        }
        return $('#note').append($recents);
      }
    });
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
    if (localStorage['twitter_id']) {
      $start = $('<input>').attr('type', 'submit');
      $start.attr('id', 'start').attr('value', '24分間集中する').attr('type', 'submit');
    } else {
      $start = $('<a></a>').html('Twitterログイン');
      $start.attr('href', '/auth/twitter');
    }
    $start.attr('class', 'btn btn-default');
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

  window.comment = function(body) {
    var $recents, Comment, comment;
    Comment = Parse.Object.extend("Comment");
    comment = new Comment();
    comment.set('body', body);
    if (localStorage['twitter_id']) {
      comment.set('twitter_id', parseInt(localStorage['twitter_id']));
    }
    if (localStorage['twitter_nickname']) {
      comment.set('twitter_nickname', localStorage['twitter_nickname']);
    }
    if (localStorage['twitter_image']) {
      comment.set('twitter_image', localStorage['twitter_image']);
    }
    comment.save(null, {
      error: function(comment, error) {
        return console.log(error);
      }
    });
    $recents = $('#note .recents');
    if (localStorage['twitter_image']) {
      $recents.prepend("<img src='" + localStorage['twitter_image'] + "' />");
    }
    $recents.prepend(body);
    $recents.prepend('<br />');
    return $('#comment').val('');
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
