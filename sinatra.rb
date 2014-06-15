require 'sinatra'
require 'net/http'
require 'uri'

get '/proxy' do
  headers "Content-Type" => "text/json; charset=utf8"
  url = params[:url]
  Net::HTTP.get(URI.parse(url))
end
