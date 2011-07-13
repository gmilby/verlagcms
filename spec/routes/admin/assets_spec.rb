require 'spec_helper'

describe "routes/admin/assets" do
  include Rack::Test::Methods
  
  before(:all) do    
    setup_site
    @artist = Factory(:artist, :name => 'Egon')                       
    @asset = Factory(:asset, :artist => @artist, :site => @site)   
    @assets = [@asset]
  end 
  
  after(:all) do
    teardown
  end   
  
  context 'GET index' do
    
    # context 'html' do 
    #   def do_get
    #     get '/admin/assets'
    #   end
    #   
    #   it 'should be successful' do
    #     pending 'deprecated' 
    #     do_get
    #     last_response.should be_ok
    #   end
    #   
    #   it 'should set the content header to html' do  
    #     pending 'deprecated' 
    #     do_get
    #     last_response.headers['Content-Type'].should == 'text/html;charset=utf-8'
    #   end
    # end
    
    context 'json' do   
      def do_get
        get '/admin/assets.json'
      end
    
      it 'should be successful' do
        do_get    
        last_response.should be_ok
      end
      
      it 'should set the content header to json' do
        do_get
        last_response.headers['Content-Type'].should == 'application/json'
      end
    
      it 'should include assets in the json' do
        do_get
        last_response.body.should include(@asset.to_json)
      end 
      
      it 'should not include assets from other sites' do  
        pending 
        @alien_site = Factory(:site, :name => 'Alien', :subdomain => 'alien')
        @alien_asset = Factory(:asset, :site => @alien_site, :title => 'Alien') 
        do_get 
        last_response.body.should_not include(@alien_asset.to_json) 
      end 
    end
    
  end  
  
  context 'POST create' do
    
    context 'html' do 
      def do_post
        post "/admin/assets", :file => File.open(root_path('/spec/data/830px-Tieboardingcraft.jpg')), :file => { :filename => '830px-Tieboardingcraft.jpg' }
      end
      
      it 'should be a redirect' do
        do_post
        last_response.should be_redirect
      end
    end
    
    context 'json' do 
      def do_post
        post "/admin/assets.json", :file => File.open(root_path('/spec/data/830px-Tieboardingcraft.jpg')), :file => { :filename => '830px-Tieboardingcraft.jpg' }
      end
      
      it 'should be successful' do
        do_post
        last_response.should be_ok 
      end  
      
      it 'should set the content header to json' do
        do_post
        last_response.headers['Content-Type'].should == 'application/json'
      end 
      
      it 'should return the filename in the json' do
        do_post                       
        JSON.parse(last_response.body)['title'].should == '830px-Tieboardingcraft' 
      end
    end
    
  end   
  
  context 'PUT update' do  
          
    context 'json' do   
      def do_put
        put "/admin/assets/#{@asset.id}.json", :asset => { :title => 'Really Awesome Image' }
      end
    
      it 'should be successful' do
        do_put
        last_response.should be_ok
      end
      
      it 'should set the content header to json' do
        do_put
        last_response.headers['Content-Type'].should == 'application/json'
      end
      
      it 'should include the title in the json' do  
        do_put
        last_response.body.should include('Really Awesome Image')
      end  
    end
  
  end
  
  # context 'GET edit' do
  #   
  #   context 'html' do 
  #     def do_get
  #       get "/admin/assets/#{@asset.id}/edit"
  #     end
  #     
  #     it 'should be successful' do 
  #       pending 'deprecated' 
  #       do_get
  #       last_response.should be_ok
  #     end
  #     
  #     it 'should set the content header to html' do 
  #       pending 'deprecated'
  #       do_get
  #       last_response.headers['Content-Type'].should == 'text/html;charset=utf-8'
  #     end
  #   end
  #   
  # end
  
end