object false
code(:now) { (Time.now.to_f * 1000).to_i }
code :pages do 
  @pages
end
code :folders do 
  @folders 
end
# code(:assets) { 
#   @site.assets 
# }
code(:templates) { 
 @site.templates 
}
code(:sites) { 
 @sites 
}
code :current_user do
  current_user
end
code(:users) { 
  @site.users 
}