require 'spec_helper'

describe "routes/assets" do
  include Rack::Test::Methods
  
  before(:all) do 
    @artist = Artist.make()
    @asset = Asset.make(:artist => @artist, :tags => ['naked'])
    @assets = [@asset]
  end 
  
  after(:all) do
    teardown
  end   
  
  context 'GET index' do
    
    context 'html' do 
      def do_get
        get '/assets'
      end
      
      it 'should be successful' do
        do_get
        last_response.should be_ok
      end
      
      it 'should set the content header to html' do
        do_get
        last_response.headers['Content-Type'].should == 'text/html;charset=utf-8'
      end
    end
    
    context 'json' do   
      def do_get
        get '/assets.json'
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
    end
    
  end
  
  context 'GET edit' do
    
    context 'html' do 
      def do_get
        get "/assets/#{@asset.id}/edit"
      end
      
      it 'should be successful' do
        do_get
        last_response.should be_ok
      end
      
      it 'should set the content header to html' do
        do_get
        last_response.headers['Content-Type'].should == 'text/html;charset=utf-8'
      end
    end
    
  end
  
end