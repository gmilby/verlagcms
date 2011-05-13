require 'sinatra/base'   

module Sinatra                                   
  module BasicAuth  
    
    module Helpers  
      
      def authorized?
       session[:authorized] 
      end     
      
      def authorize! 
        redirect '/login' unless authorized?
      end     
      
      def logout! 
        session[:authorized] = false
      end 
      
    end 
      
    def self.registered(app) 
      app.helpers BasicAuth::Helpers  
      
      app.set :username, 'frank' 
      app.set :password, 'changeme'  
      
      app.get '/login' do 
        haml :'/vendor/sinatra-basicauth/views/site/login'
      end    
      
      app.post '/login' do 
        if params[:user] == options.username && params[:pass] == options.password
          session[:authorized] = true
          redirect '/' 
        else
          session[:authorized] = false
         redirect '/login' 
        end
      end 
    
    end
  end    

  register BasicAuth 
end