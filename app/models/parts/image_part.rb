class ImagePart < Part
  include MongoMapper::EmbeddedDocument
  
  # TODO add custom validation
  key :name, String, :required => true, :unique => true 
  key :content, String   
  
  key :asset_id, ObjectId 
  belongs_to :asset, :foreign_key => :asset_id
  
  liquid_methods :name, :content, :render, :image_path
  
  def admin_path
   "/admin/pages/#{self.page_id}/image_parts/#{self.id}" 
  end
 
  def path
    self.asset.image_path if self.asset
  end
  
  def image_path
    self.asset.image_path if self.asset
  end
  
  def as_json(options)
    super(:methods => [:image_path, :asset, :path, :klass])
  end
  
  def render(edit=false)
    self.asset.image_path
    # ImageProxy.new(self, edit)
  end
  
end