// Backbone router
Verlag.Router = Backbone.Router.extend({
  
  routes: {
    '':                     'show_index', 
    'admin/':               'show_index',
    'admin/pages':          'show_pages',
    'admin/pages/:id':      'show_page',
    'admin/folders':        'folders_index',
    'admin/folders/:id':    'show_folder',
    'admin/assets/:id':     'show_asset',
    'admin/templates':      'templates_index',
    'admin/templates/:id':  'show_template',
    'admin/settings':       'show_settings'
  },
  
  show_index: function(){
    // console.log('started');
  },
  
  // Pages
  // ------------------------------------------------------------ //
  show_pages: function(){
    this.cleanup(Verlag.editor);
    
    var id = Verlag.pages.first().id;
    // Verlag.sidebar = new Verlag.View.PageIndex();
    Verlag.editor = new Verlag.View.PagePreview({ id: id });
  },
  
  show_page: function(id){
    // this.cleanup(Verlag.sidebar);
    this.cleanup(Verlag.editor);
        
    // Verlag.sidebar = new Verlag.View.PageIndex();
    Verlag.editor = new Verlag.View.PagePreview({ id: id });
  }, 
  
  // Folders
  // ------------------------------------------------------------ //
  folders_index: function(){
    this.cleanup(Verlag.editor);
    Verlag.editor = new Verlag.View.Folders();
  },
  
  show_folder: function(id){
    this.cleanup(Verlag.editor);
    
    
    Verlag.editor = new Verlag.View.Assets({ 
      id: id
    });
  },
  
  // Assets
  // ------------------------------------------------------------ //
  show_asset: function(id){
    this.cleanup(Verlag.editor);
    
    Verlag.modal = new Verlag.View.Asset({ id: id }, function(asset){
      Verlag.editor = new Verlag.View.Assets({ 
        id: asset.get('parent_id')
      });
    });
  },
  
  // Design / Templates
  // ------------------------------------------------------------ //
  templates_index: function(){
    this.cleanup(Verlag.sidebar);
    this.cleanup(Verlag.editor);
    
    var id = Verlag.templates.findByKlass('Layout')[0].id;
    Verlag.editor = new Verlag.View.DesignEdit({ id: id });
  },
  
  show_template: function(id){
    this.cleanup(Verlag.sidebar);
    this.cleanup(Verlag.editor);
    
    Verlag.editor = new Verlag.View.DesignEdit({ id: id });
  },
  
  show_settings: function(){
    this.cleanup(Verlag.sidebar);
    this.cleanup(Verlag.editor);
    
    Verlag.editor = new Verlag.View.Settings();
  },
  
  // Shared
  // ------------------------------------------------------------ //
  cleanup: function(view){
    if(view){
      view.off();
      $(view.el).undelegate();
      console.log('cleanup')
    }
  }
  
});
