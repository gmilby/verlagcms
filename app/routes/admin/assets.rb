class Main    
  
  module Admin  
    module Assets  
      
      # Asset Index
      # -------------------------------------------
      get '/?' do  
        @query = params[:query] ? params[:query].split('.')[0] : ''
        per_page = params[:limit] ? params[:limit] : Asset.per_page
        plucky_query = if params[:query]
          Asset.by_site(current_site).search_all(@query)
        else
          Asset.by_site(current_site)
        end
        @assets = plucky_query.paginate(:order => 'created_at DESC', :per_page => per_page, :page => params[:page])
        
        @assets.to_json 
      end
      
      # Create Asset
      # -------------------------------------------
      post '' do
        # For some reason Sinatra is not picking up the params here...
        data = params.empty? ? request.env["rack.request.form_hash"] : params
        
        asset = Asset.new(:file => data['file'][:tempfile])
        asset.file_name = data['file'][:filename]    
        asset.site = current_site
        asset.save
        asset.to_json
        # respond_to do |format|
        #   format.html { redirect('/assets') }
        #   # format.json { asset.to_json }
        # end
      end

    end  
  end 
  
end