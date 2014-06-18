class Util
  @time: (mtime) ->
    if mtime < 24 * 3600 * 1000
      time = parseInt(mtime/1000)
      min = parseInt(time/60)
      sec = time - min*60
      "#{Util.zero(min)}:#{Util.zero(sec)}"
    else
      time = new Date(mtime * 1000)
      month = time.getMonth() + 1
      day  = time.getDate()
      hour = time.getHours()
      min  = time.getMinutes()
      "#{Util.zero(month)}/#{Util.zero(day)} #{Util.zero(hour)}:#{Util.zero(min)}"

  @zero: (i) ->
    if i < 10 then "0#{i}" else "#{i}"

  @countDown: (duration, callback='reload') ->
    $('title').html(Util.time(duration))
    duration -= 1000
    if duration > 1000
      if callback == 'reload'
        setTimeout("Util.countDown(#{duration})", 1000)
      else
        setTimeout("Util.countDown(#{duration}, #{callback})", 1000)
    else
      if callback == 'reload'
        location.reload()
      else
        callback()


window.Util = window.Util || Util
