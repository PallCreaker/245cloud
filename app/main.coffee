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
    countDown(track.duration, complete)

    @workloads.unshift(workload)
    
    localStorage['workloads'] = JSON.stringify(@workloads)

    Workload = Parse.Object.extend("Workload")
    workload = new Workload()
    workload.set('sc_id', localStorage['sc_id'])
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
  $note = $('<div></div>').attr('id', 'note')
  $note.html('24分おつかれさまでした！5分間交換ノートが見られます')

  $recents = $('<div></div>').attr('class', 'recents')
  $note.append($recents)

  Comment = Parse.Object.extend("Comment")
  query = new Parse.Query(Comment)
  query.find({
    success: (comments) ->
      console.log comments
      $comment = $('<input />').attr('id', 'comment')
      $('#note').append($comment)

      $('#comment').keypress((e) ->
        if e.which == 13 #enter
          body = $('#comment').val()
          window.comment(body)
      )

      for c in comments
        $recents.prepend(c.attributes.body)
        $recents.prepend('<br />')
      $('#note').append($recents)
  })

  $('#contents').html($note)

  countDown(5*60*1000, 'reload')

init = () ->
  $body = $('body')
  $body.attr('align', 'center')

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
  
  $start = $('<input>').attr('id', 'start').attr('value', '24分集中する').attr('type', 'submit')
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
  comment.save(null, {error: (comment, error) ->
    console.log error
  }
  )
  $recents = $('#note .recents')
  $recents.prepend(body)
  $recents.prepend('<br />')

  $('#comment').val('')
