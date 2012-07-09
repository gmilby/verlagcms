require 'spec_helper'

describe "routes/api/v1'/pages" do
  include Rack::Test::Methods
  
  before(:all) do 
    teardown
    build_complete_site 
    setup_site 
    @child_a = Factory(:page, :parent_id => @page.id, :title => 'Child A', :layout => @layout) 
    @child_b = Factory(:page, :parent_id => @page.id, :title => 'Child B', :layout => @layout) 
  end 
  
  after(:all) do
    teardown
  end   
  
  context 'GET index' do
    
    context 'json' do   
      def do_get
        get '/api/v1'/pages.json'
      end
    
      it 'should be successful' do
        do_get
        last_response.should be_ok
      end
      
      it 'should set the content header to json' do
        do_get
        last_response.headers['Content-Type'].should == 'application/json;charset=utf-8'
      end
    
      it 'should include pages in the json' do  
        do_get
        last_response.body.should include(@page.title)
      end   
      
      it 'should not include pages from other sites' do   
        @alien_site = Factory(:site, :name => 'Alien', :subdomain => 'alien', :group => @group)  
        @alien_layout = Factory(:layout, :site_id => @alien_site.id, :name => 'alien')
        @alien_page = Factory(:page, :title => 'alien page', :parent => @alien_site.root, :site_id => @alien_site.id, :layout_id => @alien_layout.id) 
        do_get 
        last_response.body.should_not include(@alien_page.title)  
      end
    end
    
  end 
  
  context 'POST create' do
        
    context 'json' do   
      def do_post
        @name = Faker::Name.first_name
        post "/api/v1'/pages.json", { title: @name, layout_id: @layout.id, parent_id: @root.id }.to_json
      end
    
      it 'should be successful' do
        do_post
        last_response.should be_ok
      end
      
      it 'should set the content header to json' do
        do_post
        last_response.headers['Content-Type'].should == 'application/json;charset=utf-8'
      end
    
      it 'should include pages in the json' do  
        do_post
        last_response.body.should include(@name)
      end  
    end
    
  end  
  
  context 'GET children' do 
        
    context 'json' do   
      def do_get
        get "/api/v1'/pages/#{@page.id}/children.json"
      end
    
      it 'should be successful' do
        do_get
        last_response.should be_ok
      end
      
      it 'should set the content header to json' do
        do_get
        last_response.headers['Content-Type'].should == 'application/json;charset=utf-8'
      end
    
      it 'should include pages in the json' do  
        do_get
        last_response.body.should include(@child_a.title)
      end 
      
      it 'should include pages in the json' do  
        do_get
        last_response.body.should include(@child_b.title)
      end  
   
    end  
  end    
  
  context 'PUT update' do  
    
    before(:all) do
      @alt_layout = Factory(:layout, site_id: @site.id, name: 'Alt')
    end
          
    context 'json' do   
      def do_put
        @new_title = Faker::Name.first_name
        put "/api/v1'/pages/#{@page.id}.json", { title: @new_title, layout_id: @alt_layout.id  }.to_json
      end
    
      it 'should be successful' do
        do_put
        last_response.should be_ok
      end
      
      it 'should set the content header to json' do
        do_put
        last_response.headers['Content-Type'].should == 'application/json;charset=utf-8'
      end
      
      it 'should include the new title in the json' do  
        do_put
        last_response.body.should include(@new_title)
      end  
      
      it 'should include the new layout in the json' do  
        do_put
        last_response.body.should include(@alt_layout.id)
      end
    end

  end
  
  context 'DELETE destroy' do
        
    context 'json' do  
      before(:each) do 
        @page = Factory(:page, :title => 'killme', :parent_id => @root.id, :site_id => @site.id, :layout_id => @layout.id) 
      end    
      
      after(:all) do
        teardown
      end
       
      def do_delete
        delete "/api/v1'/pages/#{@page.id}.json"
      end
    
      it 'should be successful' do
        do_delete
        last_response.should be_ok
      end
      
      it 'should set the content header to json' do
        do_delete
        last_response.headers['Content-Type'].should == 'application/json;charset=utf-8'
      end
    
      it 'should include pages in the json' do  
        do_delete
        last_response.body.should_not include(@page.title)
      end  
      
      it 'should delete the page' do 
        page_id = @page.id
        do_delete
        Page.find(page_id).should be_nil
      end
    end
    
  end
  
end