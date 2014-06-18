(function() {
  var complete, init, play, start;

  Parse.initialize("8QzCMkUbx7TyEApZjDRlhpLQ2OUj0sQWTnkEExod", "gzlnFfIOoLFQzQ08bU4mxkhAHcSqEok3rox0PBOM");

  localStorage['client_id'] = '2b9312964a1619d99082a76ad2d6d8c6';

  if (location.origin.match(/dev/)) {
    localStorage['is_dev'] = true;
  }

  $(function() {
    return init();
  });

  play = function() {
    localStorage['sc_id'] = location.hash.replace(/#/, '');
    return Soundcloud.fetch(localStorage['sc_id'], localStorage['client_id'], function(track) {
      var ap, artwork, key, params, workload, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
      params = {};
      _ref = ['sc_id', 'twitter_id'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        params[key] = localStorage[key];
      }
      _ref1 = ['title', 'artwork_url'];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        key = _ref1[_j];
        params[key] = track[key];
      }
      ParseParse.save("Workload", params);
      localStorage['artwork_url'] = track.artwork_url;
      if (localStorage['is_dev']) {
        Util.countDown(30000, complete);
      } else {
        Util.countDown(track.duration, complete);
      }
      if (false) {
        _ref2 = this.workloads;
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          workload = _ref2[_k];
          artwork = '';
          if (workload.artwork_url) {
            artwork = "<img src=\"" + workload.artwork_url + "\" width=100px/>";
          }
          $('#workloads').append("<tr>\n  <td><a href=\"#" + workload.sc_id + "\">" + workload.title + "</a></td>\n  <td>" + artwork + "</td>\n  <td>" + (Util.time(workload.started)) + "</td>\n</tr>");
        }
      }
      ap = localStorage['is_dev'] ? 'false' : 'true';
      return $("#playing").html("<iframe width=\"100%\" height=\"400\" scrolling=\"no\" frameborder=\"no\" src=\"https://w.soundcloud.com/player/?visual=true&url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F" + localStorage['sc_id'] + "&show_artwork=true&client_id=" + localStorage['client_id'] + "&auto_play=" + ap + "\"></iframe>");
    });
  };

  complete = function() {
    var $note, $recents, $track, $tracks, Comment, query;
    $note = $('<table></table').attr('id', 'note').addClass('table').attr('style', 'width: 500px; margin: 0 auto;');
    $note.html('24分おつかれさまでした！5分間交換ノートが見られます');
    $recents = $('<div></div>').attr('class', 'recents');
    $note.append($recents);
    Comment = Parse.Object.extend("Comment");
    query = new Parse.Query(Comment);
    query.descending("createdAt");
    query.find({
      success: function(comments) {
        var $comment, $img, c, hour, min, t, _i, _len;
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
          $recents.append("<tr>");
          $img = c.attributes.twitter_image || "";
          $recents.append("<td><img src='" + $img + "' /><td>");
          $recents.append("<td>" + c.attributes.body + "</td>");
          $recents.append("<td>" + hour + "時" + min + "分</td>");
          $recents.append("</tr>");
        }
        return $('#note').append($recents);
      }
    });
    $('#contents').attr({
      style: 'text-align:center;'
    });
    $('#contents').html($note);
    $track = $("<input />").attr('id', 'track');
    $tracks = $("<div></div>").attr('id', 'tracks');
    $('#contents').append("<hr /><h3>好きなパワーソングを探す</h3>");
    $('#contents').append($track);
    $('#contents').append($tracks);
    $('#track').keypress(function(e) {
      var q, url;
      if (e.which === 13) {
        q = $('#track').val();
        url = "http://api.soundcloud.com/tracks.json?client_id=" + localStorage['client_id'] + "&q=" + q + "&duration[from]=" + (23 * 60 * 1000) + "&duration[to]=" + (25 * 60 * 1000);
        return $.get(url, function(tracks) {
          var artwork, track, _i, _len, _results;
          if (tracks[0]) {
            _results = [];
            for (_i = 0, _len = tracks.length; _i < _len; _i++) {
              track = tracks[_i];
              artwork = '';
              if (track.artwork_url) {
                artwork = "<img src=\"" + track.artwork_url + "\" width=100px/>";
              }
              _results.push($('#tracks').append("<tr>\n  <td><a href=\"#" + track.id + "\">" + track.title + "</a></td>\n  <td>" + artwork + "</td>\n  <td>" + (Util.time(track.duration)) + "</td>\n</tr>"));
            }
            return _results;
          } else {
            return alert("「" + q + "」で24分前後の曲はまだ出てないようです...。他のキーワードで探してみてください！");
          }
        });
      }
    });
    return Util.countDown(5 * 60 * 1000, 'reload');
  };

  init = function() {
    var $body, $item, $start, id, _i, _len, _ref;
    $body = $('body');
    $body.attr({
      style: 'text-align:center;'
    });
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
      $start.attr('id', 'start').attr('value', '24分間集中する！！').attr('type', 'submit');
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
        location.hash = sc_id;
        return play();
      }
    });
  };

  window.comment = function(body) {
    var $recents, key, params, _i, _len, _ref;
    params = {
      body: body
    };
    _ref = ['twitter_id', 'twitter_nickname', 'twitter_image', 'sc_id', 'artwork_url'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      params[key] = localStorage[key];
    }
    ParseParse.save('Comment', params);
    $recents = $('#note .recents');
    if (localStorage['twitter_image']) {
      $recents.prepend("<img src='" + localStorage['twitter_image'] + "' />");
    }
    $recents.prepend(body);
    $recents.prepend('<br />');
    return $('#comment').val('');
  };

}).call(this);
