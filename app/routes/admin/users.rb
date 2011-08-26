class Main  
  module Admin 
      
    # Index
    # -------------------------------------------
    get '/users/?' do
      collection = current_user.is_admin? ? User.by_site(current_site).all : [current_user] # 
      collection.to_json  
    end
    
    # Create
    # -------------------------------------------
    post '/:model' do   
      resource = klass.new(params[model.singularize.to_sym]) 
      resource.sites << current_site
      if resource.save
        resource.to_json
      else
        { :errors => resource.errors }.to_json
      end
    end
      
  end  
end