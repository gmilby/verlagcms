require File.dirname(__FILE__) + '/../acceptance_helper'

feature "Layouts", %q{
  In order to have a decent CMS
  As an author
  I want to 
} do

  before(:all) do
    teardown
    build_complete_site 
    setup_site   
  end
  
  after(:all) do 
    teardown
  end

  scenario "view the admin layouts index" do 
    visit '/admin/' 
    click_link 'Templates'
    
    current_path.should == '/admin/templates'
    
    page.should have_css('#sidebar ul')
    page.should have_content(@layout.name) 
    page.should have_content('x') 
    page.should have_css("#remove-layout-#{@layout.id}") 
    # page.should have_css('a#templates.active')
  end     
  
  scenario "edit a layout" do 
    pending
    visit '/admin/' 
    click_link 'Templates'
    
    page.should have_content(@layout.name) 
    click_link @layout.name
    fill_in 'layout_name', :with => 'layout.html'
    click_button 'Save'

    page.should have_content('layout.html')
    # page.should have_css('a#templates.active')
  end
end
