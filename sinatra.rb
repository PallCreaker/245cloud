require 'sinatra'
require 'net/http'
require 'uri'
require 'omniauth-twitter'

configure do
  set :sessions, true
  set :inline_templates, true
end

use OmniAuth::Builder do
  provider :twitter, 'CwNnlOH10VpopMJvgwQUQA', 'yjJLW9t2K0P3wmqOWeGhzx9oyIGRznqE3lPPxeLoIjk'
end

get '/proxy' do
  headers "Content-Type" => "text/json; charset=utf8"
  url = params[:url]
  Net::HTTP.get(URI.parse(url))
end

# https://gist.github.com/fairchild/1442227
get '/auth/:provider/callback' do
  data = request.env['omniauth.auth']
  twitter_id = data[:uid]
  erb "
    少々お待ちください
    <script src=\"http://www.parsecdn.com/js/parse-1.2.18.min.js\"></script>
    <script>
    Parse.initialize(\"8QzCMkUbx7TyEApZjDRlhpLQ2OUj0sQWTnkEExod\", \"gzlnFfIOoLFQzQ08bU4mxkhAHcSqEok3rox0PBOM\")
    var Twitter = Parse.Object.extend(\"Twitter\");
    var twitter = new Twitter();
    twitter.set('twitter_id', #{twitter_id})
    twitter.set('twitter_nickname', '#{data[:info][:nickname]}')
    twitter.set('twitter_image', '#{data[:info][:image]}')
    twitter.save(null, {
      success: function(data){
        localStorage['twitter_id'] = data.attributes.twitter_id
        localStorage['twitter_nickname'] = data.attributes.twitter_nickname
        localStorage['twitter_image'] = data.attributes.twitter_image
        location.href = '/'
      },
      error: function(twitter, error){
        console.log(error);
      }
    })
    </script>
  "
end
