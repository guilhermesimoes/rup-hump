require 'sinatra/base'
require 'sinatra/assetpack'
require 'sinatra/reloader' if development?

class WebApp < Sinatra::Base
  register Sinatra::AssetPack

  assets {
    serve '/js',     from: 'assets/javascripts'
    serve '/css',    from: 'assets/stylesheets'
    serve '/images', from: 'assets/images'

    js :application, [
      '/js/main.js'
    ]

    css :application, [
      '/css/normalize.css',
      '/css/styles.css'
    ]

    js_compression  :jsmin
    css_compression :sass
  }

  configure :development do
    register Sinatra::Reloader
  end

  configure :production do
    set :static_cache_control, [:public, max_age: 31536000]  # Set expire header of 1 year for static files
    set :force_ssl, true
  end

  get '/' do
    erb :home
  end
end
