require File.dirname(__FILE__) + '/../acceptance_helper'
require 'acceptance/acceptance_helper'

feature "Pages", %q{
  In order to have a decent CMS
  As an author
  I want to create and manage pages
} do

  background do
    setup_site   
    @layout = Factory(:layout, :site_id => @site.id) 
    puts @site.name
    @root = Factory(:page, :title => 'Home', :site_id => @site.id, :layout_id => @layout.id)
    @child = Factory(:page, :title => 'About', :parent => @root, :site_id => @site.id, :layout_id => @layout.id)
  end

  scenario "Page index" do
    visit '/admin/#/pages' 
    
    # page.should have_content(@site.name)

    page.should have_css('#editor')
    page.should have_css('#sidebar')
    page.should have_css('#sidebar ul')   
    
    current_path.should == '/admin/'
    current_url.should match(%r(/#/pages$))
    
    page.driver.render "tmp/capybara/pages-index-#{Time.now.strftime('%Y-%m-%d-%H-%M-%S')}.png"
  end

end

# before(:each) do 
#   Capybara.current_driver = :zombie  
#   setup_site   
#   @layout = Factory(:layout, :site_id => @site.id) 
#   @root = Factory(:page, :title => 'Home', :site_id => @site.id, :layout_id => @layout.id)
#   @child = Factory(:page, :title => 'About', :parent => @root, :site_id => @site.id, :layout_id => @layout.id)  
# end
#            
# after(:each) do
#   Capybara.use_default_driver  
#   teardown
# end
# 
# scenario "views the admin pages index" do 
#   visit '/admin/#/pages' 
#   # visit '/admin/'
#   page.should have_css('#editor')
#   page.should have_css('#sidebar')
#   page.should have_css('#sidebar ul')   
#   sleep(2)
# 
#   page.should have_content(@root.title)  
#   # page.should have_css("#edit-#{@root.id}")
#   # page.should have_content(@child.title) 
#   
#   # page.should have_css("#add-child-#{@root.id}") 
#   # page.should have_css("#remove-page-#{@root.id}")  
# end 

# scenario "views the admin pages index" do 
#   visit '/admin/' 
#   visit '/admin/#/pages'    
#   
#   page.should have_content(@root.title) 
#   click_link("edit-#{@root.id}")   
#   # page.should have_content('Title')
# end   

# scenario "views the admin edit page directly" do 
#   visit '/admin/' 
#   visit "/admin/#/sidebar/#{@root.id}"    
# 
#   page.should have_content('Title') 
#   page.should have_content('Add Part')
#   page.should have_content('add asset') 
# end        

# scenario "adds a page" do 
#   visit '/admin/' 
#   # visit '/admin/#/pages'    
# 
#   click_link "add-child-#{@root.id}"   
#   # page.should have_content('New Page')     
#   page.should have_css('#modal')
#   
#   fill_in 'page[title]', :with => 'Newer Page' 
#   click_button 'Save'  
#   
#   page.should have_content('New Page')
# end   
# 
# scenario "edits a page" do
#   visit '/admin/' 
#   # visit '/admin/#/pages'  
# 
#   click_link "#{@child.title}" 
#   # page.should have_content('Title') 
#   
#   fill_in 'Title', :with => 'New Title'
#   click_button 'Save'
#   
#   page.should have_content('New Title')
# end  
# 
# scenario "edits the root page" do
#   visit '/admin/' 
#   # visit '/admin/#/pages'  
# 
#   click_link "#{@root.title}" 
#   page.should have_content('Home') 
#   
#   fill_in 'Title', :with => 'New Home'
#   # TODO zombie hangs here
#   # click_button 'Save'
#   # 
#   # page.should have_content('New Home')
# end
# 
# scenario "removes a page" do  
#   pending
#   visit '/admin/' 
#   # visit '/admin/#/pages'  
# 
#   click_link "remove-page-#{@child.id}"   
#    
#   page.should have_css('#modal')  
#   page.should have_content('Remove Page')     
#     
#   # TODO zombie hangs here
#   # click_button 'Delete' 
#   # page.should_not have_content(@child.title)
# end 
# 
# scenario "adds an image" do 
#   pending
#   visit '/admin/' 
#   # visit "/admin/#/pages/#{@root.id}/edit" 
#   
#   page.should have_content('Title')      
#    
#   click_link('add asset')   
#   page.should have_css('#modal')   
#   # page.should have_css('#search-form') 
# end
