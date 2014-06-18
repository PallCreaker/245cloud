Parse.initialize("8QzCMkUbx7TyEApZjDRlhpLQ2OUj0sQWTnkEExod", "gzlnFfIOoLFQzQ08bU4mxkhAHcSqEok3rox0PBOM")
localStorage['client_id'] = '2b9312964a1619d99082a76ad2d6d8c6'
localStorage['is_dev'] = true if location.origin.match(/dev/)

$ ->
  init()

window.countDown = (duration, callback='reload') ->
  $('title').html(Util.formatTime(duration))
  duration -= 1000
  if duration > 1000
    if callback == 'reload'
      setTimeout("countDown(#{duration})", 1000)
    else
      setTimeout("countDown(#{duration}, #{callback})", 1000)
  else
    if callback == 'reload'
      location.reload()
    else
      callback()

play = () ->
  location.hash = localStorage['sc_id']
  url = "http://api.soundcloud.com/tracks/#{localStorage['sc_id']}.json?client_id=#{localStorage['client_id']}"
  $.get(url, (track) ->
    if localStorage['workloads']
      @workloads = JSON.parse(localStorage['workloads'])
    else
      @workloads = []
    workload = {
      sc_id: localStorage['sc_id']
      started: new Date
      title: track.title
      artwork_url: track.artwork_url
    }

    if localStorage['is_dev']
      countDown(3000, complete)
    else
      countDown(track.duration, complete)

    @workloads.unshift(workload)
    
    localStorage['workloads'] = JSON.stringify(@workloads)

    Workload = Parse.Object.extend("Workload")
    workload = new Workload()
    workload.set('sc_id', parseInt(localStorage['sc_id']))
    workload.save(null, {error: (workload, error) ->
      console.log error
    }
    )

    for workload in @workloads
      artwork = ''
      if workload.artwork_url
        artwork = "<img src=\"#{workload.artwork_url}\" width=100px/>"
      $('#workloads').append("""
        <tr>
          <td><a href=\"##{workload.sc_id}\">#{workload.title}</a></td>
          <td>#{artwork}</td>
          <td>#{Util.formatTime(workload.started)}</td>
        </tr>
      """)
      ap = if localStorage['is_dev'] then 'false' else 'true'
      $("#playing").html("""
  <iframe width="100%" height="400" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?visual=true&url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F#{localStorage['sc_id']}&show_artwork=true&client_id=#{localStorage['client_id']}&auto_play=#{ap}"></iframe>
      """)
    )

complete = () ->
  localStorage['sc_id'] = null
  $note = $('<table></table').attr('id', 'note').addClass('table').attr('style', 'width: 500px; margin: 0 auto;')
  $note.html('24分おつかれさまでした！5分間交換ノートが見られます')

  $recents = $('<div></div>').attr('class', 'recents')
  $note.append($recents)

  Comment = Parse.Object.extend("Comment")
  query = new Parse.Query(Comment)
  query.descending("createdAt")
  query.find({
    success: (comments) ->
      $comment = $('<input />').attr('id', 'comment')
      $('#note').append($comment)

      $('#comment').keypress((e) ->
        if e.which == 13 #enter
          body = $('#comment').val()
          window.comment(body)
      )

      for c in comments
        t = new Date(c.createdAt)
        hour = t.getHours()
        min = t.getMinutes()
        $recents.append("<tr>")
        $img = c.attributes.twitter_image ||  ""
        $recents.append("<td><img src='#{$img}' /><td>")
        $recents.append("<td>#{c.attributes.body}</td>")
        $recents.append("<td>#{hour}時#{min}分</td>")
        $recents.append("</tr>")
      $('#note').append($recents)
  })

  $('#contents').attr(style: 'text-align:center;')
  $('#contents').html($note)

  $track = $("<input />").attr('id', 'track')
  $tracks = $("<div></div>").attr('id', 'tracks')

  $('#contents').append("<hr /><h3>好きなパワーソングを探す</h3>")
  $('#contents').append($track)
  $('#contents').append($tracks)

  $('#track').keypress((e) ->
    if e.which == 13 #enter
      q = $('#track').val()
      url = "http://api.soundcloud.com/tracks.json?client_id=#{localStorage['client_id']}&q=#{q}&duration[from]=#{23*60*1000}&duration[to]=#{25*60*1000}"
      $.get(url, (tracks) ->
        if tracks[0]
          for track in tracks
            artwork = ''
            if track.artwork_url
              artwork = "<img src=\"#{track.artwork_url}\" width=100px/>"

            $('#tracks').append("""
              <tr>
                <td><a href=\"##{track.id}\">#{track.title}</a></td>
                <td>#{artwork}</td>
                <td>#{Util.formatTime(track.duration)}</td>
              </tr>
            """)
        else
          alert "「#{q}」で24分前後の曲はまだ出てないようです...。他のキーワードで探してみてください！"
      )
  )

  countDown(5*60*1000, 'reload')

init = () ->
  $body = $('body')
  $body.attr(style: 'text-align:center;')

  $body.html('')
  for id in ['description', 'contents', 'footer']
    $item = $('<div></div>')
    $item.attr('id', id)
    $body.append($item)

  $.get('/proxy?url=https://ruffnote.com/pandeiro245/245cloud/13475/download.json', (data) ->
    $('#description').html(data.content)
  )

  $.get('/proxy?url=https://ruffnote.com/pandeiro245/245cloud/13477/download.json', (data) ->
    $('#footer').html(data.content)
  )
  
  if localStorage['twitter_id']
    $start = $('<input>').attr('type', 'submit')
    $start.attr('id', 'start').attr('value', '24分間集中する').attr('type', 'submit')
  else
    $start = $('<a></a>').html('Twitterログイン')
    $start.attr('href', '/auth/twitter')
  $start.attr('class', 'btn btn-default')
  $('#contents').html($start)
  $('#start').click(() ->
    start()
  )

start = () ->
  $start = $('<div></div>').attr('id', 'playing')
  $('#contents').html($start)
  Music = Parse.Object.extend("Music")
  query = new Parse.Query(Music)
  query.find({
    success: (musics) ->
      n = Math.floor(Math.random() * musics.length)
      sc_id = musics[n].attributes.sc_id
      localStorage['sc_id'] = sc_id
      play()
  })

window.comment = (body) ->
  Comment = Parse.Object.extend("Comment")
  comment = new Comment()
  comment.set('body', body)
  comment.set('twitter_id', parseInt(localStorage['twitter_id'])) if localStorage['twitter_id']
  comment.set('twitter_nickname', localStorage['twitter_nickname']) if localStorage['twitter_nickname']
  comment.set('twitter_image', localStorage['twitter_image']) if localStorage['twitter_image']
  comment.save(null, {error: (comment, error) ->
    console.log error
  }
  )
  $recents = $('#note .recents')
  $recents.prepend("<img src='#{localStorage['twitter_image']}' />") if localStorage['twitter_image']
  $recents.prepend(body)
  $recents.prepend('<br />')

  $('#comment').val('')
