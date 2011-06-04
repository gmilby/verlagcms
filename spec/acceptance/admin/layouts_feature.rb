require File.dirname(__FILE__) + '/../acceptance_helper'

feature "Admin Assest" do

  context 'A logged in user, with JS,' do
    
    before(:all) do 
      Capybara.current_driver = :zombie  
      setup_site
      @layout = Factory(:layout, :site => @site) 
    end
    
    after(:all) do
      Capybara.use_default_driver  
      teardown
    end
    
    scenario "views the admin pages index" do 
      visit '/admin/' 
      visit '/admin/#/layouts'
      page.should have_css('#sidebar')
      page.should have_css('table') 
   
      page.should have_content(@layout.name) 
      page.should have_content('x') 
      page.should have_css("#remove-layout-#{@layout.id}") 
    end     
    
    
    scenario "edits a page" do 
      visit '/admin/' 
      visit '/admin/#/layouts'   
      
      click_link @layout.name
      page.should have_content('Title')  
      # fill_in 'layout_name', :with => 'Fucked up layout'
      # click_button 'Save'
      
      # page.should have_content('Fucked up layout')
    end
  end
end