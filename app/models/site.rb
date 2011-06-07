class Site
  include MongoMapper::Document
  
  key :name, String, :required => true, :unique => true 
  key :subdomain, String, :required => true, :unique => true 

  many :pages
  many :assets
  many :templates   
  
  def root
    self.pages.first :conditions => { :parent_id => nil }
  end  
  
  def children
    self.root.children
  end   
  
  def active_pages(parent_ids=nil)
    parent_ids = parent_ids ? (parent_ids << self.root.id) : [self.root.id]
    pages = Page.all(:conditions => { :site_id => self.id, :parent_id => parent_ids})  
    pages << self.root
    pages
  end
  
  def domain
    "#{self.subdomain}.#{monk_settings(:domain)}"
  end
  
  liquid_methods :name, :root, :children 
  
  protected
    
    before_validation :set_subdomain
    def set_subdomain
      self.subdomain = self.subdomain.blank? ? sanitize(self.name) :sanitize(self.subdomain)
    end
    
    def sanitize(text)
      text.gsub(/[^a-z0-9\-.]+/i, '-').gsub(/\-$/,'').downcase
    end
  
end