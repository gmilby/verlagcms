source "http://rubygems.org"

gem 'rack', '~> 1.3.4' 
gem 'sinatra', '1.3.1' 
gem 'tilt', '~> 1.3' 
gem 'sinatra-namespace', :path => 'vendor/sinatra-namespace' #, :git => 'https://github.com/rkh/sinatra-namespace.git' 
# gem 'sinatra-advanced-routes'
gem 'thin' 
gem 'monk-glue', :git => 'https://github.com/monkrb/glue.git' 
gem 'rack-cache'
# gem 'sprockets', :git =>'git://github.com/sstephenson/sprockets.git'
# gem 'hike' ,'~> 1.2.1'

gem 'warden'
gem 'bcrypt-ruby'

# Mongomapper and plugins
gem 'mongo_mapper', :git => 'https://github.com/jnunemaker/mongomapper.git'
# gem 'mongo_mapper', :path => 'vendor/mongomapper'
gem 'mongo_ext', :require => 'mongo'
gem 'mongo', '1.3'
gem 'bson', '1.3'
gem 'bson_ext', '1.3'  
gem 'hunt', :git => 'https://github.com/jnunemaker/hunt.git'
gem 'fast-stemmer', '~> 1.0'
gem 'joint', :git => 'https://github.com/jnunemaker/joint.git'
gem 'mongo_mapper_acts_as_tree', :git => 'https://github.com/bogn/mongo_mapper_acts_as_tree.git'
gem 'bin', :git => 'https://github.com/jnunemaker/bin.git'
gem 'canable', :path => 'vendor/canable'

gem 'mini_magick'

gem 'haml'  
gem 'sass'
gem 'rabl', :git => 'https://github.com/nesquena/rabl.git'
gem 'mustache', :git => 'https://github.com/defunkt/mustache.git'
gem 'liquid' 
gem 'RedCloth' 

gem 'json'
gem 'rack-flash'
gem 'rack-cache'
gem 'rack-raw-upload', :git => 'https://github.com/newbamboo/rack-raw-upload.git'

group :production do 
  gem 'memcached'
end

group :development do
  gem 'rake'
  gem 'thor'  
  gem 'monk' 
  gem 'jim', :git => 'https://github.com/quirkey/jim.git'
end

group :test do
  gem 'rack-test'
  gem 'test-unit'
  gem 'rspec', '>= 2.5.0'
  gem 'capybara' #, :git => 'https://github.com/jnicklas/capybara.git'
  gem 'yajl-ruby'
  # gem 'capybara-zombie', :path => 'vendor/capybara-zombie' # 
  gem 'capybara-webkit', :git => 'https://github.com/thoughtbot/capybara-webkit.git'
  gem 'factory_girl' #, :git => 'https://github.com/thoughtbot/factory_girl.git'
  gem 'faker'
  gem 'jasmine'
end