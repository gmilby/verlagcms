require 'spec_helper'

describe "routes/site" do
  include Rack::Test::Methods   
  
  before(:all) do
    setup_site   
    @layout = Factory(:layout, :site => @site)
    @page = Factory(:page, :title => 'root', :parent_id => nil, :site => @site, :layout => @layout) 
  end
  
  after(:all) do
    teardown  
  end
  
  context 'routes' do
    it 'should show the home page' do
      get '/'
      last_response.should be_ok
    end
    
    it 'should show the 404 page' do 
      get '/fibble/bits'
      last_response.status.should == 404
    end
  end   
  
  # TODO move this to its own spec
  context 'formats' do
    it 'should respond to html' do
      get '/search'
      last_response.headers['Content-Type'].should == 'text/html;charset=utf-8'
    end
  
    it 'should respond to json' do
      get '/search/naked.json'
      last_response.headers['Content-Type'].should == 'application/json'
    end
  end  
    
  context 'mustache templates' do
    it 'should show the asset template' do
      get '/search' 
      # Very basic way of checking for the mustache template
      last_response.body.should include("type='mustache'")
    end
    
    it 'should set the asset template id' do
      get '/search' 
      last_response.body.should include("asset-list-template")
    end
    
    it 'should include the asset list template' do
      template = File.open(root_path(File.join('app/views/', 'search', 'asset_list.mustache')))
      get '/search' 
      last_response.body.should include(template.read.html_safe)
    end
    
    it 'should include the asset display template' do
      template = File.open(root_path(File.join('app/views/', 'search', 'asset_display.mustache')))
      get '/search' 
      last_response.body.should include(template.read.html_safe)
    end
    
  end
  
end