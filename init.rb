ROOT_DIR = File.expand_path(File.dirname(__FILE__)) unless defined? ROOT_DIR

require 'rubygems'  
require "bundler/setup"  

Bundler.setup

# Monk
require 'monk/glue'
require 'sinatra/base' 
require 'sinatra/advanced_routes'  
require 'sinatra/namespace'   

# Warden / Login
require 'warden'
require 'bcrypt'

# Sinatra Extensions
require 'vendor/sinatra-basicauth/lib/sinatra/basic_auth'
require 'lib/sinatra/respond_to'  
require 'lib/sinatra/logger' 
require 'lib/sinatra/images' 
require 'lib/sinatra/get_subdomain' 

# Mongo stuff
require 'mongo_mapper'
require 'joint'
require 'hunt'
require 'canable'

# Rack
require 'rack/cache'
require 'rack/cache' 
require 'rack/request' 
require 'lib/rack/raw_upload'
require 'lib/rack/subdomains'
require 'lib/hunt/search_all'

# Templating
require 'mustache/sinatra'
require 'haml' 
require 'liquid' 
require 'RedCloth' 
# require 'jim'

class Main < Monk::Glue

  set :app_file, __FILE__    
  set :views, root_path('app', 'views') 
  set :sass, { 
    :cache => RACK_ENV == 'development' ? false : true, 
    :cache_location => './tmp/sass-cache',
    :style => :compact }
  set :haml, { 
    :format => :html5, 
    :ugly => RACK_ENV == 'development' ? false : true } 
  set :default_content_type, :html
  
  # Not sure if this is the correct syntax
  register Rabl
  
  # Rack Middleware 
  use Rack::Cache,
    :verbose => false,
    :metastore => 'file:tmp/cache/meta', 
    :entitystore => 'file:tmp/cache/body'       
  use Rack::Session::Cookie, :secret => "fibble this must be longer"
  use Rack::RawUpload  
  
  # use Jim::Rack, :bundle_uri => '/js/'
  
  register Mustache::Sinatra  
  set :mustache, {
    :views     => root_path('app/views'),
    :templates => root_path('app/views'),
    :namespace => Main }
  
  # Extensions    
  register Sinatra::Namespace  
  register Sinatra::BasicAuth 
  register Sinatra::Logger 
  register Sinatra::RespondTo  
  register Sinatra::Images 
  register Sinatra::GetSubdomain 
  register Sinatra::AdvancedRoutes 
  
  configure do
    mime_type :mustache, 'text/mustache' 
    mime_type :'octet-stream', 'application/octet-stream' 
  end

  use Warden::Manager do |manager|
    manager.default_strategies :fibble
    manager.failure_app = Main
  end

end

# Connect to mongodb
if ENV['MONGOHQ_URL']
  puts "Running on MongoHQ" 
  MongoMapper.config = { RACK_ENV => {'uri' => ENV['MONGOHQ_URL']} }
  MongoMapper.connect(RACK_ENV)
else
  puts "Using local database" 
  MongoMapper.database = monk_settings(:mongo)[:database]
  MongoMapper.connection = Mongo::Connection.new(monk_settings(:mongo)[:host], nil, :logger => logger)
end

require root_path('app/models/template.rb') 
# This needs to be required first or Artist blows up...
require root_path('app/models/asset.rb')
# This needs to be required first or Page blows up...
require root_path('app/models/part.rb')  

# Load all models.
Dir[root_path('app/models/*.rb')].each do |file|
  require file
end   

# Load all helpers.
Dir[root_path('app/helpers/*.rb')].each do |file|
  require file
end

# Load all admin routes.
Dir[root_path('app/routes/admin/*.rb')].each do |file|
  require file
end

# Load site and assets route. 
require 'app/routes/assets.rb'  
require 'app/routes/site.rb'
  
# Load all views.
Dir[root_path('app/views/**/*.rb')].each do |file|
  require file
end

# Load all lib liquid files.
Dir[root_path('app/liquid/*.rb')].each do |file|
  require file
end  

if defined? Encoding
  Encoding.default_external = Encoding::UTF_8
end

Main.run! if Main.run?
