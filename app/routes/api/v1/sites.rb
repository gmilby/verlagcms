class Main    
  
  namespace '/admin' do
    namespace '/sites' do
      
      # site Index
      # -------------------------------------------
      get '/?' do
        collection = current_user.is_super_user? ? Site.all : current_user.sites
        respond_to do |format|
          format.html { admin_haml :'admin/index' }
          format.json { collection.to_json }
        end
      end
      
      # Create
      # -------------------------------------------
      post '' do   
        attributes = JSON.parse(request.body.read.to_s)
        resource = Site.new(attributes) 
        
        # TODO move this to the view
        group = Group.first

        resource.group = group
        if resource.save
          current_user.sites << resource
          current_user.save
          resource.to_json
        else
          { :errors => resource.errors }.to_json 
        end
      end
      
      # Current
      # -------------------------------------------
      get '/current/?' do
        @site = current_site
        # active_page_ids = []
        active_page_ids = request.cookies['active_page_ids'] ? request.cookies['active_page_ids'].split(',') : nil

        # @pages = current_site.pages
        # @pages = current_site.active_pages(active_page_ids).sort_by{ |p| p.created_at }  
        @pages = current_site.pages.sort_by{ |p| p.created_at }
        @folders =  Item.where(parent_id: nil).where(site_id: current_site._id).all
        puts "Folders: #{@folders.length}"
        @sites = current_user.sites
        
        # @root = current_site.root 
        
        respond_to do |format|
          # format.html { admin_haml :'admin/index' }
          format.json { render :rabl, :'admin/sites/current', :format => 'json' }
        end
      end
      
    end  
  end
end