class Main   
  include Canable::Enforcers 
  
  # Admin Mustache Templates 
  # -------------------------------------------
  template_route = get '/templates' do  
    authenticate!
    cache_request  
    @files = Dir[root_path('app/views/admin/**/*.mustache')]
    partial :'layouts/js_templates' 
  end

  # Site admin interface  
  # -------------------------------------------  
  module Admin    
    before do
      # TODO better way to override authorization
      authenticate! unless request.path.match(/^\/admin\/css\//)
  
      # Redirects if no site is found
      # unless current_site   
      #   redirect '/admin/' 
      # end 
    end  
    
    # Redirects to '/admin/' so that the page hash looks pretty     
    get '' do
      redirect '/admin/'
    end
    
    admin_route = get '/' do   
      admin_haml :'admin/index'  
    end  
    

  end
  
  # CSS Templates 
  # -------------------------------------------
  css_route = get '/css/:name' do 
    name = "#{params[:name]}.#{format.to_s}"
    css = Stylesheet.by_site(current_site).find_by_name(name)  
    if css    
      css.render 
    else
      raise Sinatra::NotFound   
    end
  end 
  
  # Javascript Templates
  # -------------------------------------------
  js_route = get '/js/:name' do
    name = "#{params[:name]}.#{format.to_s}"
    js = Javascript.by_site(current_site).find_by_name(name) 
    if js    
      js.render 
    else
      raise Sinatra::NotFound   
    end
  end  
  
  # Site Preview
  # -------------------------------------------
  preview_route = get '/preview*' do   
    authenticate!
    path = params[:splat].first   
    # TODO change method to current_site.find_by_path
    page = Page.find_by_path(path, current_site) 
    
    if page 
      page_view = Views::Page.new page, true
      page_view.render()
      # page.render(format, request)
    else   
      raise Sinatra::NotFound   
    end
  end
  
  # Site Pages
  # -------------------------------------------
  pages_route = get '*' do
    cache_request(60) # unless authenticated?
    authenticate! unless current_site.published?    
         
    path = params[:splat].first
    # TODO change method to current_site.find_by_path
    page = Page.find_by_path(path, current_site) if path
    
    if page 
      page_view = Views::Page.new page
      page_view.render()
    else   
      raise Sinatra::NotFound   
    end
    # page.template.content
  end    
  
  error 404 do   
    # TODO Build custom pages
    admin_haml :'errors/not_found'     
  end
  
  #  Error logging
  error 500 do   
    # Error logging
    e = request.env['sinatra.error']
    info = "Application error\n#{e}\n#{e.backtrace.join("\n")}"
    logger.error info
    haml :'errors/500'     
  end
  
end
